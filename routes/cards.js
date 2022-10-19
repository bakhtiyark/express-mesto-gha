const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regexpLink } = require('../utils/constants');

const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  removeLike,
} = require('../controllers/cards');

// Создание карточки
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(true),
    link: Joi.string().required(true).pattern(regexpLink),
  }),
}), createCard);

// Получение данных всех карточек
router.get('/', getCards);

// Удаление карточки
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteCard);

// Лайканье карточки
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), likeCard);

// Снятие лайка с карточки
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), removeLike);

module.exports = router;
