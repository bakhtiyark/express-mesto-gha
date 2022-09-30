//Модули
const express = require('express');
const mongoose = require('mongoose');

//Порт
const { PORT = 3000 } = process.env;

//Роутеры
const { cardRouter } = require('./routes/cards');
const { userRouter } = require('./routes/users');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});
module.exports.createCard = (req, res) => {
  console.log(req.user._id); // _id станет доступен
};

app.listen(PORT);
