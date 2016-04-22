/**
 * Created with JetBrains WebStorm.
 * User: Andy.Chen
 * Date: 14-5-23
 * Time: 下午3:30
 * To change this template use File | Settings | File Templates.
 */
var fs = require('fs');

var body = {
    title : '救济金',
    result : null,
    message : null
};

var route = 'config/alms';
var path = './config/gameConfig/items/alms.json';
var dataProvider = require('../../data_provider/dao_provider/system/config');
var key = 'alms';

exports.index = function(req, res){
    body.message = null;

    var method = req.method;

    dataProvider.getConfig(key, function(error, data){
        if(error)
            return render(res, route, '配置文件读取失败.');

        var result = JSON.parse(data.config);

        if(method === 'POST'){
            var limit = req.body.limit;
            var times = req.body.times;
            var chips = req.body.chips;

            var regex1 = /^[0-9]{1,}$/;
            if(!regex1.test(limit))
                return render(res, route, '金贝下限必需为数字.');

            if(!regex1.test(times))
                return render(res, route, '领取次数必需为数字.');

            if(!regex1.test(chips))
                return render(res, route, '金贝必需为数字.');

            limit = parseInt(limit);
            times = parseInt(times);
            chips = parseInt(chips);

            result.limit = limit;
            result.times = times;
            result.chips = chips;

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