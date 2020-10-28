const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^((http|https):\/\/)(www\.)?([A-Za-z0-9.-]{1,250})\.[A-Za-z]{2,25}/.test(v);
      },
      message: 'Неверная URL ссылка',
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^((http|https):\/\/)(www\.)?([A-Za-z0-9.-]{1,250})\.[A-Za-z]{2,25}/.test(v);
      },
      message: 'Неверная URL ссылка',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'owner',
    required: true,
  },
});

module.exports = mongoose.model('article', articleSchema);
