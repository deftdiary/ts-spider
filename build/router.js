"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var spider_1 = __importDefault(require("./spider"));
var analyzer_1 = __importDefault(require("./analyzer"));
var router = express_1.Router();
var loginHtml = ("<!DOCTYPE html>\n<html>\n  <body style=\"display:flex;justify-content:center;align-items:center;min-height:100vh;\">\n    <form method=\"post\" action=\"/getData\">\n      <input type=\"password\" name=\"password\" />\n      <button>login</button>\n    </form>\n  </body>\n</html>");
router.get('/', function (req, res) {
    res.redirect(302, '/login');
});
router.get('/login', function (req, res) {
    res.send(loginHtml);
});
router.post('/getData', function (req, res) {
    var password = req.body.password;
    if (password === '123') {
        var url = "http://top.sogou.com/hot/shishi_1.html".trim();
        var anaylyzer = analyzer_1.default.getInstance();
        new spider_1.default(url, anaylyzer);
        res.send('Get Data success');
    }
    else {
        res.send(req.teacherName + "Password Error");
    }
});
exports.default = router;
