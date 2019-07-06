const express = require('express');
const router = express.Router();

const { signup, login, signout, requireSignin } = require('../controllers/auth');
const { userSignupValidator } = require('../validator');

router.post('/signup', userSignupValidator, signup);
router.post('/login', login);
router.get('/signout', signout);

module.exports = router;
