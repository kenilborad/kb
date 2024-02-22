const Route = require('express').Router();
const error = require('../../../middlewares/validators/validation-result');
const auth = require('../../../middlewares/auth');
const userValidationRule = require('../../../middlewares/validators/user/user.validation');

Route.post('/register', userValidationRule.create, error, require('../controllers/register'));
Route.post('/login', userValidationRule.login, error, require('../controllers/login'));
Route.post('/logout', auth, require('../controllers/logout'));
Route.post('/logout-all', auth, require('../controllers/logout-all'));
Route.post('/reset-pwd', userValidationRule.resetPWD, error, require('../controllers/reset-password'));
Route.post('/change-pwd', auth, userValidationRule.changePassword, error, require('../controllers/change-password'));
Route.post('/reset-pwd/:token', userValidationRule.resetPassword, error, require('../controllers/reset-password-url'));

module.exports = Route;
