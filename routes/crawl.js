const express = require('express');
const router = express.Router();
//const movieContrl = require('../controllers/movieController');
const crawlContrl = require('../controllers/crawlController');
// 爬取列表
router.get('/index', (req, res, next) => {
    res.redirect('/crawl/index.html');
 });
 
router.get('/list', crawlContrl.movie_crawl_list);
router.get('/start/:path', crawlContrl.movie_crawl_start);

module.exports = router;
