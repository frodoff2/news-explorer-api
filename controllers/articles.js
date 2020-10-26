const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const RequestError = require('../errors/request-err');

const Forbidden = require('../error/forbidden-err.js');

// получаем все статьи
module.exports.getArticles = (req, res, next) => {
  Article.find({})
    .then((articles) => {
      if (articles) {
        res.status(200).send({ articles })
      }
      throw new NotFoundError('Нет статей')
  })
    .catch(next);
};

// добавляем статью
module.exports.postArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image, owner = req.user._id  } = req.body;
   Article.create({ keyword, title, text, date, source, link, image, owner })
 // const { keyword, title  } = req.body;
 // Article.create({ keyword, title  })

    .then((articles) => {
      res.status(200).send({ articles })
    })
    .catch(() => {
      throw new RequestError('Что-то не так с запросом');
    })
    .catch(next);
};

// удаляем статью
module.exports.deleteArticle = (req, res, next) => {
  const owner = req.user._id;
  Article.findOneAndDelete({ _id: req.params.id, owner })
    .then((card) => {
      if (!card) {
        throw new Forbidden('Что-то не так с запросом');
      }
      res.send(card);
    })
    .catch(next);
};