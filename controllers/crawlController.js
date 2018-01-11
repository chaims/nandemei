const express = require('express');
const { exec } = require('child_process');
const router = express.Router();

//执行爬取
router.get('/craw/start', (req,res,next) => {
  exec('node ./craw/hanmovie', function(err, stdout, stderr) {
    if (err){
        throw err;
    }
    console.log('11111111');
    console.log(stdout);
  });
  res.json({ result:'ok' });
});
module.exports = router;
