const { generateGetCloudFrontSignedUrl } = require('../../../../shared-lib/aws/functions/generate-get-signed-url');
const { getMessage } = require('../../../../utils/messages');
const userLogger = require('../../user-logger');

const updateProfile = async (parent, args, ctx) => {
  try {
    userLogger.debug('modules/user/resolvers/mutations/update-profile');
    userLogger.info('updating profile...');

    const { localeService, prisma, req } = ctx;
    const { user } = req;

    let userUpdates = args.data;
    userUpdates = Object.fromEntries(Object.entries(userUpdates)
      // eslint-disable-next-line no-unused-vars
      .filter(([key, value]) => value !== null));

    const updatedData = await prisma.users.update({
      where: {
        id: user.id,
      },
      data: userUpdates,
    });

    if (updatedData.avatar) {
      const signedUrl = await generateGetCloudFrontSignedUrl(updatedData.avatar, '', ctx);
      updatedData.avatar = signedUrl;
    }

    const response = {
      data: updatedData,
      message: getMessage('USER_UPDATE_SUCCESS', localeService),
    };

    return response;
  } catch (err) {
    userLogger.error(`Error from updateProfile resolver => ${err}`, ctx);
    throw err;
  }
};

module.exports = updateProfile;
