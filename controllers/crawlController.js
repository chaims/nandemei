const fs = require("fs");
const path = require("path");
const cp = require('child_process');
//const Movie = require('../models/movie');
/*
*crawl
*/
exports.movie_crawl_list = (req, res, next) => {
    const root = path.join(__dirname, 'crawl');
    let filesList = []; 
    const readDirSync = (filepath) => {
        const files = fs.readdirSync(filepath);      
        files.forEach(function(file,index){  
            var info = fs.statSync(root + "/" + file);      
            if(info.isDirectory()){
                if(file !== 'lib'){
                    readDirSync(root + "/" + file);  
                }  
            }else{  
                filesList.push({
                    name:file.replace(/\.js/i,'')
                });
            }     
        });     
    }
    readDirSync(root); 
    res.json(filesList);
};
exports.movie_crawl_start = (req, res, next) => {
    const str = 'controllers/crawl/'+req.params.path;
    let nodeShell = cp.spawn('node', [str], {});
    nodeShell.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });
    nodeShell.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });
    nodeShell.on('exit', function (code) {
        console.log('child crawl process exited with code ' + code);
    });
    res.json({result:'ok',msg:'start'});
};
exports.movie_crawl_stop = (req, res, next) => {
    res.send('crawl start');
};
exports.movie_crawl_remove = (req, res, next) => {
    res.send('crawl remove');
};
