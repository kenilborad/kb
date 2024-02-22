const CustomGraphqlError = require('../../../../shared-lib/error-handler');
const generateVerificationCode = require('../../../../utils/auth/generate-code');
const sendEmail = require('../../../../utils/email-service/send-email');
const { getMessage } = require('../../../../utils/messages');
const userLogger = require('../../user-logger');

const resendVerificationCode = async (parent, args, ctx) => {
  try {
    userLogger.debug('modules/user/resolvers/mutations/resend-verification-code');
    userLogger.info('sending verification code...');

    const { localeService, prisma, req } = ctx;
    const { user } = req;

    const verificationCode = generateVerificationCode();

    const userData = await prisma.users.findFirst({
      where: {
        email: user.email,
      },
    });

    if (!userData) {
      throw new CustomGraphqlError(getMessage('USER_NOT_FOUND', localeService));
    }

    await prisma.users.update({
      where: {
        email: user.email,
      },
      data: {
        verificationCode,
      },
    });

    await sendEmail({
      toEmailAddresses: [user.email],
      templateKey: 'EMAIL_VERIFY',
      data: {
        OTP: verificationCode,
      },
    });

    const response = {
      message: getMessage('OTP_SEND_SUCCESS', localeService),
    };

    return response;
  } catch (err) {
    userLogger.error(`Error from resendVerificationCode resolver => ${err}`, ctx);
    throw err;
  }
};

module.exports = resendVerificationCode;
