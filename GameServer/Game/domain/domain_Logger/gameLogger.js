/**
 * Created by peihengyang on 15/7/16.
 */

var http = require('http');
var request = require('querystring');
//epay("aaaa");
function epay(inputParams)
{

    console.log(" COME IN");
    //console.log(JSON.stringify(inputParams));
    var DTparams = request.stringify({
        //DTreq:JSON.stringify(inputParams.DTreq == null ? {}:inputParams.DTreq),
        //DTres:JSON.stringify(inputParams.DTres == null ? {}:inputParams.DTres)
    });
//console.log('params:',JSON.stringify(inputParams.DTreq == null ? {}:inputParams.DTreq));
    var options = {
        host: '192.168.2.199',
        port: 8003,
        path: '/DTLogger/RequestStart',
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': DTparams.length
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

    req.write(DTparams + "\n");
    req.end();

}
exports.Logger=epay;
