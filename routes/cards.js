const router = require('express').Router();
const {
    createCard,
    getCards,
    deleteCard,
    likeCard,
    removeLike,
} = require('../controllers/cards');

// Создание карточки
router.post('/cards', createCard);

// Получение данных всех карточек
router.get('/cards', getCards);

// Удаление карточки
router.delete('/cards/:cardId', deleteCard);

// Лайканье карточки
router.put('/cards/:cardId', likeCard);

// Снятие лайка с карточки
router.delete('/cards/:cardId', removeLike);

module.exports.userRouter = router;