const fs = require("fs");
const path = require("path");
const Movie = require('../models/movie');

/*
*crawl
*/
exports.movie_crawl_list = (req, res, next) => {
    const root = path.join(__dirname, 'crawl');
    const files = fs.readdirSync(root); 
    let filesList = []; 
    files.forEach(function(file,index){  
        var info = fs.statSync(root + "/" + file);      
        if(info.isDirectory()){  
            readDirSync(root + "/" + file);  
        }else{  
            filesList.push({
                name:file.replace(/\.js/i,'')
            });
        }     
    });  
    res.json(filesList);
};
exports.movie_crawl_start = (req, res, next) => {
    res.send('crawl start');
};
exports.movie_crawl_stop = (req, res, next) => {
    res.send('crawl start');
};
exports.movie_crawl_remove = (req, res, next) => {
    res.send('crawl remove');
};
/* 
*movie 
*/
exports.movie_list = (req, res, next) => {
    res.send('movie list pageinfo');
};
exports.movie_search = (req, res, next) => {
    res.send('movie search list pageinfo');
};
exports.movie_info_get = (req, res, next) => {
    res.send('get movie info');
};
exports.movie_info_create = (req, res, next) => {
    res.send('create movie info');
};
exports.movie_info_update = (req, res, next) => {
    res.send('update movie info');
};
exports.movie_info_delete = (req, res, next) => {
    res.send('delete movie info');
};
