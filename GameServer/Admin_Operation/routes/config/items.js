/**
 * Created with JetBrains WebStorm.
 * User: apple
 * Date: 14-7-31
 * Time: 上午11:20
 * To change this template use File | Settings | File Templates.
 */
var fs = require('fs');

var body = {
    title : '道具',
    results : [],
    message : null
};

var route = 'config/items';
var path = './config/gameConfig/items/items.json';
var dataProvider = require('../../data_provider/dao_provider/system/config');
var key = 'item';

function render(res, route, message){
    body.message = message;
    res.render(route, body);
};


exports.index = function(req, res){
    var method = req.method;
    body.message = null;

    dataProvider.getConfig(key, function(error, data){
        if(error)
            return render(res, route, '配置文件读取失败.');
        console.log(data);
        var results = null;
        if (data == null) {
            data = {key_id: key, config:[]};
            results = data.config;
        }
        else {
            results = JSON.parse(data.config);
        }

          console.log(results);

        if(method === 'POST'){
            var item_id = req.body.item_id;
            var type = req.body.type;
            var name = req.body.name;
            var description = req.body.description;
            var begin_date = req.body.begin_date;
            var end_date = req.body.end_date;
            var sort_id = req.body.sort_id;
            var icon = req.body.icon;
            var value = req.body.value;
            value = value?parseInt(value):0;
            console.log("type" + type);
            var regex1 = /^[0-9]{1,}$/;
            if(!regex1.test(item_id))
                return render(res, route, 'id必需为数字.');
            if(!regex1.test(type))
                return render(res, route, '类型必需为数字.');
            if(!regex1.test(sort_id))
                return render(res, route, '排序必需为数字.');

            var i = 0;
            for(; i< results.length; i++){
                var result = results[i];
                if(result.item_id == item_id){
                    result.type = type;
                    result.name = name;
                    result.description = description;
                    result.begin_date = begin_date;
                    result.end_date = end_date;
                    result.sort_id = sort_id;
                    result.icon = icon;
                    result.value = value;
                    break;
                }
            }

            if(i >= results.length){
                results.push({
                    item_id : item_id,
                    type : type,
                    name : name,
                    description : description,
                    begin_date : begin_date,
                    end_date : end_date,
                    sort_id : sort_id,
                    icon: icon,
                    value: value
                });
            }


            console.log(results);
            data.config = JSON.stringify(results);

            dataProvider.editConfig(data, function(error){
                if(error)
                    return render(res, route, '配置文件写入失败.');

                body.message = '修改成功.';
                body.results = results;
                res.render(route, body);
            });
        }
        else{
            var id = req.query.id;
            if(parseInt(id) > 0){
                for(var i=0; i<results.length; i++){
                    if(results[i].item_id == parseInt(id)){
                        results.splice(i,1);
                        break;
                    }
                }
                data.config = JSON.stringify(results);

                dataProvider.editConfig(data, function(error){
                    if(error)
                        return render(res, route, '配置文件写入失败.');

                    body.message = '删除成功.';
                    body.results = results;
                    res.render(route, body);
                });
            }
            else{
                body.results = results;
                res.render(route, body);
            }
        }
    });
}