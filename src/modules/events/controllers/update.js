const { StatusCodes } = require('http-status-codes');
const createError = require('http-errors');
const { getEvent } = require('../../../db-functions');
const Event = require('../../../models/event');
const getResponse = require('../../../utils/response-generator');
const { getObjectId } = require('../../../utils/utils');
const logger = require('../../../utils/logger');

const update = async (req, res, next) => {
  try {
    const { id } = req.query;
    const _id = await getObjectId(id);

    const eventData = await getEvent({ _id });

    if (!(req.user._id !== eventData.createdBy)) {
      throw createError.Conflict(`Event does not created by ${req.user.name}......`);
    }

    await Event.findByIdAndUpdate(_id, req.body);

    return res.send(getResponse(StatusCodes.OK, 'event successfully updated.....'));
  } catch (error) {
    logger.error('failed to update event');
    return next(error);
  }
};

module.exports = update;
