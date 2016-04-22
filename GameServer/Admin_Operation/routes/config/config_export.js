/**
 * Created with JetBrains WebStorm.
 * User: Andy.Chen
 * Date: 14-5-23
 * Time: 下午3:30
 * To change this template use File | Settings | File Templates.
 */
var fs = require('fs');
var dataProvider = require('../../data_provider/dao_provider/system/config');
var key = 'config';

var body = {
    title : '配置表导出',
    result : null,
    message : null
};

var route = 'config/config_export';

exports.index = function(req, res){
    var method = req.method;

    if(method === 'POST'){

        dataProvider.getConfig(key,function(error, results){
            if(error)
            {
                return render(res, route, '配置文件导出失败.');
            }
            else
            {
                if(!results)
                {
                    return render(res, route, '无配置表数据.');
                }
                var model = {
                   id:results.key_id,
                   config_num:results.config_num,
                   data:JSON.parse(results.config)
                };
                var configData = JSON.stringify(model);
                body.message = configData;
                res.render(route, body);
            }
        });
    }
    else
        res.render(route, body);
};

function render(res, route, message){
    body.message = message;
    res.render(route, body);
}