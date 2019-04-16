// library imports
const express = require('express');
const path = require('path');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
var session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');

// Passport config
require('./config/passport')(passport);

// local imports
const config = require('./config/database');

const {Book} = require('./models/book');

let app = express();

// DB config
const db = require('./config/database').MongoURI;

// Connect to mongodb
mongoose
	.connect(db, { useNewUrlParser: true })
	.then(() => console.log('MongoDB connected...'))
	.catch(err => console.log('Error', err));

// load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

let port = process.env.PORT || 3070;

// bodyparser, now included in express
app.use(express.urlencoded({ extended: false })); // for form post request,

// use public folder
app.use(express.static(path.join(__dirname, 'public')));

// express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// express messages middleware
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// express validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.'),
    root = namespace.shift(),
    formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }

    return {
      param: formParam,
      msg: msg,
      value: value
    }
  }
}));

// after other middlewares
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// create a global variable for errors and flash
app.get('*', (req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.errors = req.errors || null;
  next();
});

const books = require('./routes/books');
const users = require('./routes/users');
app.use('/', books);
app.use('/', users);

app.get('/', async (req, res) => {
  const books = await Book.find({});
  try {
    res.render('index', {
      title: 'Books',
      books
    });
  } catch (e) {
    res.status(400).send(err);
  }
});

app.listen(port, () => {
  console.log(`Login app is running on port ${port}`);
});

exports.app = app;
