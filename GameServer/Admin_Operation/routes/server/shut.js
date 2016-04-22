/**
 * Created with JetBrains WebStorm.
 * User: andy.chen
 * Date: 14-5-20
 * Time: 下午7:02
 * To change this template use File | Settings | File Templates.
 */
var http = require("http");

var body = {
    title : '配置表更新',
    message : null
};


exports.restartServer = function(req,res){
    body.message = "success";
    var route = "shut/restartServer";
    var method = req.method;
//    var cmdPath = process.argv[1];
//    var cmdParams = [];
//    if(process.argv[2] == 'DEV'){
//        cmdParams.push('DEV');
//    }
//    else
//    {
//        cmdParams.push('QA');
//        cmdParams.push('Internal');
//    }
//
//    var cmdPathArr = cmdPath.split('/');
//    var runPath = '';
//    cmdPathArr.forEach(function(item){
//        console.log(item);
//        if(item!='Admin' && item !='app.js'){
//            runPath =  runPath + item + '/';
//        }
//    })
//    runPath = runPath + 'app.js';
//    console.log(runPath);
    var spawn = require('child_process').spawn;
//    //console.log(spawn('forever',['list']));
//    var exec =require('child_process').exec;
//    var runResult = exec('dir',{encoding:"utf8"});
//    console.log(runResult);
    spawn('forever', ['restartall'])
//    spawn('forever', ['start',runPath, 'Game', cmdParam1]);
//    spawn('forever', ['start',runPath, 'Login', cmdParam1]);
//    spawn('forever', ['start','/home/share/DtServer/GameServer/app.js', 'Game', 'Internal']);
//    spawn('forever', ['start','/home/share/DtServer/GameServer/app.js', 'Game', 'DEV']);
//    spawn('forever', ['start','/home/share/DtServer/QA/GameServer/app.js', 'Login', 'QA']);
//    spawn('forever', ['start','/home/share/DtServer/GameServer/app.js', 'Login', 'Internal']);
//    spawn('forever', ['start','/home/share/DtServer/GameServer/app.js', 'Login', 'DEV']);
    body.result = "success";
    console.log("yeah");
    res.render(route, body);

}
exports.index = function(req, res){
    body.message = null;
    var method = req.method;
    if(method === 'POST')
    {
        var params = require('querystring').stringify({
            userName:"test1",
            pass:"ddesdffsfs",
            sorceType:0,
            device_identifier:"10000"
        });
        updateConfig(params,res,req.body);
    }
    else
    {
        console.log("hello ====");
        res.render('shut/index', body);
    }
};

function updateConfig(params,response,webReq)
{
    console.log(" COME IN");
    var options = {
        host: webReq.server,
        port: webReq.port,
        path: '/gameConfig/updateConfig',
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': params.length,
            'cre':'qOUvcjdUmjf9HcH3a94j/HFFOZHfsNMfvbCTARG41EU=',
            'userId':'100000106',
            'server_id':'1'
        }
    };

//使用http 发送
    var req = http.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        //console.log(res);
//设置字符编码
        res.setEncoding('utf8');

//返回数据流
        var _data="";

//数据
        res.on('data', function (chunk) {
            _data+=chunk;
            _data = JSON.parse(_data);
            if(_data.result == true)
            {
                body.message = "更新成功.";
                response.render('shut/index', body);
            }
            else
            {
                body.message ="更新失败";
                response.render('shut/index', body);
            }
            console.log('BODY: ' + chunk);
        });

// 结束回调
        res.on('end', function(){

            console.log("REBOAK:",_data)
        });

//错误回调 // 这个必须有。 不然会有不少 麻烦
        req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
        });
    });
    req.write(params + "\n");
    req.end();
}
