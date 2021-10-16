const {
  MONGO_DB, NODE_ENV, PORT = 3001, JWT_SECRET,
} = process.env;

const DB = NODE_ENV === 'production' ? MONGO_DB : 'mongodb://localhost:27017/moviesdb';
const SECRET_KEY = NODE_ENV === 'production' ? JWT_SECRET : 'secret-key';

module.exports = {
  DB,
  PORT,
  SECRET_KEY,
};
