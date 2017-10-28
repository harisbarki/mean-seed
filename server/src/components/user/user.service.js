'use strict';
const Config = require('../../shared/config/config');
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const privateKey = Config.key.privateKey;

exports.decrypt = (password) => {
	return decrypt(password);
};

exports.encrypt = (password) => {
	return encrypt(password);
};

exports.sentMailVerificationLink = (user, token) => {
	let textLink = "http://" + Config.express.host + ":" + Config.express.port + "/" + Config.email.verifyEmailUrl + "/" + token;
	let sender = `Barki Team<${Config.email.user}>`;
	let mailBody = `<p>Thanks for Registering</p><p>Please verify your email by clicking on the verification link below.<br/><a href=${textLink.toString()}>Verification Link</a></p>`;
	// return sendMail(sender, user.email, `Account Verification`, mailBody);
};

exports.sentMailForgotPassword = (user, token) => {
	let textLink = "http://" + Config.express.host + ":" + Config.express.port + "/" + Config.email.resetEmailUrl + "/" + token;
	let sender = `Barki Team<${Config.email.user}>`;
	let mailBody = `<p>Please reset your password by clicking on the link below.<br/><a href=${textLink.toString()}>Reset Password Link</a></p>`;
	// return sendMail(sender, user.email, `Account New password`, mailBody);
};

function decrypt(password) {
	let decipher = crypto.createDecipher(algorithm, privateKey);
	let dec = decipher.update(password, 'hex', 'utf8');
	dec += decipher.final('utf8');
	return dec;
}

function encrypt(password) {
	let cipher = crypto.createCipher(algorithm, privateKey);
	let crypted = cipher.update(password.toString(), 'utf8', 'hex');
	crypted += cipher.final('hex');
	return crypted;
}

