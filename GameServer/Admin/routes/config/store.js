/**
 * Created with JetBrains WebStorm.
 * User: Andy.Chen
 * Date: 14-5-23
 * Time: 下午3:30
 * To change this template use File | Settings | File Templates.
 */
var fs = require('fs');
var storeProvider = require('../../data_provider/dao_provider/store/apple');
var dataProvider = require('../../data_provider/dao_provider/system/config');
var key = 'store';

var body = {
    title : '商城',
    result : null,
    message : null
};

var route = 'config/store';
var path = './config/gameConfig/items/store.json';

exports.index = function(req, res){
    var method = req.method;

    if(method === 'POST'){
        storeProvider.getAll(function(error, results){
            if(error)
                return render(res, route, '读取数据失败.');

            var apples = [], alipay = [], goods = [];
            results.forEach(function(result){
                goods.push({
                    "id":result.recharge_id,
                    "price":result.price,
                    "type":result.status,
                    "des":result.description,
                    "pic_id":result.pic_id,
                    "name":result.name,
                    "comm":result.chips,
                    "dia":result.diamond,
                    "sort":result.sort,
                    "begin_date" : result.begin_date,
                    "end_date" : result.end_date,
                    "is_valid" : result.is_valid
                });

                if(result.type == 1)
                    apples.push(result.recharge_id);
                else if(result.type == 2)
                    alipay.push(result.recharge_id);
            });

            var storeConfig = {
                "CommodityConfig" : {
                    "AppStore" : apples,
                    "Ali" : alipay
                },
                "Commoditys" : goods
            };

            var data = {
                key_id : key,
                config : JSON.stringify(storeConfig)
            };
            dataProvider.editConfig(data, function(error){
                if(error)
                    return render(res, route, '配置文件写入失败.');

                body.message = '生效成功.';
                res.render(route, body);
            });
        });
    }
    else
        res.render(route, body);
};

function render(res, route, message){
    body.message = message;
    res.render(route, body);
}