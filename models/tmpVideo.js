const mongoose = require('mongoose');
const db = require('./index');
const videoSchema = new mongoose.Schema({
    "type": {type : String},        //电影、电视、综艺、动漫
    "title": {type : String},       //标题
    "link": {type: String}          //详情页
});
module.exports = db.model('todo_video', videoSchema );