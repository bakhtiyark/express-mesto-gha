const User = require('../models/user');

const createUser = (req, res) => {
    const { name, about, avatar } = req.body;

    return User.create({ name, about, avatar })
        .then((user) => res.status(201).send({data:user}))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                res.status(400).send({ message: 'Одно из полей не заполнено' });
                return;
            } else {
                return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
            }

        });
};
// Получение конкретного пользователя
const getUser = (req, res) => {
    User.findById(req.params.userId)
        .then((user) => {
            if (!user) {
                res.status(404).send({ message: 'Пользователь не найдет' });
                return;
            } else {
                return res.status(200).send(user);
            }

        })
        .catch(() => {
            if (!userId) {
                res.status(400).send({ message: 'ID пользователя не найдет' });
                return;
            } else {
                return res.status(500).send({ message: 'Внутренняя ошибка сервера'});

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
    User.findByIdAndUpdate(req.user._id, { name, about })
        .then((user) => {
            if (!user) {
                res.status(404).send("Пользователь не найден.")
                return;
            } else {
                res.status(200).send(user)
            }

        }).catch((err) =>{
            if (err.name === "ValidationError") {
                res.status(400).send({message: "Некорректные данные пользователя"})
            } else {
                res.status(500).send({message: "Внутренняя ошибка сервера"})
            }
        })
};

// Обновление аватара
const patchAvatar = (req, res) => {
    const { avatar } = req.body
    User.findByIdAndUpdate(req.user._id, { avatar })
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