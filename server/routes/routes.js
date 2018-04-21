"use strict"
const express = require('express');
const router = express.Router();
const _ = require('underscore');
const { User } = require('../models/user');
const { Album } = require('../models/album');
const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');
router.use(bodyParser());


module.exports = function() {

  router.get("/isAuthenticated", (req, res) => {
    req.user ? res.json({ loggedIn: true }) : res.json({ loggedIn: false });
  });

  router.use(function(req, res, next) {
    if (! req.user) {
      return next();
      res.redirect('/');
    } else {
      next();
    }
  });

  router.get('/userInfo', async (req, res) => {
    try {
      const user = await User.findById(req.user._id).populate('albums.album')
      res.json({
        sucess: true,
        userInfo: {
          displayName: user.displayName,
          photo: user.photo,
        },
        library: user.albums
      });
    } catch (error){
      console.log(error);
    }

  });

  router.get('/updateLibrary', (req, res) => {
    const spotify = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: process.env.REDIRECT_URI,
      accessToken: req.user.accessToken.toString(),
      refreshToken: req.user.refreshToken.toString()
    });
    getAlbums(20, 0, req.user, spotify, () => res.json({success: true}))
  });

  router.get('/albums', async (req, res) => {
    try {
      let user = await User.findById(req.user._id).populate('albums.album');
      res.json({ success: true, albums: user.albums});
    } catch (error) {
      console.log(error);
    }
  });

  router.post('/createPlaylist', async (req, res) => {
    const spotify = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: process.env.REDIRECT_URI,
      accessToken: req.user.accessToken.toString(),
      refreshToken: req.user.refreshToken.toString()
    });
    try {
      const tracks = req.body.tracks.map(trackid => 'spotify:track:' + trackid);
      console.log(tracks, req.body.name)
      const playlist = await spotify.createPlaylist(req.user.spotifyID, req.body.name, { 'public' : false });
      spotify.addTracksToPlaylist(req.user.spotifyID, playlist.body.id, tracks)
    } catch (error) {
      console.log(error);
    }
    res.json({ success: true });
  })

  return router;
}

const getAlbums = async (limit, offset, user, spotify, done) => {
  let data = await spotify.getMySavedTracks({ limit: limit, offset: offset });
  let addedAlbum = data.body.items.map(item => {
    return {
      added_at: item.added_at,
      id: item.track.album.id,
      albumObj: {}
    }
  });

  let uniqAlbums = _.uniq(addedAlbum, album => album.id);
  let albumObjs = await spotify.getAlbums(uniqAlbums.map(album => album.id));

  for (let i = 0; i < uniqAlbums.length; i++) {
    uniqAlbums[i].albumObj = albumObjs.body.albums[i]
  }

  Promise.all(uniqAlbums.map( async (album) => {
    let albumArtists = album.albumObj.artists.map(artist => ({ name: artist.name, id: artist.id }));
    let albumImages = album.albumObj.images;
    let albumTracks = album.albumObj.tracks.items.map(track => ({
      artists: track.artists.map(artist => ({ name: artist.name, id: artist.id })),
      id: track.id,
      name: track.name,
      track_number: track.track_number
    }));

    const albumQuery = { "id": album.id };

    const albumDB = {
      id: album.id,
      artists: albumArtists,
      images: albumImages,
      name: album.albumObj.name,
      popularity: album.albumObj.popularity,
      release_date: album.albumObj.release_date,
      tracks: albumTracks
    };

    const options = { upsert: true, new: true };

    let albumObj = await Album.findOneAndUpdate(albumQuery, albumDB, options);
    let exists = user.albums.find(item => albumObj._id.equals(item.ref));
    if(!exists) {
      await User.findById(user._id).then(user => {
        user.albums.push({ date_added: album.added_at, album: albumObj._id });
        user.save();
      })
    }
  })).then(() => {
    if (addedAlbum.length === limit) getAlbums(limit, offset+limit, user, spotify, done);
    else done();
  })
}
