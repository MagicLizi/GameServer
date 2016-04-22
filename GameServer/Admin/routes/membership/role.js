/**
 * Created with JetBrains WebStorm.
 * User: andy.chen
 * Date: 14-5-22
 * Time: 下午12:13
 * To change this template use File | Settings | File Templates.
 */

var date = require('../../util/date');
var sqlClient1 = require('../../data_provider/dao/sqlClient').tinygame;
var sqlClient2 = require('../../data_provider/dao/sqlClient').tinyadmin;
var roleProvider = require('../../data_provider/dao_provider/player/role');
var sanctionProvider = require('../../data_provider/dao_provider/player/sanction');
var body = {
    title : '角色管理',
    result : null,
    results : [],
    message : null,
    id : 0,
    count : 1
};

exports.index = function(req, res){
    body.message = null;
    var route = 'role/index';
    body.result = {};
    res.render(route, body);
};

exports.search = function(req, res){
    body.message = null;
    var route = 'role/index';
    var key = req.body.name;
    var type = req.body.type;
    if(key=='')
        return render(res, route, '请输入角色信息.');

    var searchFunc = null;
    if(type == 1)
        searchFunc = roleProvider.getPlayerById;
    else
        searchFunc = roleProvider.getPlayerByName;

    searchFunc(key, function(error, result){
        if(error)
            return render(res, route, '查询失败.');

        body.result = result || {};
        res.render(route, body);
    });
};

exports.sanction = function(req, res){
    body.message = null;
    var route = 'role/sanction';

    var id = req.query.id;
    if(!parseInt(id)){
        res.redirect('role');
        return;
    }

    body.id = id;

    var page_no = parseInt(req.query.page_no) || 1;
    var page_start=(page_no-1)*20;

    sanctionProvider.getAllSanction(id,page_start,20,function(error, results){
        if(error)
            body.results = [];
        else
            body.results = results;

        sanctionProvider.getCount(id,function(error,result){
            if(!error)
                body.count = (result.count%20==0)?(result.count/20):(result.count/20+1);

            body.count = (body.count<=0?1:body.count);

            res.render(route, body);
        });
    });
};

exports.operation = function(req, res){
    var route = 'role/sanction';

    var id = req.query.id;

    body.id = id;

    var type = req.body.type;
    var value = req.body.value;
    var reason = req.body.reason;

    if(!parseInt(value))
        return render(res, route, '制裁值必需为数字.');

    if(reason=='')
        return render(res, route, '请输入缘由.');

    var property_name = '';
    if(type==1)
        property_name='chips';
    else if(type==2)
        property_name='diamond';
    else
        property_name='victory';

    var model = {
        type : type,
        value : value,
        player_id : id,
        name : req.session.user.name,
        reason : reason,
        create_date : new Date()
    };

    var execSqlCommands1 = [],execSqlCommands2 = [];

    execSqlCommands1.push(roleProvider.updateQuery(id, property_name, value));

    execSqlCommands2.push(sanctionProvider.insertQuery(model));

    sqlClient1.transaction(execSqlCommands1, function(error, result){
        if(error)
            return render(res, route, '处理失败.');

        sqlClient2.transaction(execSqlCommands2, function(error, result){
            if(error)
                return render(res, route, '处理失败.');

            body.message = '处理成功.';
            res.render(route, body);
        });
    });
};

function render(res, route, message){
    body.message = message;
    res.render(route, body);
};