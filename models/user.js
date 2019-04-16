const mongoose = require('mongoose');

let UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3
    },
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 3
    },
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6
    },
    registred: {
      type: Boolean,
      default: true
    }
  }
);

let User = mongoose.model('User', UserSchema);

exports.User = User;
