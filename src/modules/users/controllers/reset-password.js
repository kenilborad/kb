const moment = require('moment');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const getResponse = require('../../../utils/response-generator');
const sendMail = require('../../../utils/send-mail');
const { getUser } = require('../../../db-functions');
const logger = require('../../../utils/logger');

const resetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await getUser({ email });

    user.resetPwdToken = jwt.sign({
      _id: user._id.toString(), email: user.email,
    }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    user.resetPwdExpires = moment(new Date()).add(30, 'm').toDate();

    const data = await sendMail(user.email, user.resetPwdToken);

    await user.save();

    return res.send(getResponse(StatusCodes.OK, 'Email Send Successfully.....', data));
  } catch (error) {
    logger.error('failed to reset password');
    return next(error);
  }
};

module.exports = resetPassword;
