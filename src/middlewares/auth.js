const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user) {
      throw createError.Conflict('No such User Found......');
    }

    req.token = token;
    req.user = user;

    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = auth;
