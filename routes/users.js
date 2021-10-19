const router = require('express').Router();

const { validateUserUpdate } = require('../middlewares/validation');
const { getUser, updateUser, _getUsers } = require('../controllers/users');

router.get('/', _getUsers);
router.get('/me', getUser);
router.patch('/me', validateUserUpdate, updateUser);

module.exports = router;
