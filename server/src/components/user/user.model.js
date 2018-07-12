// Importing Node packages required for schema
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const config = require('../../shared/config/config');
const ROLES = require('../../shared/constants');

//= ===============================
// User Schema
//= ===============================
const UserSchema = new Schema({
		uuid: {
			type: String,
			unique: true,
			required: true
		},
		email: {
			type: String,
			lowercase: true,
			unique: true
		},
		password: {
			type: String
		},
		profile: {
			name: { type: String },
		},
		role: {
			type: String,
			enum: [ROLES.ROLE_MEMBER, ROLES.ROLE_SUBSCRIBER, ROLES.ROLE_ADMIN],
			default: ROLES.ROLE_MEMBER
		},
		resetPasswordToken: { type: String },
		resetPasswordExpires: { type: Date }
	},
	{
		timestamps: true
	});

//= ===============================
// User ORM Methods
//= ===============================

// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre('save', function (next) {
	const user = this;

	user.updatedAt = new Date();

	if (!user.isModified('password')) return next();

	bcrypt.hash(user.password, config.security.saltRounds, function(err, hash) {
		// Store hash in your password DB.
		if (err) return next(err);
		console.log('hashed', hash);
		user.password = hash;
		next();
	});
});

// Method to compare password for login
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
		if (err) { return cb(err); }

		cb(null, isMatch);
	});
};

module.exports = mongoose.model('User', UserSchema);
