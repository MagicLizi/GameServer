/**
 * Created with JetBrains WebStorm.
 * User: apple
 * Date: 14-8-5
 * Time: 下午2:31
 * To change this template use File | Settings | File Templates.
 */
var fs = require('fs');

var body = {
    title: '礼包',
    results: [],
    message: null
};

var route = 'config/packages';
var path = './config/gameConfig/packages/packages.json';
var dataProvider = require('../../data_provider/dao_provider/system/config');
var key = 'packages';

function render(res, route, message) {
    body.message = message;
    res.render(route, body);
};


exports.index = function (req, res) {
    var method = req.method;
    body.message = null;
    dataProvider.getConfig("item", function (error, data) {
//        if(!data) return;
        var items = data.config;
        items = JSON.parse(items);
        dataProvider.getConfig(key, function (error, data) {
            if (error)
                return render(res, route, '配置文件读取失败.');
            var results = null;
            if (data == null) {
                data = {key_id: key, config: []};
                results = data.config;
            }
            else {
                results = JSON.parse(data.config);
            }

            if (method === 'POST') {
                var package_id = req.body.package_id;
                var name = req.body.name;
                var begin_date = req.body.begin_date;
                var end_date = req.body.end_date;
                var regex1 = /^[0-9]{1,}$/;
                var regex2 = /([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]/;
                if (!regex1.test(package_id))
                    return render(res, route, 'id必需为数字.');
                //这个正则不怎么靠谱
                var i = 0;
                for (; i < results.length; i++) {
                    var result = results[i];
                    if (result.package_id == package_id) {
                        result.name = name;
                        result.begin_date = begin_date;
                        result.end_date = end_date;
                        break;
                    }
                    if (result.name == name) {
                        return render(res, route, '礼包名称不能重复');
                        return;
                    }
                }

                if (i >= results.length) {
                    results.push({
                        package_id: package_id,
                        name: name,
                        begin_date: begin_date,
                        end_date: end_date
                    });
                }
                data.config = JSON.stringify(results);

                dataProvider.editConfig(data, function (error) {
                    if (error)
                        return render(res, route, '配置文件写入失败.');

                    body.message = '修改成功.';
                    body.results = results;
                    setName(results, items);
                    res.render(route, body);
                });
            }
            else {
                console.log("删除" + JSON.stringify(req.query));
                var id = req.query.id;
                if (parseInt(id) > 0) {
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].package_id == parseInt(id)) {
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

function setName (results, items) {
    console.log(items);
    results.forEach(function (_package) {
        if (_package && _package.items) {
            _package.items.forEach(function (item) {
                items.forEach(function (_item) {
                    if (_item.item_id == item.item_id) {
                        item.name = "[" + _item.name + "]";
                    }
                })
            })
        }
    })
}
exports.edit = function (req, res) {
    var route = 'config/packages_edit';
    body.message = null;
    var method = req.method;
    var package_id = parseInt(req.query.id);
    dataProvider.getConfig("item", function (error, data) {
        var items = data.config;
        items = JSON.parse(items);
        dataProvider.getConfig(key, function (error, data) {
            if (error) {
                logger.error(error);
                return render(res, route, '配置文件读取失败.');
            }

            var results = JSON.parse(data.config);

            var result = null;
            results.forEach(function (item) {
                if (item.package_id == package_id)
                    result = item;
            });

            if (method === 'POST') {
                var item_id = req.body.item_id;
                var item_count = req.body.item_count;

                item_id = parseInt(item_id);
                item_count = parseInt(item_count);
                result.items = result.items || [];
                var found = false;

                result.items.forEach(function (item) {
                    if (item.item_id == item_id) {
                        console.log("found!!!!!!!" + item_count);
                        item.item_count = item_count;
                        found = true;
                    }
                })
                if (!found) {
                    console.log("新增道具" + result.items.length);

                    result.items.push({
                        item_id: item_id,
                        item_count: item_count
                    })
                }
                if(result.items.length > 5) {
                    return render(res, route, '道具不得超过5种');
                }
                data.config = JSON.stringify(results);

                dataProvider.editConfig(data, function (error) {
                    if (error)
                        return render(res, route, '配置文件写入失败.');
                    body.result = result;
                    body.items = items;
                    body.package_id = package_id;
                    res.render(route, body);
                });
            }
            else {
                var item_id = req.query.item_id;
                result.items = result.items || [];
                if (parseInt(item_id) > 0) {
                    for (var i = 0; i < result.items.length; i++) {
                        if (result.items[i].item_id == parseInt(item_id)) {
                            result.items.splice(i, 1);
                            break;
                        }
                    }
                }
                data.config = JSON.stringify(results);

                dataProvider.editConfig(data, function (error) {
                    if (error)
                        return render(res, route, '配置文件写入失败.');

                    body.result = result;
                    body.items = items;
                    body.package_id = package_id;
                    res.render(route, body);
                });
            }
        });
    });
};