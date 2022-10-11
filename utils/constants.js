const NOT_FOUND = 404;
const INCORRECT_DATA = 400;
const SERVER_ERROR = 500;
module.exports = {
  NOT_FOUND,
  INCORRECT_DATA,
  SERVER_ERROR,
};

app.post('/signup', (req, res) => {
  bcrypt.hash(req.body.password, 10).then(hash => User.create({
    email: req.body.email,
    password: hash,
  })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      res.status(400).send(err);
    })
});