/*  eslint linebreak-style: ["error", "windows"]  */

// Модули
const express = require('express');
const mongoose = require('mongoose');

/*
const bodyParser = require("body-parser")
*/

// Порт
const { PORT = 3000 } = process.env;

// Роутеры
const { cardRouter } = require('./routes/cards');
const { userRouter } = require('./routes/users');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
/*
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true,
}));
*/
app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use('/*', (req, res) => {
  res.status(404).json({ message: 'Запрашиваемая страница не найдена.' });
});

app.listen(PORT);
