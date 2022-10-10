// Модули
const express = require('express');
const mongoose = require('mongoose');

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

// Заглушка
app.use('/*', (req, res) => {
  res.status(404).json({ message: 'Запрашиваемая страница не найдена.' });
});

app.listen(PORT);
