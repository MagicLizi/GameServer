/**
 * Created with JetBrains WebStorm.
 * User: Andy.Chen
 * Date: 14-5-23
 * Time: 下午3:30
 * To change this template use File | Settings | File Templates.
 */
var fs = require('fs');
var storeProvider = require('../../data_provider/dao_provider/store/item');
var dataProvider = require('../../data_provider/dao_provider/system/config');
var key = 'item_store';

var body = {
    title : '道具商城',
    result : null,
    message : null
};

var route = 'config/item_store';

exports.index = function(req, res){
    var method = req.method;

    if(method === 'POST'){
        storeProvider.getAll(function(error, results){
            if(error)
                return render(res, route, '读取数据失败.');

            var goods = [];
            results.forEach(function(result){
                goods.push({
                    "item_id":result.item_id,
                    "sort_num":result.sort_num,
                    "name":result.name,
                    "sex":result.sex,
                    "pic_id":result.pic_id,
                    "type":result.type,
                    "pos":result.pos,
                    "currency_type":result.currency_type,
                    "price":result.price,
                    "lvl_limit":result.lvl_limit,
                    "description":result.description,
                    "begin_date" : result.begin_date,
                    "end_date" : result.end_date,
                    "is_valid" : result.is_valid
                });
            });

            var storeConfig = {
                "items" : goods
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