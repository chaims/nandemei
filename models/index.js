var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/nandemei');
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
module.exports = db;