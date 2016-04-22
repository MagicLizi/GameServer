/**
 * Created with JetBrains WebStorm.
 * User: apple
 * Date: 14-8-7
 * Time: 下午4:52
 * To change this template use File | Settings | File Templates.
 */

var date = require('../../util/date');
var redeemProvider = require('../../data_provider/dao_provider/redeemCode/redeemCode');
var itemSanctionProvider = require('../../data_provider/dao_provider/item/itemSanction');
var dataProvider = require('../../data_provider/dao_provider/system/config');
var async = require('async');
var excel = require('excel-export');

var body = {
    title: '兑换码管理',
    message: null
};

function getRedeemCode() {
    var str = 'abcdefghijklmnopqrstuvwxyz0123456789';
    console.log(str[3]);
    var length = 8;
    var code = '';
    for (var i = 0; i < 8; i++) {
        code += str[Math.floor(Math.random() * str.length)];
    }
    return code;
}

function setName(results, items) {
    results.forEach(function (item) {
        if (item) {
            items.forEach(function (_item) {
                if (item.package_id == _item.package_id) {
                    item.name = _item.name;
                }
            })
        }
    });
}

exports.index = function (request, response) {
    body.message = null;
    var page_no = parseInt(request.query.page_no) || 1;
    var page_start = (page_no - 1) * 20;

    dataProvider.getConfig("packages", function (error, data) {
        if(!data) return;
        var packages = data.config;
        packages = JSON.parse(packages);
        redeemProvider.getRedeemCodes(page_start, 20, function (error, results) {
            redeemProvider.getAllCount(function (error, result) {
                body.results = results ? results : [];
                body.packages = packages;
                body.count = (result.count % 20 == 0) ? (result.count / 20) : (result.count / 20 + 1);
                setName(body.results, packages);
                response.render('redeemCode/index', body);
            })

        });
    });
};

exports.deleteCode = function (req, res) {
    var package_id = req.query.package_id || req.body.package_id;
    redeemProvider.deleteCode(package_id, function(error, results){
        if (error) {
            body.message = '删除错误！';
            res.render(route, body);

        }
        else {
            body.message = '删除成功';
            exports.index(req, res);
        }

    });
}

exports.excel =  function (req, res) {
    var package_id = req.query.package_id || req.body.package_id;
    console.log(package_id);
    var conf = {};
    conf.cols = [
        {
            caption:'激活码',
            type:'string'
        },
        {
            caption:'状态',
            type:'number'
        },
        {
            caption:'激活人',
            type:'number'
        },
        {
            caption:'激活时间',
            type:'string'
        }
    ];
    conf.rows = [];
    redeemProvider.excel(package_id, function(error, results){
        console.log("results:" + JSON.stringify(results));
        if(!error){
            results.forEach(function(result){
                var data = [];
                data.push(result.redeem_code);
                data.push(result.uid?1:0);
                data.push(result.uid);
                data.push(result.use_date?result.use_date.format("yyyy-MM-dd hh:mm:ss"):"");
                conf.rows.push(data);
            });
        }
        create_excel(res, conf);
    });
}

exports.update = function (req, res) {
    var method = req.method;
    var route = 'redeemCode/index';
    var redeem_code = req.query.redeem_code || req.body.redeem_code;
    var package_id = req.query.package_id || req.body.package_id;
    var count = req.query.count || req.body.count;
    var begin_date = req.query.begin_date || req.body.begin_date;
    var end_date = req.query.end_date || req.body.end_date;
    var type = req.query.type || req.body.type;

    console.log("type:" + type);
    package_id = parseInt(package_id);
    count = parseInt(count);
    type = parseInt(type);
    begin_date = new Date(begin_date);
    end_date = new Date(end_date);
    console.log("type:" + type);
    redeemProvider.updateRedeem({redeem_code: redeem_code, package_id: package_id, count: count, begin_date: begin_date, end_date: end_date, type: type}, function (error) {
        if (error) {
            body.message = '出错了';
            res.render(route, body);
        }
        else {
            exports.index(req, res);
        }
    });
}

exports.edit = function (req, res) {
    var method = req.method;
    var route = 'redeemCode/index';
    var redeem_code_count = req.query.redeem_code_count || req.body.redeem_code_count;
    var package_id = req.query.package_id || req.body.package_id;
    var count = req.query.count || req.body.count;
    var begin_date = req.query.begin_date || req.body.begin_date;
    var end_date = req.query.end_date || req.body.end_date;
    var type = req.query.type || req.body.type;
    var regex1 = /^[0-9]{1,}$/;
    if (!regex1.test(package_id)) {
        body.message = '礼包id必需为数字.';
        res.render(route, body);
        return;
    }
    if (!regex1.test(count)) {
        body.message = '数量必需为数字.';
        res.render(route, body);
        return;
    }

    if (count > 500 || redeem_code_count > 500) {
        body.message = '数量不能超过500';
        res.render(route, body);
        return;
    }
    var tasks = [];
    var success = 0;
    for (var i = 0; i < redeem_code_count; i++) {
        tasks.push(function (cb) {
            redeemProvider.insertRedeem({redeem_code: getRedeemCode(), package_id: package_id, count: count, begin_date: begin_date, end_date: end_date, type: type}, function (error) {
                if (error) {

                }
                else {
                    success++;
                }
                cb();
            });
        });
    }
    async.series(tasks, function (error) {
        if (success < redeem_code_count) {
            body.message = '成功' + success + '个   ' + '失败' + (redeem_code_count - success) + '个';
            res.render(route, body);
        }
        else {
            exports.index(req, res);
        }
    });
};

exports.delete = function (req, res) {
    var method = req.method;
    var route = 'redeemCode/index';
    var redeem_code = req.query.redeem_code || req.body.redeem_code;
    var package_id = req.query.package_id || req.body.package_id;
    var count = req.query.count || req.body.count;

    redeemProvider.deleteRedeem(redeem_code, function (error) {
        if (error) {
            body.message = '修改失败';
            res.render(route, body);
            return;
        }
        exports.index(req, res);
    });
};


function replay(req, res, callback){
    var page_no = parseInt(req.query.page_no) || 1;
    var start = (page_no - 1) * 20;

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

function create_excel(res, conf){
    var now = new Date();
    var name = now.format('yyyyMMddhhmmss');
    var result = excel.execute(conf);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader("Content-Disposition", "attachment; filename=" + name + ".xlsx");
    res.end(result, 'binary');
}