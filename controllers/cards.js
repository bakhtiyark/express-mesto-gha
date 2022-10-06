//Импорт модели
const Card = require('../models/card');
const {NotFound, ValidationError} = require("../errors/errors")


// Создание карты
const createCard = (req, res, next) => {
    const { name, link } = req.body;
    const ownerId = req.user._id;

    Card.create({ name, link, owner: ownerId })
        .then((card) => res.status(200).send({ data: card }))
        .catch((err) => {
            if (err.status === ValidationError.status) {
                return next(ValidationError.message);
            } else {
                return next(err);
            }
        });
};

// Получить все карты
const getCards = (req, res) => {
    Card.find({})
        .then((cards) => res.status(200).send({ data: cards }))
        .catch(() => res.status(500).send({ message: `lalala  ` }));
};

// Удалить карточку
const deleteCard = (req, res, next) => {
    const { cardId } = req.params;

    Card.findById(cardId)
        .then((card) => {
            if (!card) {
                throw new NotFound("Данная страница не найдена");
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
            throw new NotFound("Данная страница не найдена");
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
            throw new NotFound("Данная страница не найдена");
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