/**
 * Created with JetBrains WebStorm.
 * User: andy.chen
 * Date: 14-5-22
 * Time: 下午12:13
 * To change this template use File | Settings | File Templates.
 */

var date = require('../util/date');
var accountProvider = require('../data_provider/dao_provider/membership/sanction');
var roleProvider = require('../data_provider/dao_provider/player/sanction');
var robotProvider = require('../data_provider/dao_provider/player/robotsanction');
var itemProvider = require('../data_provider/dao_provider/item/itemSanction');
var dataProvider = require('../data_provider/dao_provider/system/config');

var body = {
    title : '日志',
    results : [],
    message : null,
    begin_date : null,
    end_date : null
};

exports.index = function(req, res){
    body.message = null;
    var route = 'log/index';
    body.result = {};
    res.render(route, body);
};

exports.account = function(req, res){
    var begin_date = req.query.sd || '';
    var end_date = req.query.ed || '';

    var page_no = parseInt(req.query.page_no) || 1;
    var page_start=(page_no-1)*20;

    body.begin_date = begin_date;
    body.end_date = end_date;

    accountProvider.getAllList(begin_date, end_date, page_start, 20, function(error, results){
        if(error)
            body.results = [];
        else
            body.results = results;

        accountProvider.getAllCount(begin_date, end_date, function(error,result){
            if(!error)
                body.count = (result.count%20==0)?(result.count/20):(result.count/20+1);

            body.count = (body.count<=0?1:body.count);

            res.render('log/account', body);
        });
    });
};

exports.role = function(req, res){
    var begin_date = req.query.sd || '';
    var end_date = req.query.ed || '';

    var page_no = parseInt(req.query.page_no) || 1;
    var page_start=(page_no-1)*20;

    body.begin_date = begin_date;
    body.end_date = end_date;

    roleProvider.getAllList(begin_date, end_date, page_start, 20, function(error, results){
        if(error)
            body.results = [];
        else
            body.results = results;

        roleProvider.getAllCount(begin_date, end_date, function(error,result){
            if(!error)
                body.count = (result.count%20==0)?(result.count/20):(result.count/20+1);

            body.count = (body.count<=0?1:body.count);

            res.render('log/role', body);
        });
    });
};

exports.robot = function(req, res){
    var begin_date = req.query.sd || '';
    var end_date = req.query.ed || '';

    var page_no = parseInt(req.query.page_no) || 1;
    var page_start=(page_no-1)*20;

    body.begin_date = begin_date;
    body.end_date = end_date;

    robotProvider.getAllList(begin_date, end_date, page_start, 20, function(error, results){
        if(error)
            body.results = [];
        else
            body.results = results;

        robotProvider.getAllCount(begin_date, end_date, function(error,result){
            if(!error)
                body.count = (result.count%20==0)?(result.count/20):(result.count/20+1);

            body.count = (body.count<=0?1:body.count);

            res.render('log/robot', body);
        });
    });
};

function render(res, route, message){
    body.message = message;
    res.render(route, body);
};

/*
function where(begin_date, end_date, page_start, page_size){
    var param = {
        sql : ' LIMIT ?,?',
        value : [page_start, page_size]
    };

    if(begin_date!=''&&end_date!=''){
        param = {
            sql : ' WHERE create_date>=? AND create_date<=? LIMIT ?,?',
            value : [begin_date, end_date, page_start, page_size]
        };
    }
    else if(begin_date!=null){
        param = {
            sql : '  WHERE create_date>=? LIMIT ?,?',
            value : [begin_date, page_start, page_size]
        };
    }
    else if(end_date!=null){
        param = {
            sql : ' WHERE create_date<=? LIMIT ?,?',
            value : [end_date, page_start, page_size]
        };
    }

    return param;
}
*/
function setName(results, items) {
    results.forEach(function (result) {
        items.forEach(function (item) {
            if (item.item_id == result.item_id) {
                result.item_name = "[" + item.name + "]";
            }
        })
    })
}
exports.item = function(req, res){
    var begin_date = req.query.sd || '';
    var end_date = req.query.ed || '';

    var page_no = parseInt(req.query.page_no) || 1;
    var page_start=(page_no-1)*20;

    body.begin_date = begin_date;
    body.end_date = end_date;
    dataProvider.getConfig("item", function (error, data) {
        var items = data.config;
        items = JSON.parse(items);
        itemProvider.getList(begin_date, end_date, page_start, 20, function(error, results){
            if(error)
                body.results = [];
            else{
                setName(results, items);
                body.results = results;
            }


            itemProvider.getAllCount(begin_date, end_date, function(error,result){
                if(!error)
                    body.count = (result.count%20==0)?(result.count/20):(result.count/20+1);

                body.count = (body.count<=0?1:body.count);

                res.render('log/item', body);
            });
        });
    });

};