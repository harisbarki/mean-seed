'use strict';
const SeedModel = require('./seed.model');

exports.get = (id) => {
	return id ? SeedModel.findById(id) : SeedModel.find();
};

exports.create = (fileRecord) => {
	return SeedModel.create(fileRecord);
};

exports.update = (fileRecord) => {
	fileRecord.modifiedAt = new Date();
	return SeedModel.update(fileRecord);
};

exports.remove = (_id) => {
	return SeedModel.remove(_id);
};
