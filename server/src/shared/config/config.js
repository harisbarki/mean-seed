const path = require('path');

let config = module.exports;
const PRODUCTION = process.env.NODE_ENV === 'production';

let rootDir = path.dirname(require.main.filename);
rootDir = path.join(rootDir, '../');
config.rootServerDirectory = rootDir;

config.express = {
	port: process.env.PORT || '3000',
	host: 'localhost'
};

config.key = {
	privateKey: 'anythingCanBeUsedHere',
	tokenExpiry: 1 * 30 * 1000 * 60 // 1 hour
};

config.mongodb = {
	host: 'mongodb://localhost:27017/seed'
};

if (PRODUCTION) {

}
