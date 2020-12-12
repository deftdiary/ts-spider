"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var spider_1 = __importDefault(require("./spider"));
var analyzer_1 = __importDefault(require("./analyzer"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var router = express_1.Router();
var loginHtml = ("<!DOCTYPE html>\n<html>\n  <body style=\"display:flex;justify-content:center;align-items:center;flex-direction:column;min-height:100vh;\">\n    <h2 style=\"text-align:center;margin-bottom:20px\">\u6B22\u8FCE\u6765\u5230\u5C0F\u7AD9</h2>\n    <form method=\"post\" action=\"/login\">\n      <label for=\"pwInput\" >\u8BF7\u8F93\u5165\u5BC6\u7801:</label>\n      <input type=\"password\" name=\"password\" id=\"pwInput\" />\n      <button>\u767B\u9646</button>\n    </form>\n  </body>\n</html>");
var logoutHtml = ("<!DOCTYPE html>\n<html>\n  <body style=\"display:flex;justify-content:center;align-items:center;flex-direction:column;min-height:100vh;\">\n    <a href=\"/getData\">\u542F\u52A8\u5C0F\u8718\u86DB</a>\n    <a href=\"/showData\">\u663E\u793A\u83B7\u53D6\u6570\u636E</a>\n    <a href='/logout'> \u9000\u51FA</a>\n  </body>\n</html>");
router.get('/', function (req, res) {
    res.redirect(302, '/login');
});
router.get('/login', function (req, res) {
    var isLogin = req.session ? req.session.login : undefined;
    if (isLogin) {
        res.send(logoutHtml);
    }
    else {
        res.send(loginHtml);
    }
});
router.get('/logout', function (req, res) {
    if (req.session) {
        req.session.login = undefined;
    }
    res.redirect('/login');
});
router.post('/login', function (req, res) {
    var password = req.body.password;
    var isLogin = req.session ? req.session.login : undefined;
    if (isLogin) {
        res.redirect('/login');
    }
    else {
        if (password === '123' && req.session) {
            req.session.login = true;
            res.send('登陆成功');
        }
        else {
            res.send('登陆失败');
        }
    }
});
router.get('/getData', function (req, res) {
    var isLogin = req.session ? req.session.login : false;
    if (isLogin) {
        var url = "http://top.sogou.com/hot/shishi_1.html".trim();
        var anaylyzer = analyzer_1.default.getInstance();
        new spider_1.default(url, anaylyzer);
        res.send('🕷️ 小蜘蛛获取数据成功');
    }
    else {
        res.send('请登陆后再使用小蜘蛛🕷️ ');
    }
});
router.get('/showData', function (req, res) {
    var isLogin = req.session ? req.session.login : false;
    if (isLogin) {
        try {
            var position = path_1.default.resolve(__dirname, '../data/result.json');
            var result = fs_1.default.readFileSync(position, 'utf-8');
            res.json(JSON.parse(result));
        }
        catch (e) {
            res.send('尚未爬取到数据');
        }
    }
    else {
        res.send('用户尚未登陆');
    }
});
exports.default = router;
