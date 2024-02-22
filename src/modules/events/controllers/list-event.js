const { StatusCodes } = require('http-status-codes');
const Event = require('../../../models/event');
const logger = require('../../../utils/logger');
const getResponse = require('../../../utils/response-generator');

const listEvent = async (req, res, next) => {
  try {
    const {
      name = '', startDate = null, endDate = null, skip = 0, limit = 1000,
    } = req.query;
    const nameFilter = RegExp(name, 'i');

    const data = await Event.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              {
                $regexMatch: { input: '$name', regex: nameFilter },
              },
              {
                $cond: {
                  if: {
                    $and: [
                      { $ifNull: [startDate, false] },
                      { $ifNull: [endDate, false] },
                    ],
                  },
                  then: {
                    $and: [
                      { $gte: ['$startTime', new Date(startDate)] },
                      { $lt: ['$startTime', new Date(endDate)] },
                    ],
                  },
                  else: [],
                },
              },
            ],
          },
        },
      },
      { $skip: Number(skip) },
      { $limit: Number(limit) },
      {
        $project: {
          id: 1,
          name: 1,
          category: 1,
          description: 1,
          startTime: 1,
          endTime: 1,
          location: 1,
        },
      },
    ]);

    return res.send(getResponse(StatusCodes.OK, 'event Data.....', data));
  } catch (error) {
    logger.error('failed to list event');
    return next(error);
  }
};

module.exports = listEvent;
