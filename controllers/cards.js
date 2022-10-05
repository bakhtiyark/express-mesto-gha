//Импорт модели
const Card = require('../models/card');

//Ошибки
const invalidData = {
    "code": 400,
    "message": "переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля;"
}

const dataNotFound = {
    "code": 404,
    "message": "Карточка или пользователь не найден."
}

// Создание карты
const createCard = (req, res, next) => {
    const { name, link } = req.body;
    const ownerId = req.user._id;

    Card.create({ name, link, owner: ownerId })
        .then((card) => res.status(200).send({data:card}))
        .catch((err) => {
            if (err.status === invalidData.code) {
                return next(invalidData.message);
            } else {
                return next(err);
            }
        });
};

// Получить все карты
const getCards = (res, next) => {
    Card.find({})
        .then((cards) => res.status(200).send(cards))
        .catch(next);
};

// Удалить карточку
const deleteCard = (req, res, next) => {
    const { cardId } = req.params;

    Card.findById(cardId)
        .then((card) => {
            if (!card) {
                throw dataNotFound.message;
            }
            return Card.findByIdAndRemove(cardId)
                .then(() => res.status(200).send({ message: 'Карточка удалена' }))
                .catch(next);
        })
};

// Поставить лайк карточке
const likeCard = (req, res) => {
    Card.findByIdAndUpdate(
        req.params.cardId,
        { $addToSet: { likes: req.user._id } },
        { new: true },
    ).then((card) => {
        if (!card) {
            throw dataNotFound.message;
        } else {
            res.status(200).send(card);
        }

    })
};
//Удаления лайка с карты
const removeLike = (req, res) => {
    Card.findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.user._id } },
        { new: true },
    ).then((card) => {
        if (!card) {
            throw dataNotFound.message;
        }
        res.status(200).send(card);
    })
};

module.exports = {
    createCard,
    getCards,
    deleteCard,
    likeCard,
    removeLike,
};