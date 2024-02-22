const express = require('express');
const createError = require('http-errors');
const errorHandler = require('./src/middlewares/error-handler');

const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();

// db
require('./src/config/db');

app.use(express.json());

// Routes
app.use('/user', require('./src/modules/users/routes/user-routes'));
app.use('/event', require('./src/modules/events/routes/event-routes'));

app.get('/', (res) => {
  res.send('EVENT-MANAGEMENT-MONGOOSE');
});

app.use(async (req, res, next) => next(createError.NotFound()));
// const error = new Error('not found');
// error.status = 404;

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server listen at PORT number ${PORT}`);
});
