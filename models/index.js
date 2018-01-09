var mongoose = require('mongoose');
mongoose.connect('mongodb://chadmin:ch123456@127.0.0.1:27017/nandemei?authSource=admin');
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
module.exports = db;