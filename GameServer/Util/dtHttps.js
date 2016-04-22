/**
 * Created by peihengyang on 15/10/12.
 */


var https = require('https');
var crypto = require("crypto");
var md5 = crypto.createHash('md5');//.update('ichangyou2014').digest();
var httpsPost = module.exports;
httpsPost.get = function(uri,param,inputhost,inputpath,cookie,callback)
{

    console.log(" COME IN");
    console.log('inputpath:',inputpath+'?' + param);
    //var params = require('querystring').stringify(params);
    var params = JSON.stringify(param);
    var options = {
        host: inputhost,
        path: inputpath+'?' + param,
        method: 'GET',
        port: 443,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie':cookie
        }
        //files:'~/Document/130501.jpg'
    };

//使用http 发送
    var req = https.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        //console.log(res);
//设置字符编码
        res.setEncoding('utf8');

//返回数据流
        var _data="";

//数据
        res.on('data', function (chunk)
        {
            _data+=chunk;
            console.log('BODY: ' + chunk);
        });

// 结束回调
        res.on('end', function(){
            console.log("REBOAK:",_data);
            callback(null,_data);
        });

//错误回调 // 这个必须有。 不然会有不少 麻烦
        req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
        });



    });
console.log('reqget:',req);
    req.write(params + "\n");
    req.end();

}


httpsPost.post = function(uri,param,inputhost,inputpath,cookie,callback)
{

    console.log(" COME IN");
    console.log(param);
    //var params = require('querystring').stringify(param);
    var params = JSON.stringify(param);
    console.log('params',params);
    //var params = param;
    var options = {
        host: inputhost,
        path: inputpath + uri,
        method: 'post',
        port: 443,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': params.length
        }
    };

//使用http 发送
    var req = https.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        //console.log(res);
//设置字符编码
        res.setEncoding('utf8');

//返回数据流
        var _data="";

//数据
        res.on('data', function (chunk)
        {
            _data+=chunk;
            console.log('BODY: ' + chunk);
        });

// 结束回调
        res.on('end', function(){
            console.log("REBOAK:",_data);
            callback(null,_data);
        });

//错误回调 // 这个必须有。 不然会有不少 麻烦
        req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
        });
    });

    //console.log('reqpost:',req);
    req.write(params);
    console.log('req.write',req);
    req.end();

}
