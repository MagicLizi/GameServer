/**
 * Created with JetBrains WebStorm.
 * User: apple
 * Date: 14-8-8
 * Time: 下午2:41
 * To change this template use File | Settings | File Templates.
 */
var date = require('../../util/date');
var redeemProvider = require('../../data_provider/dao_provider/redeemCode/redeemCode');
var itemSanctionProvider = require('../../data_provider/dao_provider/item/itemSanction');
var dataProvider = require('../../data_provider/dao_provider/system/config');
var async = require('async');

var body = {
    title: '兑换码管理',
    message: null
};

exports.index = function (request, response) {
    body.message = null;
    body.results = body.results ? body.results : [];
    body.results2 = body.results2 ? body.results2 : [];

    body.code = body.code ? body.code : '';
    body.package_id = body.package_id ? body.package_id : '';
    response.render('redeemCode/search', body);
};

exports.searchPackage = function (req, res) {
    body.message = null;
    var package_id = req.body.package_id;

    if (package_id == '') {
        body.message = '请输入礼包id';
        body.results = [];
        res.render('redeemCode/search', body);
        return;
    }
    dataProvider.getConfig("packages", function (error, data) {
        var packages = data.config;
        packages = JSON.parse(packages);
        redeemProvider.getRedeemsWithPackageID(package_id, function (error, results) {
            console.log(results);
            var success_count = [];
            var tasks = [];
            results.forEach(function (redeem) {
                tasks.push(function (cb) {
                    redeemProvider.getRedeemUsedSuccessCount(redeem.redeem_code, function (error, result) {
                        redeem.used_count = result;
                        cb();
                    })
                });
            });
            async.series(tasks, function (error) {
                body.results2 = results;
                body.results = [];
                body.package_id = package_id;
                exports.index(req, res);
            });
        });
    });
}

exports.search = function (req, res) {
    body.message = null;
    var code = req.body.code;
    console.log("code" + code);
    if (code == '') {
        body.message = '请输入激活码信息.';
        body.results = [];
        res.render('redeemCode/search', body);
        return;
    }
    dataProvider.getConfig("packages", function (error, data) {
        var packages = data.config;
        packages = JSON.parse(packages);

        redeemProvider.getRedeemUsedHistory(code, function (error, results) {
            body.results = results;
            body.results2 = [];
            body.code = code;
            setName(results, packages);
            exports.index(req, res);
        });
    });
}

function setName(results, items) {
    results.forEach(function (item) {
        if (item) {
            items.forEach(function (_item) {
                if (item.package_id == _item.package_id) {
                    item.package_name = _item.name;
                }
            });
        }
    });
}