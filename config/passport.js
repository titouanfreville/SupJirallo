var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    config      = require('./database'),
    Users        = require('../models/users'),
    User         = Users.User,
    ProductOwner = Users.ProductOwner,
    Developer    = Users.Developer;

module.exports = function(passport) {
  var opts={};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.id}, function(err, user) {
      if (err) return done(err,false);
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  }));
}