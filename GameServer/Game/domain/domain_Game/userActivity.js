/**
 * Created by peihengyang on 15/10/29.
 */

var code = require('../../code');
var gameEnum = require('../../enum');
var userItemDomain = require('./userBag');
var userBagDomain = require('./userBag');
var userVIPProvider = require('../../dao_provider/dao_Game/VIP');
var activityProvider = require('../../dao_provider/dao_Game/activity');
var async =  require('async');
var editItemProviter = require('../../dao_provider/dao_edit/item');
var userGameUserProviter = require('../../dao_provider/dao_Game/gameUser');
var editProvider = require('../domain_config/config');
var editActivity = editProvider.getConfig("activity").info;
var userActivity = module.exports;

userActivity.getUserNotReceivingActivity = function(userId,callback){
    userActivity.checkTodayActivity(userId,function(error,resultCheckActivity){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            activityProvider.getTodayUserActivity(userId,function(error,resultUserActivity){
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    callback(null,resultUserActivity);
                }
            })
        }
    })
};

userActivity.checkTodayActivity = function(userId,callback){
    var fun = [];
    var task1;
    var thisMonth = new Date(new Date().getTime() - 4 * 3600 * 1000).getMonth()+1;
    console.log('thisMonth:',thisMonth);
    var a = [];
    var i = 1;
    for(var b in gameEnum.Activity_Type) {
        a.push(i);
        i++
    }
    a.forEach(function(item){
        if((thisMonth%2 == 1 && item == gameEnum.Activity_Type.Daily_Reward1) ||
            (thisMonth%2 == 0 && item == gameEnum.Activity_Type.Daily_Reward2) ||
            (item != gameEnum.Activity_Type.Daily_Reward1 && item != gameEnum.Activity_Type.Daily_Reward2)){
            console.log(item);
            fun.push(function(callbacktask) {
                console.log('x:',userId,'||',item);
                activityProvider.getNextActivityReward(userId, item, function (error, resultsNextActivity) {
                        if (error != null) {
                            console.log(error);
                            callbacktask(error, null);
                        }
                        else {
                            callbacktask(null,resultsNextActivity);
                        }

                    }
                )
            })
        }
    })
    console.log(fun);
    async.series(fun,function(error,resultsGetNextActivity){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            callback(null,resultsGetNextActivity);
        }
    })
};

userActivity.deliverActivityReward = function(userId,activityType,callback){
    userActivity.checkTodayActivity(userId,function(error,resultCheckActivity){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            activityProvider.getUserActivityByType(userId,activityType,
                function(error,resultUserActivity) {
                    if (error != null) {
                        console.log(error);
                        callback(error, null);
                    }
                    else {
                        if (resultUserActivity.length == 0) {
                            callback(code.Activity.User_Activity_ISNULL, null);
                        }
                        else if (resultUserActivity.length == 1) {
                            userVIPProvider.getUserVIPByUserId(userId,function(error,resultUserVIP){
                                if(error!=null){
                                    console.log(error);
                                    callback(error,null);
                                }
                                else
                                {
                                    console.log(resultUserActivity);
                                    var Item_List = []
                                    editActivity.Activity.forEach(function (activity) {
                                        if (resultUserActivity[0].Activity_Id == activity.Activity_Id) {
                                            if(resultUserVIP.VIP_Lvl >= activity.Double_VIP_Lvl && activity.Double_VIP_Lvl != -1){
                                                Item_List.push( {
                                                    Item_Id: activity.Reward_Item_Id,
                                                    Item_Amount: activity.Reward_Item_Amount * 2,
                                                    User_Id: userId
                                                });
                                            }
                                            else
                                            {
                                                Item_List.push( {
                                                    Item_Id: activity.Reward_Item_Id,
                                                    Item_Amount: activity.Reward_Item_Amount,
                                                    User_Id: userId
                                                });
                                            }
                                        }
                                    })
                                    userBagDomain.addItemsToBag(userId, Item_List, function (error, resultAddItem) {
                                        if (error != null) {
                                            console.log(error);
                                            callback(error, null);
                                        }
                                        else {
                                            editItemProviter.getItemEffectByType(gameEnum.Item_Effect_Type.Hero, function (error, resultHeroItem) {
                                                if (error != null) {
                                                    console.log(error);
                                                    callback(error, null);
                                                }
                                                else {
                                                    var heros = '';
                                                    resultHeroItem.forEach(function (HeroItem) {
                                                        Item_List.forEach(function (item) {
                                                            if (item.Item_Id == HeroItem.Item_Id) {
                                                                heros += HeroItem.Effect_Value + ",";
                                                            }
                                                        })
                                                    });
                                                    console.log('getUserHeroByHeroIdsL');
                                                    userGameUserProviter.getUserHeroByHeroIdsL(userId, heros, function (error, resultUserHeros) {
                                                        if (error != null) {
                                                            console.log(error);
                                                            callback(error, null);
                                                        }
                                                        else {
                                                            resultUserActivity[0].Status =  gameEnum.Activity_Reward_Status.Received;
                                                            console.log(resultUserActivity);
                                                            activityProvider.updateUserActivityStatus(resultUserActivity[0],function(error,resultUpdateActivity){
                                                                if(error!=null){
                                                                    console.log(error);
                                                                    callback(error,null);
                                                                }
                                                                else
                                                                {
                                                                    var resultsActivity = {
                                                                        Items: Item_List,
                                                                        User_Heros: resultUserHeros
                                                                    };
                                                                    console.log(resultsActivity)
                                                                    callback(null, resultsActivity);
                                                                }
                                                            })

                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                        else
                        {
                            callback(code.Activity.User_Activity_Invalid,null);
                        }
                    }
                })
        }
    })
};
