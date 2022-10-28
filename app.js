require('dotenv').config();
// Модули
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { celebrate, errors, Joi } = require('celebrate');
const bodyParser = require('body-parser');
const allowedCors = require('./middlewares/cors');

const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (allowedCors.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};
// Константы

const { regexpLink } = require('./utils/constants');

const { login, createUser } = require('./controllers/users');

// Middlewares

const errorHandler = require('./middlewares/error');
// const cors = require('./middlewares/cors');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// Порт
const { PORT = 3000 } = process.env;
console.log('11');
const NotFound = require('./errors/NotFound');

// Подключение базы данных
mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(cors());

// Crash test
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// signin
app.use(requestLogger);
app.use(errorLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

// reg
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regexpLink),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

// Роутинг

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

// Заглушка
app.use('/*', auth, (req, res, next) => {
  next(new NotFound('Запрашиваемая страница не найдена'));
});

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
