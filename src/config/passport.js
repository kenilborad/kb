const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const users = require('../models/users');
const { secret } = require('./config');

function auth() {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret,
  };
  console.log('inside passport');
  passport.use(
    new JwtStrategy(opts, (jwt_payload, callback) => {
      const userId = jwt_payload._id;
      users.findById(userId, (err, results) => {
        if (err) {
          return callback(err, false);
        }
        if (results) {
          callback(err, results);
        } else {
          callback(null, false);
        }
      });
    }),
  );
}

exports.auth = auth;
exports.checkAuth = passport.authenticate('jwt', { session: false });
