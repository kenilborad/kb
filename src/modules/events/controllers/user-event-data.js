const { StatusCodes } = require('http-status-codes');
const Event = require('../../../models/event');
const logger = require('../../../utils/logger');
const getResponse = require('../../../utils/response-generator');

const usersEventData = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const created = await Event.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              {
                $eq: ['$createdBy', _id],
              },
              {
                $gt: ['$endTime', new Date()],
              },
            ],
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'invitedUser',
          foreignField: '_id',
          as: 'invitedUser',
          pipeline: [
            {
              $project: {
                _id: 0,
                name: 1,
                email: 1,
                contactNumber: 1,
              },
            },
            {
              $sort: { name: 1 },
            },
          ],
        },
      },
      {
        $addFields: {
          invitedUser: {
            $concatArrays: [
              [
                { user_count: { $size: '$invitedUser' } },
              ],
              '$invitedUser',
            ],
          },
        },
      },
      {
        $sort: {
          name: 1,
        },
      },
    ]);

    const invited = await Event.aggregate([
      {
        $match: {
          invitedUser: _id,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          category: 1,
          description: 1,
          startTime: 1,
          endDate: 1,
          location: 1,
        },
      },
      {
        $sort: {
          name: 1,
        },
      },
    ]);

    return res.send(getResponse(StatusCodes.OK, 'Event successfully Created......', { created, invited }));
  } catch (error) {
    logger.error('failed to get data');
    return next(error);
  }
};

module.exports = usersEventData;
