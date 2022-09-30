const User = require('../models/user');

const createUser = (req, res) => {
    const { name, about, avatar } = req.body;

    if (!name || !about) {
        return res.status(400).send({ message: 'Одно из полей не заполнено' });
    }

    return User.create({ name, about, avatar })
        .then((user) => res.status(201).send(user))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return res.status(400).send({ message: 'Одно из полей не заполнено' });
            }
            return res.status(500).send({ message: 'Что-то пошло не так' });
        });
};
const getUser = (req, res) => {
    const { userId } = req.params;

    User.findById(userId)
        .then((user) => {
            if (!user) {
                return res.status(404).send({ message: 'Пользователь не найдет' });
            }

            return res.status(200).send(user);
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return res.status(400).send({ message: 'ID пользователя не найдет' });
            }
            return res.status(500).send({ message: 'Что-то пошло не так' });
        });
};

const getUsers = (res) => {
    User.find({})
        .then((users) => res.status(200).send(users))
        .catch(() => res.status(500).send({ message: 'Что-то пошло не так' }));
};

module.exports = {
    createUser,
    getUsers,
    getUser
};