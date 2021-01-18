require('dotenv').config();

module.exports = {
  MONGO_URL: (process.env.NODE_ENV !== 'production')
    ? 'mongodb://localhost:27017/newsdb' : process.env.MONGO_URL,
};
