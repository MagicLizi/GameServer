/**
 * Created with JetBrains WebStorm.
 * User: andy.chen
 * Date: 14-5-20
 * Time: 下午7:02
 * To change this template use File | Settings | File Templates.
 */
var date = require('../../util/date');
var messageProvider = require('../../data_provider/dao_provider/message/system');
var body = {
    title : '消息',
    message : null
};

exports.index = function(req, res){
    body.message = null;
    messageProvider.getAll(function(error, results){
        body.results = results;
        res.render('message/index', body);
    });
};

exports.add = function(req, res){
    body.message = null;
    var method = req.method;
    var route = 'message/add';
    if(method === 'POST'){
        var user_id = req.body.user_id;
        var name = req.body.name;
        var content = req.body.content;
        var sort = req.body.sort || 1;
        /*
        var begin_date = req.body.begin_date;
        var end_date = req.body.end_date;
        */
        var begin_date = new Date();
        var end_date = new Date();
        var is_valid = req.body.is_valid;
        var type = req.body.box1 || 1;

        if(type == 1){
            if(user_id=='')
                return render(res, route, '用户域不能为空.');

            var regex1 = /^[0-9|\-|,]{1,}$/ig;
            if(!regex1.test(user_id))
                return render(res, route, '用户域只支持【数字 , -】.');
        }

        if(name=='')
            return render(res, route, '请输入名称.');

        if(content=='')
            return render(res, route, '请输入内容.');
        /*
        if(!begin_date || begin_date=='')
            return render(res, route, '开始时间错误.');

        if(!end_date || end_date=='')
            return render(res, route, '结束时间错误.');
        */

        var model = {
            type : type,
            user_id : user_id,
            name : name,
            content : content,
            sort : sort,
            /*
            begin_date : new Date(Date.parse(begin_date)),
            end_date : new Date(Date.parse(end_date)),
            */
            begin_date : begin_date,
            end_date : end_date,
            is_valid : is_valid,
            create_date : new Date()
        };

        messageProvider.addMessage(model, function(error, result){
            if(error){
                body.message = '添加失败.';
                res.render(route, body);
            }
            else{
                body.message = '添加成功.';
                res.render(route, body);
            }
        });

    }
    else
        res.render(route, body);
};

exports.edit = function(req, res){
    body.message = null;
    var method = req.method;
    var route = 'message/edit';

    var message_id = req.query.id;

    if(!parseInt(message_id)){
        res.redirect('message');
        return;
    }
    messageProvider.getMessage(message_id, function(error, result){
        if(error){
            res.redirect('message');
            return;
        }
        else{
            if(!result){
                res.redirect('message');
                return;
            }

            if(method === 'POST'){
                var user_id = result.user_id;
                var name = req.body.name;
                var content = req.body.content;
                var sort = req.body.sort || 1;
                /*
                var begin_date = req.body.begin_date;
                var end_date = req.body.end_date;
                */
                var begin_date = new Date();
                var end_date = new Date();
                var is_valid = req.body.is_valid;

                if(name=='')
                    return render(res, route, '请输入名称.');

                if(content=='')
                    return render(res, route, '请输入内容.');

                /*
                if(!begin_date || begin_date=='')
                    return render(res, route, '开始时间错误.');

                if(!end_date || end_date=='')
                    return render(res, route, '结束时间错误.');
                */

                var model = {
                    type : result.type,
                    message_id : message_id,
                    user_id : user_id,
                    name : name,
                    content : content,
                    sort : sort,
                    /*
                    begin_date : new Date(Date.parse(begin_date)),
                    end_date : new Date(Date.parse(end_date)),
                    */
                    begin_date : begin_date,
                    end_date : end_date,
                    is_valid : is_valid,
                    create_date : new Date()
                };

                messageProvider.editMessage(model, function(error, result){
                    if(error){
                        body.message = '更新失败.';
                        res.render(route, body);
                    }
                    else{
                        body.message = '更新成功.';
                        result.begin_date = result.begin_date;
                        result.end_date = result.end_date;
                        body.result = result;
                        res.render(route, body);
                    }
                });
            }
            else{
                body.result = result;
                res.render(route, body);
            }
        }
    });
};

function render(res, route, message){
    body.message = message;
    res.render(route, body);
};