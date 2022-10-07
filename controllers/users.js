const User = require('../models/user');
const { NotFound, ValidationError } = require("../errors/errors")

const createUser = (req, res) => {
    const { name, about, avatar } = req.body;

        User.create({ name, about, avatar })
        .then((user) => res.send({ data: user }))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                res.status(400).send({ message: 'Одно из полей не заполнено' });
            } else {
                return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
            }

        });
};
//hitlist
// Получение конкретного пользователя
const getUser = (req, res, next) => {
    User.findById(req.params.userId)
      .orFail(() => {
        throw new NotFound('ID пользователя не найден');
      })
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return next(new ValidationError('ID пользователя не найден'));
        }
        if (err.message === 'NotFound') {
          return next(new NotFound('Пользователь не найден'));
        } else {
          next(err);
        }
      });
  };

// Получить данные всех юзеров
const getUsers = (req, res) => {
    User.find({})
        .then((user) => res.status(200).send(user))
        .catch(() => res.status(500).send({ message: 'Внутренняя ошибка сервера' }));
};

// Обновление данных пользователя
const patchUser = (req, res) => {
    const { name, about } = req.body
    User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
        .then((user) => {
            if (!user) {
                res.status(404).send("Пользователь не найден.")
                return;
            } else {
                res.status(200).send(user)
            }

        }).catch((err) => {
            if (err.name === "ValidationError") {
                res.status(400).send({ message: "Некорректные данные пользователя" })
            } else {
                res.status(500).send({ message: "Внутренняя ошибка сервера" })
            }
        })
};

// Обновление аватара
const patchAvatar = (req, res) => {
    const { avatar } = req.body
    User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
        .then((user) => {
            if (!user) {
                res.status(404).send("Пользователь не найден.")
                return;
            } else {
                res.status(200).send(user)
            }

        })
};

module.exports = {
    createUser,
    getUsers,
    getUser,
    patchUser,
    patchAvatar

};