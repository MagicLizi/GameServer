/**
 * Created by David_shen on 9/11/14.
 */

var date = require('../../util/date');
var storeProvider = require('../../data_provider/dao_provider/store/item');
var body = {
    title : '道具商城',
    message : null
};

exports.index = function(req, res){
    body.message = null;
    storeProvider.getAll(function(error, results){
        body.results = results;
        res.render('store/item_store/index', body);
    });
};

exports.add = function(req, res){
    body.message = null;
    var method = req.method;
    var route = 'store/item_store/add';
    if(method === 'POST'){
        var item_id = req.body.item_id;
        var sort_num = req.body.sort_num;
        var name = req.body.name;
        var sex = req.body.sex;
        var pic_id = req.body.pic_id;
        var pos = req.body.pos;
        var currency_type = req.body.currency_type;
        var price = req.body.price;
        var lvl_limit = req.body.lvl_limit;
        var description = req.body.description;
        var begin_date = req.body.begin_date;
        var end_date = req.body.end_date;
        var is_valid = req.body.is_valid ;
        var regex1 = /^[0-9]{1,}$/;
        if(item_id == "")
            return render(res, route, '请输入道具编号.');
        if(!parseInt(sort_num))
            return render(res, route, '排序编号必需为数字.');
        if(name=='')
            return render(res, route, '请输入道具名称.');
        if(!parseInt(price))
            return render(res, route, '价格必需为数字.');

        if(!regex1.test(lvl_limit))
            return render(res, route, '等级限制必需为数字.');

        if(description=='')
            return render(res, route, '请输入道具描述.');
        if(!begin_date || begin_date=='')
            return render(res, route, '开始时间错误.');

        if(!end_date || end_date=='')
            return render(res, route, '结束时间错误.');

        var model = {
            item_id : item_id,
            sort_num :sort_num,
            name : name,
            sex:sex,
            pic_id:pic_id,
            pos:pos,
            currency_type:currency_type,
            price : price,
            lvl_limit:lvl_limit,
            description : description,
            begin_date : new Date(Date.parse(begin_date)),
            end_date : new Date(Date.parse(end_date)),
            is_valid : is_valid,
            create_date : new Date()
        };
        storeProvider.addRecharge(model, function(error, result){
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
    var route = 'store/item_store/edit';

    var recharge_id = req.query.id;

    if(!parseInt(recharge_id)){
        res.redirect('apple');
        return;
    }
    storeProvider.getRecharge(recharge_id, function(error, result){
        if(error){
            res.redirect('apple');
            return;
        }
        else{
            if(!result){
                res.redirect('apple');
                return;
            }
            if(method === 'POST'){
                var sort_num = req.body.sort_num;
                var name = req.body.name;
                var sex = req.body.sex;
                var pic_id = req.body.pic_id;
                var pos = req.body.pos;
                var currency_type = req.body.currency_type;
                var price = req.body.price;
                var lvl_limit = req.body.lvl_limit;
                var description = req.body.description;
                var begin_date = req.body.begin_date;
                var end_date = req.body.end_date;
                var is_valid = req.body.is_valid ;
                var regex1 = /^[0-9]{1,}$/;
                if(!parseInt(sort_num))
                    return render(res, route, '排序编号必需为数字.');
                if(name=='')
                    return render(res, route, '请输入道具名称.');

                if(!regex1.test(lvl_limit))
                    return render(res, route, '等级限制必需为数字.');

                if(!parseInt(price))
                    return render(res, route, '价格必需为数字.');
                if(description=='')
                    return render(res, route, '请输入道具描述.');
                if(!begin_date || begin_date=='')
                    return render(res, route, '开始时间错误.');

                var model = {
                    item_id : recharge_id,
                    sort_num :sort_num,
                    name : name,
                    sex:sex,
                    pic_id:pic_id,
                    pos:pos,
                    currency_type:currency_type,
                    price : price,
                    lvl_limit:lvl_limit,
                    description : description,
                    begin_date : new Date(Date.parse(begin_date)),
                    end_date : new Date(Date.parse(end_date)),
                    is_valid : is_valid,
                    create_date : new Date()
                };

                storeProvider.editRecharge(model, function(error, result){
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
}