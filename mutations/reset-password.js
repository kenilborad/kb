const CustomGraphqlError = require('../../../../shared-lib/error-handler');
const { generatePassword, verifyPassword } = require('../../../../utils/auth/generate-password');
const { getMessage } = require('../../../../utils/messages');
const userLogger = require('../../user-logger');

const resetPassword = async (parent, args, ctx) => {
  try {
    userLogger.debug('modules/user/resolvers/mutations/reset-password');
    userLogger.info('reset Password...');

    const { localeService, prisma } = ctx;
    const { otp, newPassword, email } = args.data;

    const hashedPassword = generatePassword(newPassword);

    const userData = await prisma.users.findFirst({
      where: {
        email,
      },
    });

    if (!userData) {
      throw new CustomGraphqlError(getMessage('USER_NOT_FOUND', localeService));
    }

    const originalTime = new Date(userData.updatedAt);
    const currentTime = new Date();
    const newTime = new Date(currentTime.getTime() - 10 * 60000);

    if (userData.wrongCodeAttempt === 3 && originalTime > newTime) {
      throw new CustomGraphqlError(getMessage('INCORRECT_ATTEMPT', localeService), 'MAXIMUM_ATTEMPT_REACHED');
    }

    if (userData.resetPasswordCode !== otp) {
      if (userData.wrongCodeAttempt === 3) {
        await prisma.users.update({
          where: {
            id: userData.id,
          },
          data: {
            wrongCodeAttempt: 1,
          },
        });
        throw new CustomGraphqlError(getMessage('INCORRECT_CODE', localeService));
      }
      await prisma.users.update({
        where: {
          email: userData.email,
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

    const matchPassword = verifyPassword(newPassword, userData.password);

    if (matchPassword) {
      throw new CustomGraphqlError(getMessage('ALREADY_USED_PASSWORD', localeService));
    }

    await prisma.users.update({
      where: {
        email: userData.email,
      },
      data: {
        password: hashedPassword,
        wrongCodeAttempt: 0,
      },
    });
    const response = {
      message: getMessage('USER_PASSWORD_RESET', localeService),
    };

    return response;
  } catch (err) {
    userLogger.error(`Error from resetPassword resolver => ${err}`, ctx);
    throw err;
  }
};

module.exports = resetPassword;
