"use strict"
const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const { Album } = require('../models/album');
const { Track } = require('../models/track')
const SpotifyWebApi = require('spotify-web-api-node');
const spotify = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI
});

module.exports = function() {

  router.use(function(req, res, next) {
    if (! req.user) {
      res.redirect('/auth/spotify');
    } else {
      next();
    }
  });

  router.get('/library', (req, res) => {
    spotify.setAccessToken(req.user.accessToken.toString());
    //console.log(req.user)
    getTracks(50, 0, req.user);
    res.redirect('/welcome')
  })

  router.get('/albums', (req, res) => {
    res.json(req.user.albums.length)
  })

  router.get('/welcome', (req, res) => {
    res.send('welcome to soundvision')
  });

  return router;
}


const getTracks = async (limit, offset, user) => {
  let tracks = [];
  await spotify.getMySavedTracks({ limit: limit, offset: offset })
         .then(data => {
           console.log('spotify request sucess');

           tracks = data.body.items.map(track => {
             return {
               trackID: track.track.id,
               track: track.track,
               albumID: track.track.album.id,
               album: track.track.album,
               date_added: track.added_at
             }
           })
           let updateAlbums = [];

           Promise.all(tracks.map(async (track) => {
             const trackQuery = { trackID: track.trackID };
             const albumQuery = { albumID: track.album.id };
             const album = { albumID: track.album.id, album: track.album };
             const options = { upsert: true, new: true };

             let [userAlbum] = await Promise.all([
               Album.findOneAndUpdate(albumQuery, album, options),
               Track.findOneAndUpdate(trackQuery, track, options)
             ])
             let exists = user.albums.find(item => userAlbum._id.equals(item.ref))
                || updateAlbums.find(item => userAlbum._id.equals(item.ref))
             if(!exists) {
               updateAlbums.push({ date_added: track.date_added, ref: userAlbum._id })
             }
           })).then(() => {
             User.findById(user._id).then(user => {
               user.albums.push.apply(user.albums, updateAlbums);
               user.save();
               if (tracks.length === 50) getTracks(limit, offset+50, user);
             })
           });
         }).catch(err => console.log(err));
}
