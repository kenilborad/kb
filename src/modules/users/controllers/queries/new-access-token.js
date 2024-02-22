const CONFIG = require('../../../../config/config');
const { generateGetCloudFrontSignedUrl } = require('../../../../shared-lib/aws/functions/generate-get-signed-url');
const CustomGraphqlError = require('../../../../shared-lib/error-handler');
const generateToken = require('../../../../utils/auth/generate-token');
const getDecodedToken = require('../../../../utils/auth/get-decoded-token');
const { getMessage } = require('../../../../utils/messages');
const userLogger = require('../../user-logger');

const accessTokenLifeTime = CONFIG.JWT.ACCESS_TOKEN_LIFE_TIME;

const newAccessToken = async (parent, args, ctx) => {
  try {
    userLogger.debug('modules/user/resolvers/mutations/new-access-token');
    userLogger.info('generating access token...');

    const { localeService, prisma } = ctx;
    const { refreshToken } = args;

    if (!refreshToken.startsWith('Bearer ')) {
      throw new CustomGraphqlError(getMessage('INVALID_TOKEN'));
    }

    const token = refreshToken.slice(7, refreshToken.length);

    const userData = await prisma.users.findFirst({
      where: {
        refreshToken: token,
      },
    });

    if (!userData) {
      throw new CustomGraphqlError(getMessage('USER_NOT_FOUND', localeService));
    }

    const payload = await getDecodedToken(token, localeService);
    const accessToken = await generateToken(payload.userId, accessTokenLifeTime);
    await prisma.userSessions.create({
      data: {
        userId: payload.userId,
        accessToken,
      },
    });

    if (userData.avatar) {
      const signedUrl = await generateGetCloudFrontSignedUrl(userData.avatar, '', ctx);
      userData.avatar = signedUrl;
    }

    const response = {
      data: { accessToken, user: userData },
      message: getMessage('NEW_ACCESS_TOKEN_SUCCESS', localeService),
    };

    return response;
  } catch (err) {
    userLogger.error(`Error from newAccessToken resolver => ${err}`, ctx);
    throw err;
  }
};

module.exports = newAccessToken;
