let {thunderEncode} = require('./lib/thunderencode');
let CommonService = require('./commonService');

class DyttService extends CommonService {
    constructor({baseUrl, entryPage, listPage, pageInfo}) {
        this.entryPage = entryPage;
        this.listPage = listPage;
        this.pageInfo = pageInfo;
        this.baseUrl = baseUrl;
    }
    async getCrawlEntry() {
        await super.getCrawlEntry();   
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
    async getPerPageList(url) {

    }
    async getNextPageUrl() {

    }
    async getDetailByUrl(url, videoSchema) {
        
    }    
}

module.exports = DyttService;