const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regexpLink } = require('../utils/constants');

const {
  getUsers,
  getUser,
  patchUser,
  patchAvatar,
} = require('../controllers/users');

// Получение данных текущего
router.get('/me', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUser);

// Получение данных конкретного пользователя по ID
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUser);

// Получение данных всех пользователей
router.get('/', getUsers);

// Обновление данных пользователя
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(false).min(2).max(30),
    about: Joi.string().required(false).min(2).max(30),
    avatar: Joi.string().required(false).pattern(regexpLink),
  }),
}), patchUser);

// Замена аватара
router.patch('/me', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(true).pattern(regexpLink),
  }),
}), patchAvatar);

module.exports.userRouter = router;
