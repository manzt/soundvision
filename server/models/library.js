const mongoose = require('mongoose');

const librarySchema = mongoose.Schema({
  albumID: {
    type: String,
    unique: true
  },
  album: {
    type: Object
  },
  added_at: {
    type: String
  }
});

module.exports = { Library: mongoose.model('Library', librarySchema) };
