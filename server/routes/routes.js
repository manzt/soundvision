"use strict"
const express = require('express');
const router = express.Router();
const _ = require('underscore');
const { User } = require('../models/user');
const { Album } = require('../models/album');
const { Track } = require('../models/track')
const SpotifyWebApi = require('spotify-web-api-node');

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
      })
    } catch (error){
      console.log(error);
    }

  });

  router.get('/getAlbums', (req, res) => {
    const spotify = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: process.env.REDIRECT_URI,
      accessToken: req.user.accessToken.toString(),
      refreshToken: req.user.refreshToken.toString()
    });

    getAlbums(20, 0, req.user, spotify, () => res.json({success: true}))

  });

  router.get('/albums', (req, res) => {
    //res.json(req.user.albums.length)
    User.findById(req.user._id)
        .populate('albums.album')
        .then((user) => res.json({
          success: true,
          albums: user.albums
        }));
  });

  return router;
}

const getAlbums = async (limit, offset, user, spotify, done) => {
  let data = await spotify.getMySavedTracks({ limit: limit, offset: offset });
  let tracks = data.body.items.map(item => {
    return {
      trackID: item.track.id,
      track: item.track,
      albumID: item.track.album.id,
      album: null,
      date_added: item.added_at
    }
  });

  let uniqAlbums = _.uniq(tracks, item => item.albumID);
  let albumObjs = await spotify.getAlbums(uniqAlbums.map(album => album.albumID));

  for (let i = 0; i < uniqAlbums.length; i++) {
    uniqAlbums[i].album = albumObjs.body.albums[i]
  }

  Promise.all(uniqAlbums.map(async(album) => {
    const albumQuery = { "album.id": album.album.id };
    const albumDB = {
      albumID: album.albumID,
      album: album.album,
    };
    const options = { upsert: true, new: true };

    let albumObj = await Album.findOneAndUpdate(albumQuery, albumDB, options);
    let exists = user.albums.find(item => albumObj._id.equals(item.ref));
    if(!exists) {
      await User.findById(user._id).then(user => {
        user.albums.push({ date_added: album.date_added, album: albumObj._id });
        user.save();
      })
    }
  })).then(() => {
    if (tracks.length === limit) getAlbums(limit, offset+limit, user, spotify, done);
    else done();
  })
}
