const { StatusCodes } = require('http-status-codes');
const createError = require('http-errors');
const Event = require('../../../models/event');
const getResponse = require('../../../utils/response-generator');
const logger = require('../../../utils/logger');

const create = async (req, res, next) => {
  try {
    const {
      name, category, description, startTime, endTime, location,
    } = req.body;

    const event = await Event.findOne({ name, startTime, endTime });

    if (event) {
      throw createError.Conflict('Event already exists......');
    }

    const newEvent = new Event({
      name,
      category,
      description,
      createdBy: req.user._id,
      startTime,
      endTime,
      location,
    });

    await newEvent.save();

    return res.send(getResponse(StatusCodes.OK, 'Event successfully Created......', newEvent));
  } catch (error) {
    logger.error('failed to create event');
    return next(error);
  }
};

module.exports = create;
