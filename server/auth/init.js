const passport = require('passport');
const { User } = require('../models/user');


module.exports = function() {

  passport.serializeUser((user, done) => done(null, user.id) );

  passport.deserializeUser((id, done) =>
    User.findById(id).then((err,user) => done(err, user))
  );

};
