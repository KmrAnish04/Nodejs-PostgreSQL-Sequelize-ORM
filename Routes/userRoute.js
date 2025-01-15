const { authentication, restrictTo } = require('../Controllers/authController.js')
const { fetchAllUsers } = require('../Controllers/userController.js');

const router = require('express').Router();

router.route('/').get(authentication, restrictTo('0'), fetchAllUsers);

module.exports = router;