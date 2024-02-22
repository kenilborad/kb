const bcrypt = require('bcryptjs');
const createError = require('http-errors');
const { StatusCodes } = require('http-status-codes');
const { getUser } = require('../../../db-functions');
const logger = require('../../../utils/logger');
const getResponse = require('../../../utils/response-generator');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await getUser({ email });

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw createError.Unauthorized('Enter valid Credentials......');
    }

    const token = await user.generateAuthToken();

    return res.send(getResponse(StatusCodes.OK, 'User successfully LoggedIn......', { token }));
  } catch (error) {
    logger.error('failed to login');
    return next(error);
  }
};

module.exports = login;
