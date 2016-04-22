/**
 * Created with JetBrains WebStorm.
 * User: andy.chen
 * Date: 14-5-20
 * Time: 下午7:02
 * To change this template use File | Settings | File Templates.
 */
var date = require('../../util/date');
var noticeProvider = require('../../data_provider/dao_provider/system/notice');
var body = {
    title : '公告',
    message : null
};

exports.index = function(req, res){
    body.message = null;
    noticeProvider.getAll(function(error, results){
        body.results = results;
        res.render('notice/index', body);
    });
};

exports.add = function(req, res){
    var method = req.method;
    var route = 'notice/add';
    if(method === 'POST'){
        var name = req.body.name;
        var content = req.body.content;
        var is_jump = req.body.is_jump || 1;
        var jump_sort = req.body.jump_sort || 1;
        var sort = req.body.sort || 1;
        var begin_date = req.body.begin_date;
        var end_date = req.body.end_date;
        var is_valid = req.body.is_valid;

        if(name=='')
            return render(res, route, '请输入名称.');

        if(content=='')
            return render(res, route, '请输入内容.');

        if(!begin_date || begin_date=='')
            return render(res, route, '开始时间错误.');

        if(!end_date || end_date=='')
            return render(res, route, '结束时间错误.');

        var model = {
            name : name,
            content : content,
            is_jump : is_jump,
            jump_sort : jump_sort,
            sort : sort,
            begin_date : new Date(Date.parse(begin_date)),
            end_date : new Date(Date.parse(end_date)),
            is_valid : is_valid,
            create_date : new Date()
        };

        noticeProvider.addNotice(model, function(error, result){
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
    var method = req.method;
    var route = 'notice/edit';

    var notice_id = req.query.id;

    if(!parseInt(notice_id)){
        res.redirect('notice');
        return;
    }
    noticeProvider.getNotice(notice_id, function(error, result){
        if(error){
            res.redirect('notice');
            return;
        }
        else{
            if(!result){
                res.redirect('notice');
                return;
            }

            if(method === 'POST'){
                var name = req.body.name;
                var content = req.body.content;
                var is_jump = req.body.is_jump || 1;
                var jump_sort = req.body.jump_sort || 1;
                var sort = req.body.sort || 1;
                var begin_date = req.body.begin_date;
                var end_date = req.body.end_date;
                var is_valid = req.body.is_valid;

                if(name=='')
                    return render(res, route, '请输入名称.');

                if(content=='')
                    return render(res, route, '请输入内容.');

                if(!begin_date || begin_date=='')
                    return render(res, route, '开始时间错误.');

                if(!end_date || end_date=='')
                    return render(res, route, '结束时间错误.');

                var model = {
                    notice_id : notice_id,
                    name : name,
                    content : content,
                    is_jump : is_jump,
                    jump_sort : jump_sort,
                    sort : sort,
                    begin_date : new Date(Date.parse(begin_date)),
                    end_date : new Date(Date.parse(end_date)),
                    is_valid : is_valid,
                    create_date : new Date()
                };

                noticeProvider.editNotice(model, function(error, result){
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