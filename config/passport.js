const LocalStrategy = require('passport-local').Strategy;
const {User} = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports = function (passport) {
  // Local Strategy
  passport.use(
		new LocalStrategy(
			{ usernameField: 'email' },
			async (email, password, done) => {
				// Match user
				try {
					// Validation passed
					const user = await User.findOne({ email });
					if (!user) {
						return done(null, false, {
							message: 'This email is not registred!'
						});
					} else {
						// Match password
						bcrypt.compare(
							password,
							user.password,
							(err, isMatch) => {
								if (err) throw err;

								if (isMatch) {
									return done(null, user);
								} else {
									return done(null, false, {
										message: 'Email or password are incorrect!'
									});
								}
							}
						);
					}
				} catch (error) {
					res.status(404).send();
				}
			}
		)
	);

    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });
};
