const { getMessage } = require('../../../../utils/messages');
const userLogger = require('../../user-logger');

const signOut = async (parent, args, ctx) => {
  try {
    userLogger.debug('modules/user/resolvers/mutations/sign-out');
    userLogger.info('sign out profile...');

    const { localeService, prisma, req } = ctx;
    const token = req.headers.authorization;

    const accessToken = token.slice(7, token.length);

    const data = await prisma.userSessions.findFirst({
      where: {
        accessToken,
      },
    });

    await prisma.userSessions.delete({
      where: {
        id: data.id,
      },
    });

    const response = {
      message: getMessage('USER_LOGGED_OUT_SUCCESS', localeService),
    };

    return response;
  } catch (err) {
    userLogger.error(`Error from signOut resolver => ${err}`, ctx);
    throw err;
  }
};

module.exports = signOut;
