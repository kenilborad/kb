/* eslint-disable node/no-missing-require */
/* eslint-disable import/no-unresolved */
const CONFIG = require('../../../../config/config');
const CustomGraphqlError = require('../../../../shared-lib/error-handler');
const firebase = require('../../../../shared-lib/firebase');
const generateVerificationCode = require('../../../../utils/auth/generate-code');
const { generatePassword } = require('../../../../utils/auth/generate-password');
const generateToken = require('../../../../utils/auth/generate-token');
const sendEmail = require('../../../../utils/email-service/send-email');
const { getMessage } = require('../../../../utils/messages');

const userLogger = require('../../user-logger');

const accessTokenLifeTime = CONFIG.JWT.ACCESS_TOKEN_LIFE_TIME;
const refreshTokenLifeTime = CONFIG.JWT.REFRESH_TOKEN_LIFE_TIME;

const googleSignIn = async (parent, args, ctx) => {
  const transaction = await ctx.prisma.$transaction(async prisma => {
    try {
      userLogger.debug('modules/user/resolvers/mutations/google-sign-in');
      userLogger.info('google sign in...');

      const { localeService } = ctx;
      const { token } = args.data;
      let refreshToken = '';
      let authProvider = '';

      if (!token.startsWith('Bearer ')) {
        throw new CustomGraphqlError(getMessage('INVALID_TOKEN'));
      }

      const authToken = token.slice(7, token.length);
      const user = await firebase.auth().verifyIdToken(authToken);
      const {
        uid: firebaseId, name, email, picture, firebase: { sign_in_provider: provider },
      } = user;

      let User = await prisma.users.findFirst({
        where: {
          email,
        },
      });

      if (provider === 'google.com') {
        authProvider = 'GOOGLE';
      }

      if (User === null) {
        const nameArray = name.split(' ', 2);

        const firstName = nameArray[0];
        const lastName = nameArray[1];

        const password = `${firstName.toUpperCase().substring(0, 2)}#444${lastName.toLowerCase().substring(2, 4)}`;

        const hashedPassword = generatePassword(password);

        const verificationCode = generateVerificationCode();

        const userCreateData = {
          firstName,
          lastName,
          email,
          avatar: picture,
          password: hashedPassword,
          verificationCode,
          authProvider,
          firebaseId,
        };
        User = await prisma.users.create({ data: userCreateData });

        await sendEmail({
          toEmailAddresses: [email],
          templateKey: 'EMAIL_VERIFY',
          data: {
            OTP: verificationCode,
          },
        });
      }

      refreshToken = User.refreshToken;

      if (!User.refreshToken) {
        refreshToken = await generateToken(User.id, refreshTokenLifeTime);
        await prisma.users.update({
          where: {
            email,
          },
          data: {
            refreshToken,
          },
        });
      }

      const accessToken = await generateToken(User.id, accessTokenLifeTime);
      await prisma.userSessions.create({
        data: {
          userId: User.id,
          accessToken,
        },
      });

      const response = {
        data: { refreshToken, accessToken, user: User },
        message: getMessage('USER_SIGN_IN_SUCCESS', localeService),
      };
      return response;
    } catch (err) {
      if (err.errorInfo.code === 'auth/id-token-expired') {
        throw new CustomGraphqlError(getMessage('FIREBASE_TOKEN_EXPIRED'));
      }
      userLogger.error(`Error From googleSignIn Resolver => ${err} `, ctx);
      throw err;
    }
  });

  return transaction;
};
module.exports = googleSignIn;
