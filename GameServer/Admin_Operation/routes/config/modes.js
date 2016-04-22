/**
 * Created with JetBrains WebStorm.
 * User: Andy.Chen
 * Date: 14-5-23
 * Time: 下午3:30
 * To change this template use File | Settings | File Templates.
 */
var fs = require('fs');

var body = {
    title : '模式设置',
    results : [],
    message : null
};

var route = 'config/modes';
var path = './config/gameConfig/items/game_modes.json';
var dataProvider = require('../../data_provider/dao_provider/system/config');
var key = 'game_modes';

exports.index = function(req, res){
    var method = req.method;

    dataProvider.getConfig(key, function(error, data){
        if(error)
            return render(res, route, '配置文件读取失败.');

       if(!data) return;
        var results = JSON.parse(data.config);

        if(method === 'POST'){
            var mode_id = req.body.mode_id;
            var rate = req.body.rate;
            var tiny = req.body.tiny;
            var streaky_bull = req.body.streaky_bull;
            var boom = req.body.boom;
            var bull0 = req.body.bull0;
            var bull1 = req.body.bull1;
            var bull2 = req.body.bull2;
            var bull3 = req.body.bull3;
            var bull4 = req.body.bull4;
            var bull5 = req.body.bull5;
            var bull6 = req.body.bull6;
            var bull7 = req.body.bull7;
            var bull8 = req.body.bull8;
            var bull9 = req.body.bull9;
            var bull10 = req.body.bull10;

            var regex1 = /^[0-9]{1,}$/;
            if(!regex1.test(mode_id))
                return render(res, route, '大区必需为数字.');

            /*
            if(!regex1.test(rate))
                return render(res, route, '倍率必需为数字.');
            */

            if(!regex1.test(tiny))
                return render(res, route, '五小牛必需为数字.');

            if(!regex1.test(streaky_bull))
                return render(res, route, '五花牛必需为数字.');

            if(!regex1.test(boom))
                return render(res, route, '炸弹必需为数字.');

            if(!regex1.test(bull0))
                return render(res, route, '无牛必需为数字.');

            if(!regex1.test(bull1))
                return render(res, route, '牛丁必需为数字.');

            if(!regex1.test(bull2))
                return render(res, route, '牛二必需为数字.');

            if(!regex1.test(bull3))
                return render(res, route, '牛三必需为数字.');

            if(!regex1.test(bull4))
                return render(res, route, '牛四必需为数字.');

            if(!regex1.test(bull5))
                return render(res, route, '牛五必需为数字.');

            if(!regex1.test(bull6))
                return render(res, route, '牛六必需为数字.');

            if(!regex1.test(bull7))
                return render(res, route, '牛七必需为数字.');

            if(!regex1.test(bull8))
                return render(res, route, '牛八必需为数字.');

            if(!regex1.test(bull9))
                return render(res, route, '牛九必需为数字.');

            if(!regex1.test(bull0))
                return render(res, route, '牛牛需为数字.');

            mode_id = parseInt(mode_id);
            rate = 0;
            tiny = parseInt(tiny);
            streaky_bull = parseInt(streaky_bull);
            boom = parseInt(boom);
            bull0 = parseInt(bull0);
            bull1 = parseInt(bull1);
            bull2 = parseInt(bull2);
            bull3 = parseInt(bull3);
            bull4 = parseInt(bull4);
            bull5 = parseInt(bull5);
            bull6 = parseInt(bull6);
            bull7 = parseInt(bull7);
            bull8 = parseInt(bull8);
            bull9 = parseInt(bull9);
            bull10 = parseInt(bull10);

            if(tiny<=0 || tiny>2000000000
            || streaky_bull<=0 || streaky_bull>2000000000
            || boom<=0 || boom>2000000000
            || bull0<=0 || bull0>2000000000
            || bull1<=0 || bull1>2000000000
            || bull2<=0 || bull2>2000000000
            || bull3<=0 || bull3>2000000000
            || bull4<=0 || bull4>2000000000
            || bull5<=0 || bull5>2000000000
            || bull6<=0 || bull6>2000000000
            || bull7<=0 || bull7>2000000000
            || bull8<=0 || bull8>2000000000
            || bull9<=0 || bull9>2000000000
            || bull10<=0 || bull10>2000000000)
                return render(res, route, '围应该为1-2000000000.');

            var i = 0;
            for(; i<results.length; i++){
                var result = results[i];
                if(result.mode_id == mode_id){
                    result.mode_id = mode_id;
                    result.rate = rate;
                    result.multiples.tiny = tiny;
                    result.multiples.streaky_bull = streaky_bull;
                    result.multiples.boom = boom;
                    result.multiples.bull0 = bull0;
                    result.multiples.bull1 = bull1;
                    result.multiples.bull2 = bull2;
                    result.multiples.bull3 = bull3;
                    result.multiples.bull4 = bull4;
                    result.multiples.bull5 = bull5;
                    result.multiples.bull6 = bull6;
                    result.multiples.bull7 = bull7;
                    result.multiples.bull8 = bull8;
                    result.multiples.bull9 = bull9;
                    result.multiples.bull10 = bull10;
                    break;
                }
            }

            if(i>=results.length){
                results.push({
                    mode_id : mode_id,
                    rate : rate,
                    multiples :{
                        tiny : tiny,
                        streaky_bull : streaky_bull,
                        boom : boom,
                        bull0 : bull0,
                        bull1 : bull1,
                        bull2 : bull2,
                        bull3 : bull3,
                        bull4 : bull4,
                        bull5 : bull5,
                        bull6 : bull6,
                        bull7 : bull7,
                        bull8 : bull8,
                        bull9 : bull9,
                        bull10 : bull10
                    }
                });
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
            var id = req.query.id;
            if(parseInt(id) > 0){
                for(var i=0; i<results.length; i++){
                    if(results[i].mode_id == parseInt(id)){
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