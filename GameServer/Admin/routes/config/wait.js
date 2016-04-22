/**
 * Created with JetBrains WebStorm.
 * User: Andy.Chen
 * Date: 14-5-23
 * Time: 下午3:30
 * To change this template use File | Settings | File Templates.
 */
var fs = require('fs');

var body = {
    title : '其他设置',
    result : null,
    message : null
};

var route = 'config/wait';
var path = './config/gameConfig/items/wait.json';
var dataProvider = require('../../data_provider/dao_provider/system/config');
var key = 'wait';

exports.index = function(req, res){
    var method = req.method;

    dataProvider.getConfig(key, function(error, data){
        if(error)
            return render(res, route, '配置文件读取失败.');

        if(!data) return;
        var result = JSON.parse(data.config);

        if(method === 'POST'){
            var ready = req.body.ready;
            var rush = req.body.rush;
            var multiple = req.body.multiple;
            var select = req.body.select;
            var push = req.body.push;

            var regex1 = /^[0-9]{1,}$/;
            if(!regex1.test(ready))
                return render(res, route, '准备时间必需为数字.');

            if(!regex1.test(rush))
                return render(res, route, '抢庄时间必需为数字.');

            if(!regex1.test(multiple))
                return render(res, route, '选倍时间必需为数字.');

            if(!regex1.test(select))
                return render(res, route, '选择牌时间必需为数字.');

            if(!regex1.test(push))
                return render(res, route, '推送时间必需为数字.');

            ready = parseInt(ready);
            rush = parseInt(rush);
            multiple = parseInt(multiple);
            select = parseInt(select);
            push = parseInt(push);

            result.ready = ready;
            result.rush = rush;
            result.multiple = multiple;
            result.select = select;
            result.push = push;

            data.config = JSON.stringify(result);

            dataProvider.editConfig(data, function(error){
                if(error)
                    return render(res, route, '配置文件写入失败.');

                body.message = '设置成功.';
                body.result = result;
                res.render(route, body);
            });
        }
        else{
            body.result = result;
            res.render(route, body);
        }
    });
};

function render(res, route, message){
    body.message = message;
    res.render(route, body);
};