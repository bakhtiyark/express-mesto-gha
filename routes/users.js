const router = require('express').Router();
const {
  createUser,
  getUsers,
  getUser,
  patchUser,
  patchAvatar
} = require('../controllers/users');

// Создание пользователя
router.post('/', createUser);

// Получениеи данных конкретного пользователя по ID
router.get('/:userId', getUser);

// Получение данных всех пользователей
router.get('/', getUsers);

// Обновление данных пользователя
router.patch('/me', patchUser);

// Замен аватара
router.patch('/me/avatar', patchAvatar);

module.exports.userRouter = router;