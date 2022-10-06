const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
    required: true
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
    required: true
  },
  avatar: {
    type: String,
    required: true
  }
});


module.exports = mongoose.model('user', userSchema);