const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;

const {User} = require('../models/user');
const init = require('./init');

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI || 'http://localhost:8888/callback';

passport.use(new SpotifyStrategy({
  clientID: client_id,
  clientSecret: client_secret,
  callbackURL: redirect_uri
}, (accessToken, refreshToken, expires_in, profile, done) => {
  //console.log(profile)
  const searchQuery = {
    spotifyID: profile.id
  };

  const updates = {
    spotifyID: profile.id,
    accessToken: accessToken,
    refreshToken: refreshToken,
    expires_in: expires_in
  }

  const options = {
    upsert: true
  }

  User.findOneAndUpdate(searchQuery, updates, options)
      .then(user => done(null, user))
}));

init();

module.exports = passport;
