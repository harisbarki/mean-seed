let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let uniqueValidator = require('mongoose-unique-validator');

/**
 * @module  User
 * @description contain the details of Attribute
 */

let User = new Schema({

	/**
	 email. It can only contain valid email id, should be unique, is required and indexed.
	 */
	email: {
		type: String,
		unique: true,
		required: true
	},

	/**
	 password. It can only contain string, is required field.
	 */
	password: {
		type: String,
		required: true
	},

	/**
	 propertyId. It can only contain string.
	 */
	isVerified: {
		type: Boolean,
		default: false
	}
});

User.plugin(uniqueValidator);

User.statics = {
	saveUser: function (requestData) {
		return this.create(requestData);
	},
	findUserUpdate: function (query, user) {
		return this.findOneAndUpdate(query, user);
	},
	updateUser: function (user) {
		return user.save();
	},

	findUser: function (query) {
		return this.findOne(query);
	},

	findUserByIdAndEmail: function (id, email) {
		return this.findOne({email: email, _id: id});
	}
};

let user = mongoose.model('user', User);

/** export schema */
module.exports = {
	User: user
};
