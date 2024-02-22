const bcrypt = require('bcryptjs');
const createError = require('http-errors');
const { StatusCodes } = require('http-status-codes');
const { getUser } = require('../../../db-functions');
const logger = require('../../../utils/logger');
const getResponse = require('../../../utils/response-generator');
const { getHashPassword } = require('../../../utils/utils');

const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await getUser({ email: req.user.email });

    const valid = await bcrypt.compare(oldPassword, user.password);

    if (!valid) {
      throw createError.Unauthorized('Enter valid Credentials......');
    }

    user.password = await getHashPassword(newPassword);

    await user.save();

    return res.send(getResponse(StatusCodes.OK, 'password changed successfully.....'));
  } catch (error) {
    logger.error('failed to change password');
    return next(error);
  }
};

module.exports = changePassword;
