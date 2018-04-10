const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const { User } = require('../models/user');
const init = require('./init');

//encrytion
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECRET_KEY);

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

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
    accessToken: cryptr.encrypt(accessToken),
    refreshToken: cryptr.encrypt(refreshToken),
    expires_in: expires_in
  }

  const options = {
    upsert: true,
    new: true
  }

  User.findOneAndUpdate(searchQuery, updates, options)
      .then(user => done(null, user))
      .catch(err => done(err));
}));

init();

module.exports = passport;
