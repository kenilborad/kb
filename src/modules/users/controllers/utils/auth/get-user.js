const { PrismaClient } = require('@prisma/client');

const defaultLogger = require('../../logger');

const prisma = new PrismaClient();
const CustomGraphqlError = require('../../shared-lib/error-handler');
const { getMessage } = require('../messages');

const getDecodedToken = require('./get-decoded-token');

const getUser = async (token, localeService) => {
  if (!token) {
    throw new CustomGraphqlError(getMessage('NOT_LOGGEDIN', localeService), 'LOGIN_REQUIRED');
  }

  if (!token.startsWith('Bearer ')) {
    throw new CustomGraphqlError(getMessage('INVALID_TOKEN', localeService), 'INVALID_TOKEN');
  }

  const authToken = token.slice(7, token.length);
  try {
    const decodedToken = await getDecodedToken(authToken, localeService);
    const user = await prisma.users.findFirst({
      where: {
        id: decodedToken.userId,
      },
    });
    return user;
  } catch (error) {
    defaultLogger(`Error from getUser > ${error}`, null, 'error');
    throw error;
  }
};

module.exports = getUser;
