const createError = require('http-errors');
const User = require('../models/user');

const getUser = async (pipeline) => {
  try {
    const user = await User.findOne(pipeline);

    if (!user) {
      throw createError.Conflict('No such User Found......');
    }

    return user;
  } catch (error) {
    throw createError.InternalServerError;
  }
};

module.exports = getUser;
