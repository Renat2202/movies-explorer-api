const router = require('express').Router();
const auth = require('../middlewares/auth');

const { errorMessages } = require('../constants/constants');

const { login, createUser } = require('../controllers/users');
const { validateSignUp, validateSignIn, validateAuthorization } = require('../middlewares/validation');

const NotFoundError = require('../errors/not-found-err');

router.post('/signup', validateSignUp, createUser);
router.post('/signin', validateSignIn, login);

router.use('/users', validateAuthorization, auth, require('./users'));
router.use('/movies', validateAuthorization, auth, require('./movies'));

// Обаработчк ошибок
router.use('*', (req, res, next) => {
  next(new NotFoundError(errorMessages.pageNotFoundError));
});

module.exports = router;
