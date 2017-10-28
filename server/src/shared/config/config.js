let config = module.exports;
let PRODUCTION = process.env.NODE_ENV === 'production';

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
