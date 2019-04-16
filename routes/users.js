const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// local imports
const {Book} = require('../models/book');
const {User} = require('../models/user');

router.get('/register', async (req, res) => {
  res.render('register', {
    title: 'Register'
  });
});

let findUsers = (username) => {
  var users = User.find({username: username}).exec();
  return users;
};

// Register handle ( for the form in register.ejs page )
router.post('/register', async (req, res) => {
  // destructuring req.body object
	const { name, email, username, password, password2 } = req.body;

	let errors = [];

  // Check required fields
	if (!name) {
		errors.push({ msg: 'Please fill in your name!' });
	}

  if (!email) {
		errors.push({ msg: 'Please fill in your email!' });
	}

  if (!username) {
		errors.push({ msg: 'Please fill in your username!' });
	}

  if (!password) {
		errors.push({ msg: 'Please fill in your password!' });
	}

  if (!password2) {
		errors.push({ msg: 'Please confirm your password!' });
	}

  if (errors.length > 0) {
    const user = { name,	email, username, password, password2 };
    // console.log(user);
    res.render('register', {
      title: 'Register new user',
      user,
      errors,
			name,
			email,
      username,
			password,
			password2
    });
    // console.log(errors);
  } else {
    try {
			// Validation passed
			const user = await User.findOne({ email: email });
      if (user) {
				// User exists
				errors.push({ msg: 'Email is already registred!' });

        user.registred = false;

				res.render('register', {
					title: 'Register new user',
          user,
          errors,
          name,
          username
				});
			} else {
        const newUser = new User({
					name,
					email,
          username,
					password
				});
				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if (err) throw err;

						newUser.password = hash;

						newUser
							.save()
							.then(user => {
								req.flash(
									'info',
									'You are now registred and can log in.'
								);
								res.redirect('/login');
							})
							.catch(err => console.log(err));
					});
				});
			}
		} catch (error) {
			res.status(404).send();
		}
  }
});

router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login'
  });
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/layout',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});


router.get('/layout', async (req, res) => {
  const findBooks = await Book.find({});
  const users = await User.find({});
  let books = [];

  findBooks.forEach((book) => {
    if(book.userId == req.user._id){
      books.push(book);
    }
  });
  try {
    res.render('layout', {
        title: 'Books',
        books
      });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/logout', (req, res) => {
    req.logout();
  	req.flash('info', 'You are logged out!');
  	res.redirect('/login');
});

module.exports = router;
