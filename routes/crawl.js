const express = require('express');
const { exec } = require('child_process');
const router = express.Router();
const movieContrl = require('../controllers/movieController');

// 爬取列表
router.get('/index', (req, res, next) => {
    res.redirect('/crawl/index.html');
 });
router.get('/list', movieContrl.movie_crawl_list);
router.get('/start', movieContrl.movie_crawl_start);

module.exports = router;
