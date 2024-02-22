const { getMessage } = require('../../../../utils/messages');
const userLogger = require('../../user-logger');

const deleteProfile = async (parent, args, ctx) => {
  try {
    userLogger.debug('modules/user/resolvers/mutations/delete-profile');
    userLogger.info('deleting profile...');

    const { localeService, prisma, req } = ctx;
    const { user } = req;

    const updateUser = prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        email: `${user.email}_${user.id}`,
      },
    });

    const deleteUser = prisma.users.delete({
      where: {
        id: user.id,
      },
    });

    await prisma.$transaction([updateUser, deleteUser]);

    const response = {
      message: getMessage('USER_DELETE_SUCCESS', localeService),
    };

    return response;
  } catch (err) {
    userLogger.error(`Error from deleteProfile resolver => ${err}`, ctx);
    throw err;
  }
};

module.exports = deleteProfile;
