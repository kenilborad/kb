const { check } = require('express-validator');
const validator = require('validator');

const create = [
  check('name')
    .trim()
    .notEmpty()
    .withMessage('Event Name is required..')
    .isString()
    .withMessage('Event Name should be a string'),
  check('category')
    .trim()
    .notEmpty()
    .withMessage('Event Category is required..')
    .isString()
    .withMessage('Event Category should be a string'),
  check('description')
    .trim()
    .notEmpty()
    .withMessage('Event Description is required..')
    .isString()
    .withMessage('Event Description should be a string'),
  check('startTime')
    .isISO8601()
    .withMessage('Must be a valid date....')
    .trim()
    .notEmpty()
    .withMessage('Start Time is required..')
    .isString()
    .withMessage('Start Time should be a string'),
  check('endTime')
    .isISO8601()
    .withMessage('Must be a valid date....')
    .trim()
    .notEmpty()
    .withMessage('End Time is required..')
    .isString()
    .withMessage('End Time should be a string'),
  check('location')
    .isObject()
    .notEmpty()
    .withMessage('Location is required..'),
  check('location.latitude')
    .optional()
    .trim()
    .isString()
    .withMessage('latitude should be string'),
  check('location.longitude')
    .optional()
    .trim()
    .isString()
    .withMessage('longitude should be string'),
  check('location.city')
    .trim()
    .notEmpty()
    .withMessage('City is required..')
    .isString()
    .withMessage('City should be a string'),

];

const update = [
  check('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Event Name is required..')
    .isString()
    .withMessage('Event Name should be a string'),
  check('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Event Category is required..')
    .isString()
    .withMessage('Event Category should be a string'),
  check('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Event Description is required..')
    .isString()
    .withMessage('Event Description should be a string'),
  check('startTime')
    .optional()
    .isISO8601()
    .withMessage('Must be a valid date....')
    .trim()
    .notEmpty()
    .withMessage('Start Time is required..')
    .isString()
    .withMessage('Start Time should be a string'),
  check('endTime')
    .optional()
    .isISO8601()
    .withMessage('Must be a valid date....')
    .trim()
    .notEmpty()
    .withMessage('End Time is required..')
    .isString()
    .withMessage('End Time should be a string'),
  check('location')
    .optional()
    .isObject()
    .notEmpty()
    .withMessage('Location is required..'),
  check('location.latitude')
    .optional()
    .trim()
    .isString()
    .withMessage('latitude should be string'),
  check('location.longitude')
    .optional()
    .trim()
    .isString()
    .withMessage('longitude should be string'),
  check('location.city')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('City is required..')
    .isString()
    .withMessage('City should be a string'),

];

const invite = [
  check('email')
    .custom((value) => {
      if (!Array.isArray(value) && typeof value !== 'string') {
        throw new Error('Email must be a string or an array');
      }

      const emails = Array.isArray(value) ? value : [value];
      // eslint-disable-next-line no-restricted-syntax
      for (const email of emails) {
        if (!validator.isEmail(email)) {
          throw new Error('Email is not valid');
        }
      }

      return true;
    }),
];

const eventValidationRule = {
  create,
  update,
  invite,
};

module.exports = eventValidationRule;
