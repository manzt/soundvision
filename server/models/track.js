const mongoose = require('mongoose');

const trackSchema = mongoose.Schema({
  trackID: {
    type: String,
    unique: true
  },
  albumID: {
    type: String
  },
  song: {
    type: Object
  }
});

module.exports = { Track: mongoose.model('Track', trackSchema) };
