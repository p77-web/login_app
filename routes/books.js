const express = require('express');
const router = express.Router();

// local imports
const {Book} = require('../models/book');
const {User} = require('../models/user');
const { ensureAuthenticated } = require('../config/auth');

router.get('/layout', ensureAuthenticated, async (req, res) => {
  const myBooks = await Book.find({});

  let books = [];
  try {
    myBooks.forEach((book) => {
      if(book.userId == req.user._id){
        books.push(book);
      }
    });

    res.render('layout', {
      title: 'Books',
      books,
      user: req.user
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/books/add', ensureAuthenticated, async (req, res) => {
  res.render('addBook', {
    title: 'Books'
  });
});

router.get('/book/:id', async (req, res) => {
  const bookId = req.params.id;
  const book = await Book.findById(bookId);

  try {
    if (!book) {
      return res.status(404).send();
    }
    res.render('book', {
      title: book.title,
      book
    });
  } catch (e) {
    res.status(400).send();
  }
});

router.post('/books/add', async (req, res) => {
  const { title, author, year } = req.body;

	let errors = [];

  // Check required fields
	if (!title) {
		errors.push({ msg: 'Please fill in the book\'s title!' });
	}

  if (!author) {
		errors.push({ msg: 'Please fill in the book\'s autor!' });
	}

  if (!year) {
		errors.push({ msg: 'Please fill in the book\'s year!' });
	}

  if (errors.length > 0) {
    const book = { title, author, year };
    req.user.registred = true;
    res.render('addBook', {
      title: 'Books',
      user: req.user,
      bookTitle: title,
      author,
      bookYear: year,
      errors
    });
  } else {
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      year: req.body.year,
      userId: req.user._id
    });
    await book.save();
    const myBooks = await Book.find({});

    let books = [];

    myBooks.forEach((book) => {
      if(book.userId == req.user._id){
        books.push(book);
      }
    });

    try {
      req.flash('info', 'Book added!');
      res.render('layout', {
        title: 'Books',
        books,
        user: req.user
      });
    } catch (err) {
      req.flash('error', 'Book not added!');
      res.status(400).send(err);
    }
  }
});

router.get('/book/edit/:id', ensureAuthenticated, async (req, res) => {
  const bookId = req.params.id;
  const book = await Book.findById(bookId);

  try {
    if (!book) {
      return res.status(404).send();
    }
    res.render('editBook', {
      title: book.title,
      book
    });
  } catch (e) {
    res.status(400).send();
  }
});

router.post('/book/edit/:id', async (req, res) => {
  const book = {
    title: req.body.title,
    author: req.body.author,
    year: req.body.year
  };

  const id = req.params.id;

  try {
    if (!book) {
      return res.status(404).send();
    }
    await Book.findOneAndUpdate({
      _id: id
    }, {$set: book}, {new: true});
    req.flash('info', 'Book updated!')
    res.redirect('/book/' + id);
  } catch (e) {
    req.flash('error', 'Book not updated!')
    res.status(400).send();
  }
});

router.get('/book/delete/:id', ensureAuthenticated, async (req, res) => {
  const id = req.params.id;

  try {
    const book = await Book.findOneAndDelete({
      _id: id
    });
    if (!book) {
      return res.status(404).send();
    }
    res.redirect('/layout');
  } catch (e) {
    res.status(400).send();
  }
});

module.exports = router;
