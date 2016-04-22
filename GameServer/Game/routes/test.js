/**
 * Created by peihengyang on 14-10-15.
 */


var http = require('http');
epay("aaaa",function(error,result){
console.log('httpresult:',result);
});
function epay(params,callback)
{

    console.log(" COME IN");
    var params = require('querystring').stringify({"result":"0","userName":"890086000001000318","productName":"钻石x60","payType":"4","amount":"1.00","orderId":"A20151210113626399476362","notifyTime":"1449718612363","requestId":"2015-12-10-11-36-17-513","extReserved":"100003466,10","sign":"dPz3haw0YmODr4vetS5dCeG+C9ex04EVb/lSabQPBCGEOcrnj+jzdObRvKJQKt2JSOnbuxP4KkqqbdXih5SB7BzY2h1D9JH8IZoV8zBl5E/bakbNljUlqgZ7+eYMijt64KEJHx/Z+e3HJEIPD3KdeUlyHn4foBoGQhfrv8ScxnXYSw1jJ0dslrQ/rklU8bR7ZTLGTYFOWhGXoOX4AM72vXiNL2iIvURanL9TJ+AO/+L8BueVrBh30RTC69VxBS+oOBhXe0j1NCeMUP+spIkdnonKSVXsmtRPVvTIlxBjxvILwJrsNaIJC94SzEKVRWJwL0S3AW25IjbO+fh5TKX2iA=="});

    var options = {
        host: 'game.ichangyou.cn',
        port: 8010,
        path: '/order/orderNotice1207',
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': params.length,
            'cre':'qOUvcjdUmjf9HcH3a94j/HFFOZHfsNMfvbCTARG41EU=',
            'userid':100002542

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
        res.on('data', function (chunk)
        {
            _data+=chunk;
            console.log('BODY: ' + chunk);
        });

// 结束回调
        res.on('end', function(){
            console.log("REBOAK:",_data)
            callback(null,_data);
        });

//错误回调 // 这个必须有。 不然会有不少 麻烦
        req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
        });



    });
    req.write(params + "\n");
    req.end();

}
//exports.epay=epay;
