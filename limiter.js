const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 5000, // 15 минут
  max: 10,
});

module.exports = limiter;
