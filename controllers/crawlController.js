const fs = require("fs");
const path = require("path");
const { exec } = require('child_process');
//const Movie = require('../models/movie');
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
    const str = 'node controllers/crawl/'+req.params.path;
    exec(str, function(err, stdout, stderr) {
        if (err){
            throw err;
        }
        console.log('11111111');
        console.log(stdout);
    });
    res.json({result:'ok',msg:'start'});
};
exports.movie_crawl_stop = (req, res, next) => {
    res.send('crawl start');
};
exports.movie_crawl_remove = (req, res, next) => {
    res.send('crawl remove');
};
