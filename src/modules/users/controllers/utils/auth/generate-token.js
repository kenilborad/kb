const jwt = require('jsonwebtoken');

const CONFIG = require('../../config/config');

const JWT_SECRET = CONFIG.JWT.SECRET;

const generateToken = (userId, expireLifeTime) => new Promise((resolve, reject) => {
  jwt.sign({ userId }, JWT_SECRET, { expiresIn: expireLifeTime }, (error, token) => {
    if (error) {
      return reject(error);
    }
    resolve(token);
    return true;
  });
});

module.exports = generateToken;
