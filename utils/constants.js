const NOT_FOUND = 404;
const INCORRECT_DATA = 400;
const SERVER_ERROR = 500;

const regexpLink = /^(https?:\/\/)?([\w]{1,32}\.[\w]{1,32})[^]*$/m;

module.exports = {
  NOT_FOUND,
  INCORRECT_DATA,
  SERVER_ERROR,
  regexpLink,
};
