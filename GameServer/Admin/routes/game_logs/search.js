/**
 * Created with JetBrains WebStorm.
 * User: andy.chen
 * Date: 14-5-22
 * Time: 下午12:13
 * To change this template use File | Settings | File Templates.
 */
var underscore = require('underscore');
var excel = require('excel-export');
var actionProvider = require('../../data_provider/dao_provider/logs/action');
var dataProvider = require('../../data_provider/dao_provider/system/config');
var page_size = 20;

var body = {
    title: '游戏日志',
    codes: require('../../config/logcode.json'),
    results: [],
    opts: null,
    message: null,
    url: null,
    reply_item: reply_item
};

exports.index = function (req, res) {
    body.message = null;
    body.results = [];

    /*
     var page_no = parseInt(req.query.page_no) || 1;
     var start = (page_no - 1) * page_size;

     var search = parseInt(req.query.search) || 0;
     var action_id = req.query.action_id;
     var begin_date = req.query.begin_date;
     var end_date = req.query.end_date;
     var user_type = parseInt(req.query.user_type);
     var user_value = req.query.user_value;
     var key_type = parseInt(req.query.key_type);
     var key_value = req.query.key_value;
     var key_select = req.query.key_select;

     var now = new Date();
     if(!!begin_date)
     begin_date = new Date(Date.parse(begin_date));
     else{
     var y = now.getFullYear(), m = now.getMonth()+1, d = now.getDate();
     begin_date = new Date(Date.parse(y+'-'+m+'-'+(d-1)));
     }

     if(!!end_date)
     end_date = new Date(Date.parse(end_date));
     else{
     var y = now.getFullYear(), m = now.getMonth()+1, d = now.getDate();
     end_date = new Date(Date.parse(y+'-'+m+'-'+d));
     }

     var actions = [];
     if(!!action_id){
     var act = action_id.split(',');
     for(var i=1; i<act.length; i++){
     if(parseInt(act[i])>0)
     actions.push(parseInt(act[i]));
     }
     }

     dataProvider.getConfig('config', function(error, configResult){
     var regions = [];
     if(!error && configResult){
     var configData = JSON.parse(configResult.config);
     configData.regions.forEach(function(region){
     regions.push(region.name);
     });
     }
     body.opts = {
     action_id : action_id,
     actions : actions,
     begin_date : begin_date,
     end_date : end_date,
     user_type : user_type,
     user_value : user_value,
     key_type : key_type,
     key_value : key_value,
     key_select : key_select,
     page_no : page_no,
     regions : regions
     };

     if(search == 1){
     if(actions.length == 0){
     body.message = '请选择您想要查询的动作。';
     res.render('game_logs/search', body);
     }
     else{
     var opts = bind_type(body.opts);
     opts.page_size = page_size;
     opts.start = start;

     actionProvider.getList(actions, opts, function(error, result){
     if(!error){
     body.results = result.list;
     var total = page_total(result.total);
     body.url = page_url(total, page_no, body.opts)
     }
     res.render('game_logs/search', body);
     });
     }
     }
     else
     res.render('game_logs/search', body);
     });
     */
    replay(req, res, function (result) {
        var search = result.search;
        var actions = result.actions;
        var page_no = result.page_no;
        var start = result.start;

        if (search == 1) {
            if (actions.length == 0) {
                body.message = '请选择您想要查询的动作。';
                res.render('game_logs/search', body);
            }
            else {
                var opts = bind_type(body.opts);
                opts.page_size = page_size;
                opts.start = start;

                actionProvider.getList(actions, opts, function (error, result) {
                    if (!error) {
                        body.results = result.list;
                        var total = page_total(result.total);
                        body.url = page_url(total, page_no, body.opts)
                    }
                    res.render('game_logs/search', body);
                });
            }
        }
        else
            res.render('game_logs/search', body);
    });
};

exports.excel = function (req, res) {
    var conf = {};
    conf.cols = [
        {
            caption: '日期',
            type: 'string'
        },
        {
            caption: '动作',
            type: 'string'
        },
        {
            caption: '帐号',
            type: 'string'
        },
        {
            caption: '昵称',
            type: 'string'
        },
        {
            caption: '机器人',
            type: 'string'
        },
        {
            caption: '数据信息',
            type: 'string'
        }
    ];
    conf.rows = [];

    replay(req, res, function (result) {
        var search = result.search;
        var actions = result.actions;
        var page_no = result.page_no;

        if (search == 1) {
            if (actions.length == 0) {
                body.message = '请选择您想要查询的动作。';
                res.render('game_logs/search', body);
            }
            else {
                var opts = bind_type(body.opts);

                actionProvider.excel(actions, opts, function (error, results) {
                    if (!error) {
                        results.forEach(function (result) {
                            var data = [], is_code = false;
                            data.push(result.create_date.format('yyyy-MM-dd hh:mm:ss'));

                            body.codes.forEach(function (code) {
                                if (code.code == result.action_id) {
                                    data.push(code.name + '(' + result.action_id + ')');
                                    is_code = true;
                                }
                            });

                            if (!is_code)
                                data.push(result.action_id);

                            data.push(result.account);
                            data.push(result.nickname);
                            data.push(result.is_robot == 1 ? '是' : '否');
                            data.push(reply_item(result, 2));

                            conf.rows.push(data);
                        });
                    }
                    create_excel(res, conf);
                });
            }
        }
        else
            create_excel(res, conf);
    });
};

function create_excel(res, conf) {
    var now = new Date();
    var name = now.format('yyyyMMddhhmmss');
    var result = excel.execute(conf);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader("Content-Disposition", "attachment; filename=" + name + ".xlsx");
    res.end(result, 'binary');
}

function replay(req, res, callback) {
    var page_no = parseInt(req.query.page_no) || 1;
    var start = (page_no - 1) * page_size;

    var search = parseInt(req.query.search) || 0;
    var action_id = req.query.action_id;
    var begin_date = req.query.begin_date;
    var end_date = req.query.end_date;
    var user_type = parseInt(req.query.user_type);
    var user_value = req.query.user_value;
    var key_type = parseInt(req.query.key_type);
    var key_value = req.query.key_value;
    var key_select = req.query.key_select;

    var now = new Date();
    if (!!begin_date)
        begin_date = new Date(Date.parse(begin_date));
    else {
        var y = now.getFullYear(), m = now.getMonth() + 1, d = now.getDate();
        begin_date = new Date(Date.parse(y + '-' + m + '-' + (d - 1)));
    }

    if (!!end_date)
        end_date = new Date(Date.parse(end_date));
    else {
        var y = now.getFullYear(), m = now.getMonth() + 1, d = now.getDate();
        end_date = new Date(Date.parse(y + '-' + m + '-' + d));
    }

    var actions = [];
    if (!!action_id) {
        var act = action_id.split(',');
        for (var i = 1; i < act.length; i++) {
            if (parseInt(act[i]) > 0)
                actions.push(parseInt(act[i]));
        }
    }

    dataProvider.getConfig('config', function (error, configResult) {
        var regions = [];
        if (!error && configResult) {
            var configData = JSON.parse(configResult.config);
            configData.regions.forEach(function (region) {
                regions.push(region.name);
            });
        }
        body.opts = {
            action_id: action_id,
            actions: actions,
            begin_date: begin_date,
            end_date: end_date,
            user_type: user_type,
            user_value: user_value,
            key_type: key_type,
            key_value: key_value,
            key_select: key_select,
            page_no: start,
            regions: regions
        };

        callback({
            search: search,
            actions: actions,
            page_no: page_no,
            start: start
        });
        /*
         if(search == 1){
         if(actions.length == 0){
         body.message = '请选择您想要查询的动作。';
         res.render('game_logs/search', body);
         }
         else{
         var opts = bind_type(body.opts);
         opts.page_size = page_size;
         opts.start = start;

         actionProvider.getList(actions, opts, function(error, result){
         if(!error){
         body.results = result.list;
         var total = page_total(result.total);
         body.url = page_url(total, page_no, body.opts)
         }
         res.render('game_logs/search', body);
         });
         }
         }
         else
         res.render('game_logs/search', body);
         */
    });

};

function bind_type(opts) {
    var result = {};

    if (!!opts.begin_date)
        result.begin_date = opts.begin_date;

    if (!!opts.end_date)
        result.end_date = opts.end_date;

    if (opts.user_value != '') {
        if (opts.user_type == 1) {
            if (parseInt(opts.user_value) >= 0)
                result.player_id = parseInt(opts.user_value);
        }
        else if (opts.user_type == 2)
            result.account = opts.user_value;
        else if (opts.user_type == 3)
            result.nickname = opts.user_value;
    }

    if (opts.key_value != '') {
        if (opts.key_type == 1)
            result.region_name = opts.key_value;
        else if (opts.key_type == 2) {
            if (parseInt(opts.key_value) >= 0)
                result.region_id = parseInt(opts.key_value);
        }
        else if (opts.key_type == 3) {
            if (parseInt(opts.key_value) >= 0)
                result.loop_id = parseInt(opts.key_value);
        }
        else if (opts.key_type == 4) {
            if (parseInt(opts.key_value) >= 0)
                result.round_id = parseInt(opts.key_value);
        }
    }
    return result;
};

function reply_item(item, color) {
    color = color || 1;
    var result = ''
    switch (item.action_id) {
        case 1001:
            break;
        case 1002:
            break;
        case 1003:
            break;
        case 1004:
            result += blue('手机号：') + green(item.v1, color);
            break;
        case 1005:
            break;
        case 1006:
            result += blue('排名：') + green(item.i7, color);
            break;
        case 1007:
            result += blue('增加值：', color) + green(item.i2, color);
            result += blue('，结果：', color) + green(item.i3, color);
            result += blue('，来源：', color) + green(item.v1, color);
            break;
        case 1008:
            result += blue('减少值：', color) + green(item.i2, color);
            result += blue('，结果：', color) + green(item.i3, color);
            result += blue('，来源：', color) + green(item.v1, color);
            break;
        case 1009:
            result += blue('任务名：', color) + green(item.v1, color);
            result += blue('，任务奖励：', color) + green(element(item.t1), color);
            break;
        case 1010:
            break;
        case 1011:
            result += blue('游戏时间(S)：', color) + green(item.i1, color);
            break;


        case 2001:
            result += blue('场次名：', color) + green(item.v1, color);
            result += blue('，押金贝数：', color) + green(item.i4, color);
            result += blue('，兑换血量：', color) + green(item.i2, color);
            break;
        case 2002:
        case 2003:
        case 2004:
            result += blue('场次名：', color) + green(item.v1, color);
            result += blue('，血量：', color) + green(item.i2, color);
            break;
        case 2005:
            result += blue('增加值：', color) + green(item.i3, color);
            result += blue('，结果：', color) + green(item.i2, color);
            result += blue('，减少金贝量：', color) + green(item.i4, color);
            break;
        case 2006:
        case 2007:
            result += blue('增加值：', color) + green(item.i3, color);
            result += blue('，结果：', color) + green(item.i2, color);
            break;
        case 2008:
            result += blue('场次名：', color) + green(item.v1, color);
            result += blue('本场参加局数：', color) + green(item.i5, color);
            result += blue('，兑换金贝数：', color) + green(item.i4, color);
            result += blue('，本场游戏时间：', color) + green(item.i6, color);
            break;
        case 2009:
            result += blue('场次名：', color) + green(item.v1, color);
            result += blue('，场次ID：', color) + green(item.i2, color);
            result += blue('，扣除报名费：', color) + green(element(item.t1), color);
            result += blue('，本场比赛已报名人数：', color) + green(item.i9, color);
            break;
        case 2010:
            result += blue('场次名：', color) + green(item.v1, color);
            result += blue('，场次ID：', color) + green(item.i2, color);
            result += blue('，归还报名费：', color) + green(element(item.t1), color);
            break;
        case 2011:
            result += blue('场次名：', color) + green(item.v1, color);
            result += blue('，场次ID：', color) + green(item.i2, color);
            result += blue('，报名费：', color) + green(element(item.t1), color);
            result += blue('，本场比赛人数：', color) + green(item.i9, color);
            break;
        case 2012:
            result += blue('场次名：', color) + green(item.v1, color);
            result += blue('，场次ID：', color) + green(item.i2, color);
            result += blue('，轮次ID：', color) + green(item.i3, color);
            result += blue('，桌号：', color) + green(item.i1, color);
            break;
        case 2013:
        case 2014:
        case 2015:
            result += blue('场次名：', color) + green(item.v1, color);
            result += blue('，场次ID：', color) + green(item.i2, color);
            result += blue('，轮次ID：', color) + green(item.i3, color);
            result += blue('，桌号：', color) + green(item.i1, color);
            result += blue('，局次ID：', color) + green(item.i4, color);
            result += blue('，比赛分：', color) + green(item.i5, color);
            result += blue('，本场名次：', color) + green(item.i6, color);
            break;
        case 2016:
            result += blue('场次名：', color) + green(item.v1, color);
            result += blue('，场次ID：', color) + green(item.i2, color);
            result += blue('，本场名次：', color) + green(item.i6, color);
            result += blue('，奖励内容：', color) + green(element(item.t2), color);
            break;
        case 2017:
        case 2018:
            result += blue('场次名：', color) + green(item.v1, color);
        case 3001:
        case 3002:
        case 3003:
        case 3004:
            result += blue('触发区域：', color) + green(item.i1 == 1 ? "登陆" : item.i1 == 2 ? "主界面" : item.i1 == 3 ? "比赛场" : "押金场", color);
            break;

    }
    return result;
}

function page_total(count) {
    return (count % page_size == 0) ? (count / page_size) : (parseInt(count / page_size) + 1);
}

function page_url(total, index, opts) {
    var i = 0, j = 0;
    if (total <= 10) {
        i = 1;
        j = total;
    }
    else {
        if (index - 5 <= 0) {
            i = 1;
            j = 10;
        }
        else if (index + 5 >= total) {
            i = total - 10;
            j = total;
        }
        else {
            i = index - 5;
            j = index + 5;
        }
    }

    var condition = 'search=1&action_id=' + opts.action_id;

    if (!!opts.begin_date)
        condition += '&begin_date=' + opts.begin_date.format('yyyy-MM-dd hh:mm:ss');
    if (!!opts.end_date)
        condition += '&end_date=' + opts.end_date.format('yyyy-MM-dd hh:mm:ss');

    condition += '&user_type=' + opts.user_type;
    condition += '&user_value=' + opts.user_value || '';

    condition += '&key_type=' + opts.key_type;
    condition += '&key_value=' + opts.key_value || '';

    var url = '[ 共' + total + '页 <a href="/game_logs/search?' + condition + '&page_no=1">首页</a> ';
    for (var k = i; k <= j; k++) {
        if (k == index)
            url += ' ' + k;
        else
            url += ' <a href="/game_logs/search?' + condition + '&page_no=' + k + '">' + k + '</a> ';
    }

    url += ' <a href="/game_logs/search?' + condition + '&page_no=' + total + '">尾页</a>';
    url += ' 当前第' + index + '页]';

    if (total > 0)
        url += ' [<a href="/game_logs/excel?' + condition + '&total=' + total + '" style="color:#0000FF;">导出Excel</a>]';
    return url;
}

function element(rewards) {
    var name = '';
    if (rewards != '') {
        var elements = JSON.parse(rewards);

        elements.forEach(function (element) {
            if (element != null) {
                switch (element.element_id) {
                    case 10001:
                        name += '｜金贝：' + element.count;
                        break;
                    case 10002:
                        name += '｜通宝卡：' + element.count;
                        break;
                    case 10003:
                        name += '｜失败：' + element.count;
                        break;
                    case 10004:
                        name += '｜胜利：' + element.count;
                        break;
                }
            }
        });
    }

    return name + '|';
}

function render(res, route, message) {
    body.message = message;
    res.render(route, body);
};

function red(text, color) {
    if (color == 1)
        return '<span style="color:red;">' + text + '</span>';
    else
        return text;
}
function green(text, color) {
    if (color == 1)
        return '<span style="color:green;">' + text + '</span>';
    else
        return text;
}
function blue(text, color) {
    if (color == 1)
        return '<span style="color:blue;">' + text + '</span>';
    else
        return text;
}