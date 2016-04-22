/**
 * Created by peihengyang on 15/3/25.
 */
var date = require('../../util/date');
var rankEditProvidor = require('../../data_provider/dao_provider/edit/rank');
var itemEditProvider = require('../../data_provider/dao_provider/edit/item');
var body = {
    title : '技能',
    message : null
};
var rank = module.exports;
rank.indexRewards = function(req, res){
    body.message = null;
    var route = 'edit/Rank/Rewards/index';
    rankEditProvidor.getAll(function(error, resultsRank){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else {
            body.results = resultsRank;
            console.log("results");
            console.log(resultsRank);
            res.render(route, body);
        }
    })
};


rank.addRewards = function(req, res){
    body.message = null;
    var route = 'edit/Rank/Rewards/add';
    var method = req.method;
    var rewardsModel = {};
    console.log(method);
    var results = {};
    itemEditProvider.getAll(function(error,resultsItems){
        if(error!=null){
            console.log(error);
            body.message = error;
            res.render(route,body);
        }
        else
        {
            results.Item = resultsItems.Item;
            results.Rewards = {};
            if(method === 'POST'){

                rewardsModel = createRewardsModel(req);
                rewardsModel.Create_Date = new Date();
                rankEditProvidor.addRewards(rewardsModel,function(error, resultsAddRewards){
                    if(error!=null){
                        console.log(error);
                        body.message = error;
                        res.render(route,body);
                    }
                    else
                    {
                        results.Rewards = rewardsModel;
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
        }
    })

};

rank.editRewards = function(req, res){
    body.message = null;
    var route = 'edit/Rank/Rewards/edit';
    var method = req.method;
    var rewardsModel = {};
    var rewards_id = req.query.id;
    console.log(method);
    var results = {};
    itemEditProvider.getAll(function(error,resultsItems){
        if(error!=null){
            console.log(error);
            body.message = error;
            res.render(route,body);
        }
        else
        {
            rankEditProvidor.getRewardsById(rewards_id,function(error,resultsReward){
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    results.Item = resultsItems.Item;
                    results.Rewards = resultsReward;
                    if(method === 'POST'){
                        rewardsModel = createRewardsModel(req);
                        rewardsModel.Rewards_Id = rewards_id;
                        rewardsModel.Create_Date = new Date();
                        rankEditProvidor.updateRewards(rewardsModel,function(error, resultsAddRewards){
                            if(error!=null){
                                console.log(error);
                                body.message = error;
                                res.render(route,body);
                            }
                            else
                            {
                                results.Rewards = rewardsModel;
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
                }
            });
        }
    })

};

var createRewardsModel = function (req){
    var RewardsModel = {
        Rewards_Id:0,
        Max_Rank:req.body.Max_Rank,
        Min_Rank:req.body.Min_Rank,
        Item_Id:req.body.Item_Id,
        Item_Amount:req.body.Item_Amount,
        Enable:req.body.Enable,
        Rewards_Type:req.body.Rewards_Type,
        Create_Date:''
    };
    return RewardsModel;
};