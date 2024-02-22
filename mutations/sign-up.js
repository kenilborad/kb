const CustomGraphqlError = require('../../../../shared-lib/error-handler');
const generateVerificationCode = require('../../../../utils/auth/generate-code');
const { generatePassword } = require('../../../../utils/auth/generate-password');
const sendEmail = require('../../../../utils/email-service/send-email');
const { getMessage } = require('../../../../utils/messages');
const userLogger = require('../../user-logger');

const signUp = async (parent, args, ctx) => {
  try {
    userLogger.debug('modules/user/resolvers/mutations/sign-up');
    userLogger.info('signUp new user...');

    const { localeService, prisma } = ctx;
    const {
      firstName, lastName, email, password, authProvider,
    } = args.data;

    const userExist = await prisma.users.findFirst({
      where: {
        email,
      },
    });

    if (userExist) {
      throw new CustomGraphqlError(getMessage('USER_EXIST'));
    }

    const hashedPassword = generatePassword(password);

    const verificationCode = generateVerificationCode();

    const userData = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      verificationCode,
      authProvider,
    };

    const data = await prisma.users.create({ data: userData });

    await sendEmail({
      toEmailAddresses: [email],
      templateKey: 'EMAIL_VERIFY',
      data: {
        OTP: verificationCode,
      },
    });

    const response = {
      data,
      message: getMessage('USER_CREATE_SUCCESS', localeService),
    };

    return response;
  } catch (err) {
    userLogger.error(`Error from user signUp resolver => ${err}`, ctx);
    throw err;
  }
};

module.exports = signUp;
