const createError = require('http-errors');
const Event = require('../models/event');

const getEvent = async (pipeline) => {
  try {
    const event = await Event.findOne(pipeline);

    if (!event) {
      throw createError.Conflict('No such Event Found......');
    }

    return event;
  } catch (error) {
    throw createError.InternalServerError;
  }
};

module.exports = getEvent;
