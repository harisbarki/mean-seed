// Importing Passport, strategies, and config
const passport = require('passport'),
	User = require('../components/user/user.model'),
	config = require('./config/config'),
	JwtStrategy = require('passport-jwt').Strategy,
	ExtractJwt = require('passport-jwt').ExtractJwt,
	LocalStrategy = require('passport-local');

// Setting username field to email rather than username
const localOptions = {
	usernameField: 'email'
};

// Setting up local login strategy
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
	User.findOne({ email }, (err, user) => {
		if (err) { return done(err); }
		if (!user) { return done(null, false, { error: 'Your login details could not be verified. Please try again.' }); }

		user.comparePassword(password, (err, isMatch) => {
			if (err) { return done(err); }
			if (!isMatch) { return done(null, false, { error: 'Your login details could not be verified. Please try again.' }); }

			return done(null, user);
		});
	});
});

// Setting JWT strategy options
const jwtOptions = {
	// Telling Passport to check authorization headers for JWT
	jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
	secretOrKey: config.security.privateKey,
	issuer: config.security.issuer,
	audience: config.security.audience
};

// Setting up JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
	User.findById(payload._id, (err, user) => {
		if (err) { return done(err, false); }

		if (user) {
			done(null, user);
		} else {
			done(null, false);
		}
	});
});

passport.use(jwtLogin);
passport.use(localLogin);
