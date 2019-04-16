const mongoose = require('mongoose');
const config = require('../config/database');

mongoose.Promise = global.Promise;

mongoose.set('useCreateIndex', true);

mongoose.connect(config.database, {useNewUrlParser: true});

exports.mongoose = mongoose;
