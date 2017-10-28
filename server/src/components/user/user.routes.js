const User = require('./user.controller');
const express = require('express');
const router = express.Router();

router.post('/create', User.create);
router.post('/login', User.login);
router.post('/forgot', User.forgotPassword);
router.post('/reset', User.newPassword);
router.post('/verify-email', User.verifyEmail);

module.exports = router;
