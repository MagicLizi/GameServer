/**
 * Created with JetBrains WebStorm.
 * User: apple
 * Date: 14-8-1
 * Time: 下午2:31
 * To change this template use File | Settings | File Templates.
 */
var fs = require('fs');

var body = {
    title: '道具',
    results: [],
    message: null
};

var route = 'config/formulas';
var path = './config/gameConfig/items/formulas.json';
var dataProvider = require('../../data_provider/dao_provider/system/config');
var key = 'formulas';

function render(res, route, message) {
    body.message = message;
    res.render(route, body);
};

exports.index = function (req, res) {
    var method = req.method;
    body.message = null;
    dataProvider.getConfig("item", function (error, data) {
        var items = data.config;
        items = JSON.parse(items);
        items.push({item_id:10001, name:"金贝"});

        dataProvider.getConfig(key, function (error, data) {
            if (error)
                return render(res, route, '配置文件读取失败.');
            console.log(data);
            var results = null;
            if (data == null) {
                data = {key_id: key, config: []};
                results = data.config;
            }
            else {
                results = JSON.parse(data.config);
            }

            console.log(results);

            if (method === 'POST') {
                var formula_id = req.body.formula_id;
                var origin_item_id = req.body.origin_item_id;
                var origin_item_count = req.body.origin_item_count;
                var target_item_id = req.body.target_item_id;
                var target_item_count = req.body.target_item_count;
                var begin_date = req.body.begin_date;
                var end_date = req.body.end_date;
                var is_valid = req.body.is_valid == "on"?true:false;
                var type = req.body.type;
                console.log("is_valid" + is_valid);
                var regex1 = /^[0-9]{1,}$/;
                if (!regex1.test(formula_id) || !regex1.test(origin_item_id) || !regex1.test(target_item_id))
                    return render(res, route, 'id必需为数字.');
                if (!regex1.test(origin_item_count) || !regex1.test(target_item_count))
                    return render(res, route, '数量必需为数字.');
                var i = 0;
                for (; i < results.length; i++) {
                    var result = results[i];
                    if (result.formula_id == formula_id) {
                        result.origin_item_id = origin_item_id;
                        result.origin_item_count = origin_item_count;
                        result.target_item_id = target_item_id;
                        result.target_item_count = target_item_count;
                        result.type = type;
                        result.begin_date = begin_date;
                        result.end_date = end_date;
                        result.is_valid = is_valid;
                        break;
                    }
                }

                if (i >= results.length) {
                    results.push({
                        formula_id: formula_id,
                        origin_item_id: origin_item_id,
                        origin_item_count: origin_item_count,
                        target_item_id: target_item_id,
                        target_item_count: target_item_count,
                        type: type,
                        begin_date: begin_date,
                        end_date: end_date,
                        is_valid: is_valid
                    });
                }
                console.log(results);
                data.config = JSON.stringify(results);
                dataProvider.editConfig(data, function (error) {
                    if (error)
                        return render(res, route, '配置文件写入失败.');
                    body.message = '设置成功.';
                    body.results = results;
                    body.items = items;
                    setName(results, items);
                    res.render(route, body);
                });
            }
            else {
                var id = req.query.id;
                if (parseInt(id) > 0) {
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].formula_id == parseInt(id)) {
                            results.splice(i, 1);
                            break;
                        }
                    }
                    data.config = JSON.stringify(results);

                    dataProvider.editConfig(data, function (error) {
                        if (error)
                            return render(res, route, '配置文件写入失败.');

                        body.message = '删除成功.';
                        body.results = results;
                        body.items = items;
                        setName(results, items);
                        res.render(route, body);
                    });
                }
                else {
                    body.results = results;
                    body.items = items;
                    setName(results, items);
                    res.render(route, body);
                }
            }
        });
    });
}


function setName(results, items) {
    console.log(results);
    results.forEach(function (formula) {
        if (formula) {
            items.forEach(function (_item) {
                if (formula.origin_item_id == _item.item_id) {
                    formula.origin_item_name = "[" + _item.name + "]";
                }
                if (formula.target_item_id == _item.item_id) {
                    formula.target_item_name = "[" + _item.name + "]";
                }
            })
        }
    })
}