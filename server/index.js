const express = require('express');
const morgan = require('morgan');
const Spotify = require('node-spotify-api');
const mongoose = require('mongoose');
const session = require('express-session');
const serve = require('express-static');

//import authorization routes
const auth = require('./routes/auth');
//import routes
const routes = require('./routes/routes');
//import spotify passport configuration
const passportSpotify = require('./auth/spotify')


const app = express();

// Middlewares
app.use(morgan('dev'));

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

//Passport
app.use(passportSpotify.initialize());
app.use(passportSpotify.session());

//Routes
app.use('/', auth(passportSpotify));
app.use('/api', routes());

app.use(serve(__dirname + '/../build'));


let port = process.env.PORT || 8888
console.log(`Listening on port ${port}. Go /auth/spotify to initiate authentication flow.`)
app.listen(port)
