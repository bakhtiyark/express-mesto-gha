//Erreur 400

class ValidationError extends Error {
    constructor(message) {
        super(message)
        this.name = "ValidationError"
        this.message = message
        this.status = 400
    }
}
// 404
class NotFound extends Error {
    constructor(message) {
        super(message)
        this.name = "NotFound"
        this.message = message
        this.status = 404
    }
}
module.exports = {
    ValidationError,
    NotFound
}