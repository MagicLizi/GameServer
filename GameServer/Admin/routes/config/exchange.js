/**
 * Created with JetBrains WebStorm.
 * User: Andy.Chen
 * Date: 14-5-23
 * Time: 下午3:30
 * To change this template use File | Settings | File Templates.
 */
var fs = require('fs');

var body = {
    title : '兑换设置',
    results : [],
    message : null
};

var route = 'config/exchange';
var path = './config/gameConfig/items/exchange.json';
var dataProvider = require('../../data_provider/dao_provider/system/config');
var key = 'exchange';

exports.index = function(req, res){
    var method = req.method;

    dataProvider.getConfig(key, function(error, data){
        if(error)
            return render(res, route, '配置文件读取失败.');

        var results = JSON.parse(data.config);

        if(method === 'POST'){
            var diamond = req.body.diamond;
            var chips = req.body.chips;
            var box1 = req.body.box1;
            var box2 = req.body.box2;


            var regex1 = /^[0-9]{1,}$/;
            if(!regex1.test(diamond))
                return render(res, route, '通宝卡必需为数字.');

            if(!regex1.test(chips))
                return render(res, route, '金贝必需为数字.');

            diamond = parseInt(diamond);
            chips = parseInt(chips);


            if(diamond<=0 || diamond>2000000000)
                return render(res, route, '通宝卡范围应该为1-2000000000.');

            if(chips<=0 || chips>2000000000)
                return render(res, route, '金贝范围应该为1-2000000000.');


            results[0].count = chips;
            results[0].is_open = (box1=='1'?true:false);

            results[1].count = diamond;
            results[1].is_open = (box2=='1'?true:false);

            data.config = JSON.stringify(results);

            dataProvider.editConfig(data, function(error){
                if(error)
                    return render(res, route, '配置文件写入失败.');

                body.message = '设置成功.';
                body.results = results;
                res.render(route, body);
            });
        }
        else{
            body.results = results;
            res.render(route, body);
        }
    });
};

function render(res, route, message){
    body.message = message;
    res.render(route, body);
};