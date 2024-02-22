const CustomGraphqlError = require('../../../../shared-lib/error-handler');
const generateVerificationCode = require('../../../../utils/auth/generate-code');
const sendEmail = require('../../../../utils/email-service/send-email');
const { getMessage } = require('../../../../utils/messages');
const userLogger = require('../../user-logger');

const resetPwdRequest = async (parent, args, ctx) => {
  try {
    userLogger.debug('modules/user/resolvers/mutations/reset-pwd-request');
    userLogger.info('reset password request send...');

    const { localeService, prisma } = ctx;
    const { email } = args.data;

    const resetPasswordCode = generateVerificationCode();

    const userData = await prisma.users.findFirst({
      where: {
        email,
      },
    });

    if (!userData) {
      throw new CustomGraphqlError(getMessage('USER_NOT_FOUND', localeService));
    }

    await prisma.users.update({
      where: {
        email,
      },
      data: {
        resetPasswordCode,
      },
    });

    await sendEmail({
      toEmailAddresses: [email],
      templateKey: 'RESET_PASSWORD',
      data: {
        userName: userData.firstName,
        email: userData.email,
        OTP: resetPasswordCode,
      },
    });

    const response = {
      message: getMessage('OTP_SEND_SUCCESS', localeService),
    };

    return response;
  } catch (err) {
    userLogger.error(`Error from resetPwdRequest resolver => ${err}`, ctx);
    throw err;
  }
};

module.exports = resetPwdRequest;
