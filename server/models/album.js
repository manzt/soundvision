const mongoose = require('mongoose');

const albumSchema = mongoose.Schema({
  album: {
    type: Object
  }
});

module.exports = { Album: mongoose.model('Album', albumSchema) };
