

/* 
*@author caihao
*@desc crawl http://www.dy2018.com/ use puppeteer for exercise 
*@date 2018/1/17
*/
let {thunderEncode} = require('./lib/thunderencode');
let videoSchema = require('../../models/video');
const puppeteer = require('puppeteer');
const baseUrl = 'http://www.dy2018.com';
(async() => {
    try{
        browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
        //browser = await puppeteer.launch({headless:false});
        let page = await browser.newPage();
        //过滤request
        const requestInterception = async(pageName) => {
            await pageName.setRequestInterception(true);
            pageName.on('request', request => {
                if (request.resourceType === 'image' || request.resourceType === 'script')
                    request.abort();
                else
                    request.continue();
            });
        } 
        //通过首页获取待爬取入口
        const getIndexCrawlList = async(timer) => {
            try{
                await page.goto(baseUrl);  
                await page.setViewport({width: 1200, height: 600});
                const menuLinks = '#menu > div > ul > li > a';
                await page.waitForSelector(menuLinks);
                const menuLinksArr = await page.evaluate(menuLinks => {
                    const menuDoms = Array.from(document.querySelectorAll(menuLinks));
                    return menuDoms.slice(0,menuDoms.length-6).map(dom =>{
                        return {
                            'href':dom.href,
                            'desc':dom.textContent
                        }
                    });
                },  menuLinks);
                return menuLinksArr;
            }catch(e){
                if(timer<5){
                    timer++;
                    return await getIndexCrawlList(timer);
                }else{
                    console.log('error on getIndexCrawlList');
                    console.log(e);
                    return [];
                }
            }
        }
        //获取影片信息
        const getVideoInfos = async (url,timer) => {
            try{
                await videoInfo.goto(url);
                const downloadUrls = '#Zoom table tr td a'; 
                await videoInfo.waitForSelector(downloadUrls);
                videoInfo.waitFor(500);
                const detail = await videoInfo.evaluate(() => {
                    //数据对应解析
                    const schemaMapping = (dataArry) => {
                        let objMap = {
                            "localname": "译名",  
                            "originName": "片名",
                            "year": "年代",
                            "area": "产地",       
                            "category": "类别",   
                            "lang": "语言",       
                            "subtitle": "字幕",
                            "playtime": "上映日期",
                            "dbscore": "豆瓣评分",     
                            "imdbscore": "IMDb评分",   
                            "filetype": "文件格式",    
                            "videosize": "视频尺寸",   
                            "filesize": "文件大小",    
                            "episodes": "集数",    
                            "videotime": "片长",   
                            "director": "导演",    
                            "star": "主演",        
                            "desc": "简介"
                            //"previewImg": "",  //预览图
                            //"tmpUrls": {type : Array},      //预下载地址
                            //"downloadUrls": {type : Array}, //下载地址
                            //"watchUrls": {type : Array}  //观看地址
                        };
                        let objMapVal = {};
                        if(dataArry){
                            let preKey = '';
                            dataArry.forEach((mapVal) =>{
                                const tmpVal = mapVal.replace(/\s/g,'');
                                if(tmpVal){
                                    if(tmpVal.indexOf('◎')>-1){
                                        preKey = '';
                                        for(let k in objMap){
                                            const cname = objMap[k];
                                            if(tmpVal.indexOf(cname)>-1){
                                                preKey = k;
                                                const rval = tmpVal.replace(new RegExp('◎'+cname,'g'),'');
                                                if(rval){
                                                    objMapVal[k] = rval;
                                                } 
                                                break;
                                            }
                                        }
                                    } else {
                                        if(preKey){
                                            objMapVal[preKey] = (objMapVal[preKey]?(objMapVal[preKey]+'\r\n'):'') + tmpVal;
                                        }
                                    }
                                }
                            });
                        }
                        return objMapVal;
                    };
                    const infoArry = Array.from(document.querySelectorAll('#Zoom p')).map((dom) => { return dom.textContent });
                    const obj = schemaMapping(infoArry);
                    const timeDom = document.querySelector('div.co_area2 > div.co_content8 > ul > div.position > span.updatetime');
                    if(timeDom){
                        obj.publishTime = timeDom.textContent;
                    }
                    //下载
                    let downloadUrls = [];
                    const downloadDoms = Array.from(document.querySelectorAll('#Zoom table tr td a'));
                    downloadDoms.forEach(dom =>{
                        if(dom.hasAttribute('thundertype')){
                            downloadUrls.push({
                                "desc":dom.textContent,
                                "url":dom.textContent
                            });
                        } else {
                            downloadUrls.push({
                                "desc":dom.textContent,
                                "url":dom.textContent
                            });
                        }
                    });
                    obj.downloadUrls = downloadUrls;
                    return obj;
                });
                //下载链接加密转换
                if(detail.downloadUrls){
                    detail.downloadUrls.forEach(urlObj => {
                        if(urlObj.url.indexOf('ftp://')>-1){
                            urlObj.url = thunderEncode(urlObj.url);
                        }
                    })
                }
                detail.type = typeDesc; //电影、电视、综艺、动漫
                return detail;
            }catch(e){
                if(timer<5){
                    timer++;
                    return await getVideoInfos(url, timer);
                }else{
                    console.log(e);
                    return {};
                }
            }
        };  
        //获取每一页列表的影片信息
        const getListVideoInfos = async (linkArr) => {
            let infos = {};
            for (var i = 0; i < linkArr.length; i++) {
                try{
                    infos = await getVideoInfos(linkArr[i]['link'],0);
                }catch(e){
                    console.log('error getListVideoInfos get '+linkArr[i]['title']+' video info');
                    console.log(e);
                }
                infos.tag = linkArr[i]['tag'];
                infos.title = linkArr[i]['title'];
                console.log(infos.title);
                if(infos){
                    videoSchema.find({originName:infos.originName,director:infos.director}).exec(function(err,result){
                        if(err){
                            console.log(err);
                        }
                        if(result && result.length>0){
                            // TODO result [Array] update       
                        }else{
                            const video = new videoSchema(infos);
                            video.save(function(err){
                                if(err){
                                    console.log(err);
                                }
                            });
                        }
                    });
                }
            }
        };
        //获取影片列表
        const getPerPageVideoList = async(timer) => {
            try{
                const videoTr = 'div.co_content8 > ul > table > tbody > tr:nth-child(2) > td:nth-child(2) > b';
                await videoListPage.waitForSelector(videoTr);
                const perPageList = await videoListPage.evaluate(videoTr => { 
                    const videoDoms = Array.from(document.querySelectorAll(videoTr));
                    return videoDoms.map(dom =>{
                        const adom1 = dom.querySelector('a:nth-child(1)');
                        const adom2 = dom.querySelector('a:nth-child(2)');
                        const tag = adom2?adom1.textContent:'';
                        const title = tag?adom2.textContent:adom1.textContent;
                        const link = tag?adom2.href:adom1.href;
                        return {
                            'tag': tag,
                            'title': title,
                            'link': link
                        };
                    });
                },  videoTr);
                return perPageList;
            }catch(e){
                if(timer < 5){
                    timer++;
                    await videoListPage.reload();
                    return await getPerPageVideoList(timer);
                }else{
                    console.log('error on getPerPageVideoList');
                    console.log(e);
                    return [];
                }
            }
        };
        //遍历每个顶级入口下的列表页面
        const preGetVideoList = async(url,timer) => {
            try{
                await videoListPage.goto(url);
                const perList = await getPerPageVideoList(0);
                console.log('========'+ '(' +perList.length + '条)' +'========');
                await getListVideoInfos(perList);
            }catch(e){
                if(timer < 5){
                    timer++;
                    await preGetVideoList(url, timer);
                }else{
                    console.log('error on preGetVideoList');
                    console.log(e);
                }
            }
        } 
        //取每个顶级入口下的，所有分页列表Url
        const getPerPageUrl = async(url,timer) => {
            try{
                await videoListPage.goto(url);
                const pageList = 'div.bd3r > div.co_area2 > div.co_content8 > div select > option';
                await videoListPage.waitForSelector(pageList);
                const totalPages = await videoListPage.evaluate(pageList => { 
                    const pages = Array.from(document.querySelectorAll(pageList));
                    return pages.map(dom =>{
                        return dom.value;
                    });
                },  pageList);
                return totalPages;
            }catch(e){
                if(timer < 5){
                    timer++;
                    return await getPerPageUrl(url,timer);
                }else{
                    console.log('error on getPerPageUrl');
                    console.log(e);
                    return [];
                }
            }
            
        }

        let typeDesc = '';
        requestInterception(page);
        let menuLinksArr = await getIndexCrawlList(0);
        
        let videoListPage = await browser.newPage();
        requestInterception(videoListPage);
        let videoInfo = await browser.newPage();
        requestInterception(videoInfo);
        
        for(let i = 0;i<menuLinksArr.length;i++){
            //入口类型
            const typeInfo = menuLinksArr[i]['desc'];
            if(['华语连续剧','美剧','日韩剧'].indexOf(typeInfo) > -1){
                typeDesc = "电视剧";f
            } else if (typeInfo.indexOf('综艺') > -1) {
                typeDesc = "综艺";
            } else if (typeInfo.indexOf('动漫') > -1) {
                typeDesc = "动漫";
            } else {
                typeDesc = "电影";
            }
            const totalPageArr = await getPerPageUrl(menuLinksArr[i]['href'],0);
            if(totalPageArr){
                for(let j = 0;j<totalPageArr.length;j++){
                    console.log('=================='+ typeInfo + ':' + (baseUrl + totalPageArr[j]) + '==================');
                    await preGetVideoList(baseUrl+totalPageArr[j],0);
                }
            }
        }
        await browser.close();
    }catch(e){
        console.log('报错退出了!');
        console.log(e);
    }finally{
        if(browser){
            console.log('结束了！')
            await browser.close();
        }
    }
})();