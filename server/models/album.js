const mongoose = require('mongoose');

const albumSchema = mongoose.Schema({
  // albumID: {
  //   type: String,
  //   unique: true
  // },
  album: {
    type: Object
  }
});

module.exports = { Album: mongoose.model('Album', albumSchema) };
