/**
 * Created with JetBrains WebStorm.
 * User: andy.chen
 * Date: 14-5-20
 * Time: 下午7:02
 * To change this template use File | Settings | File Templates.
 */
var date = require('../../util/date');
var storeProvider = require('../../data_provider/dao_provider/store/apple');
var body = {
    title : '商城',
    message : null
};

exports.index = function(req, res){
    body.message = null;
    console.log("indexindex");
    storeProvider.getAll(function(error, results){
        body.results = results;
        res.render('store/apple/index', body);
    });
};

exports.add = function(req, res){
    body.message = null;
    var method = req.method;
    var route = 'store/apple/add';
    if(method === 'POST'){
        var recharge_id = req.body.recharge_id;
        var pic_id = req.body.pic_id;
        var name = req.body.name;
        var type = req.body.type;
        var price = req.body.price;
        var chips = req.body.chips;
        var diamond = req.body.diamond || 0;
        var description = req.body.description;
        var sort = req.body.sort || 1;
        var status = req.body.status;
        var begin_date = req.body.begin_date;
        var end_date = req.body.end_date;
        var is_valid = req.body.is_valid;

        if(!parseInt(recharge_id))
            return render(res, route, '充值项目编号必需为数字.');

        if(name=='')
            return render(res, route, '请输入名称.');

        if(!parseInt(price))
            return render(res, route, '价格必需为数字.');
        /*
        if(!parseInt(diamond))
            return render(res, route, '通宝卡必需为数字.');
        */
        if(!parseInt(chips))
            return render(res, route, '金贝必需为数字.');

        if(!begin_date || begin_date=='')
            return render(res, route, '开始时间错误.');

        if(!end_date || end_date=='')
            return render(res, route, '结束时间错误.');

        var model = {
            recharge_id : recharge_id,
            type : type,
            name : name,
            pic_id:pic_id,
            price : price,
            chips : chips,
            diamond : diamond,
            description : description,
            sort : sort,
            status : status,
            begin_date : new Date(Date.parse(begin_date)),
            end_date : new Date(Date.parse(end_date)),
            is_valid : is_valid,
            create_date : new Date()
        };

        storeProvider.getRecharge(recharge_id, function(error, result){
            if(error)
                return render(res, route, '添加失败.');
            else{
                if(!!result)
                    return render(res, route, '充值项目编号已存在.');

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
        });

    }
    else
        res.render(route, body);
};

exports.edit = function(req, res){
    body.message = null;
    var method = req.method;
    var route = 'store/apple/edit';

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
                var name = req.body.name;
                var type = req.body.type;
                var pic_id = req.body.pic_id;
                var price = req.body.price;
                var chips = req.body.chips;
                var diamond = req.body.diamond || 0;
                var description = req.body.description;
                var sort = req.body.sort || 1;
                var status = req.body.status;
                var begin_date = req.body.begin_date;
                var end_date = req.body.end_date;
                var is_valid = req.body.is_valid;


                if(name=='')
                    return render(res, route, '请输入名称.');

                if(!parseInt(price))
                    return render(res, route, '价格必需为数字.');
                /*
                if(!parseInt(diamond))
                    return render(res, route, '通宝卡必需为数字.');
                */

                if(!parseInt(chips))
                    return render(res, route, '金贝必需为数字.');

                if(!begin_date || begin_date=='')
                    return render(res, route, '开始时间错误.');

                if(!end_date || end_date=='')
                    return render(res, route, '结束时间错误.');

                var model = {
                    recharge_id : recharge_id,
                    name : name,
                    type : type,
                    pic_id:pic_id,
                    price : price,
                    chips : chips,
                    diamond : diamond,
                    description : description,
                    sort : sort,
                    status : status,
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
};