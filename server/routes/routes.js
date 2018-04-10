"use strict"
const express = require('express');
const router = express.Router();
const { User } = require('../models/user')
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
    spotify.getMySavedAlbums({
      limit: 50,
      offest: 1
    })
    .then(data => User.findByIdAndUpdate(req.user.id, { library: data.body.items }))
    .catch(err => console.log('Somthing went wrong', err))

    res.redirect('/welcome')
  })

  router.get('/welcome', async (req, res) => {
    console.log('library size', req.user.library.length)
    res.send('welcome to soundvision')
  });

  return router;
}
