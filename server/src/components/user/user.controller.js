'use strict';
const UserService = require('./user.service');
const Config = require('../../shared/config/config');
const Jwt = require('jsonwebtoken');
const User = require('./user.model').User;
const privateKey = Config.key.privateKey;

exports.create = (req, res) => {
	req.body.password = UserService.encrypt(req.body.password);

	// regex for email test
	if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.email)) {

		User.saveUser(req.body).then((user) => {
			let tokenData = {
				email: user.email,
				id: user._id
			};

			UserService.sentMailVerificationLink(user, Jwt.sign(tokenData, privateKey)).then(() => {
				let successResponse = {
					statusCode: 200,
					message: 'Please confirm your email id by clicking on link in email'
				};
				res.json(successResponse);
			}).catch((err) => {
				console.error(err);
				let errorResponse = {
					statusCode: 500,
					message: `Error while sending verification email`
				};
				res.status(errorResponse.statusCode).json(errorResponse);
			});
		}).catch((err) => {
			console.error(err);
			let errorResponse = {
				statusCode: 500,
				message: `Oh uh, something went wrong`
			};
			if (err.name === 'ValidationError') {
				errorResponse.statusCode = 409;
				errorResponse.message = `Please provide another email`;
			}
			res.status(errorResponse.statusCode).json(errorResponse)
		});
	} else {
		let errorResponse = {
			statusCode: 412,
			message: `Email not valid`
		};
		res.status(errorResponse.statusCode).json(errorResponse);
	}

};

exports.login = (req, res) => {
	User.findUser({ email: req.body.email }).then((user) => {
		if (user === null) {
			res.status(422).send(`Email not recognised`);
		} else {
			if (req.body.password === UserService.decrypt(user.password)) {
				if (!user.isVerified) {
					let errorResponse = {
						statusCode: 401,
						message: `Your email address is not verified. Please verify your email address to proceed`
					};
					res.status(errorResponse.statusCode).send(errorResponse);
				}
				else {
					let tokenData = {
						email: user.email,
						id: user._id
					};
					let result = {
						statusCode: 200,
						data: {
							email: user.email,
							token: Jwt.sign(tokenData, privateKey)
						}
					};
					res.json(result);
				}
			} else {
				let errorResponse = { statusCode: 500, message: `Oh uh, something went wrong` };
				res.status(errorResponse.statusCode).json(errorResponse);
			}
		}
	}).catch((err) => {
		console.error(err);
		let errorResponse = { statusCode: 500, message: `Oh uh, something went wrong` };
		res.status(errorResponse.statusCode).json(errorResponse);
	});
};

exports.forgotPassword = (req, res) => {
	User.findUser({ email: req.body.email }).then((user) => {
		if (user === null) {
			let errorResponse = { statusCode: 422, message: `Please provide another user email` };
			res.status(errorResponse.statusCode).json(errorResponse);
		}
		else {
			let tokenData = {
				email: user.email,
				id: user._id
			};

			UserService.sentMailForgotPassword(user, Jwt.sign(tokenData, privateKey)).then(() => {
				let successResponse = { statusCode: 200, message: 'Reset password link sent to your mail.' };
				res.json(successResponse);
			}).catch((err) => {
				console.error(err);
				let errorResponse = { statusCode: 500, message: `Error sending forget password email` };
				res.status(errorResponse.statusCode).json(errorResponse);
			});
		}
	}).catch((err) => {
		console.error(err);
		let errorResponse = { statusCode: 500, message: `Oh uh, something went wrong` };
		res.status(errorResponse.statusCode).json(errorResponse);
	});
};

exports.newPassword = (req, res) => {
	Jwt.verify(req.body.token, privateKey, (err, decoded) => {
		if (err) {
			console.error(err);
			let errorResponse = { statusCode: 500, message: `Oh uh, something went wrong` };
			res.status(errorResponse.statusCode).json(errorResponse);
		}
		else {
			User.findUserByIdAndEmail(decoded.id, decoded.email).then((user) => {
				if (user === null) {
					res.status(422).send(`Email not recognised`);
				}
				else if (req.body.newPassword !== req.body.confirmNew) {
					res.status(400).send(`Password Mismatch`);
				}
				else {
					user.password = UserService.encrypt(req.body.newPassword);
					User.updateUser(user).then(() => {
						res.json({ message: `password changed successfully` });
					}).catch((err) => {
						console.error(err);
						let errorResponse = { statusCode: 500, message: `Oh uh, something went wrong` };
						res.status(errorResponse.statusCode).json(errorResponse);
					});
				}
			}).catch((err) => {
				console.error(err);
				let errorResponse = { statusCode: 500, message: `Oh uh, something went wrong` };
				res.status(errorResponse.statusCode).json(errorResponse);
			});
		}
	})
};

exports.verifyEmail = (req, res) => {
	if (req.body.token) {
		let token = req.body.token;

		Jwt.verify(token, privateKey, (err, decoded) => {
			if (err) {
				console.error(err);
				let errorResponse = { statusCode: 500, message: `Oh uh, something went wrong` };
				res.status(errorResponse.statusCode).json(errorResponse);
			}
			else {
				User.findUserByIdAndEmail(decoded.id, decoded.email).then((user) => {
					if (user === null) {
						let errorResponse = { statusCode: 422, message: `Email not recognised` };
						res.status(errorResponse.statusCode).send(errorResponse);
					}
					else if (user.isVerified === true) {
						let successResponse = { statusCode: 200, message: `Account is already verified` };
						res.json(successResponse);
					}
					else {
						user.isVerified = true;
						User.updateUser(user).then(() => {
							let successResponse = { statusCode: 200, message: `Account successfully verified` };
							res.json(successResponse);
						}).catch((err) => {
							console.error(err);
							let errorResponse = { statusCode: 500, message: `Oh uh, something went wrong` };
							res.status(errorResponse.statusCode).json(errorResponse);
						});
					}
				}).catch((err) => {
					console.error(err);
					let errorResponse = { statusCode: 500, message: `Oh uh, something went wrong` };
					res.status(errorResponse.statusCode).json(errorResponse);
				});
			}
		})
	} else {
		let errorResponse = { statusCode: 500, message: `Oh uh, something went wrong` };
		res.status(errorResponse.statusCode).json(errorResponse);
	}
};
