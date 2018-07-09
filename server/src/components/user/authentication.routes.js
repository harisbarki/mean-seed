const express = require('express');
const router = express.Router();
let passport = require('passport');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
var request = require('request');

const User = require('./user.model');
const setUserInfo = require('./user.service').setUserInfo;
const config = require('../../shared/config/config');
const userService = require('./user.service');

const ROLES = require('../../shared/constants');
// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', {session: false});
const requireLogin = passport.authenticate('local', {session: false});

// Generate JWT
function generateToken(user) {
	return jwt.sign(user, config.security.privateKey, {
		algorithm: 'HS512',
		expiresIn: config.security.tokenExpiry, // in seconds,
		issuer: config.security.issuer,
		audience: config.security.audience,
		subject: user._id ? user._id.toString() : user.orcid ? user.orcid.toString() : ""
	});
}

// Test protected route
router.get('/protected', requireAuth, (req, res) => {
	res.send({content: 'The protected test route is functional!'});
});

router.get('/admins-only', requireAuth, userService.roleAuthorization(ROLES.ROLE_ADMIN), (req, res) => {
	res.send({content: 'Admin dashboard is working.'});
});

//= =======================================
// Login Route
//= =======================================
router.post('/login', requireLogin, (req, res, next) => {
	const userInfo = setUserInfo(req.user);

	res.status(200).json({
		token: `JWT ${generateToken(userInfo)}`,
		expiresIn: config.security.tokenExpiry,
		user: userInfo
	});
});


router.post('/orcid', (req, res, next) => {
	const formData = {
		client_id: config.security.orcid.client_id,
		client_secret: config.security.orcid.client_secret,
		grant_type: config.security.orcid.grant_type,
		code: req.body.code,
		response_type: config.security.orcid.response_type,
		redirect_uri: req.redirect_uri
	};

	request.post({url: config.security.orcid.url, form: formData}, function (err, httpResponse, body) {
		if (err) console.error(err);

		const response = JSON.parse(body);

		User.findOne({'orcid._id': response.orcid}, (err, user) => {
			if (err) {
				return next(err);
			}

			if(!user) {
				//create user
				user = new User({
					uuid: response.orcid,
					orcid: {
						_id: response.orcid,
					}
				});
			}

			user.profile.name  = response.name;
			user.orcid.access_token  = response.access_token;
			user.orcid.refresh_token = response.refresh_token;

			user.save((err, user) => {
				if (err) {
					return next(err);
				}

				const userInfo = setUserInfo(user);
				res.status(200).json({
					token: `JWT ${generateToken(userInfo)}`,
					expiresIn: response.expires_in,
					user: userInfo
				});
			});
		});
	})
});

//= =======================================
// Registration Route
//= =======================================
router.post('/register', (req, res, next) => {
	// Check for registration errors
	const email = req.body.email;
	const name = req.body.name || null;
	const password = req.body.password;

	// Return error if no email provided
	if (!email) {
		return res.status(422).send({error: 'You must enter an email address.'});
	}

	// Return error if no password provided
	if (!password) {
		return res.status(422).send({error: 'You must enter a password.'});
	}

	User.findOne({email}, (err, existingUser) => {
		if (err) {
			return next(err);
		}

		// If user is not unique, return error
		if (existingUser) {
			return res.status(422).send({error: 'That email address is already in use.'});
		}

		// If email is unique and password was provided, create account
		const user = new User({
			uuid: email,
			email,
			password,
			profile: {name}
		});

		user.save((err, user) => {
			if (err) {
				return next(err);
			}

			// Subscribe member to Mailchimp list
			// mailchimp.subscribeToNewsletter(user.email);

			// Respond with JWT if user was created

			const userInfo = setUserInfo(user);

			res.status(201).json({
				token: `JWT ${generateToken(userInfo)}`,
				expiresIn: config.security.expiresIn,
				user: userInfo
			});
		});
	});
});

//= =======================================
// Forgot Password Route
//= =======================================
router.post('/forgot-password', (req, res, next) => {
	const email = req.body.email;

	User.findOne({email}, (err, existingUser) => {
		// If user is not found, return error
		if (err || existingUser == null) {
			res.status(422).json({error: 'Your request could not be processed as entered. Please try again.'});
			return next(err);
		}

		// If user is found, generate and save resetToken

		// Generate a token with Crypto
		crypto.randomBytes(48, (err, buffer) => {
			const resetToken = buffer.toString('hex');
			if (err) {
				return next(err);
			}

			existingUser.resetPasswordToken = resetToken;
			existingUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour

			existingUser.save((err) => {
				// If error in saving token, return it
				if (err) {
					return next(err);
				}

				const message = {
					subject: 'Reset Password',
					text: `${'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
					'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
					'http://'}${req.headers.host}/reset-password/${resetToken}\n\n` +
					`If you did not request this, please ignore this email and your password will remain unchanged.\n`
				};

				// Otherwise, send user email via Mailgun
				// mailgun.sendEmail(existingUser.email, message);

				return res.status(200).json({message: 'Please check your email for the link to reset your password.'});
			});
		});
	});
});

//= =======================================
// Reset Password Route
//= =======================================
router.post('/reset-password/:token', (req, res, next) => {
	User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, (err, resetUser) => {
		// If query returned no results, token expired or was invalid. Return error.
		if (!resetUser) {
			res.status(422).json({error: 'Your token has expired. Please attempt to reset your password again.'});
		}

		// Otherwise, save new password and clear resetToken from database
		resetUser.password = req.body.password;
		resetUser.resetPasswordToken = undefined;
		resetUser.resetPasswordExpires = undefined;

		resetUser.save((err) => {
			if (err) {
				return next(err);
			}

			// If password change saved successfully, alert user via email
			const message = {
				subject: 'Password Changed',
				text: 'You are receiving this email because you changed your password. \n\n' +
				'If you did not request this change, please contact us immediately.'
			};

			// Otherwise, send user email confirmation of password change via Mailgun
			// mailgun.sendEmail(resetUser.email, message);

			return res.status(200).json({message: 'Password changed successfully. Please login with your new password.'});
		});
	});
});

module.exports = router;
