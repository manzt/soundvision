const express = require('express');
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const Spotify = require('node-spotify-api');
const mongoose = require('mongoose');
const User = require('./models/models');
const auth = require('./routes/auth');
const routes = require('./routes/routes');

const app = express();

if (!process.env.MONGODB_URI) {
  console.error('Cannot find MONGODB_URI.  Run env.sh?');
  process.exit(1);
}
mongoose.connect(process.env.MONGODB_URI).then(() => console.log('Connected to MongoDB!'));

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI || 'http://localhost:8888/callback';

passport.use(new SpotifyStrategy({
  clientID: client_id,
  clientSecret: client_secret,
  callbackURL: redirect_uri
}, (accessToken, refreshToken, expires_in, profile, done) => {
  User.findOneAndUpdate({ spotifyID: profile.id }, {
    spotifyID: profile.id,
    accessToken: accessToken,
    refreshToken: refreshToken,
    expires_in: expires_in,
  }, { upsert: true }).then((err, user) => done(err, user));
}));

passport.serializeUser((user, done) => done(null, user.spotifyID));

passport.deserializeUser((id, done) =>
  User.findOne({ spotifyID: id })
    .then(user => done(null, user))
    .catch( err => console.log('error in deserilize: ', err))
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/', auth(passport));
app.use('/', routes());

let port = process.env.PORT || 8888
console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`)
app.listen(port)



























// app.get('/login', function(req, res) {
//   res.redirect('https://accounts.spotify.com/authorize?' +
//     querystring.stringify({
//       response_type: 'code',
//       client_id: process.env.SPOTIFY_CLIENT_ID,
//       scope: 'user-read-private user-read-email',
//       redirect_uri
//     }))
// })
//
// app.get('/callback', function(req, res) {
//   let code = req.query.code || null
//   let authOptions = {
//     url: 'https://accounts.spotify.com/api/token',
//     form: {
//       code: code,
//       redirect_uri,
//       grant_type: 'authorization_code'
//     },
//     headers: {
//       'Authorization': 'Basic ' + (new Buffer(
//         process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
//       ).toString('base64'))
//     },
//     json: true
//   }
//   request.post(authOptions, function(error, response, body) {
//     var access_token = body.access_token
//     let uri = process.env.FRONTEND_URI || 'http://localhost:3000'
//     res.redirect(uri + '?access_token=' + access_token)
//   })
// })
