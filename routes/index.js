const express = require('express');
const { exec } = require('child_process');
const router = express.Router();
/* GET home page. */
router.get('/', (req, res, next) => {
   res.redirect('/html/index.html');
});
module.exports = router;
