const logger = require('../utils/logger');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500);
  logger.error(`${err.status} || ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  return res.send({
    error: {
      status: err.status || 500,
      Message: err.message,
    },
  });
};

module.exports = errorHandler;
