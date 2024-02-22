const CustomGraphqlError = require('../../../../shared-lib/error-handler');
const sendEmail = require('../../../../utils/email-service/send-email');
const { getMessage } = require('../../../../utils/messages');
const userLogger = require('../../user-logger');

const verifyEmail = async (parent, args, ctx) => {
  try {
    userLogger.debug('modules/user/resolvers/mutations/verify-email');
    userLogger.info('verifying email...');

    const { localeService, prisma, req } = ctx;
    const { verificationCode } = args.data;
    const { user } = req;

    const userData = await prisma.users.findFirst({
      where: {
        id: user.id,
      },
    });
    if (!userData) {
      throw new CustomGraphqlError(getMessage('USER_NOT_FOUND', localeService));
    }

    if (userData.emailVerified === true) {
      throw new CustomGraphqlError(getMessage('USER_ALREADY_VERIFIED', localeService));
    }

    const originalTime = new Date(userData.updatedAt);
    const currentTime = new Date();
    const newTime = new Date(currentTime.getTime() - 10 * 60000);

    if (userData.wrongCodeAttempt === 3 && originalTime > newTime) {
      throw new CustomGraphqlError(getMessage('INCORRECT_ATTEMPT', localeService), 'MAXIMUM_ATTEMPT_REACHED');
    }

    if (userData.verificationCode !== verificationCode) {
      if (userData.wrongCodeAttempt === 3) {
        await prisma.users.update({
          where: {
            id: user.id,
          },
          data: {
            wrongCodeAttempt: 1,
          },
        });
        throw new CustomGraphqlError(getMessage('INCORRECT_CODE', localeService));
      }
      await prisma.users.update({
        where: {
          id: user.id,
        },
        data: {
          wrongCodeAttempt: userData.wrongCodeAttempt += 1,
        },
      });
      if (userData.wrongCodeAttempt === 3) {
        throw new CustomGraphqlError(getMessage('INCORRECT_ATTEMPT', localeService), 'MAXIMUM_ATTEMPT_REACHED');
      }
      throw new CustomGraphqlError(getMessage('INCORRECT_CODE', localeService));
    }

    await prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: true,
        wrongCodeAttempt: 0,
      },
    });

    await sendEmail({
      toEmailAddresses: [user.email],
      templateKey: 'EMAIL_VERIFY_SUCCESS',
      data: {
        name: user.firstName,
      },
    });

    const response = {
      data: {},
      message: getMessage('USER_VERIFY_SUCCESS', localeService),
    };

    return response;
  } catch (err) {
    userLogger.error(`Error from verifyEmail resolver => ${err}`, ctx);
    throw err;
  }
};

module.exports = verifyEmail;
