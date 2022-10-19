// Модули
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const bodyParser = require('body-parser');
const { regexpLink } = require('./utils/constants');

const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');

// Порт
const { PORT = 3000 } = process.env;

// Роутеры
const { cardRouter } = require('./routes/cards');
const { userRouter } = require('./routes/users');
// const NotFound = require('./errors/NotFound');

const app = express();

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

// reg
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(false).min(2).max(30),
    about: Joi.string().required(false).min(2).max(30),
    avatar: Joi.string().required(false).pattern(regexpLink),
    email: Joi.string().required(true).email(),
    password: Joi.string().required(true),
  }),
}), createUser);

app.use(auth);

// signin

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(true).email(),
    password: Joi.string().required(true),
  }),
}), login);

// Роутинг
app.use('/users', userRouter);
app.use('/cards', cardRouter);

// Заглушка
app.use('/*', (res) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT);
