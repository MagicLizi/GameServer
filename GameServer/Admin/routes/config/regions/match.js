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
    result : null,
    message : null
};

var path = './config/gameConfig/items/regions.json';
var dataProvider = require('../../../data_provider/dao_provider/system/config');
var key = 'regions';

var mode_id = 3;

exports.index = function(req, res){
    var route = 'config/regions/match';
    body.message = null;
    var method = req.method;

    dataProvider.getConfig(key, function(error, data){
        if(error){
            logger.error(error);
            return render(res, route, '配置文件读取失败.');
        }

        var results = JSON.parse(data.config);

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

                body.message = '删除成功.';
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

exports.add = function(req, res){
    var route = 'config/regions/match_add';
    body.message = null;
    var method = req.method;

    dataProvider.getConfig(key, function(error, data){
        if(error){
            logger.error(error);
            return render(res, route, '配置文件读取失败.');
        }

        var results = JSON.parse(data.config);

        if(method === 'POST'){
            var region_id = req.body.region_id;
            var type = req.body.type;
            var name = req.body.name;
            var description = req.body.description;
            var detail_description = req.body.detail_description;
            var reward_description = req.body.reward_description;
            var scene_id = req.body.scene_id;
            var antes = req.body.antes;
            var min = req.body.min;
            var max = req.body.max;
            var lose_max = req.body.lose_max || 0;
            var trusteeship = req.body.box1;
            var select_help = req.body.box2;
            var begin_date = req.body.begin_date;
            var end_date = req.body.end_date;
            var loop_cycle = req.body.loop_cycle;
            var base_chips = req.body.base_chips;
            var out_chips = req.body.out_chips;
            //var loop_count = req.body.loop_count;
            //var round_count = req.body.round_count;
            var match_min = req.body.match_min;
            var match_max = req.body.match_max;

            region_id = parseInt(region_id);
            type = parseInt(type);
            scene_id = parseInt(scene_id);
            antes = parseInt(antes);
            min = parseInt(min);
            max = parseInt(max);
            lose_max = parseInt(lose_max);
            loop_cycle = parseInt(loop_cycle);
            base_chips = parseInt(base_chips);
            out_chips = parseInt(out_chips);
            //loop_count = parseInt(loop_count);
            //round_count = parseInt(round_count);
            match_min = parseInt(match_min);
            match_max = parseInt(match_max);

            var regex1 = /^[0-9]{1,}$/;
            if(!regex1.test(region_id))
                return render(res, route, '大区必需为数字.');

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

            if(!regex1.test(lose_max))
                return render(res, route, '输上限必需为数字.');

            if(!begin_date || begin_date=='')
                return render(res, route, '开始时间错误.');

            if(!end_date || end_date=='')
                return render(res, route, '结束时间错误.');

            if(!regex1.test(loop_cycle))
                return render(res, route, '循环周期必需为数字.');

            if(!regex1.test(base_chips))
                return render(res, route, '基础金贝必需为数字.');

            if(!regex1.test(out_chips))
                return render(res, route, '淘汰金贝必需为数字.');
            /*
             if(!regex1.test(loop_count))
             return render(res, route, '轮数必需为数字.');

             if(!regex1.test(round_count))
             return render(res, route, '局数必需为数字.');
             */
            if(!regex1.test(match_min))
                return render(res, route, '人数下限必需为数字.');

            if(!regex1.test(match_max))
                return render(res, route, '人数上限必需为数字.');

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
                    return render(res, route, 'ID已经存在.');
                }
            }

            var item = {
                region_id : region_id,
                type : type,
                mode_id : mode_id,
                name : name,
                description : description,
                detail_description : detail_description,
                scene_id : scene_id,
                antes : antes,
                min : min,
                max : max,
                lose_max : lose_max,
                trusteeship : (trusteeship=='1'?true:false),
                select_help : (select_help=='1'?true:false),
                reward_description : reward_description,
                consume : [],
                match : {
                    begin_date : new Date(Date.parse(begin_date)),
                    end_date : new Date(Date.parse(end_date)),
                    loop_cycle : loop_cycle,
                    base_chips : base_chips,
                    out_chips : out_chips,
                    min : match_min,
                    max : match_max,
                    round_count : [],
                    out_chips_additions : [],
                    antes_additions : [],
                    round_promotions : [],
                    rewards : []
                }
            };
            results.push(item);

            data.config = JSON.stringify(results);

            dataProvider.editConfig(data, function(error){
                if(error)
                    return render(res, route, '配置文件写入失败.');

                body.message = '添加成功.';
                body.result = item;
                res.redirect('config/regions/match/edit?id='+region_id);
            });
        }
        else{
            res.render(route, body);
        }
    });
};

exports.edit = function(req, res){
    var route = 'config/regions/match_edit';
    body.message = null;
    var method = req.method;

    var region_id = parseInt(req.query.id);
    dataProvider.getConfig("item", function (error, data) {
        var items = data.config;
        items = JSON.parse(items);
        dataProvider.getConfig(key, function(error, data){
        if(error){
            logger.error(error);
            return render(res, route, '配置文件读取失败.');
        }

        var results = JSON.parse(data.config);

        var result = null;
        results.forEach(function(item){
            if(item.region_id == region_id)
                result = item;

        });

        if(method === 'POST'){
            //var region_id = req.body.region_id;
            var name = req.body.name;
            var type = req.body.type;
            var description = req.body.description;
            var detail_description = req.body.detail_description;
            var reward_description = req.body.reward_description;
            var scene_id = req.body.scene_id;
            var antes = req.body.antes;
            var min = req.body.min;
            var max = req.body.max;
            var lose_max = req.body.lose_max || 0;
            var trusteeship = req.body.box1;
            var select_help = req.body.box2;
            var begin_date = req.body.begin_date;
            var end_date = req.body.end_date;
            var loop_cycle = req.body.loop_cycle;
            var base_chips = req.body.base_chips;
            var out_chips = req.body.out_chips;
            //var loop_count = req.body.loop_count;
            //var round_count = req.body.round_count;
            var match_min = req.body.match_min;
            var match_max = req.body.match_max;

            scene_id = parseInt(scene_id);
            type = parseInt(type);
            antes = parseInt(antes);
            min = parseInt(min);
            max = parseInt(max);
            lose_max = parseInt(lose_max);
            loop_cycle = parseInt(loop_cycle);
            base_chips = parseInt(base_chips);
            out_chips = parseInt(out_chips);
            //loop_count = parseInt(loop_count);
            //round_count = parseInt(round_count);
            match_min = parseInt(match_min);
            match_max = parseInt(match_max);

            var regex1 = /^[0-9]{1,}$/;

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

            if(!regex1.test(lose_max))
                return render(res, route, '输上限必需为数字.');

            if(!begin_date || begin_date=='')
                return render(res, route, '开始时间错误.');

            if(!end_date || end_date=='')
                return render(res, route, '结束时间错误.');

            if(!regex1.test(loop_cycle))
                return render(res, route, '循环周期必需为数字.');

            if(!regex1.test(base_chips))
                return render(res, route, '基础金贝必需为数字.');

            if(!regex1.test(out_chips))
                return render(res, route, '淘汰金贝必需为数字.');
            /*
             if(!regex1.test(loop_count))
             return render(res, route, '轮数必需为数字.');

             if(!regex1.test(round_count))
             return render(res, route, '局数必需为数字.');
             */
            if(!regex1.test(match_min))
                return render(res, route, '人数下限必需为数字.');

            if(!regex1.test(match_max))
                return render(res, route, '人数上限必需为数字.');

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
                    if(result.mode_id != mode_id){
                        return render(res, route, 'ID已经其他模式下存在.');
                    }
                    else{
                        result.scene_id = scene_id;
                        result.type = type;
                        result.name = name;
                        result.description = description;
                        result.detail_description = detail_description;
                        result.reward_description = reward_description;
                        result.antes = antes;
                        result.min = min;
                        result.max = max;
                        result.lose_max = lose_max;
                        result.trusteeship = (trusteeship=='1'?true:false);
                        result.select_help = (select_help=='1'?true:false);
                        result.match.begin_date = new Date(Date.parse(begin_date));
                        result.match.end_date = new Date(Date.parse(end_date));
                        result.match.loop_cycle = loop_cycle;
                        result.match.base_chips = base_chips;
                        result.match.out_chips = out_chips;
                        //result.match.loop_count = loop_count;
                        //result.match.round_count = round_count;
                        result.match.min = match_min;
                        result.match.max = match_max;
                        break;
                    }
                }
            }

            data.config = JSON.stringify(results);

            dataProvider.editConfig(data, function(error){
                if(error)
                    return render(res, route, '配置文件写入失败.');

                body.message = '编辑成功.';
                body.result = result;
                body.items = items;
                res.render(route, body);
            });
        }
        else{
            body.result = result;
            body.items = items;
            res.render(route, body);
        }
    });
    });
};

/**
 * 淘汰金贝增量
 * @param req
 * @param res
 */
exports.removeGameTimes = function(req, res){
    var region_id = parseInt(req.query.region_id);
    var index = parseInt(req.query.index);

    read(res, function(results){

        for(var i=0; i<results.length; i++){
            if(results[i].region_id == region_id){
                var chips = results[i].match.out_chips_additions;
                chips.splice(index,1);
                break;
            }
        }

        write(res, results);
    });
};

exports.addGameTimes = function(req, res){
    var region_id = parseInt(req.query.region_id);

    read(res, function(results){
        for(var i=0; i<results.length; i++){
            if(results[i].region_id == region_id){
                var chips = results[i].match.out_chips_additions;
                chips.push([]);
            }
        }

        write(res, results);
    });
};

exports.removeStreakElement = function(req, res){
    var region_id = parseInt(req.query.region_id);
    var loop = parseInt(req.query.loop);
    var index = parseInt(req.query.index);

    read(res, function(results){

        for(var i=0; i<results.length; i++){
            if(results[i].region_id == region_id){
                var chips = results[i].match.out_chips_additions;
                for(var j=0; j<chips.length; j++){
                    if(j == loop){
                        for(var k=0; k<chips[j].length; k++){
                            if(k == index){
                                chips[j].splice(index, 1);
                                break;
                            }
                        }
                    }
                }
                break;
            }
        }

        write(res, results);
    });
};

exports.updateStreakElement = function(req, res){
    var region_id = parseInt(req.query.region_id);
    var loop = parseInt(req.query.loop);
    var count = parseInt(req.query.count);
    var index = parseInt(req.query.index);

    if(!!count){
        read(res, function(results){

            for(var i=0; i<results.length; i++){
                if(results[i].region_id == region_id){
                    var chips = results[i].match.out_chips_additions;
                    for(var j=0; j<chips.length; j++){
                        if(j == loop){
                            for(var k=0; k<chips[j].length; k++){
                                if(k == index){
                                    chips[j][index] = count;
                                    break;
                                }
                            }
                        }
                    }
                    break;
                }
            }

            write(res, results);
        });
    }
    else
        error(res);
};

exports.addStreakElement = function(req, res){
    var region_id = parseInt(req.query.region_id);
    var loop = parseInt(req.query.loop);
    var count = parseInt(req.query.count);

    if(!!count){
        read(res, function(results){
            for(var i=0; i<results.length; i++){
                if(results[i].region_id == region_id){
                    var chips = results[i].match.out_chips_additions;
                    for(var j=0; j<chips.length; j++){
                        if(loop == j){
                            chips[j].push(count);
                            break;
                        }
                    }
                    break;
                }
            }
            write(res, results);
        });
    }
    else
        error(res);
};

/**
 * 底注增量
 * @param req
 * @param res
 */
exports.removeAntesLoop = function(req, res){
    var region_id = parseInt(req.query.region_id);
    var index = parseInt(req.query.index);

    read(res, function(results){

        for(var i=0; i<results.length; i++){
            if(results[i].region_id == region_id){
                var chips = results[i].match.antes_additions;
                chips.splice(index,1);
                break;
            }
        }

        write(res, results);
    });
};

exports.addAntesLoop = function(req, res){
    var region_id = parseInt(req.query.region_id);

    read(res, function(results){
        for(var i=0; i<results.length; i++){
            if(results[i].region_id == region_id){
                var chips = results[i].match.antes_additions;
                chips.push([]);
            }
        }

        write(res, results);
    });
};

exports.deleteAntesRound = function(req, res){
    var region_id = parseInt(req.query.region_id);
    var loop = parseInt(req.query.loop);
    var index = parseInt(req.query.index);

    read(res, function(results){

        for(var i=0; i<results.length; i++){
            if(results[i].region_id == region_id){
                var chips = results[i].match.antes_additions;
                for(var j=0; j<chips.length; j++){
                    if(j == loop){
                        for(var k=0; k<chips[j].length; k++){
                            if(k == index){
                                chips[j].splice(index, 1);
                                break;
                            }
                        }
                    }
                }
                break;
            }
        }

        write(res, results);
    });
};

exports.updateAntesRound = function(req, res){
    var region_id = parseInt(req.query.region_id);
    var loop = parseInt(req.query.loop);
    var count = parseInt(req.query.count);
    var index = parseInt(req.query.index);

    if(!!count){
        read(res, function(results){

            for(var i=0; i<results.length; i++){
                if(results[i].region_id == region_id){
                    var chips = results[i].match.antes_additions;
                    for(var j=0; j<chips.length; j++){
                        if(j == loop){
                            for(var k=0; k<chips[j].length; k++){
                                if(k == index){
                                    chips[j][index] = count;
                                    break;
                                }
                            }
                        }
                    }
                    break;
                }
            }

            write(res, results);
        });
    }
    else
        error(res);

};

exports.addAntesRound = function(req, res){
    var region_id = parseInt(req.query.region_id);
    var loop = parseInt(req.query.loop);
    var count = parseInt(req.query.count);

    if(!!count){
        read(res, function(results){
            for(var i=0; i<results.length; i++){
                if(results[i].region_id == region_id){
                    var chips = results[i].match.antes_additions;
                    for(var j=0; j<chips.length; j++){
                        if(loop == j){
                            chips[j].push(count);
                            break;
                        }
                    }
                    break;
                }
            }
            write(res, results);
        });
    }
    else
        error(res);
};

/**
 * 每轮进级人数
 * @param req
 * @param res
 */
exports.addRoundPeople = function(req, res){
    var region_id = parseInt(req.query.region_id);
    var people = parseInt(req.query.people);

    if(!!people){
        read(res, function(results){
            for(var i=0; i<results.length; i++){
                if(results[i].region_id == region_id){
                    var chips = results[i].match.round_promotions;
                    chips.push(people);
                }
            }

            write(res, results);
        });
    }
    else
        error(res);
};

exports.updateRoundPeople = function(req, res){
    var region_id = parseInt(req.query.region_id);
    var index = parseInt(req.query.index);
    var people = parseInt(req.query.people);
    if(!!people){
        read(res, function(results){

            for(var i=0; i<results.length; i++){
                if(results[i].region_id == region_id){
                    var chips = results[i].match.round_promotions;
                    chips[index] = people;
                    break;
                }
            }

            write(res, results);
        });
    }
    else
        error(res);

};

exports.removeRoundPeople = function(req, res){
    var region_id = parseInt(req.query.region_id);
    var index = parseInt(req.query.index);

    read(res, function(results){

        for(var i=0; i<results.length; i++){
            if(results[i].region_id == region_id){
                var chips = results[i].match.round_promotions;
                chips.splice(index,1);
                break;
            }
        }

        write(res, results);
    });
};

/**
 * 排名奖励
 * @param req
 * @param res
 */
exports.addRankArea = function(req, res){
    var region_id = parseInt(req.query.region_id);
    var no = req.query.no;

    read(res, function(results){
        for(var i=0; i<results.length; i++){
            if(results[i].region_id == region_id){
                var is_exists = false;
                var prizes = results[i].match.rewards;
                for(var j=0; j<prizes.length; j++){
                    if(prizes[j].no == no){
                        is_exists = true;
                        break;
                    }
                }
                if(!is_exists)
                    prizes.push({
                        no: no,
                        elements : []
                    });

                break;
            }
        }

        write(res, results);
    });
};
exports.removeRankArea = function(req, res){
    var region_id = parseInt(req.query.region_id);
    var index = parseInt(req.query.index);

    read(res, function(results){

        for(var i=0; i<results.length; i++){
            if(results[i].region_id == region_id){
                var prizes = results[i].match.rewards;
                for(var j=0; j<prizes.length; j++){
                    if(j == index){
                        prizes.splice(j,1);
                        break;
                    }
                }
                break;
            }
        }

        write(res, results);
    });
};
exports.removeAreaElement = function(req, res){
    var region_id = parseInt(req.query.region_id);
    var index = parseInt(req.query.index);
    var no = parseInt(req.query.no);

    read(res, function(results){

        for(var i=0; i<results.length; i++){
            if(results[i].region_id == region_id){
                var prizes = results[i].match.rewards;
                for(var j=0; j<prizes.length; j++){
                    if(j == no){
                        var prize = prizes[j];
                        prize.elements.splice(index, 1);
                        break;
                    }
                }
                break;
            }
        }

        write(res, results);
    });
};
exports.addAreaElement = function(req, res){
    var region_id = parseInt(req.query.region_id);
    var index = parseInt(req.query.index);
    var element_id = parseInt(req.query.element_id);
    var count = parseInt(req.query.count);

    if(!!count){
        read(res, function(results){
            for(var i=0; i<results.length; i++){
                if(results[i].region_id == region_id){
                    var prizes = results[i].match.rewards;
                    for(var j=0; j<prizes.length; j++){
                        if(j == index){
                            var prize = prizes[j];
                            prize.elements.push({
                                element_id : element_id,
                                count : count
                            });

                            break;
                        }
                    }
                    break;
                }
            }

            write(res, results);
        });
    }
    else
        error(res);
};

/**
 * 报名费用
 * @param req
 * @param res
 */
exports.addConsumeElement = function(req, res){
    var region_id = parseInt(req.query.region_id);
    var element_id = parseInt(req.query.element_id);
    var count = parseInt(req.query.count);

    if(count>=0){
        read(res, function(results){
            for(var i=0; i<results.length; i++){
                if(results[i].region_id == region_id){
                    var consume = results[i].consume;
                    consume.push({
                        element_id : element_id,
                        count : count
                    });

                    break;
                }
            }

            write(res, results);
        });
    }
    else
        error(res);
};
exports.removeConsumeElement = function(req, res){
    var region_id = parseInt(req.query.region_id);
    var index = parseInt(req.query.index);

    read(res, function(results){

        for(var i=0; i<results.length; i++){
            if(results[i].region_id == region_id){
                var consume = results[i].consume;
                consume.splice(index, 1);
                break;
            }
        }

        write(res, results);
    });
};

/**
 * 轮局设置
 * @param req
 * @param res
 */
exports.addRound = function(req, res){
    var region_id = parseInt(req.query.region_id);
    var round = parseInt(req.query.round);

    if(!!round){
        read(res, function(results){
            for(var i=0; i<results.length; i++){
                if(results[i].region_id == region_id){
                    var match = results[i].match;
                    var chips = match.round_count;
                    chips.push(round);

                    var loop = [];
                    for(var j=0; j<round; j++){
                        loop.push(-1);
                    }
                    match.out_chips_additions.push(loop);
                    match.antes_additions.push(loop);
                    match.round_promotions.push(-1);
                }
            }

            write(res, results);
        });
    }
    else
        error(res);
};

exports.updateRound = function(req, res){
    var region_id = parseInt(req.query.region_id);
    var index = parseInt(req.query.index);
    var round = parseInt(req.query.round);

    if(!!round){
        read(res, function(results){
            for(var i=0; i<results.length; i++){
                if(results[i].region_id == region_id){
                    var match = results[i].match;
                    var old_round = match.round_count[index];
                    results[i].match.round_count[index] = round;

                    if(old_round<round){

                        var loop = [];
                        for(var j=0; j<(round-old_round); j++){
                            match.out_chips_additions[index].push(-1);
                            match.antes_additions[index].push(-1);
                        }
                    }
                    else if(old_round>round){
                        var l = old_round - round;
                        match.out_chips_additions[index].splice(round-1,l);
                        match.antes_additions[index].splice(round-1,l);
                    }
                }
            }

            write(res, results);
        });
    }
    else
        error(res);
};

exports.removeRound = function(req, res){
    var region_id = parseInt(req.query.region_id);
    var index = parseInt(req.query.index);

    read(res, function(results){

        for(var i=0; i<results.length; i++){
            if(results[i].region_id == region_id){
                var match = results[i].match;
                var chips = match.round_count;
                chips.splice(index,1);

                match.out_chips_additions.splice(index,1);
                match.antes_additions.splice(index,1);
                match.round_promotions.splice(index,1);
                break;
            }
        }

        write(res, results);
    });
};

function render(res, route, message){
    body.message = message;
    res.render(route, body);
};

function read(res, callback){
    dataProvider.getConfig(key, function(error, data){
        if(error)
            res.end("0");
        else{
            var results = JSON.parse(data.config);

            callback(results);
        }
    });
}

function write(res, results){
    var data = {
        key_id : key,
        config : JSON.stringify(results)
    };

    dataProvider.editConfig(data, function(error){
        if(error)
            res.end("0");
        else
            res.end("1");
    });
}

function error(res){
    res.end("0");
}