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
    title: '大区设置',
    results: [],
    result: null,
    message: null
};

var path = './config/gameConfig/items/regions.json';
var dataProvider = require('../../../data_provider/dao_provider/system/config');
var key = 'regions';


exports.index = function (req, res) {
    var route = 'config/regions/deposit';
    body.message = null;
    var method = req.method;

    dataProvider.getConfig(key, function (error, data) {
        if (error) {
            logger.error(error);
            return render(res, route, '配置文件读取失败.');
        }
        var results = [];

        if(data.config)
        {
            results = JSON.parse(data.config);
        }

        var id = req.query.id;
        console.log(data);
        if (parseInt(id) >= 0) {
            for (var i = 0; i < results.length; i++) {
                if (results[i].region_id == parseInt(id)) {
                    results.splice(i, 1);
                    break;
                }
            }
            data.config = JSON.stringify(results);

            dataProvider.editConfig(data, function (error) {
                if (error)
                    return render(res, route, '配置文件写入失败.');

                body.message = '删除成功.';
                body.results = results;
                res.render(route, body);
            });
        }
        else {
            body.results = results;
            res.render(route, body);
        }
    });
};

exports.add = function (req, res) {
    var route = 'config/regions/deposit_add';
    body.message = null;
    var method = req.method;
    console.log(req.body);
    dataProvider.getConfig(key, function (error, data) {
        if (error) {
            logger.error(error);
            return render(res, route, '配置文件读取失败.');
        }
        var results = [];
        if(data.config)
        {
            results = JSON.parse(data.config);
        }
        if (method === 'POST') {

            var name = req.body.name;
            var score_limit = req.body.score_limit||0;
            var lvl_limit = req.body.lvl_limit;
            var base_score = req.body.base_score;
            var server_score = req.body.server_score;
            var begin_date = req.body.begin_date;
            var end_date = req.body.end_date;
            var is_valid = req.body.is_valid;

            score_limit = parseInt(score_limit);
            lvl_limit = parseInt(lvl_limit);
            base_score = parseInt(base_score);
            server_score = parseInt(server_score);

            var regex1 = /^[0-9]{1,}$/;

            if (name == '')
                return render(res, route, '名称不能为空.');

            if (!regex1.test(score_limit))
                return render(res, route, '准入分必需为数字.');

            if (!regex1.test(lvl_limit))
                return render(res, route, '准入等级必需为数字.');

            if (!regex1.test(base_score))
                return render(res, route, '底注必需为数字.');

            if (!regex1.test(server_score))
                return render(res, route, '服务费必需为数字.');

            var region_id = 0;
            for (var i = 0; i < results.length; i++) {
                var result = results[i];
                if (result.region_id >= region_id) {
                    region_id = result.region_id +1;
                }
            }

            var item = {
                region_id: region_id,
                name: name,
                score_limit: score_limit,
                lvl_limit: lvl_limit,
                base_score: base_score,
                server_score:server_score,
                is_valid: is_valid,
                begin_date : new Date(Date.parse(begin_date)),
                end_date : new Date(Date.parse(end_date))
            };
            results.push(item);

            data.config = JSON.stringify(results);
            data.config_num ++;
            dataProvider.editConfig(data, function (error) {
                if (error)
                    return render(res, route, '配置文件写入失败.');

                body.message = '添加成功.';
                body.result = item;
//                res.redirect('config/regions/deposit/edit?id=' + region_id);
                res.render(route, body);
            });
        }
        else {
            res.render(route, body);
        }
    });
};

exports.edit = function (req, res) {
    var route = 'config/regions/deposit_edit';
    body.message = null;
    var method = req.method;

    var region_id = parseInt(req.query.id);

    dataProvider.getConfig(key, function (error, data) {
        var items = data.config;
        items = JSON.parse(items);

        dataProvider.getConfig(key, function (error, data) {
            if (error) {
                logger.error(error);
                return render(res, route, '配置文件读取失败.');
            }

            var results;
            if(data)
            {
                results = JSON.parse(data.config);
            }
            var result = null;
            results.forEach(function (item) {
                if (item.region_id == region_id)
                    result = item;
            });

            if(!result)
            {
                return render(res, route, '大区编号错误');
            }

            if (method === 'POST') {

                var name = req.body.name;
                var score_limit = req.body.score_limit||0;
                var lvl_limit = req.body.lvl_limit;
                var base_score = req.body.base_score;
                var server_score = req.body.server_score;
                var begin_date = req.body.begin_date;
                var end_date = req.body.end_date;
                var is_valid = req.body.is_valid;

                score_limit = parseInt(score_limit);
                lvl_limit = parseInt(lvl_limit);
                base_score = parseInt(base_score);
                server_score = parseInt(server_score);

                var regex1 = /^[0-9]{1,}$/;

                if (name == '')
                    return render(res, route, '名称不能为空.');

                if (!regex1.test(score_limit))
                    return render(res, route, '准入分必需为数字.');

                if (!regex1.test(lvl_limit))
                    return render(res, route, '准入等级必需为数字.');

                if (!regex1.test(base_score))
                    return render(res, route, '底注必需为数字.');

                if (!regex1.test(server_score))
                    return render(res, route, '服务费必需为数字.');

                result.name = name;
                result.score_limit = score_limit;
                result.lvl_limit = lvl_limit;
                result.base_score = base_score;
                result.server_score = server_score;
                result.begin_date = new Date(Date.parse(begin_date));
                result.end_date = new Date(Date.parse(end_date));
                result.is_valid = is_valid;

                data.config = JSON.stringify(results);
                data.config_num ++;
                dataProvider.editConfig(data, function (error) {
                    if (error)
                        return render(res, route, '配置文件写入失败.');

                    body.message = '编辑成功.';
                    body.result = result;
                    body.items = items;
                    res.render(route, body);
                });
            }
            else {
                result.begin_date = new Date(Date.parse(result.begin_date));
                result.end_date = new Date(Date.parse(result.end_date));
                body.result = result;
                body.items = items;
                res.render(route, body);
            }
        });
    });
};

/**
 * 删除游戏奖励
 * @param req
 * @param res
 */
exports.removeGameElement = function (req, res) {
    var region_id = parseInt(req.query.region_id);
    var index = parseInt(req.query.index);
    var times = parseInt(req.query.times);

    read(res, function (results) {

        for (var i = 0; i < results.length; i++) {
            if (results[i].region_id == region_id) {
                var prizes = results[i].deposit.game_prizes;
                prizes[times].elements.splice(index, 1);
                break;
            }
        }

        write(res, results);
    });
};
/**
 * 添加游戏奖励
 * @param req
 * @param res
 */
exports.addGameElement = function (req, res) {
    var region_id = parseInt(req.query.region_id);
    var index = parseInt(req.query.times);
    var element_id = parseInt(req.query.element_id);
    var count = parseInt(req.query.count);

    if (!!count) {
        read(res, function (results) {

            for (var i = 0; i < results.length; i++) {
                if (results[i].region_id == region_id) {
                    var prizes = results[i].deposit.game_prizes;
                    prizes[index].elements.push({
                        element_id: element_id,
                        count: count
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

/**
 * 删除游戏奖励
 * @param req
 * @param res
 */
exports.removeGameTimes = function (req, res) {
    var region_id = parseInt(req.query.region_id);
    var times = parseInt(req.query.times);

    read(res, function (results) {

        for (var i = 0; i < results.length; i++) {
            if (results[i].region_id == region_id) {
                var prizes = results[i].deposit.game_prizes;
                prizes.splice(times, 1);
                break;
            }
        }

        write(res, results);
    });
};
/**
 *
 * @param req
 * @param res
 */
exports.addGameTimes = function (req, res) {
    var region_id = parseInt(req.query.region_id);
    var times = req.query.times;
    var description = req.query.description;

    if (!!times && times != '') {
        read(res, function (results) {
            for (var i = 0; i < results.length; i++) {
                if (results[i].region_id == region_id) {
                    var prizes = results[i].deposit.game_prizes;
                    prizes.push({
                        times: times,
                        elements: [],
                        description: description
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

/**
 * 删除连胜奖励
 * @param req
 * @param res
 */
exports.removeStreakElement = function (req, res) {
    var region_id = parseInt(req.query.region_id);
    var index = parseInt(req.query.index);
    var times = parseInt(req.query.times);

    read(res, function (results) {

        for (var i = 0; i < results.length; i++) {
            if (results[i].region_id == region_id) {
                var prizes = results[i].deposit.streak_prizes.config;
                prizes[times].elements.splice(index, 1);
                break;
            }
        }

        write(res, results);
    });
};
/**
 * 添加连胜奖励
 * @param req
 * @param res
 */
exports.addStreakElement = function (req, res) {
    var region_id = parseInt(req.query.region_id);
    var times = parseInt(req.query.times);
    var element_id = parseInt(req.query.element_id);
    var count = parseInt(req.query.count);

    if (!!count) {
        read(res, function (results) {

            for (var i = 0; i < results.length; i++) {
                if (results[i].region_id == region_id) {
                    var prizes = results[i].deposit.streak_prizes.config;
                    prizes[times].elements.push({
                        element_id: element_id,
                        count: count
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

/**
 * 删除连胜奖励
 * @param req
 * @param res
 */
exports.removeStreakTimes = function (req, res) {
    var region_id = parseInt(req.query.region_id);
    var times = parseInt(req.query.times);

    read(res, function (results) {

        for (var i = 0; i < results.length; i++) {
            if (results[i].region_id == region_id) {
                var prizes = results[i].deposit.streak_prizes.config;
                prizes.splice(times, 1);
                break;
            }
        }

        write(res, results);
    });
};
/**
 *
 * @param req
 * @param res
 */
exports.addStreakTimes = function (req, res) {
    var region_id = parseInt(req.query.region_id);
    var times = req.query.times;
    var description = req.query.description;

    if (!!times && times != '') {
        read(res, function (results) {

            for (var i = 0; i < results.length; i++) {
                if (results[i].region_id == region_id) {
                    var is_exists = false;
                    var prizes = results[i].deposit.streak_prizes.config;
                    prizes.push({
                        times: times,
                        elements: [],
                        description: description
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

/**
 * 报名费用
 * @param req
 * @param res
 */
exports.addConsumeElement = function (req, res) {
    var region_id = parseInt(req.query.region_id);
    var element_id = parseInt(req.query.element_id);
    var count = parseInt(req.query.count);

    if (!!count) {
        read(res, function (results) {
            for (var i = 0; i < results.length; i++) {
                if (results[i].region_id == region_id) {
                    var consume = results[i].consume;
                    consume.push({
                        element_id: element_id,
                        count: count
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
exports.removeConsumeElement = function (req, res) {
    var region_id = parseInt(req.query.region_id);
    var index = parseInt(req.query.index);

    read(res, function (results) {

        for (var i = 0; i < results.length; i++) {
            if (results[i].region_id == region_id) {
                var consume = results[i].consume;
                consume.splice(index, 1);
                break;
            }
        }

        write(res, results);
    });
};

function render(res, route, message) {
    body.message = message;
    res.render(route, body);
};

function read(res, callback) {
    dataProvider.getConfig(key, function (error, data) {
        if (error)
            res.end("0");
        else {
            var results = JSON.parse(data.config);

            callback(results);
        }
    });
}

function write(res, results) {
    var data = {
        key_id: key,
        config: JSON.stringify(results)
    };

    dataProvider.editConfig(data, function (error) {
        if (error)
            res.end("0");
        else
            res.end("1");
    });
}

function error(res) {
    res.end("0");
}