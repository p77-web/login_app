const mongoose = require('mongoose');

let BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3
    },
    author: {
      type: String,
      required: true,
      trim: true
    },
    year: {
      type: Number,
      default: null,
      required: true,
      minlength: 4,
      maxlength: 4
    },
    userId: {
      type: String,
      required: false,
      default: null
    }
  }
);

let Book = mongoose.model('Book', BookSchema);

exports.Book = Book;
