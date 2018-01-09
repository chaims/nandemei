const express = require('express');
const { exec } = require('child_process');
const router = express.Router();
// 爬取
router.get('/start', (req,res,next) => {
    exec('node ./controllers/craw/hanmovie', function(err, stdout, stderr) {
        if (err) {
            next(new Error(err));
        }
        console.log(stdout);
    });
    res.json({ result:'ok' });
});
module.exports = router;
