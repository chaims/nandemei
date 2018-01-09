const mongoose = require('mongoose');
const db = require('./index');
var movieSchema = new mongoose.Schema({
    "daoyan": {type : String},
    "zhuyan": {type : String},
    "type": {type : String},
    "time": {type : String},
    "playtime": {type : String},
    "localname": {type : String},
    "originName": {type : String},
    "desc": {type : String},
    "tmpUrls": {type : Array},
    "urls": {type : Array},
    "createTime": {type : Date, default: Date.now}
});
module.exports = db.model('movie', movieSchema );