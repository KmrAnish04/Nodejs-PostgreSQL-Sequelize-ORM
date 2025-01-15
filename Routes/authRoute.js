const router = require('express').Router();
const {signup, login} = require('../Controllers/authController.js');

router.post('/signup', signup);
router.post('/login', login);

module.exports = router;