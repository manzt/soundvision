const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
  spotifyID: {
    type: String,
    unique: true,
    trim: true
  },
  accessToken: {
    type: String,
    trim: true,
  },
  refreshToken: {
    type: String,
    trim: true,
  },
  expires_in: {
    type: String,
    trim: true,
  },
});

module.exports = {
  User: mongoose.model('User', userSchema)
};
