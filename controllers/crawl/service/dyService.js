import CommonService from './commonService';
class DyttService extends CommonService {
    constructor(url) {
        super();
        this.entryUrl = url;
    }
    async getCrawlEntry() {
        await super.getCrawlEntry();   
    }
    async getPerPageList(url) {

    }
    async getNextPageUrl() {

    }
    async getDetailByUrl(url) {

    }    
}

module.exports = DyttService;