const { errorMessages } = require('../constants/constants');

function errors(err, req, res, next) {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? errorMessages.serverError
        : message,
    });
  next();
}

module.exports = errors;
