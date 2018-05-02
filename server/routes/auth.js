const express = require('express');
const router = express.Router();

module.exports = function(passport) {
  router.get('/auth/spotify',
  passport.authenticate('spotify', {scope: ['user-library-read', 'playlist-modify-private'] }),
  function(req, res){
    console.log('inside auth')
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
  });

  router.get('/callback',
  passport.authenticate('spotify', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

  return router;
}

//other permissions
//'user-read-email', 'playlist-modify-private'
