const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: 'Неверная почта или пароль',
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // чтобы Ап не возвращала пароль

  },
  name: {
    type: String,
    required: true,
  },
});

userSchema.statics.findUserByCredentials = function findUser(email, password) {
  // ищем пользователя по почте
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неверная почта или пароль'));
      }
      // если нашелся, сравниваем хеши
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неверная почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
