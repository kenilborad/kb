const Route = require('express').Router();
const error = require('../../../middlewares/validators/validation-result');
const auth = require('../../../middlewares/auth');
const eventValidationRule = require('../../../middlewares/validators/event/event.validation');

Route.post('/create', auth, eventValidationRule.create, error, require('../controllers/create'));
Route.post('/update', auth, eventValidationRule.update, error, require('../controllers/update'));
Route.post('/invite', auth, eventValidationRule.invite, error, require('../controllers/invite'));
Route.post('/users-event-data', auth, require('../controllers/user-event-data'));
Route.post('/list-event', auth, require('../controllers/list-event'));

module.exports = Route;
