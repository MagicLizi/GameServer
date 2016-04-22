/**
 * Created with JetBrains WebStorm.
 * User: apple
 * Date: 14-7-14
 * Time: 上午11:11
 * To change this template use File | Settings | File Templates.
 */
var date = require('../../util/date');
var channelProvider = require('../../data_provider/dao_provider/channel/channel');

var body = {
    title: '渠道管理',
    message: null
};

exports.index = function (request, response) {
    body.message = null;
    channelProvider.getAll(function (error, results) {
        console.log(JSON.stringify(results));
        body.results = results;
        response.render('channel/index', body);
    });
};

exports.add = function (req, res) {
    var method = req.method;
    var route = 'channel/add';
    if (method === 'POST') {
        var name = req.body.name;
        var remark = req.body.remark;
        console.log("remark" + remark);
        if (name == '')
            return res.render(res, route, '请输入名称.');

        if (remark == '')
            return res.render(res, route, '请输入备注.');

        var model = {
            name: name,
            remark: remark,
            create_date: new Date()
        };

        channelProvider.addChannel(model, function (error, result) {
            if (error) {
                body.message = '添加失败.';
                res.render(route, body);
            }
            else {
                body.message = '添加成功.';
                res.render(route, body);
            }
        });
    }
    else
        res.render(route, body);
};


exports.edit = function (req, res) {
    var method = req.method;
    var route = 'channel/edit';

    var channel_id = req.query.id;

    if (!parseInt(channel_id)) {
        res.redirect('channel');
        return;
    }
    channelProvider.getChannel(channel_id, function (error, result) {
        if (error) {
            res.redirect('channel');
            return;
        }
        else {
            if (!result) {
                res.redirect('channel');
                return;
            }

            if (method === 'POST') {
                var channel_name = req.body.name;
                var remark = req.body.remark;

                if (channel_name == '')
                    return render(res, route, '请输入名称.');

                if (remark == '')
                    return render(res, route, '请输入备注.');

                var model = {
                    channel_id: channel_id,
                    channel_name: channel_name,
                    remark: remark,
                    create_date: new Date()
                };

                channelProvider.editChannel(model, function (error, result) {
                    if (error) {
                        body.message = '更新失败.';
                        res.render(route, body);
                    }
                    else {
                        body.message = '更新成功.';
                        body.result = result;
                        res.render(route, body);
                    }
                });
            }
            else {
                body.result = result;
                res.render(route, body);
            }
        }
    });
};
