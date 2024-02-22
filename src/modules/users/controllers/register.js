const { StatusCodes } = require('http-status-codes');
const createError = require('http-errors');
const User = require('../../../models/user');
const { getHashPassword } = require('../../../utils/utils');
const getResponse = require('../../../utils/response-generator');
const logger = require('../../../utils/logger');

const register = async (req, res, next) => {
  try {
    logger.debug('/user/register');
    logger.info('create new user....');
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      throw createError.Conflict('user already exists.....');
    }

    req.body.password = await getHashPassword(password);
    const newUser = new User(req.body);
    await newUser.save();

    return res.send(getResponse(StatusCodes.OK, 'User successfully registered......', newUser));
  } catch (error) {
    return next(error);
  }
};

module.exports = register;
