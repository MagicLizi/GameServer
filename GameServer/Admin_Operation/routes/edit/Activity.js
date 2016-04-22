/**
 * Created by peihengyang on 15/10/28.
 */
var date = require('../../util/date');
var activityEditProvidor = require('../../data_provider/dao_provider/edit/activity');
var itemEditProvider = require('../../data_provider/dao_provider/edit/item');
var body = {
    title : '活动',
    message : null
};
var activity = module.exports;
activity.index = function(req, res){
    body.message = null;
    var route = 'edit/Activity/index';
    activityEditProvidor.getAll(function(error, resultsActivity){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else {
            body.results = resultsActivity;
            console.log("results");
            console.log(resultsActivity);
            res.render(route, body);
        }
    })
};

activity.add = function(req, res){
    body.message = null;
    var method = req.method;
    var route = 'edit/Activity/add';
    itemEditProvider.getAll(function(error,resultAllItem){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            body.results.items = resultAllItem.Item;
            if(method === 'POST'){
                var model = createModel(req);
                model.Create_Date = new Date();
                activityEditProvidor.add(model, function(error, result){
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
            {
                res.render(route, body);

            }
        }
    });

};


activity.edit = function(req, res){
    body.message = null;
    var method = req.method;
    var activityId = req.query.id;
    var route = 'edit/Activity/edit';
    itemEditProvider.getAll(function(error,resultAllItem){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            activityEditProvidor.getActivityById(activityId,function(error,resultActivity){
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    body.results = resultActivity;
                    body.results.items = resultAllItem.Item;
                    if(method === 'POST'){
                        var model = createModel(req);
                        model.Activity_Id = activityId;
                        activityEditProvidor.update(model, function(error, result){
                            if(error){
                                body.message = '更新失败.';
                                res.render(route, body);
                            }
                            else{
                                body.message = '更新成功.';
                                body.results = model;
                                body.results.items = resultAllItem.Item;
                                res.render(route, body);
                            }
                        });
                    }
                    else
                    {
                        res.render(route, body);

                    }
                }
            })

        }
    });
};


var createModel = function(req)
{
    var Activity_Type = req.body.Activity_Type;
    var Reward_Item_Id = req.body.Reward_Item_Id;
    var Reward_Item_Amount = req.body.Reward_Item_Amount;
    var Reward_Order = req.body.Reward_Order;
    var Enable = req.body.Enable;
    var Double_VIP_Lvl = req.body.Double_VIP_Lvl;
    var model = {
        Activity_Type:Activity_Type,
        Reward_Item_Id:Reward_Item_Id,
        Reward_Item_Amount:Reward_Item_Amount,
        Reward_Order:Reward_Order,
        Enable:Enable,
        Double_VIP_Lvl:Double_VIP_Lvl
    };
    return model;
};

