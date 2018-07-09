'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

/* Sub-schema for file */
let seedSubSchema = new Schema({
	_id: false,
	statusCode: Number,
	statusMessage: String    // error msg or OK msg
});

/**
 * @module File
 */
let seedSchema = new Schema({

	information: seedSubSchema,

	// Uses _id of user table
	submittedBy: {
		type: Schema.ObjectId,
		ref: 'user'
	},
	modifiedAt: {
		type: Date,
		default: Date.now
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

let seedModel = mongoose.model('file', seedSchema);

exports.model = seedModel;

/**
 * Creates the fileM in the database
 * @api
 * @param {Object<File>}file
 * @returns {Query<File, Error>}
 */
exports.create = (file) => {
	return seedModel.create(file);
};

/**
 * Updates the file in the database
 * @api
 * @param {Object<File>} file
 * @returns {Query<File, Error>}
 */
exports.update = (file) => {
	return seedModel.findOneAndUpdate({
		_id: file._id
	}, file, {new: true});
};

/**
 * Finds the file given the _id
 * @api
 * @param {string} _id
 * @returns {Query<File, Error>}
 */
exports.findById = (_id) => {
	return seedModel.findOne({
		_id: _id
	});
};

/**
 * Finds the file given the name
 * @api
 * @param {string} fileName
 * @returns {Query<File, Error>}
 */
exports.findByName = (fileName) => {
	return seedModel.findOne({
		fileName: fileName
	});
};

/**
 * Finds all the files
 * @api
 * @returns {Query<File[], Error>}
 */
exports.find = () => {
	return seedModel.find().limit(5);
};

/**
 * Delete the file
 * @api
 * @param {string} _id
 * @returns {Query<boolean, Error>}
 */
exports.remove = (_id) => {
	return seedModel.remove({
		_id: _id
	});
};

