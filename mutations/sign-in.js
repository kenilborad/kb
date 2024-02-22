const CONFIG = require('../../../../config/config');
const { generateGetCloudFrontSignedUrl } = require('../../../../shared-lib/aws/functions/generate-get-signed-url');
const CustomGraphqlError = require('../../../../shared-lib/error-handler');
const { verifyPassword } = require('../../../../utils/auth/generate-password');
const generateToken = require('../../../../utils/auth/generate-token');
const { getMessage } = require('../../../../utils/messages');
const userLogger = require('../../user-logger');

const accessTokenLifeTime = CONFIG.JWT.ACCESS_TOKEN_LIFE_TIME;
const refreshTokenLifeTime = CONFIG.JWT.REFRESH_TOKEN_LIFE_TIME;

const signIn = async (parent, args, ctx) => {
  const transaction = await ctx.prisma.$transaction(async prisma => {
    try {
      userLogger.debug('modules/user/resolvers/mutations/sign-in');
      userLogger.info('logging in...');

      const { localeService } = ctx;
      const { email, password } = args.data;
      let refreshToken = '';
      let userDetails = '';

      const checkUserRegistered = await prisma.users.findFirst({
        where: {
          email,
        },
      });
      if (!checkUserRegistered) {
        throw new CustomGraphqlError(getMessage('USER_NOT_REGISTERED', localeService));
      }

      userDetails = checkUserRegistered;

      const passwordIsValid = verifyPassword(password, userDetails.password);
      if (!passwordIsValid) {
        throw new CustomGraphqlError(getMessage('INVALID_CREDENTIALS', localeService));
      }

      refreshToken = userDetails.refreshToken;

      if (!refreshToken) {
        refreshToken = await generateToken(userDetails.id, refreshTokenLifeTime);
        userDetails = await prisma.users.update({
          where: {
            email,
          },
          data: {
            refreshToken,
          },
        });
      }

      const accessToken = await generateToken(userDetails.id, accessTokenLifeTime);
      await prisma.userSessions.create({
        data: {
          userId: userDetails.id,
          accessToken,
        },
      });

      if (userDetails.avatar) {
        const signedUrl = await generateGetCloudFrontSignedUrl(userDetails.avatar, '', ctx);
        userDetails.avatar = signedUrl;
      }

      const response = {
        data: { refreshToken, accessToken, user: userDetails },
        message: getMessage('LOGIN_SUCCESSFULLY', localeService),
      };
      return response;
    } catch (err) {
      userLogger.error(`Error from signIn resolver => ${err}`, ctx);
      throw err;
    }
  });

  return transaction;
};

module.exports = signIn;
