const passport = require('passport');
const { User } = require('../models/user');

const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECRET_KEY);

module.exports = function() {

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
          user.accessToken = cryptr.decrypt(user.accessToken);
          user.refreshToken = cryptr.decrypt(user.refreshToken);
          done(null, user);
        })
        .catch(err => done(err));
  });
};
