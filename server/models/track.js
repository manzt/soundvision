const mongoose = require('mongoose');

const trackSchema = mongoose.Schema({
  track: {
    type: Object
  }
});

module.exports = { Track: mongoose.model('Track', trackSchema) };
