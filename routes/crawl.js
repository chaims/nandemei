const express = require('express');
const { exec } = require('child_process');
const router = express.Router();
const movieContrl = require('../controllers/movieController');

// 爬取列表
router.get('/index', (req, res, next) => {
    res.redirect('/crawl/index.html');
 });
router.get('/list', movieContrl.movie_crawl_list);
// 爬取
// router.get('/start', (req,res,next) => {
//     exec('node ./controllers/craw/genmovie', function(err, stdout, stderr) {
//         if (err) {
//             next(new Error(err));
//         }
//         console.log(stdout);
//     });
//     res.json({ result:'ok' });
// });
module.exports = router;
