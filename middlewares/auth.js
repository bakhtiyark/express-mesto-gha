const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || authorization.startsWith('Bearer ')) {
    throw new AuthorizationError({ message: 'Необходимо залогиниться' });
  }
  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new AuthorizationError({ message: 'Необходимо залогиниться' });
  }
  req.user = payload;

  next();
};
