const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || authorization.startsWith('Bearer ')) {
    throw new Error('Необходимо залогиниться');
  }
  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new Error('Необходимо залогиниться');
  }
  req.user = payload;

  next();
};
