const { StatusCodes } = require('http-status-codes');
const logger = require('../../../utils/logger');
const getResponse = require('../../../utils/response-generator');

const logOutAll = async (req, res, next) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    return res.send(getResponse(StatusCodes.OK, 'All User LogOut successfully......'));
  } catch (error) {
    logger.error('failed to logout all-user');
    return next(error);
  }
};

module.exports = logOutAll;
