const express = require('express');
const router = express.Router();

const SeedCtrl = require('./seed.controller');

// Get by ID
router.get('/', (req, res) => {
	const id = req.query['_id'] ? req.query['_id'] : '';
	let promise = SeedCtrl.get(id).then((data) => {
		res.status(200).json(data);
	});
});

// Create
router.post('/', (req, res) => {
	let promise = SeedCtrl.create(req.body).then((data) => {
		res.status(200).json(data);
	});
});

// Update
router.patch('/', (req, res) => {
	let promise = SeedCtrl.update(req.body).then((data) => {
		res.status(200).json(data);
	});
});

// Delete by ID
router.delete('/', (req, res) => {
	let promise = SeedCtrl.remove(req.body['_id']).then((data) => {
		res.status(200).json(data);
	});
});

module.exports = router;
