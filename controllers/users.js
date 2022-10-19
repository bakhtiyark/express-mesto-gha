// Модули
const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Ошибки
const AuthorizationError = require('../errors/AuthorizationError');
const NotFound = require('../errors/NotFound');
const ValidationError = require('../errors/ValidationError');

// Коды
const {
  NOT_FOUND,
  INCORRECT_DATA,
  SERVER_ERROR,
  REGISTERED_ERROR,
} = require('../utils/constants');

// bcrypt-linked
const salt = 10;

// Создание юзера
const createUser = (req, res, next) => {
/* const {
    name, about, avatar, email, password,
  } = req.body;
*/
  bcrypt.hash(req.body.password, salt)
    .then((hash) => {
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
          if (err.code === 11000) {
            res.status(REGISTERED_ERROR).json({ message: 'Пользователь уже существует' });
          } else {
            next(err);
          }
        });
    });
};
// GET ME
const getCurrentUser = (res, req, next) => {
  const ownerId = req.user._id;
  User.findById(ownerId)
    .orFail(new NotFound('Пользователь не найден'))
    .then((user) => {
      res.send({ data: user });
    }).catch(next);
};

// Получение конкретного пользователя /users/:userId
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
const getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

// Обновление данных пользователя
const patchUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about, avatar }, { new: true, runValidators: true })
    .orFail(new ValidationError('Пользователь не найден'))
    .then((user) => res.send({ data: user })).catch((err) => {
      if (err.code === 11000) {
        res.status(REGISTERED_ERROR).json({ message: 'Пользователь уже существует' });
      } else {
        next(err);
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

// Логин
const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AuthorizationError('Неверный логин или пароль');
  }
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthorizationError('Неверный логин или пароль');
      }
      bcrypt.compare(password, user.password, (err, isValidPassword) => {
        if (!isValidPassword) {
          throw new AuthorizationError('Неверный логин или пароль');
        }
        const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '3600' });
        return res.status(200).send({ token });
      });
    })
    .catch(next);
};
module.exports = {
  createUser,
  getUsers,
  getUser,
  patchUser,
  patchAvatar,
  login,
  getCurrentUser,
};
