const bcrypt = require('bcryptjs');
const createError = require('http-errors');
const mongoose = require('mongoose');
const logger = require('./logger');

const getHashPassword = async (password) => {
  try {
    const hashPassword = await bcrypt.hash(password, 12);
    return hashPassword;
  } catch (error) {
    logger.error('failed to hash password', { error });
    throw createError.InternalServerError;
  }
};

const getObjectId = async (id) => {
  try {
    const objectId = await mongoose.Types.ObjectId(id);
    return objectId;
  } catch (error) {
    logger.error('failed to get object-id', { error });
    throw createError.InternalServerError;
  }
};

module.exports = {
  getHashPassword,
  getObjectId,
};
