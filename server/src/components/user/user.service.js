const User = require('./user.model');
const ROLES = require('../../shared/constants');

//= =======================================
// Authorization Middleware
//= =======================================

// Role authorization check
let roleAuthorization = function (requiredRole) {
	return function (req, res, next) {
		const user = req.user;

		User.findById(user._id, (err, foundUser) => {
			if (err) {
				res.status(422).json({ error: 'No user was found.' });
				return next(err);
			}

			// If user is found, check role.
			if (getRole(foundUser.role) >= getRole(requiredRole)) {
				return next();
			}

			return res.status(401).json({ error: 'You are not authorized to view this content.' });
		});
	};
};

// Set user info from request
let setUserInfo = function setUserInfo(request) {
	const getUserInfo = {
		_id: request._id,
		profile: request.profile,
		email: request.email,
		role: request.role
	};

	return getUserInfo;
};

let getRole = function getRole(checkRole) {
	let role;

	switch (checkRole) {
		case ROLES.ROLE_ADMIN: role = 3; break;
		case ROLES.ROLE_SUBSCRIBER: role = 2; break;
		case ROLES.ROLE_MEMBER: role = 1; break;
		default: role = 1;
	}

	return role;
};


module.exports = {
	roleAuthorization,
	getRole,
	setUserInfo
};
