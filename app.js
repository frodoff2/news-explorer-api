require('dotenv').config();

const express = require('express');
const helmet = require('helmet');

const mongoose = require('mongoose'); // модуль для монго
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { limiter } = require('./limiter');

const serverError = require('./errors/server-error');
const { login } = require('./controllers/users');
const { postUser } = require('./controllers/users');

const { userValidation, loginValidation } = require('./middlewares/validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const auth = require('./middlewares/auth');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express(); // подключаем экспресс

app.use(helmet()); // для безопасности express

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger); // подключаем логгер запросов

// роуты, не требующие авторизации
app.post('/signup', userValidation, postUser);
app.post('/signin', loginValidation, login);

// авторизуемся
app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/articles', require('./routes/articles'));

app.use(errorLogger); // подключаем логгер ошибок

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(errors()); // обрабатывает celebreate

app.use(serverError); // централизованная ошибка

app.use(limiter);

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/newsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
