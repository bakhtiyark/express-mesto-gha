// Модули
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const {
  celebrate, errors, Joi, isCelebrateError,
} = require('celebrate');
const bodyParser = require('body-parser');
const { regexpLink } = require('./utils/constants');

const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');

// Порт
const { PORT = 3000 } = process.env;

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const NotFound = require('./errors/NotFound');

mongoose.connect('mongodb://localhost:27017/mestodb');

// app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
/*
app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133',
  };

  next();
});
*/

// signin

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
    avatar: Joi.string().pattern(regexpLink),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
app.use(auth);
// Роутинг
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// Заглушка
app.use('/*', (req, res, next) => {
  next(new NotFound('Запрашиваемая страница не найдена'));
});
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  if (isCelebrateError(err)) {
    res.status(statusCode).json(err);
  } else {
    res.status(statusCode).json({ message: statusCode === 500 ? 'Внутренняя ошибка сервера' : message });
  }
  next();
});

app.listen(PORT);
