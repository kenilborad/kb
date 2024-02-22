const nodeMailer = require('nodemailer');
const createError = require('http-errors');
const logger = require('./logger');

const sendMail = async (email, token) => {
  try {
    const url = `http://localhost:3000/user/resetpwd/${token}`;
    const transporter = nodeMailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const info = await transporter.sendMail({
      from: process.env.EMAIL_ID,
      to: email,
      subject: 'Link To Reset Password',
      text: 'You have receiving this because you have requested the reset of the password for your account.Please click on the following link. or paste this into your browser to complete the process within one hour of receiving it:',
      html: `<p>Please click this link for reset password. <a href="${url}">${url}</a></p>`,

    });
    return {
      'message sent': email,
      'Preview URL': nodeMailer.getTestMessageUrl(info),
      url,
    };
  } catch (error) {
    logger.error('failed to email', { error });
    throw createError.InternalServerError;
  }
};

module.exports = sendMail;
