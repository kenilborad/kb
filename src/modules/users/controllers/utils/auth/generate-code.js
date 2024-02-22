const { customAlphabet } = require('nanoid');

const defaultLogger = require('../../logger');

const generateVerificationCode = () => {
  try {
    const code = customAlphabet('0123456789', 6);
    const verificationCode = code();

    return verificationCode;
  } catch (error) {
    defaultLogger(`Error from generateVerificationCode => ${error}`, {}, 'error');
    throw error;
  }
};

module.exports = generateVerificationCode;
