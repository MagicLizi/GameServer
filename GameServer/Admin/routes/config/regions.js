/**
 * Created with JetBrains WebStorm.
 * User: Andy.Chen
 * Date: 14-5-23
 * Time: 下午3:30
 * To change this template use File | Settings | File Templates.
 */
var fs = require('fs');
var logger = require('log4js').getLogger('app');

var body = {
    title : '大区设置',
    results : [],
    message : null
};

var route = 'config/regions';
var path = './config/gameConfig/items/regions.json';
var dataProvider = require('../../data_provider/dao_provider/system/config');
var key = 'regions';

exports.index = function(req, res){
    body.message = null;
    var method = req.method;

    dataProvider.getConfig(key, function(error, data){
        if(error){
            logger.error(error);
            return render(res, route, '配置文件读取失败.');
        }

        var results = JSON.parse(data);

        if(method === 'POST'){
            var region_id = req.body.region_id;
            var mode_id = req.body.mode_id;
            var name = req.body.name;
            var description = req.body.description;
            var scene_id = req.body.scene_id;
            var antes = req.body.antes;
            var min = req.body.min;
            var max = req.body.max;
            var trusteeship = req.body.box1;
            var select_help = req.body.box2;

            region_id = parseInt(region_id);
            mode_id = parseInt(mode_id);
            scene_id = parseInt(scene_id);
            antes = parseInt(antes);
            min = parseInt(min);
            max = parseInt(max);

            var regex1 = /^[0-9]{1,}$/;
            if(!regex1.test(region_id))
                return render(res, route, '大区必需为数字.');

            if(!regex1.test(mode_id))
                return render(res, route, '模式必需为数字.');

            if(name=='')
                return render(res, route, '名称不能为空.');

            if(description=='')
                return render(res, route, '描述不能为空.');

            if(!regex1.test(scene_id))
                return render(res, route, '场景必需为数字.');

            if(!regex1.test(antes))
                return render(res, route, '倍率必需为数字.');

            if(!regex1.test(min))
                return render(res, route, '最小金贝必需为数字.');

            if(!regex1.test(max))
                return render(res, route, '最大金贝必需为数字.');

            if(antes<=0 || antes>2000000000)
                return render(res, route, '倍率范围应该为1-2000000000.');

            if(min<=0 || min>2000000000)

                return render(res, route, '金贝范围应该为1-2000000000.');

            if(max<=0 || max>2000000000)
                return render(res, route, '金贝范围应该为1-2000000000.');

            if(min>max)
                return render(res, route, '金贝最小值不能超过最大值.');


            var i = 0;
            for(; i<results.length; i++){
                var result = results[i];
                if(result.region_id == region_id){
                    result.mode_id = mode_id;
                    result.scene_id = scene_id;
                    result.name = name;
                    result.description = description;
                    result.antes = antes;
                    result.min = min;
                    result.max = max;
                    result.trusteeship = (trusteeship=='1'?true:false);
                    result.select_help = (select_help=='1'?true:false);
                    break;
                }
            }

            if(i>=results.length){
                results.push({
                    region_id : region_id,
                    mode_id : mode_id,
                    name : name,
                    description : description,
                    scene_id : scene_id,
                    antes : antes,
                    min : min,
                    max : max,
                    trusteeship : (trusteeship=='1'?true:false),
                    select_help : (select_help=='1'?true:false)
                });
            }

             fs.writeFile(path, JSON.stringify(results), 'utf-8', function(error){
                 if(error)
                     return render(res, route, '配置文件写入失败.');

                 body.message = '设置成功.';
                 body.results = results;
                 res.render(route, body);
             });
        }
        else{
            var id = req.query.id;
            if(parseInt(id) > 0){
                for(var i=0; i<results.length; i++){
                    if(results[i].region_id == parseInt(id)){
                        results.splice(i,1);
                        break;
                    }
                }
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
        }
    });
};

function render(res, route, message){
    body.message = message;
    res.render(route, body);
};