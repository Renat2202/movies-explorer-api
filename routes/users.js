const router = require('express').Router();

const { validateUserId, validateUserUpdate } = require('../middlewares/validation');
const { getUser, updateUser } = require('../controllers/users');

router.get('/me', validateUserId, getUser);
router.patch('/me', validateUserUpdate, updateUser);

module.exports = router;
