

/* 
*@author caihao
*@desc crawl 'http://books.toscrape.com/' use puppeteer for exercise 
*@date 2017/12/29
*/
//const fs = require('fs');
let movieSchema = require('../../models/movie');
const puppeteer = require('puppeteer');
(async() => {
    try{
        const browser = await puppeteer.launch({headless:false});
        let page = await browser.newPage();
        try{
            await page.goto('http://www.hgdy123.com/genres/7/情色.html');  
            await page.setViewport({width: 1200, height: 600});
        }catch(e){
            //console.log(e);
            console.log('what?');
            await page.reload();
        }
    
        let booksInfo = [];
        let flag = true;
        let nextList = 'div.movieDetail > div > ul > li > a.next-button';
        do{ 
            //获取单页面下载地址
            const getPerPageDownloadUrl = async (pageObj,again) => {
                let pageDownInfo = '';
                let dlObj = {
                    'desc': pageObj['desc']
                };
                try{  
                    pageDownInfo = await browser.newPage();
                    await pageDownInfo.goto(pageObj['pageUrl']);
                    const btUrl = '#download > div > a';
                    await pageDownInfo.waitForSelector(btUrl);  
                    const info = await pageDownInfo.evaluate(() => {
                        let obj = {};
                        const dlDoms = Array.from(document.querySelectorAll('#download > div > a'));
                        dlDoms.forEach((dom) => {
                            if( dom.href.indexOf('magnet:')>-1 ){
                                obj.downloadUrl = dom.href;
                            }else{
                                obj.btUrl = dom.href;
                            }
                        });
                        return obj;
                    });
                    dlObj.urls = info;
                    await pageDownInfo.close();
                    return dlObj;
                }catch(e){
                    if(pageDownInfo){
                        await pageDownInfo.close();
                    }
                    if(again<5){
                        again++;
                        await getPerPageDownloadUrl(pageObj,again);
                    }else{
                        return dlObj;
                    }
                } 
            }
            //获取多个下载地址        
            const getDownloadUrl = async (downUrls) => {
                let urlObj = [];
                for(var i = 0; i<downUrls.length; i++){  
                    const dl = await getPerPageDownloadUrl(downUrls[i],0);
                    urlObj.push(dl); 
                }
                return urlObj;
            };  
             //获取影片信息
            const getBookInfos = async (url,timer) => {
                let pageInfo = '';
                try{
                    pageInfo = await browser.newPage();
                    await pageInfo.goto(url);
                    const bookInfo = 'div.moxText > table > tbody > tr > td.dl_name > div > a';
                    await pageInfo.waitForSelector(bookInfo);
                    const detail = await pageInfo.evaluate(() => {
                        let obj = {
                            'daoyan':document.querySelector('div.lInfodiv.col-md-6 > ul > li:nth-child(1)').innerText,
                            'zhuyan':document.querySelector('div.lInfodiv.col-md-6 > ul > li:nth-child(2)').innerText,
                            'type':document.querySelector('div.lInfodiv.col-md-6 > ul > li:nth-child(3)').innerText,
                            'time':document.querySelector('div.lInfodiv.col-md-6 > ul > li:nth-child(4)').innerText,
                            'playtime':document.querySelector('div.lInfodiv.col-md-6 > ul > li:nth-child(5)').innerText,
                            'localname':document.querySelector('div.lInfodiv.col-md-6 > ul > li:nth-child(6)').innerText,
                            'originName':document.querySelector('div.movieDtitle > h1').innerText,
                            'desc': document.querySelector('div.moxText > p.moxText').innerText
                        };
                        let downLoadPages = [];
                        const downloadDoms = Array.from(document.querySelectorAll('div.moxText table td.dl_name div.download_dz a'));
                        downloadDoms.forEach(dom =>{
                            downLoadPages.push({
                                'desc':dom.innerHTML,
                                'pageUrl':dom.href
                            });
                        });
                        obj.tmpUrls = downLoadPages;
                        return obj;
                    });
                    try{
                        detail.urls = await getDownloadUrl(detail.tmpUrls);
                    }catch(e){
                        console.log('error getDownloadUrl');
                    }
                    await pageInfo.close();
                    return detail;
                }catch(e){
                    if(pageInfo){
                        await pageInfo.close();
                    }
                    if(timer<5){
                       timer++;
                       await getBookInfos(url, timer);
                    }else{
                        await pageInfo.close();
                        return null;
                    }
                }
            };  
            //获取一页的影片信息
            const getListBookInfos = async (bookUrls) => {
                let infos = {};
                for (var i = 0; i < bookUrls.length; i++) {
                    try{
                        infos = await getBookInfos(bookUrls[i],0);
                    }catch(e){
                        console.log(e);
                        console.log('error getListBookInfos getInfos');
                    }
                    if(infos){
                        movieSchema.find({originName:infos.originName}).exec(function(err,result){
                            if(err){
                                console.log(err);
                            }                   
                            // TODO result [Array]        
                            const movie = new movieSchema(infos);
                            movie.save(function(err){
                                console.log(err);
                            });
                        });
                    }
                }
            };
           
            //获取影片列表
            const getPerPageBookList = async() => {
                try{
                    const bookListSelector = 'div.movieDetail h3.movieTitle a';
                    await page.waitForSelector(bookListSelector);
                    const perPageList = await page.evaluate(bookListSelector => {
                        const bookDoms = Array.from(document.querySelectorAll(bookListSelector));
                        return bookDoms.map(dom =>{
                            return dom.href;
                        });
                    },  bookListSelector);
                    return perPageList;
                }catch(e){
                    await page.reload();
                    await getPerPageBookList();
                }
            };
            //去下一页
            const getNextPageBookList = async(tryNum) => {
                try{
                    await page.waitForSelector(nextList);
                    await page.click(nextList);
                }catch(e){
                    console.log('get next ');
                    if(tryNum > 10){
                        flag = false;
                    }else{
                        tryNum++;
                        await getNextPageBookList(tryNum);
                    }
                }
            };

            const perList = await getPerPageBookList();
            try{
                await getListBookInfos(perList);
            }catch(e){
                console.log('coming 1');
            }
            try{
                await getNextPageBookList(0);  
            }catch(e){
                console.log('coming 2');
            }
        }while(flag)
        // fs.writeFile('craw/movie.json',JSON.stringify(booksInfo),function(error){
        //     console.log(error?error:'done');
        //     //await browser.close();
        // });
        // for (const obj in booksInfo){
        //     let movie = new movieSchema(booksInfo[obj]);
        //     movie.save(function(err){
        //         console.log(err);
        //     });
        // }
        await browser.close();
    }catch(e){
        console.log('return 了');
        console.log(e);
    }
})();