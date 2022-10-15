// Erreur 401

class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthorizationError';
    this.message = message;
    this.status = 401;
  }
}
module.exports = {
  AuthorizationError,
};
