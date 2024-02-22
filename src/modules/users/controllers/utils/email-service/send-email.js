const CONFIG = require('../../config/config');

const postData = require('./post-data');

const sendEmail = async (data = {}) => {
  try {
    const reqData = {
      fromEmail: data.fromEmail || CONFIG.EMAIL_SERVER.FROM_EMAIL,
      toEmail: data.toEmailAddresses,
      templateKey: data.templateKey,
      data: data.data,
    };
    const response = await postData(`${CONFIG.EMAIL_SERVER.HOST}`, reqData);
    return response;
  } catch (e) {
    return e;
  }
};

module.exports = sendEmail;
