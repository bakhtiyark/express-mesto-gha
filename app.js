// Модули
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { regexpLink } = require('./utils/constants');

const { auth } = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');

// Порт
const { PORT = 3000 } = process.env;

// Роутеры
const { cardRouter } = require('./routes/cards');
const { userRouter } = require('./routes/users');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

// Роутинг
app.use('/users', userRouter);
app.use('/cards', cardRouter);

// auth
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(false).min(2).max(30),
    about: Joi.string().required(false).min(2).max(30),
    avatar: Joi.string().required(false).pattern(regexpLink),
    email: Joi.string().required(false).email(),
    password: Joi.string().required(false).min(4),
  }),
}), createUser);
// app.use(auth);

app.post('/signup', login);

// Заглушка
app.use('/*', (req, res) => {
  res.status(404).json({ message: 'Запрашиваемая страница не найдена.' });
});

app.listen(PORT);
