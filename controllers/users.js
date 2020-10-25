 const User = require('../models/user');
 const bcrypt = require('bcryptjs');
 const jwt = require('jsonwebtoken');

 const NotFoundError = require('../errors/not-found-err');
 const ConflictErr = require('../errors/conflict-err');
 const AuthError = require('../errors/auth-err');

 module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id) // req.user._id?
    .then((user) => {
      if(user) {
        res.status(200).send({ name: user.name, email: user.email }); // name: user.name, email:
      }
      throw new NotFoundError('Нет пользователя с таким id')
    })
    .catch(next);
 };

 module.exports.postUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
     .then((hash) =>
       User.create({
        email: req.body.email,
        name: req.body.name,
        password: hash,
       }))
     .then((user) => res.send({
       _id: user._id,
       email: user.email,
       name: user.name,
     }))
     .catch(() => {
       throw new ConflictErr('Ошибка')
     })
     .catch(next);
 }

 module.exports.login = (req, res, next) => {
     const {email, password} = req.body;
     User.findUserByCredentials(email, password)
     .then((user) => {
    const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
    res.send({ token });
  })
  .catch(() => {
    throw new AuthError('Что-то не так с авторизацией');
  })
  .catch(next);
};