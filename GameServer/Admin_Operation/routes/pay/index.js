/**
 * Created with JetBrains WebStorm.
 * User: Andy.Chen
 * Date: 14-5-23
 * Time: 上午10:57
 * To change this template use File | Settings | File Templates.
 */
var date = require('../../util/date');
var roleProvider = require('../../data_provider/dao_provider/player/role');
var appleProvider = require('../../data_provider/dao_provider/player/pay/apple');

var body = {
    title : '支付查询',
    results : [],
    message : null,
    begin_date : null,
    end_date : null,
    type : 1,
    name : null,
    count : 1
};

exports.index = function(req, res){
    body.message = null;
    var route = 'pay/index';
    res.render(route, body);
};

exports.apple = function(req, res){
    var route = 'pay/apple';

    var type = req.query.type;
    var key = req.query.name;
    var searchFun = null;
    if(!!key && key != ''){
        if(type==1){
            if(!parseInt(key))
                return render(res, route, 'ID必需为数字.');
            searchFun = roleProvider.getPlayerById;
        }
        else
            searchFun = roleProvider.getPlayerByName;

        body.type = type;
        body.name = key;

        searchFun(key, function(error, result){
            if(error)
                return render(res, route, '查询失败.');

            if(!result)
                return render(res, route, '用户不存在.');

            search(req, res, result.player_id);
        });
    }
    else
        search(req, res, -1);
};

function search(req, res, player_id){
    body.message = null;
    var begin_date = req.query.sd || '';
    var end_date = req.query.ed || '';

    var page_no = parseInt(req.query.page_no) || 1;
    var page_start=(page_no-1)*20;

    body.begin_date = begin_date;
    body.end_date = end_date;

    appleProvider.getAllList(player_id, begin_date, end_date, page_start, 20, function(error, results){
        if(error)
            body.results = [];
        else
            body.results = results;

        appleProvider.getAllCount(player_id, begin_date, end_date, function(error,result){
            if(!error)
                body.count = (result.count%20==0)?(result.count/20):(result.count/20+1);

            body.count = (body.count<=0?1:body.count);

            res.render('pay/apple', body);
        });
    });
}

function render(res, route, message){
    body.message = message;
    res.render(route, body);
};