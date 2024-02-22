const mongoose = require('mongoose');

const eventSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    invitedUser: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    startTime: {
      type: mongoose.Schema.Types.Date,
      required: true,
    },
    endTime: {
      type: mongoose.Schema.Types.Date,
      required: true,
    },
    location: {
      latitude: {
        type: String,
        default: null,
      },
      longitude: {
        type: String,
        default: null,
      },
      city: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
