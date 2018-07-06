/* 
*@author caihao
*@desc crawl http://www.dy2018.com/ video detail use puppeteer for exercise 
*@date 2018/1/26
*/

let videoSchema = require('../../models/video');
let todoVideo = require('../../models/tmpVideo');
let puppeteer = require('puppeteer');
let DyttService = require('./service/DyttService');
(async() => {
    let browser;
    try{
        browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
        //browser = await puppeteer.launch({headless:false});
        let page = await browser.newPage();
        
        //TODO

        let DyttServiceInit = new DyttService({pageInfo:page});
        await DyttServiceInit.getDetailByUrl(url, videoSchema);

    }catch(e){
        console.log('报错退出了!');
        console.log(e);
    }
    await browser.close();
})();