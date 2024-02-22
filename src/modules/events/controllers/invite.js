const { StatusCodes } = require('http-status-codes');
const createError = require('http-errors');
const { getEvent, batchUpdate } = require('../../../db-functions');
const User = require('../../../models/user');
const getResponse = require('../../../utils/response-generator');
const { getObjectId } = require('../../../utils/utils');
const logger = require('../../../utils/logger');

const invite = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { id, multiple } = req.query;
    const _id = await getObjectId(id);

    const event = await getEvent({ _id });

    if ((event.createdBy).toString() !== (req.user._id.toString())) {
      throw createError.Conflict(`Event not created by ${req.user.email}......`);
    }
    // for multiple user invite
    if (multiple === 'true') {
      const result = await batchUpdate(email, event);
      return res.send(getResponse(StatusCodes.OK, 'Invited Successfully........', result));
    }
    // for single user invite
    const user = await User.findOne({ email });

    if (!user) {
      throw createError.Conflict('No such Event Found......');
    }

    const userId = await getObjectId(user._id);
    event.invitedUser.push(userId);
    await event.save();

    return res.send(getResponse(StatusCodes.OK, 'Invited Successfully........'));
  } catch (error) {
    logger.error('failed to invite email');
    return next(error);
  }
};

module.exports = invite;
