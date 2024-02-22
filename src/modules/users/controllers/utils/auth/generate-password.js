const crypto = require('crypto');

const CONFIG = require('../../config/config');
const defaultLogger = require('../../logger');

const { HASH_SALT } = CONFIG;

const generatePassword = passwordString => {
  try {
    // CREATING A UNIQUE SALT FOR A PARTICULAR USER
    // const salt = crypto.randomBytes(16).toString('hex');
    // TODO: CREATE VERIFY PASSWORD FUNCTION BASED ON REQUIREMENT, TO STORE SALT IN DATABASE OR NOT
    // HASHING USER'S SALT AND PASSWORD WITH 1000 ITERATIONS
    const hash = crypto.pbkdf2Sync(passwordString, HASH_SALT, 1000, 64, 'sha512').toString('hex');
    return hash;
  } catch (error) {
    defaultLogger(`Error from generatePassword => ${error}`, {}, 'error');
    throw error;
  }
};

const verifyPassword = (passwordString, storedHash) => {
  try {
    const hash = generatePassword(passwordString);

    return hash === storedHash;
  } catch (error) {
    defaultLogger(`Error from verifyPassword => ${error}`, {}, 'error');
    throw error;
  }
};

module.exports = { generatePassword, verifyPassword };
