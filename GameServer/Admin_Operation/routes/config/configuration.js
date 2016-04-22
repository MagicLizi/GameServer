/**
 * Created with JetBrains WebStorm.
 * User: Andy.Chen
 * Date: 14-5-23
 * Time: 下午3:30
 * To change this template use File | Settings | File Templates.
 */
var fs = require('fs');

var body = {
    title : '生效配置表',
    message : ''
};

var route = 'config/configuration';
var path = './config/gameConfig/game.json';
var dataProvider = require('../../data_provider/dao_provider/system/config');

exports.index = function(req, res){

    body.message = null;
    var method = req.method;
    if(method==='POST'){
        console.log("POSTconfig");
        dataProvider.getAll(function(error, results){
            if(error)
                return render(res, route, '配置文件写入失败.');

            var result = {};
            result.keys = [];

            results.forEach(function(item){
                switch(item.key_id){
                    case 'regions':
                        result.keys.push({id:"regions",config_num:item.config_num});
                        result.regions = {};
                        result.regions.info = JSON.parse(item.config);
                        break;
                    case 'item_store':
                        result.keys.push({id:"item_store",config_num:item.config_num});
                        var item_store = JSON.parse(item.config);
                        result.item_store = {};
                        result.item_store.items = item_store.items;
                        break;
                    case 'store':
                        result.keys.push({id:"store",config_num:item.config_num});
                        var store = JSON.parse(item.config);
                        result.store = {};
                        result.store.Commoditys = store.Commoditys;
                        result.store.CommodityConfig = store.CommodityConfig;
                        break;
                    case 'packages':
                        result.keys.push({id:"packages",config_num:item.config_num});
                        result.packages = {};
                        result.packages.info = JSON.parse(item.config);
                        break;
                    case 'item':
                        result.keys.push({id:"item",config_num:item.config_num});
                        result.items = {};
                        result.items.info = JSON.parse(item.config);
                        break;
                    case 'formulas':
                        result.keys.push({id:"formulas",config_num:item.config_num});
                        result.formulas = {};
                        result.formulas.info = JSON.parse(item.config);
                        break;
                    default :
                        break;
                }
            });

            var data = {
                key_id : 'config',
                config : JSON.stringify(result)
            };
            dataProvider.editConfig(data, function(error, result){
                if(error)

                    return render(res, route, '配置文件写入失败.');

                body.message = '生效配置表成功.';
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
};
