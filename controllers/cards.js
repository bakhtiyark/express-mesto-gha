//Импорт модели
const Card = require('../models/card');
const { NotFound, ValidationError } = require("../errors/errors")


// Создание карты
const createCard = (req, res, next) => {
    const { name, link } = req.body;
    const ownerId = req.user._id;

    Card.create({ name, link, owner: ownerId })
        .then((card) => res.status(200).send({ data: card }))
        .catch((err) => {
            if (err.name === "ValidationError") {
                res.status(400).send({ message: "Некорректные данные" });
            } else {
                res.status(500).send({ message: "Внутренняя ошибка сервера" });
            }
        });
};

// Получить все карты
const getCards = (req, res) => {
    Card.find({})
        .then((cards) => res.status(200).send({ data: cards }))
        .catch(() => res.status(500).send({ message: "Внутренняя ошибка сервера" }));
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
    ).orFail(() => { throw new NotFound("Карточка с указанным ID не найдена") })
        .then((card) => res.send({ data: card }))
        .catch((err) => {
            if (err.name === 'CastError') {
                res.status(400).send({ message: "Карточка с указанным ID не найдена"});
            } else if (404) {
                res.status(404).send({ message: "Данная страница не найдена" });
            } else {
                res.status(500).send({ message: 'Внутренняя ошибка сервера' });
            }
        });
};
//Удаления лайка с карты
const removeLike = (req, res) => {
    Card.findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.user._id } },
        { new: true },
    ).orFail(() => { throw new NotFound("Карточка с указанным ID не найдена") })
    .then((card) => {
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