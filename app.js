require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');

const { PORT = 3000 } = process.env;

const joiErrors = require('celebrate').errors;
const { login, createUser } = require('./controllers/users');
const { validateSignUp, validateSignIn, validateAuthorization } = require('./middlewares/validation');

const errors = require('./errors/errors');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const auth = require('./middlewares/auth');

const NotFoundError = require('./errors/not-found-err');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

const corsOptions = {
  origin: [
    'https://www.renat-frontend.tk',
    'https://renat-frontend.tk',
    'http://renat-frontend.tk',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
};

const app = express();

app.use(bodyParser.json());
app.use('*', cors(corsOptions));
app.use(limiter);
app.use(helmet());

mongoose.connect('mongodb://localhost:27017/moviesdb');

// логгер запросов
app.use(requestLogger);

// обработчики роутов
app.post('/signup', validateSignUp, createUser);
app.post('/signin', validateSignIn, login);

app.use('/users', validateAuthorization, auth, require('./routes/users'));
app.use('/movies', validateAuthorization, auth, require('./routes/movies'));

// логгур ошибок
app.use(errorLogger);

// Обаработчки ошибок
app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не существует'));
});

// обработчик ошибок celebrate
app.use(joiErrors());

// централизованный обработчик ошибок
app.use((err, req, res, next) => {
  errors(err, req, res, next);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
