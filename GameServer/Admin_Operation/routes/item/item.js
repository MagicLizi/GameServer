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
    title: '道具管理',
    message: null
};

function setName(results, items) {
    results.forEach(function (result) {
        items.forEach(function (item) {
            if (item.item_id == result.item_id) {
                result.name = "[" + item.name + "]";
            }
        })
    })
}

exports.index = function (request, response) {
    body.message = null;
    dataProvider.getConfig("item", function (error, data) {
        if(data)
        {
            var items = data.config;
            console.log(data);
            items = JSON.parse(items);
            itemProvider.getUserItems(request.query.user_id, function (error, results) {
                setName(results, items);
                body.results = results ? results : [];
                body.uid = request.query.user_id ? request.query.user_id:body.uid;
                response.render('item/index', body);
            });
        }
    });
};

exports.edit = function (req, res) {
    var method = req.method;
    var route = 'item/index';
    var item_id = req.query.item_id;
    var user_id = req.query.user_id;
    var item_count = req.query.item_count;
    var description = req.query.description;
    if (!description) {
        body.message = '请输入操作原因';
        res.render(route, body);
        return;
    }
    var regex1 = /^[0-9]{1,}$/;
    if (!regex1.test(item_id)) {
        body.message = 'id必需为数字.';
        res.render(route, body);
        return;
    }
    if (!regex1.test(user_id)) {
        body.message = '用户id必需为数字.';
        res.render(route, body);
        return;
    }
    if (!regex1.test(item_count)) {
        body.message = '数量必需为数字.';
        res.render(route, body);
        return;
    }

    itemProvider.updateItem({user_id: user_id, item_id: item_id, item_count: item_count}, function (error) {
        if (error) {
            body.message = '修改失败';
            res.render(route, body);
            return;
        }
        var sanction = {
            user_id: user_id,
            item_id: item_id,
            item_count: item_count,
            create_date: new Date(),
            description: description,
            admin: req.session.user.account
        };
        itemSanctionProvider.add(sanction, function (error) {
            console.log(error);
        });
        body.uid = user_id;
        //req.query.user_id = user_id;
        exports.index(req, res);
    });
};

exports.add = function (req, res) {
    var route = 'item/index';
    var item_id = req.body.item_id;
    var user_id = req.body.user_id;
    var item_count = req.body.item_count;
    var description = req.body.description;
    console.log(req.body);
    if (!description) {
        body.message = '请输入操作原因';
        res.render(route, body);
        return;
    }
    var regex1 = /^[0-9]{1,}$/;
    if (!regex1.test(item_id)) {
        body.message = 'id必需为数字.';
        res.render(route, body);
        return;
    }
    if (!regex1.test(user_id)) {
        body.message = '用户id必需为数字.';
        res.render(route, body);
        return;
    }
    if (!regex1.test(item_count)) {
        body.message = '数量必需为数字.';
        res.render(route, body);
        return;
    }

    itemProvider.updateItem({user_id: user_id, item_id: item_id, item_count: item_count}, function (error) {
        if (error) {
            body.message = '修改失败';
            res.render(route, body);
            return;
        }
        var sanction = {
            user_id: user_id,
            item_id: item_id,
            item_count: item_count,
            create_date: new Date(),
            description: description,
            admin: req.session.user.account
        };
        itemSanctionProvider.add(sanction, function () {
        });
        body.uid = user_id;
        req.query.user_id = user_id;
        exports.index(req, res);
    });
};