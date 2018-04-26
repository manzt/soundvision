"use strict"
const express = require('express');
const router = express.Router();
const _ = require('underscore');
const { User } = require('../models/user');
const { Album } = require('../models/album');
const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');
router.use(bodyParser());

//secrets
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

module.exports = function() {

  router.get("/isAuthenticated", (req, res) => {
    if (req.user) {
      try {
        const user = await User.findById(req.user._id).populate('albums.album')
        res.json({
          success: true,
          userInfo: {
            displayName: user.displayName,
            photo: user.photo,
          },
          library: user.albums
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      res.json({ loggedIn: false });
    }
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
        success: true,
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

  router.get('/updateLibrary', async (req, res) => {
    const spotify = new SpotifyWebApi({
      clientId: client_id,
      clientSecret: client_secret,
      redirectUri: redirect_uri,
      accessToken: req.user.accessToken.toString(),
      refreshToken: req.user.refreshToken.toString()
    });
    try {
      //clear current stored library
      let dbUser = await User.findById(req.user._id);
      dbUser.albums = [];
      dbUser.save();


      let tracks = [];
      let uniqTracks = await getTracks(spotify, tracks);
      await getUniqAlbums(req.user, spotify, uniqTracks, () => res.json({success: true}));
    } catch (error) {
      console.log(error);
    }
  });

  router.get('/albums', async (req, res) => {
    try {
      let user = await User.findById(req.user._id).populate('albums.album');
      res.json({library: user.albums});
    } catch (error) {
      console.log(error);
    }
  });

  router.post('/createPlaylist', async (req, res) => {
    const spotify = new SpotifyWebApi({
      clientId: client_id,
      clientSecret: client_secret,
      redirectUri: redirect_uri,
      accessToken: req.user.accessToken.toString(),
      refreshToken: req.user.refreshToken.toString()
    });
    try {
      const tracks = req.body.tracks.map(trackid => 'spotify:track:' + trackid);
      const playlist = await spotify.createPlaylist(req.user.spotifyID, req.body.name ? req.body.name : 'SOUNDVISION PLAYLIST' , { 'public' : false });
      spotify.addTracksToPlaylist(req.user.spotifyID, playlist.body.id, tracks)
    } catch (error) {
      console.log(error);
    }
    res.json({ success: true });
  })

  return router;
}

const getTracks = async (spotify, tracks, limit = 50, offset = 0) => {
  try {
    let data = await spotify.getMySavedTracks({ limit: limit, offset: offset });
    let albums = data.body.items.map(item => {
      return {
        added_at: item.added_at,
        id: item.track.album.id,
        albumObj: {}
      }
    });

    albums.forEach(album => tracks.push(album));

    if (albums.length === limit) {
      return await getTracks(spotify, tracks, limit, offset+limit)
    } else {
      let uniqAlbums = _.uniq(tracks, album => album.id);
      return uniqAlbums;
    }
  } catch (error) {
    console.log(error)
  }
}

const getUniqAlbums = async (user, spotify, uniqAlbums, done, limit = 20, offset = 0) => {
  let pages = Math.floor(uniqAlbums.length / limit);
  let finalCallLimit = uniqAlbums.length % limit;

  let promises = [];
  for (let i = 0; i <= pages; i++) {
    promises.push(
      uniqAlbums.slice(limit * i, (i === pages ? finalCallLimit : limit) + (limit * i))
    );
  }

  try {
    let albumObjs = await Promise.all(promises.map(promise =>
      spotify.getAlbums(promise.map(album => album.id)))
    );

    for (let i = 0; i < promises.length; i++) {
      for (let j = 0; j < promises[i].length; j++) {
        promises[i][j].albumObj = albumObjs[i].body.albums[j];
      }
    }

    let uniqAlbumObjs = [];
    promises.forEach(albumArr => {
      albumArr.forEach(album => uniqAlbumObjs.push(album))
    });

    await Promise.all(uniqAlbumObjs.map(async album => {
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

      let dbUser = await User.findById(user._id);
      let newAlbum = await Album.findOneAndUpdate(albumQuery, albumDB, options);
      dbUser.albums.push({ date_added: album.added_at, album: newAlbum._id });
      dbUser.save();
    }))
  } catch (error) {
    console.log(error);
  } finally {
    return done();
  }
}
