const { check } = require('express-validator');

const create = [
  check('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required..')
    .toLowerCase()
    .isString()
    .withMessage('name should be a string'),
  check('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required..')
    .isString()
    .withMessage('Email should be string')
    .isEmail()
    .withMessage('Provide valid email'),
  check('contactNumber')
    .trim()
    .notEmpty()
    .withMessage('Phone No. is required...')
    .isInt()
    .withMessage('Phone No. should in a number....')
    .isLength({ min: 10, max: 10 }),
  check('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required..')
    .isString()
    .withMessage('Password should be a string')
    .isLength({ min: 5, max: 10 })
    .withMessage('min 5 and max 10 character required....'),

];

const login = [
  check('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required..')
    .isString()
    .withMessage('Email should be string')
    .isEmail()
    .withMessage('Provide valid email'),
  check('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required..')
    .isString()
    .withMessage('Password should be a string')
    .isLength({ min: 5, max: 10 })
    .withMessage('min 5 and max 10 character required....'),

];

const resetPWD = [
  check('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required..')
    .isString()
    .withMessage('Email should be string')
    .isEmail()
    .withMessage('Provide valid email'),
];

const changePassword = [
  check('oldPassword')
    .trim()
    .notEmpty()
    .withMessage('Old Password is required..')
    .isString()
    .withMessage('name should be a string')
    .isLength({ min: 5, max: 10 })
    .withMessage('min 5 and max 10 character required....'),
  check('newPassword')
    .trim()
    .notEmpty()
    .withMessage('New Password is required..')
    .isString()
    .withMessage('Password should be a string')
    .isLength({ min: 5, max: 10 })
    .withMessage('min 5 and max 10 character required....'),
];

const resetPassword = [
  check('newPassword')
    .trim()
    .notEmpty()
    .withMessage('New Password is required..')
    .isString()
    .withMessage('Password should be a string')
    .isLength({ min: 5, max: 10 })
    .withMessage('min 5 and max 10 character required....'),
];

const userValidationRule = {
  create,
  login,
  resetPWD,
  changePassword,
  resetPassword,
};

module.exports = userValidationRule;
