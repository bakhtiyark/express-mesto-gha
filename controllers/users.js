const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { AuthorizationError } = require('../errors/AuthorizationError');
const { NotFound } = require('../errors/NotFound');
const { ValidationError } = require('../errors/ValidationError');
const {
  NOT_FOUND,
  INCORRECT_DATA,
  SERVER_ERROR,
  REGISTERED_ERROR,
} = require('../utils/constants');

// bcrypt-linked
const salt = 10;

// Создание юзера
const createUser = (req, res) => {
/* const {
    name, about, avatar, email, password,
  } = req.body;
*/
  bcrypt.hash(req.body.password, salt).then((hash) => {
    User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    })
      .then(({
        name, about, _id, avatar, createdAt, email,
      }) => res.send({
        name, about, _id, avatar, createdAt, email,
      }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(INCORRECT_DATA).send({ message: 'Одно из полей не заполнено' });
        } else if (err.code === REGISTERED_ERROR) {
          res.status(REGISTERED_ERROR).send({ message: 'Пользователь с таким емейлом уже зарегистрирован' });
        } else {
          res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
        }
      });
  });
};

// Логин
const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AuthorizationError({ message: 'Неверный логин или пароль' });
  }
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthorizationError({ message: 'Неверный логин или пароль' });
      }
      bcrypt.compare(password, user.password, (err, isValidPassword) => {
        if (!isValidPassword) {
          throw new AuthorizationError({ message: 'Неверный логин или пароль' });
        }
        const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '3600' });
        return res.status(200).send({ token });
      });
    })
    .catch(next);
};

// Получение конкретного пользователя
const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new NotFound('ID пользователя не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INCORRECT_DATA).send({ message: 'Некорректный ID пользователя' });
      } else if (err.status === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

// Получить данные всех юзеров
const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.status(200).send(user))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' }));
};

// Обновление данных пользователя
const patchUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new ValidationError('Пользователь не найден'))
    .then((user) => res.send({ data: user })).catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCORRECT_DATA).send({ message: 'Некорректные данные пользователя' });
      } else if (err.name === 'CastError') {
        res.status(INCORRECT_DATA).send({ message: 'Некорректный ID пользователя' });
      } else if (err.code === 404) {
        res.status(NOT_FOUND).send({ message: 'Запрашиваемая страница не найдена' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

// Обновление аватара
const patchAvatar = (req, res, next) => {
  const { owner } = req.user._id;
  User.findByIdAndUpdate(owner, { avatar: req.body.avatar }, { new: true, runValidators: true })
    .orFail(new NotFound('Пользователь не найден'))
    .then((user) => res.send({ data: user }))
    .catch(next);

  /* .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден.' });
      } else {
        res.send(user);
      }
    }).catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCORRECT_DATA).send({ message: 'Некорректные данные пользователя' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
      }
    }) */
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  patchUser,
  patchAvatar,
  login,
};
