require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const joiErrors = require('celebrate').errors;

// const { MONGO_DB, NODE_ENV } = process.env;
// const { PORT = 3000 } = process.env;

const { PORT, DB } = require('./constants/config');

const routes = require('./routes');
const errors = require('./errors/errors');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { limiter } = require('./middlewares/limiter');

const corsOptions = {
  // origin: [
  //   '*',
  //   'https://www.renat-frontend.tk',
  //   'https://renat-frontend.tk',
  //   'http://renat-frontend.tk',
  //   'https://www.movies-explorer.tk',
  //   'https://movies-explorer.tk',
  //   'http://movies-explorer.tk',
  // ],
  origin: '*',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
};

const app = express();

app.use(bodyParser.json());
app.use(cors(corsOptions));
// app.use('*', cors(corsOptions));
// app.use('*', cors({ origin: '*' }));
app.use(helmet());

mongoose.connect(DB);

// логгер запросов
app.use(requestLogger);

app.use(limiter);

// обработчики роутов
app.use(routes);

// логгур ошибок
app.use(errorLogger);

// Обаработчки ошибок
// обработчик ошибок celebrate
app.use(joiErrors());

// централизованный обработчик ошибок
app.use((err, req, res, next) => {
  errors(err, req, res, next);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
