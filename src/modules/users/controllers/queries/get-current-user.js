const { generateGetCloudFrontSignedUrl } = require('../../../../shared-lib/aws/functions/generate-get-signed-url');
const { getMessage } = require('../../../../utils/messages');
const userLogger = require('../../user-logger');

const getCurrentUser = async (parent, args, ctx) => {
  try {
    userLogger.debug('modules/user/resolvers/queries/get-current-user');
    userLogger.info('getting current user...');

    const { localeService, req } = ctx;
    const { user } = req;

    if (user.avatar) {
      const signedUrl = await generateGetCloudFrontSignedUrl(user.avatar, '', ctx);
      user.avatar = signedUrl;
    }

    const response = {
      data: user,
      message: getMessage('GET_CURRENT_USER_SUCCESS', localeService),
    };

    return response;
  } catch (err) {
    userLogger.error(`Error from getCurrentUser resolver => ${err}`, ctx);
    throw err;
  }
};

module.exports = getCurrentUser;
