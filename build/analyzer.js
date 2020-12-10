"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var cheerio_1 = __importDefault(require("cheerio"));
var Anaylyzer = /** @class */ (function () {
    function Anaylyzer() {
    }
    Anaylyzer.getInstance = function () {
        if (!Anaylyzer.instance) {
            Anaylyzer.instance = new Anaylyzer();
        }
        return Anaylyzer.instance;
    };
    Anaylyzer.prototype.getHotSearchInfo = function (html) {
        var $ = cheerio_1.default.load(html);
        var newsArr = [];
        var list = $('.pub-list li');
        list.map(function (_, el) {
            var news = {
                title: '',
                desc: '',
                rank: -1,
                search: -1
            };
            news.title = $(el).find('.p1').text() ? $(el).find('.p1').text() : $(el).find('.p3').text();
            news.desc = $(el).find('.p2').text()
                ? $(el).find('.p2').text().split('...')[0] + '...'
                : '无描述';
            news.rank = parseInt($(el).find('.s1 i').text());
            news.search = parseInt($(el).find('.s3').text());
            newsArr.push(news);
        });
        var jsonRet = {
            time: Date.now(),
            data: newsArr
        };
        return jsonRet;
    };
    Anaylyzer.prototype.generateJsonRet = function (jsonRet, filePath) {
        var fileContent = {};
        if (fs_1.default.existsSync(filePath)) {
            fileContent = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
        }
        fileContent[jsonRet.time] = jsonRet.data;
        return fileContent;
    };
    Anaylyzer.prototype.analyze = function (html, filePath) {
        var jsonRet = this.getHotSearchInfo(html);
        var fileContent = this.generateJsonRet(jsonRet, filePath);
        return JSON.stringify(fileContent);
    };
    return Anaylyzer;
}());
exports.default = Anaylyzer;
