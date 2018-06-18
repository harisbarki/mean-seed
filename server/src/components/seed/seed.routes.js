const express = require('express');
const router = express.Router();

const SeedCtrl = require('./seed.controller');

const MODEL_NAME = `seed`;
const FILE_NAME = `seed.routes.js`;


// Get by ID
router.get('/', (req, res) => {
	const id = req.query['_id'] ? req.query['_id'] : '';
	let promise = SeedCtrl.get(id);
	// genericFunctions.handlePromise(promise, res, 'get', MODEL_NAME, FILE_NAME);
});

// Create
router.post('/', (req, res) => {
	let promise = SeedCtrl.create(req.body);
	// genericFunctions.handlePromise(promise, res, 'post', MODEL_NAME, FILE_NAME);
});

// Update
router.patch('/', (req, res) => {
	let promise = SeedCtrl.update(req.body);
	// genericFunctions.handlePromise(promise, res, 'patch', MODEL_NAME, FILE_NAME);
});

// Delete by ID
router.delete('/', (req, res) => {
	let promise = SeedCtrl.remove(req.body['_id']);
	// genericFunctions.handlePromise(promise, res, 'delete', MODEL_NAME, FILE_NAME);
});

module.exports = router;
