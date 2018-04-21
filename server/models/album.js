const mongoose = require('mongoose');

const albumSchema = mongoose.Schema({
  id: {
    type: String
  },
  artists: {
    type: Array
  },
  images: {
    type: Array
  },
  name: {
    type: String
  },
  popularity: {
    type: Number
  },
  release_date: {
    type: String
  },
  tracks: {
    type: Array
  }
});

module.exports = { Album: mongoose.model('Album', albumSchema) };
