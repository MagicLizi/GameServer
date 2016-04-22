/**
 * Created with JetBrains WebStorm.
 * User: apple
 * Date: 14-7-14
 * Time: 上午11:11
 * To change this template use File | Settings | File Templates.
 */
var date = require('../../util/date');
var itemProvider = require('../../data_provider/dao_provider/item/item');
var itemSanctionProvider = require('../../data_provider/dao_provider/item/itemSanction');
var dataProvider = require('../../data_provider/dao_provider/system/config');
var body = {
    title: '兑奖信息管理',
    message: null
};

exports.index = function (req, res) {
    var begin_date = req.query.sd || '';
    var end_date = req.query.ed || '';
    var type = req.query.select || 2;
    var page_no = parseInt(req.query.page_no) || 1;
    var page_start = (page_no - 1) * 20;

    body.begin_date = begin_date;
    body.end_date = end_date;
    body.type = parseInt(type);
    console.log("!!!!!" + type);
    dataProvider.getConfig("item", function (error, data) {
        if(!data) return;
        var items = data.config;
        items = JSON.parse(items);
        itemProvider.getItemUseList(begin_date, end_date, page_start, 20, type, function (error, results) {
            if (error)
                body.results = [];
            else
                body.results = results;
            setName(results, items);
            itemProvider.getAllCount(begin_date, end_date, type, function (error, result) {
                if (!error)
                    body.count = (result.count % 20 == 0) ? (result.count / 20) : (result.count / 20 + 1);
                body.count = (body.count <= 0 ? 1 : body.count);
                res.render('itemUse/index', body);
            });
        });
    });
};

function setName(results, items) {
    console.log(results);
    results.forEach(function (item) {
        if (item) {
            items.forEach(function (_item) {
                if (_item.item_id == item.item_id) {
                    item.item_name = "[" + _item.name + "]";
                }
            })
        }
    })
}