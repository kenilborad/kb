const { generatePassword } = require('../../../../utils/auth/generate-password');
const { getMessage } = require('../../../../utils/messages');
const userLogger = require('../../user-logger');

const changePassword = async (parent, args, ctx) => {
  try {
    userLogger.debug('modules/user/resolvers/mutations/change-password');
    userLogger.info('changing user password...');

    const { localeService, prisma, req } = ctx;
    const { newPassword } = args.data;
    const { user } = req;

    const hashedPassword = generatePassword(newPassword);

    await prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    const response = {
      data: {},
      message: getMessage('USER_PASSWORD_UPDATED', localeService),
    };

    return response;
  } catch (err) {
    userLogger.error(`Error from changePassword resolver => ${err}`, ctx);
    throw err;
  }
};

module.exports = changePassword;
