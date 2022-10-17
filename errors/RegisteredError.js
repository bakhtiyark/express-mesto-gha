// Erreur 409

class RegisteredError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RegisteredError';
    this.message = message;
    this.status = 409;
  }
}
module.exports = {
  RegisteredError,
};
