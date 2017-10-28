const Mongoose = require('mongoose');
const config = require('./config/config');

Mongoose.Promise = global.Promise;
Mongoose.connect(config.mongodb.host, {useMongoClient: true});
const db = Mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
	console.log("Connection with database succeeded.");
});

exports.db = db;
