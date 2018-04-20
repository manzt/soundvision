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

passport.use('spotify', new SpotifyStrategy({
  clientID: client_id,
  clientSecret: client_secret,
  callbackURL: redirect_uri
}, async (accessToken, refreshToken, expires_in, profile, done) => {
  //console.log(profile)
  const searchQuery = {
    spotifyID: profile.id
  };

  const updates = {
    spotifyID: profile.id,
    accessToken: cryptr.encrypt(accessToken),
    refreshToken: cryptr.encrypt(refreshToken),
    expires_in: expires_in,
    albums: []
  }

  const options = {
    upsert: true,
    new: true
  }
  try {
    let user = await User.findOneAndUpdate(searchQuery, updates, options)
    done(null, user)
  } catch (error) {
    done(error, false, error.message);
  }
  // try {
  //   //Check whether this current user exists in DB
  //   const exisitingUser = await User.findOne({ spotifyID: profile.id} );
  //   if (existingUser) {
  //     return done(null, existingUser)
  //   }
  //   // If new account
  //   const newUser = new User({
  //     spotifyID: profile.id,
  //     accessToken: cryptr.encrypt(accessToken),
  //     refreshToken: cryptr.encrypt(refreshToken),
  //     expires_in: expires_in,
  //     albums: []
  //   })
  //
  //   await newUser.save();
  //   done(null, newUser)
  // } catch (error) {
  //   done(error, false, error.message);
  // }
}));

init();

module.exports = passport;
