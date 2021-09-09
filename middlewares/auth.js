const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');
const ForbiddenError = require('../errors/forbidden-err');

const { SECRET_KEY } = require('../constants/config');

const { errorMessages } = require('../constants/constants');

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new ForbiddenError(errorMessages.authorizationError));
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return next(new UnauthorizedError(errorMessages.authorizationNeedError));
  }

  req.user = payload;

  return next();
};
