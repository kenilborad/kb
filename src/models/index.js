const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require('./user');
db.event = require('./event');

db.ROLES = ['user', 'admin', 'moderator'];

module.exports = db;
