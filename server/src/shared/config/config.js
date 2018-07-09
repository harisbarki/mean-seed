const path = require('path');

let config = module.exports;
const PRODUCTION = process.env.NODE_ENV === 'production';

let rootDir = path.dirname(require.main.filename);
rootDir = path.join(rootDir, '../');
config.rootServerDirectory = rootDir;

config.productionEnvironment = false;

config.express = {
	port: process.env.PORT || '3000',
	host: 'localhost'
};

config.security = {
	privateKey: process.env.APP_SECURITY_PRIVATE_KEY || 'anythingCanBeUsedHere',
	tokenExpiry: (1 * 30 * 1000 * 60), // 1 hour
	saltRounds: 10,
	issuer: 'accounts.hb.ca',
	audience: 'hb.ca',
};

config.mongodb = {
	host: process.env.APP_MONGO || 'mongodb://localhost:27017/seed'
};

if (PRODUCTION) {
	config.productionEnvironment = true;
} else {
	console.log("DEV CONFIG");
	console.log(config);
}
