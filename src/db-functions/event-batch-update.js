const createError = require('http-errors');
const User = require('../models/user');
const { getObjectId } = require('../utils/utils');

const batchUpdate = async (email, event) => {
  try {
    const invitedEmail = [];
    const notExistEmail = [];
    const alreadyInvited = [];
    // eslint-disable-next-line no-inner-declarations
    // eslint-disable-next-line no-restricted-syntax, no-unreachable-loop
    for (const e of email) {
      // eslint-disable-next-line no-await-in-loop
      const user = await User.findOne({ email: e });
      if (!user) {
        notExistEmail.push(e);
      }
      if (user) {
        if ((event.invitedUser).includes(user._id)) {
          alreadyInvited.push(user.email);
        } else {
          // eslint-disable-next-line no-await-in-loop
          const userId = await getObjectId(user._id);
          event.invitedUser.push(userId);
          invitedEmail.push(user.email);
        }
      }
    }
    await event.save();

    const data = { invitedEmail, notExistEmail, alreadyInvited };
    return data;
  } catch (error) {
    throw createError.InternalServerError;
  }
};

module.exports = batchUpdate;
