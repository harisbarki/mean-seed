const express = require('express');
const router = express.Router();
let passport = require('passport');
let jwt = require('jsonwebtoken');

const User = require('./user.model');
const setUserInfo = require('./user.service').setUserInfo;

const ROLES = require('../../shared/constants');
// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });

//= =======================================
// User Routes
//= =======================================
router.get('/:userId', requireAuth, (req, res, next) => {
	const userId = req.params.userId;

	if (!req.user || req.user._id.toString() !== userId) { return res.status(401).json({ error: 'You are not authorized to view this user profile.' }); }
	User.findById(userId, (err, user) => {
		if (err) {
			res.status(400).json({ error: 'No user could be found for this ID.' });
			return next(err);
		}

		const userToReturn = setUserInfo(user);

		return res.status(200).json({ user: userToReturn });
	});
});

module.exports = router;
