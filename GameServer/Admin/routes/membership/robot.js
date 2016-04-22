/**
 * Created with JetBrains WebStorm.
 * User: Andy.Chen
 * Date: 14-7-16
 * Time: 下午4:07
 * To change this template use File | Settings | File Templates.
 */
var date = require('../../util/date');
var sqlClient = require('../../data_provider/dao/sqlClient').tinygame;
var sqlClient1 = require('../../data_provider/dao/sqlClient').tinyadmin;
var robotProvider = require('../../data_provider/dao_provider/player/robot');
var excel = require('excel-export');
var sanctionProvider = require('../../data_provider/dao_provider/player/robotsanction');
var page_size = 20;

var body = {
    title : '机器人管理',
    results : [],
    message : null,
    opts : {},
    url : null
};

exports.index = function(req, res){
    show(req, res);
};

function show(req, res){
    body.message = null;
    body.results = [];
    body.url = null;

    replay(req, res, function(result){
        var search = result.search;
        var page_no = result.page_no;
        var start = result.start;

        if(search == 1){
            var opts = bind_type(body.opts);
            opts.page_size = page_size;
            opts.start = start;

            robotProvider.getList(opts, function(error, result){
                if(!error){
                    body.results = result.list;
                    var total = page_total(result.total);
                    body.url = page_url(total, page_no, body.opts)
                }
                res.render('robot/index', body);
            });
        }
        else
            res.render('robot/index', body);
    });
}

exports.active = function(req, res){
    replay(req, res, function(result){
        var id = req.query.id || '';
        var st = req.query.st || 0;
        var execSqlCommands = [];
        var ids = id.split(',');
        var uids = [];
        ids.forEach(function(player_id){
            if(parseInt(player_id)>0){
                execSqlCommands.push(robotProvider.updateStatus(player_id, st));
                uids.push(player_id);
            }
        });

        if(execSqlCommands.length>0){
            sqlClient.transaction(execSqlCommands, function(error, results){

                var execSqlCommands1 = [];
                body.results.forEach(function(item){
                    uids.forEach(function(uid){
                        if(uid==item.player_id){
                            execSqlCommands1.push(sanctionProvider.insertQuery({
                                player_id : item.player_id,
                                nickname : item.nickname,
                                chips : item.chips,
                                create_date : new Date(),
                                name : req.session.user.name,
                                type : st==0?1:0
                            }));
                        }
                    });

                });

                if(execSqlCommands.length>0){
                    sqlClient1.transaction(execSqlCommands1, function(error, results){
                        show(req, res);
                    });
                }
                else
                    show(req, res);
            });
        }
        else
            show(req, res);
    });

};


exports.excel = function(req, res){
    var conf ={};
    conf.cols = [
        {
            caption:'ID',
            type:'string'
        },
        {
            caption:'昵称',
            type:'string'
        },
        {
            caption:'金贝数',
            type:'string'
        },
        {
            caption:'使用状态',
            type:'string'
        },
        {
            caption:'激活状态',
            type:'string'
        }
    ];
    conf.rows = [];

    replay(req, res, function(result){
        var search = result.search;

        if(search == 1){
            var opts = bind_type(body.opts);
            robotProvider.excel(opts, function(error, results){
                if(!error){
                    results.forEach(function(result){
                        var data = [];
                        data.push(result.player_id);
                        data.push(result.nickname);
                        data.push(result.chips);
                        data.push(result.status==2?'未激活':'已激活');
                        data.push(result.status==2?'':result.status==0?'空闲':'占用');

                        conf.rows.push(data);
                    });
                }
                create_excel(res, conf);
            });
        }
        else
            create_excel(res, conf);
    });
};


function create_excel(res, conf){
    var now = new Date();
    var name = now.format('yyyyMMddhhmmss');
    var result = excel.execute(conf);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader("Content-Disposition", "attachment; filename=" + name + ".xlsx");
    res.end(result, 'binary');
}

function replay(req, res, callback){
    var page_no = parseInt(req.query.page_no) || 1;
    var start = (page_no - 1) * page_size;

    var search = parseInt(req.query.search) || 0;
    var status = parseInt(req.query.status);
    var chips_min = parseInt(req.query.chips_min);
    var chips_max = parseInt(req.query.chips_max);

    body.opts = {
        status : status,
        chips_min : chips_min,
        chips_max : chips_max,
        page_no : start
    };

    callback({
        search : search,
        page_no : page_no,
        start : start
    });
};

function bind_type(opts){
    var result = {
        status : opts.status
    };

    if(opts.chips_min>=0){
        result.chips_min = opts.chips_min;
    }

    if(opts.chips_max>=0){
        result.chips_max = opts.chips_max;
    }

    return result;
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

    var condition = 'search=1';

    condition+='&status='+opts.status;
    condition+='&chips_min='+opts.chips_min;
    condition+='&chips_max='+opts.chips_max;

    var url = '[ 共'+total+'页 <a href="/robot?'+condition+'&page_no=1">首页</a> ';
    for(var k=i; k<=j; k++){
        if(k==index)
            url += ' ' + k;
        else
            url+=' <a href="/robot?'+condition+'&page_no='+k+'">'+k+'</a> ';
    }

    url += ' <a href="/robot?'+condition+'&page_no='+total+'">尾页</a>';
    url += ' 当前第'+index+'页]';

    if(total>0)
        url +=  ' [<a href="/robot_excel?'+condition+'&total='+total+'" style="color:#0000FF;">导出Excel</a>]';
    return url;
}

function render(res, route, message){
    body.message = message;
    res.render(route, body);
};