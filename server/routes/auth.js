"use strict"
const express = require('express');
const router = express.Router();

module.exports = function(passport) {
  router.get('/auth/spotify',
  passport.authenticate('spotify'),
  function(req, res){
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
  });

  router.get('/callback',
  passport.authenticate('spotify', { successRedirect: '/helloworld', failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/helloworld');
  });

  return router;
}
