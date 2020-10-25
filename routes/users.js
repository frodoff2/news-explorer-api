const express = require('express');
const router = express.Router();
const { getUser } = require('../controllers/users');
const { idValidation } = require('../middlewares/validation');

router.get('/me', idValidation, getUser) //инфо о пользователе

module.exports = router;
