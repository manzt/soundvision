"use strict"
const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const { Library } = require('../models/library');
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
    console.log(req.user)
    spotify.setAccessToken(req.user.accessToken.toString());
    getAlbums(0, 50);
    // spotify.getMySavedAlbums({
    //   limit: 50,
    //   offest: 1
    // })
    // .then(data => User.findByIdAndUpdate(req.user.id, { library: data.body.items }))
    // .catch(err => console.log('Somthing went wrong', err))

    res.redirect('/welcome')
  })

  router.get('/welcome', async (req, res) => {
    console.log('library size', req.user.library.length)
    res.send('welcome to soundvision')
  });

  return router;
}


const getAlbums = (offset, limit) => {
  spotify.getMySavedAlbums({ limit: limit, offset: offset })
         .then(data => {
           const albums = data.body.items.map(item => {
              return {
               albumID: item.album.id,
               album: item.album,
               added_at: item.added_at,
             };
           });

           for (let album of albums) {
             const searchQuery = { albumID: album.albumID }
             const options = { upsert: true }
             Library.findOneAndUpdate(searchQuery, album, options)
                   .then(() => albums.length === 50 ?
                               getAlbums(offset+1, limit) :
                               null)
           }
         });
}
