const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const RequestError = require('../errors/request-err');

const Forbidden = require('../errors/forbidden-err.js');

// получаем все статьи
module.exports.getArticles = (req, res, next) => {
  Article.find({})
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch(next);
};

// добавляем статью
module.exports.postArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image, owner = req.user._id,
  } = req.body;
  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })

    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(() => {
      throw new RequestError('Что-то не так с запросом');
    })
    .catch(next);
};

// удаляем статью

module.exports.deleteArticle = (req, res, next) => {
  const owner = req.user._id;
  Article.findOne({ _id: req.params.id })
    .select('+owner')
    .orFail(() => new NotFoundError('Нет такой статьи '))
    .then((card) => {
      if (card.owner.toString() !== owner) {
        throw new Forbidden('Вы не можете удалять статью');
      }
      return Article.findByIdAndDelete(card._id);
    })
    .then(() => {
      res.send({ message: 'Статья удалена' });
    })
    .catch(next);
};
