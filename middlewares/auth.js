const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходимо залогинится' });
  }
  const token = authorization.replace('Bearer ', '');
  const payload = jwt.verify(token, SECRET_KEY);

  // Тест
  /*
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    // отправим ошибку, если не получилось
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
  */
};
