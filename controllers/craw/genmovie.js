/*
*crawl https://genvideos.org/
*/
let movieSchema = require('../../models/movie');
//const puppeteer = require('puppeteer');
// (async() => {
//     try{
        movieSchema.find({"originName":"test"}).exec(function(err,result){
            if(err){
                console.log(err);
            }                   
            // TODO result [Array]        
            const movie = new movieSchema({
                "daoyan": '1',
                "zhuyan": '1',
                "type": '1',
                "time": '1',
                "playtime": '1',
                "localname": '1',
                "originName": '1',
                "desc": '1',
                "tmpUrls": [1],
                "urls": [1]
            });
            movie.save(function(err){
                console.log(err);
            });
        });
       
    
//})();