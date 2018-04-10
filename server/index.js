const express = require('express');
const Spotify = require('node-spotify-api');
const mongoose = require('mongoose');
const session = require('express-session');
const auth = require('./routes/auth');
const routes = require('./routes/routes');
const passportSpotify = require('./auth/spotify')

const app = express();

if (!process.env.MONGODB_URI) {
  console.error('Cannot find MONGODB_URI.  Run env.sh?');
  process.exit(1);
}
mongoose.connect(process.env.MONGODB_URI).then(() => console.log('Connected to MongoDB!'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));

app.use(passportSpotify.initialize());
app.use(passportSpotify.session());

app.use('/', auth(passportSpotify));
app.use('/', routes());

let port = process.env.PORT || 8888
console.log(`Listening on port ${port}. Go /auth/spotify to initiate authentication flow.`)
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
