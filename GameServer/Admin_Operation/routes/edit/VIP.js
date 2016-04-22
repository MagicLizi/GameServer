/**
 * Created by peihengyang on 15/3/9.
 */
var date = require('../../util/date');
var VIPEditProvider = require('../../data_provider/dao_provider/edit/VIP');
var editEnum =  require('../../data_provider/dao_provider/edit/enums');
var body = {
    title : 'VIP',
    message : null
};


exports.index = function(req, res){
    body.message = null;
    VIPEditProvider.getAll(function(error, results){
        body.results = results;
        console.log("results");
        console.log(results);
        res.render('edit/VIP/index', body);
    });
};


exports.add = function(req, res){
    body.message = null;
    var method = req.method;
    console.log(method);
    var route = 'edit/VIP/add';
    var results = {};
    if(method === 'POST'){
        var VIPModel = createVIPModel(req);
        VIPModel.Create_Date = new Date();
        VIPEditProvider.addVIP(VIPModel,function(error, resultsAddStore){
            if(error!=null){
                console.log(error);
                body.message = error;
                res.render(route,body);
            }
            else
            {
                body.results = results;
                //console.log("results");
                //console.log(results);
                res.render(route, body);
            }
        });
    }
    else
    {
        body.results = results;
        //console.log("results");
        //console.log(results);
        res.render(route, body);
    }


};


exports.edit =  function(req,res){
    body.message = null;
    var method = req.method;
    var route = 'edit/VIP/edit';
    var VIP_Id = req.query.id;
    var results = {};
    VIPEditProvider.getVIPById(VIP_Id,function(error,resultsStore){
        if(error!=null){
            body.Message = 'getVIP Error';
            res.redirect('VIP');
        }
        else
        {
            if (method === 'POST') {
                var model = createVIPModel(req);
                model.VIP_Id = VIP_Id;
                VIPEditProvider.updateVIP(model, function (error, resultUpdateStore) {
                    results = model;
                    body.results = results;
                    res.render(route, body);
                });
            }
            else {
                results = resultsStore;
                body.results = results;
                res.render(route, body);
            }
        }
    })
};



var createVIPModel = function (req){
    var VIPModel = {
        VIP_Lvl:req.body.VIP_Lvl,
        VIP_Name:req.body.VIP_Name,
        Total_Recharge:req.body.Total_Recharge,
        BuyStaminaTimes:req.body.BuyStaminaTimes,
        BuyCoinTimes:req.body.BuyCoinTimes,
        BuyPVETimes:req.body.BuyPVETimes,
        BuyPVPTimes:req.body.BuyPVPTimes,
        ResetFarFightTimes:req.body.ResetFarFightTimes,
        FarFightRewardsAdd:req.body.FarFightRewardsAdd,
        TenRaid:req.body.TenRaid,
        SkillPointLimit:req.body.SkillPointLimit,
        ForeverGoblinStore:req.body.ForeverGoblinStore,
        BuySkillPoint:req.body.BuySkillPoint,
        Description:req.body.Description
    };
    return VIPModel;
};
