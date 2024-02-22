const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { StatusCodes } = require('http-status-codes');
const getResponse = require('../../../utils/response-generator');
const { getHashPassword } = require('../../../utils/utils');
const { getUser } = require('../../../db-functions');
const logger = require('../../../utils/logger');

const resetPasswordURL = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    const { token } = req.params;

    const { _id } = jwt.verify(token, process.env.JWT_SECRET);

    if (!_id) {
      throw createError.Unauthorized('Unexpected token......');
    }

    const user = await getUser({ _id });

    if (new Date() >= user.resetPwdExpires) {
      throw createError.Unauthorized('token expired......');
    }

    user.password = await getHashPassword(newPassword);
    user.resetPwdToken = null;
    user.resetPwdExpires = null;
    await user.save();

    return res.send(getResponse(StatusCodes.OK, 'Password reset Successfully.....'));
  } catch (error) {
    logger.error('failed to reset password');
    return next(error);
  }
};

module.exports = resetPasswordURL;
