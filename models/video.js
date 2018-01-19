const mongoose = require('mongoose');
const db = require('./index');
var videoSchema = new mongoose.Schema({
    "type": {type : String},        //电影、电视、综艺、动漫
    "title": {type : String},       //标题
    "localname": {type : String},   //译名
    "originName": {type : String},  //片名
    "year": {type : Number},        //年代
    "area": {type : String},        //产地
    "category": {type : String},    //分类类别：动作。。。
    "tag": {type : String},         //标签：最新、经典。。。
    "lang": {type : String},        //语言
    "subtitle": {type : String},    //字幕
    "playtime": {type : String},    //上映日期
    "publishTime": {type : String}, // 平台发布时间
    "createTime": {type : Date, default: Date.now},  // 获取时间
    "dbscore": {type : String},     //豆瓣评分
    "imdbscore": {type : String},   //IMDB评分
    "filetype": {type : String},    //文件格式
    "videosize": {type : String},   //视频尺寸
    "filesize": {type : String},    //文件大小
    "episodes": {type : String},    //集数
    "videotime": {type : String},   //片长
    "director": {type : String},    //导演
    "star": {type : String},        //主演
    "desc": {type : String},        //简介
    "previewImg": {type : String},  //预览图
    "tmpUrls": {type : Array},      //预下载地址
    "downloadUrls": {type : Array}, //下载地址
    "watchUrls": {type : Array}  //观看地址
});
module.exports = db.model('video', videoSchema );