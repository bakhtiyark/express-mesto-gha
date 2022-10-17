// Erreur 403

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
    this.message = message;
    this.status = 403;
  }
}
module.exports = {
  UnauthorizedError,
};
