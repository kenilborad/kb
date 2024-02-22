const { StatusCodes } = require('http-status-codes');
const logger = require('../../../utils/logger');
const getResponse = require('../../../utils/response-generator');

const logOut = async (req, res, next) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
    await req.user.save();
    return res.send(getResponse(StatusCodes.OK, 'User LogOut successfully......'));
  } catch (error) {
    logger.error('failed to logout user');
    return next(error);
  }
};

module.exports = logOut;
