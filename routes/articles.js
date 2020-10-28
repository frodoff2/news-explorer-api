const express = require('express');

const router = express.Router();
const {
  getArticles, postArticle, deleteArticle,
} = require('../controllers/articles');
const { articleValidation, articleDelete } = require('../middlewares/validation');

router.get('/', getArticles);
router.post('/', articleValidation, postArticle);
router.delete('/:id', articleDelete, deleteArticle);

module.exports = router;
