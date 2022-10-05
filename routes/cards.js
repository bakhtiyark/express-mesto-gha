const router = require('express').Router();
const {
    createCard,
    getCards,
    deleteCard,
    likeCard,
    removeLike,
} = require('../controllers/cards');

// Создание карточки
router.post('/', createCard);

// Получение данных всех карточек
router.get('/', getCards);

// Удаление карточки
router.delete('/:cardId', deleteCard);

// Лайканье карточки
router.put('/:cardId/likes', likeCard);

// Снятие лайка с карточки
router.delete('/:cardId/likes', removeLike);

module.exports.cardRouter = router;