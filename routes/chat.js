const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next){
    res.redirect('/html/chat.html');
});

module.exports = router;


