let fs = require('fs');
let path = require('path');
const express = require('express');

let config = require('../shared/config/config');
// Routes
let uploadRoutes = require('./upload/upload.routes');
let userRoutes = require('./user/user.routes');
let authRoutes = require('./user/authentication.routes');
let seedRoutes = require('./seed/seed.routes');
let contactUsRoutes = require('./contact-us/contact-us.routes');

let CLIENT_DIST_PATH = 'client_dist/index.html';

module.exports = function(app) {
	let apiRoutes = express.Router();

	// Allow CORS - deny in prod
	if(!config.productionEnvironment) {
		let cors = require('cors');
		// for testing
		app.use(cors({credentials: true, origin: 'http://localhost:4200'}));

		app.use(function(req, res, next) {
			res.header("Access-Control-Allow-Origin", "http://localhost:4200");
			res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
			res.header('Access-Control-Allow-Credentials', 'true');
			next();
		});
	}

	app.use('/api', apiRoutes);	// everything encapsulates within api/
	apiRoutes.use('/auth', authRoutes);
	// apiRoutes.use('/upload', uploadRoutes);
	apiRoutes.use('/user', userRoutes);
	apiRoutes.use('/seed', seedRoutes);
	apiRoutes.use('/contact-us', contactUsRoutes);

	app.get('*', function (req, res) {
		console.log(path.join(config.rootServerDirectory + CLIENT_DIST_PATH));
		if (fs.existsSync(path.join(config.rootServerDirectory + CLIENT_DIST_PATH))) {
			res.sendFile(path.join(config.rootServerDirectory + CLIENT_DIST_PATH));
		} else {
			console.log('You are running hmr please go to 127.0.0.1:4200');
			res.send("<p>You are running hmr please go to <a href='http://127.0.0.1:4200'>127.0.0.1:4200</a>" +
				"<br>If you are not running HMR then your frontend has not compiled properly!</br>");
		}
	});
};
