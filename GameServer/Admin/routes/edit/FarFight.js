/**
 * Created by peihengyang on 15/9/16.
 */
var date = require('../../util/date');
var FarFightEditProvider = require('../../data_provider/dao_provider/edit/FarFight');
var lotteryEditProvider = require('../../data_provider/dao_provider/edit/lottery');
var body = {
    title : '远征',
    message : null
};
var exports = module.exports;

exports.index = function(req, res) {
    body.message = null;
    var mothod = req.method;
    var route = "edit/FarFight/index";

    FarFightEditProvider.getAll(function (error, results) {
            body.results = results;
            res.render(route, body);
        })
};

exports.add =  function(req,res){
    body.message = null;
    var method = req.method;
    var route = 'edit/FarFight/add';
    if(method === 'POST') {

        var model =  createFarFightModel(req);
        model.Create_Date = new Date();
        FarFightEditProvider.addFarFight(model,function(error, results) {
            body.results = results;
            res.render(route, body);
        });
    }
    else{
        res.render(route, body);
    }
};

exports.edit =  function(req,res){
    body.message = null;
    var method = req.method;
    var route = 'edit/FarFight/edit';
    var farFight_Id = req.query.id;
    FarFightEditProvider.getFarFightById(farFight_Id,function(error,result){
        if(error!=null){
            console.log('getFarFightById:',error);
            body.message = '获取失败';
            res.render(route, body);
        }
        else
        {
            body.results.FarFight = result;
            //console.log('farfightmode:',body.results);
            lotteryEditProvider.getLotteryMethod(function(error,lotteryRestuls) {
                if (error != null) {
                    console.log(error);
                    callback(error, null);
                }
                else {
                    body.results.lotteryPool = lotteryRestuls;
                    if(method === 'POST') {
                        var model =  createFarFightModel(req);
                        model.FarFight_Id = farFight_Id;
                        FarFightEditProvider.updateFarFight(model,function(error, results) {
                            if(error!=null){
                                console.log('updateFarFight:',error);
                                body.message = '更新失败';
                                res.render(route, body);
                            }
                            else
                            {
                                body.message = '更新成功';
                                body.results.FarFight = model;
                                res.render(route, body);
                            }

                        });
                    }
                    else{
                        body.message = '获取成功';
                        res.render(route, body);
                    }
                }
            })

        }

    })

};
var createFarFightModel = function(req){
    return {
        FarFight_Name:req.body.FarFight_Name,
        FarFight_Type:req.body.FarFight_Type,
        Pool_Id:req.body.Pool_Id,
        Max_Lvl:req.body.Max_Lvl,
        Min_Lvl:req.body.Min_Lvl
    }
}