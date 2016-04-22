/**
 * Created with JetBrains WebStorm.
 * User: andy.chen
 * Date: 14-5-22
 * Time: 下午12:13
 * To change this template use File | Settings | File Templates.
 */
var membership_users = require('../../data_provider/dao_provider/logs/membership_users');
var membership_bind = require('../../data_provider/dao_provider/logs/membership_bind');
var user_player = require('../../data_provider/dao_provider/logs/player');
var user_chips = require('../../data_provider/dao_provider/logs/chips');
var actions = require('../../data_provider/dao_provider/logs/actions');
var user_task = require('../../data_provider/dao_provider/logs/game_task');
var user_run = require('../../data_provider/dao_provider/logs/game_run');
var user_deposit = require('../../data_provider/dao_provider/logs/game_deposit');
var user_trusteeship = require('../../data_provider/dao_provider/logs/game_trusteeship');
var user_match = require('../../data_provider/dao_provider/logs/game_match');

var page_size = 20;

var body = {
    title : '游戏日志',
    codes : require('../../config/logcode.json'),
    action : -1,
    results : [],
    opts : null,
    url : null,
    index : 1,
    message : null,
    element : element
};

exports.index = function(req, res){
    body.message = null;
    var action_id = parseInt(req.query.action) || -1;
    body.action = action_id;
    console.log('action_id...'+action_id);

    switch(action_id){
        case 1001:
        case 1002:
            membership_account(req, res, action_id);
            break;
        case 1004:
            bind(req, res, action_id);
            break;
        case 1003:
        case 1005:
            membership_id(req, res, action_id);
            break;
        case 1006:
            player_id(req, res, action_id);
            break;
        case 1007:
        case 1008:
            chips(req, res, action_id);
            break;
        case 1009:
            tasks(req, res, action_id);
            break;
        case 1010:
        case 1011:
            run(req, res, action_id);
            break;
        case 2001:
        case 2002:
        case 2003:
        case 2004:
        case 2005:
        case 2006:
        case 2007:
        case 2008:
            deposit(req, res, action_id);
            break;
        case 2009:
        case 2010:
        case 2011:
        case 2012:
        case 2013:
        case 2014:
        case 2015:
        case 2016:
            match(req, res, action_id);
            break;
        case 2017:
        case 2018:
            trusteeship(req, res, action_id);
            break;
        default:
            res.render('game_logs/index', body);
    }
};

function membership_account(req, res, action_id){
    var index = parseInt(req.query.page_no) || 1;
    var begin_date = req.query.begin_date;
    var end_date = req.query.end_date;
    var type = parseInt(req.query.type);
    var key = req.query.key;

    var start = (index-1)*page_size;

    var opts = {
        start : start,
        page_size : page_size,
        type : type,
        key : key
    };

    body.index = start+1;

    if(!!begin_date)
        opts.begin_date = new Date(Date.parse(begin_date));
    if(!!end_date)
        opts.end_date = new Date(Date.parse(end_date));

    bind_type(type, key, opts);

    membership_users.getByAccount(action_id, opts, function(error, result){
        if(error)
            body.message = '查询失败。';
        else{

            console.log(result.list);
            body.results = result.list;
            var total = page_total(result.total);
            body.url = page_url(total, index, opts)
        }

        body.opts = opts;

        res.render('game_logs/register', body);
    });
}

function membership_id(req, res, action_id){
    var index = parseInt(req.query.page_no) || 1;
    var begin_date = req.query.begin_date;
    var end_date = req.query.end_date;
    var type = parseInt(req.query.type);
    var key = req.query.key;

    var start = (index-1)*page_size;

    var opts = {
        start : start,
        page_size : page_size,
        type : type,
        key : key
    };

    body.index = start+1;

    if(!!begin_date)
        opts.begin_date = new Date(Date.parse(begin_date));
    if(!!end_date)
        opts.end_date = new Date(Date.parse(end_date));

    bind_type(type, key, opts);

    membership_users.getByMembershipId(action_id, opts, function(error, result){
        if(error)
            body.message = '查询失败。';
        else{

            console.log(result.list);
            body.results = result.list;
            var total = page_total(result.total);
            body.url = page_url(total, index, opts)
        }

        body.opts = opts;

        res.render('game_logs/register', body);
    });
}

function player_id(req, res, action_id){
    var index = parseInt(req.query.page_no) || 1;
    var begin_date = req.query.begin_date;
    var end_date = req.query.end_date;
    var type = parseInt(req.query.type);
    var key = req.query.key;

    var start = (index-1)*page_size;

    var opts = {
        start : start,
        page_size : page_size,
        type : type,
        key : key
    };

    body.index = start+1;

    if(!!begin_date)
        opts.begin_date = new Date(Date.parse(begin_date));
    if(!!end_date)
        opts.end_date = new Date(Date.parse(end_date));

    bind_type(type, key, opts);


    user_player.getByPlayerId(action_id, opts, function(error, result){
        if(error)
            body.message = '查询失败。';
        else{

            body.results = result.list;
            var total = page_total(result.total);
            body.url = page_url(total, index, opts)
        }

        body.opts = opts;

        res.render('game_logs/player', body);
    });
}

function chips(req, res, action_id){
    var index = parseInt(req.query.page_no) || 1;
    var begin_date = req.query.begin_date;
    var end_date = req.query.end_date;
    var type = parseInt(req.query.type);
    var key = req.query.key;

    var start = (index-1)*page_size;

    var opts = {
        start : start,
        page_size : page_size,
        type : type,
        key : key
    };

    body.index = start+1;

    if(!!begin_date)
        opts.begin_date = new Date(Date.parse(begin_date));
    if(!!end_date)
        opts.end_date = new Date(Date.parse(end_date));

    bind_type(type, key, opts);


    user_chips.getByPlayerId(action_id, opts, function(error, result){
        if(error)
            body.message = '查询失败。';
        else{

            body.results = result.list;
            var total = page_total(result.total);
            body.url = page_url(total, index, opts)
        }

        body.opts = opts;

        res.render('game_logs/chips', body);
    });
}

function tasks(req, res, action_id){
    var index = parseInt(req.query.page_no) || 1;
    var begin_date = req.query.begin_date;
    var end_date = req.query.end_date;
    var type = parseInt(req.query.type);
    var key = req.query.key;

    var start = (index-1)*page_size;

    var opts = {
        start : start,
        page_size : page_size,
        type : type,
        key : key
    };

    body.index = start+1;

    if(!!begin_date)
        opts.begin_date = new Date(Date.parse(begin_date));
    if(!!end_date)
        opts.end_date = new Date(Date.parse(end_date));

    bind_type(type, key, opts);


    user_task.getByPlayerId(action_id, opts, function(error, result){
        if(error)
            body.message = '查询失败。';
        else{

            body.results = result.list;
            var total = page_total(result.total);
            body.url = page_url(total, index, opts)
        }

        body.opts = opts;

        res.render('game_logs/tasks', body);
    });
}

function run(req, res, action_id){
    var index = parseInt(req.query.page_no) || 1;
    var begin_date = req.query.begin_date;
    var end_date = req.query.end_date;
    var type = parseInt(req.query.type);
    var key = req.query.key;

    var start = (index-1)*page_size;

    var opts = {
        start : start,
        page_size : page_size,
        type : type,
        key : key
    };

    body.index = start+1;

    if(!!begin_date)
        opts.begin_date = new Date(Date.parse(begin_date));
    if(!!end_date)
        opts.end_date = new Date(Date.parse(end_date));

    bind_type(type, key, opts);


    user_run.getByPlayerId(action_id, opts, function(error, result){
        if(error)
            body.message = '查询失败。';
        else{

            body.results = result.list;
            var total = page_total(result.total);
            body.url = page_url(total, index, opts)
        }

        body.opts = opts;

        res.render('game_logs/run', body);
    });
}

function deposit(req, res, action_id){
    var index = parseInt(req.query.page_no) || 1;
    var begin_date = req.query.begin_date;
    var end_date = req.query.end_date;
    var type = parseInt(req.query.type);
    var key = req.query.key;

    var start = (index-1)*page_size;

    var opts = {
        start : start,
        page_size : page_size,
        type : type,
        key : key
    };

    body.index = start+1;

    if(!!begin_date)
        opts.begin_date = new Date(Date.parse(begin_date));
    if(!!end_date)
        opts.end_date = new Date(Date.parse(end_date));

    bind_type(type, key, opts);


    user_deposit.getByPlayerId(action_id, opts, function(error, result){
        if(error)
            body.message = '查询失败。';
        else{

            body.results = result.list;
            var total = page_total(result.total);
            body.url = page_url(total, index, opts)
        }

        body.opts = opts;

        var route = '';
        switch(action_id){
            case 2001:
                route = 'game_logs/deposit_enter';
                break;
            case 2002:
                route = 'game_logs/deposit_change';
                break;
            case 2003:
            case 2004:
                route = 'game_logs/deposit_start';
                break;
            case 2005:
                route = 'game_logs/deposit_hp';
                break;
            case 2006:
            case 2007:
                route = 'game_logs/deposit_changehp';
                break;
            case 2008:
                route = 'game_logs/deposit_leave';
                break;
            default:
                route = 'game_logs/deposit_enter';
        }

        res.render(route, body);
    });
}

function trusteeship(req, res, action_id){
    var index = parseInt(req.query.page_no) || 1;
    var begin_date = req.query.begin_date;
    var end_date = req.query.end_date;
    var type = parseInt(req.query.type);
    var key = req.query.key;

    var start = (index-1)*page_size;

    var opts = {
        start : start,
        page_size : page_size,
        type : type,
        key : key
    };

    body.index = start+1;

    if(!!begin_date)
        opts.begin_date = new Date(Date.parse(begin_date));
    if(!!end_date)
        opts.end_date = new Date(Date.parse(end_date));

    bind_type(type, key, opts);


    user_trusteeship.getByPlayerId(action_id, opts, function(error, result){
        if(error)
            body.message = '查询失败。';
        else{

            body.results = result.list;
            var total = page_total(result.total);
            body.url = page_url(total, index, opts)
        }

        body.opts = opts;

        res.render('game_logs/trusteeship', body);
    });
}

function match(req, res, action_id){
    var index = parseInt(req.query.page_no) || 1;
    var begin_date = req.query.begin_date;
    var end_date = req.query.end_date;
    var type = parseInt(req.query.type);
    var key = req.query.key;
    var match_type = parseInt(req.query.match_type);
    var match_key = req.query.match_key;

    var loop_id = parseInt(req.query.loop_id) || -1;
    var round_id = parseInt(req.query.round_id) || -1;

    var start = (index-1)*page_size;

    var opts = {
        start : start,
        page_size : page_size,
        type : type,
        key : key,
        match_type : match_type,
        match_key : match_key
    };

    body.index = start+1;

    if(!!begin_date)
        opts.begin_date = new Date(Date.parse(begin_date));
    if(!!end_date)
        opts.end_date = new Date(Date.parse(end_date));
    if(loop_id != -1)
        opts.loop_id = loop_id;
    if(round_id != -1)
        opts.round_id = round_id;

    bind_type(type, key, opts);
    bind_type(match_type, match_key, opts);

    console.log(opts);

    user_match.getByPlayerId(action_id, opts, function(error, result){
        if(error)
            body.message = '查询失败。';
        else{

            body.results = result.list;
            var total = page_total(result.total);
            body.url = page_url(total, index, opts)
        }

        body.opts = opts;

        var route = '';
        switch(action_id){
            case 2009:
                route = 'game_logs/match_apply';
                break;
            case 2010:
                route = 'game_logs/match_cancel';
                break;
            case 2011:
                route = 'game_logs/match_enter';
                break;
            case 2012:
                route = 'game_logs/match_matching';
                break;
            case 2013:
            case 2014:
            case 2015:
                route = 'game_logs/match_start';
                break;
            case 2016:
                route = 'game_logs/match_rewards';
                break;
            default:
                route = 'game_logs/match_apply';
        }

        res.render(route, body);
    });
}

function bind(req, res, action_id){
    var index = parseInt(req.query.page_no) || 1;
    var begin_date = req.query.begin_date;
    var end_date = req.query.end_date;
    var type = parseInt(req.query.type);
    var key = req.query.key;

    var start = (index-1)*page_size;

    var opts = {
        start : start,
        page_size : page_size,
        type : type,
        key : key
    };

    body.index = start+1;

    if(!!begin_date)
        opts.begin_date = new Date(Date.parse(begin_date));
    if(!!end_date)
        opts.end_date = new Date(Date.parse(end_date));

    bind_type(type, key, opts);

    membership_bind.getAction(action_id, opts, function(error, result){
        if(error)
            body.message = '查询失败。';
        else{
            body.results = result.list;
            var total = page_total(result.total);
            body.url = page_url(total, index, opts)
        }

        body.opts = opts;

        res.render('game_logs/bind', body);
    });
}

function bind_type(type, key, opts){
    if(!!key){
        switch(type){
            case 1:
                opts.account = key;
                break;
            case 2:
                if(parseInt(key))
                    opts.player_id = parseInt(key);
                break;
            case 3:
                opts.nickname = key;
                break;
            case 11:
                opts.region_name = key;
                break;
            case 12:
                if(parseInt(key))
                    opts.region_id = parseInt(key);
                break;
        }
    }
};

function page_total(count){
    return (count%page_size==0)?(count/page_size):(parseInt(count/page_size)+1);
}

function page_url(total, index, opts){
    var i= 0,j=0;
    if(total<=10){
        i=1;
        j=total;
    }
    else{
        if(index-5<=0){
            i=1;
            j=10;
        }
        else if(index+5>=total){
            i=total-10;
            j=total;
        }
        else{
            i=index-5;
            j=index+5;
        }
    }

    var condition = 'action='+body.action;
    if(!!opts.begin_date)
        condition+='&begin_date='+opts.begin_date.format('yyyy-MM-dd hh:mm:ss');
    if(!!opts.end_date)
        condition+='&end_date='+opts.end_date.format('yyyy-MM-dd hh:mm:ss');
    if(!!opts.key){
        condition+='&type='+opts.type;
        condition+='&key='+opts.key;
    }

    var url = '[ 共'+total+'页 <a href="/game_logs/search?'+condition+'&page_no=1">首页</a> ';
    for(var k=i; k<=j; k++){
        if(k==index)
            url += ' ' + k;
        else
            url+=' <a href="/game_logs/search?'+condition+'&page_no='+k+'">'+k+'</a> ';
    }

    url += ' <a href="/game_logs/search?'+condition+'&page_no='+total+'">尾页</a>';
    url += ' 当前第'+index+'页]';
    return url;
}

function element(rewards){
    var name = '';
    if(rewards!=''){
        var elements = JSON.parse(rewards);

        elements.forEach(function(element){
            switch(element.element_id){
                case 10001:
                    name+='｜金贝：'+element.count;
                    break;
                case 10002:
                    name+='｜通宝卡：'+element.count;
                    break;
                case 10003:
                    name+='｜失败：'+element.count;
                    break;
                case 10004:
                    name+='｜胜利：'+element.count;
                    break;
            }
        });
    }

    return name + '|';
}

function render(res, route, message){
    body.message = message;
    res.render(route, body);
};