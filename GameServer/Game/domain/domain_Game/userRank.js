/**
 * Created by peihengyang on 15/3/10.
 */
var code = require('../../code');
var gameEnum = require('../../enum');
var userRankProviter = require('../../dao_provider/dao_Game/rank');
var userItemDomain = require('./userBag');
var userDungeonProviter = require('../../dao_provider/dao_Game/dungeon');
var userHeroProviter = require('../../dao_provider/dao_Game/gameUser');
var userBagDomain = require('./userBag')
var editStoreProviter = require('../../dao_provider/dao_edit/store');
var editRankProviter = require('../../dao_provider/dao_edit/rank');
var userLotteryProviter = require('../../dao_provider/dao_Game/lottery');
var edit = require('../../domain/domain_Game/Hero');
var userMailDomain =  require('./userMail');
var gameUserDomain = require('./gameUser');
var userVIPDomain = require('./userVIP');
var userRank = module.exports;
var async =  require('async');
var editProvider = require('../domain_config/config');
var editGlobal = editProvider.getConfig("global").info;
userRank.addUserRank = function(userId,hero_List,callback) {
    var user_Rank =  createUserRankModel(userId);
    user_Rank.Update_Date = new Date();
    userRankProviter.addUserRank(user_Rank,function(error,result){
        if(error){
            console.log(error);
            callback(code.UserRank.Add_User_Rank_Error,null);
        }else{
            userRankProviter.addUserTopRank(userId,function(error,resultAddUserTopRank){
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    console.log('updateUserTroopRecord');
                    console.log(hero_List);
                    var h_list = '';
                    hero_List.forEach(function(hero,index){
                        if(index < 3){
                            h_list += ''+hero.User_Hero_Id+',';
                        }
                    });
                    console.log(h_list);
                    userDungeonProviter.updateUserTroopRecord(userId,gameEnum.FightType.PVP,h_list,1,function(error,resultupdate){
                        if(error!=null){
                            console.log(error);
                            callback(error,null);
                        }
                        else
                        {
                            userDungeonProviter.getUserTroopRecord(userId,function(error,resultsTroopRecord){
                                if(error!=null){
                                    console.log(error);
                                    callback(error,null);
                                }
                                else
                                {
                                    callback(null,resultsTroopRecord);
                                }
                            })

                        }
                    });
                }
            });
        }
    });
};

userRank.PVPMatch = function(userId,callback) {
    console.log('domain pvpmatch');
    gameUserDomain.checkGameFunction(userId,gameEnum.GameFunction.Arena,function(error,resultCheckResult){
        if(error!=null)
        {
            console.log(error);
            callback(error,null);
        }
        else
        {
            if(resultCheckResult.checkStatus){
                userRankProviter.PVPMatch(userId,function(error,result){
                    if(error!=null){
                        console.log(error);
                        callback(code.UserRank.PVP_Match_Error,null);
                    }else{
                        var PVPTroops  =  result[0];
                        console.log('PVPTroops:',PVPTroops);
                        var funcs = [];
                        PVPTroops.forEach(function(PVPTroop,index){
                            funcs.push(function(callbackUserHero){
                                userHeroProviter.getUserHeroByHeroIds(PVPTroop.User_Id,PVPTroop.Troop_Heros,function(error,resultsUser){
                                    if(error!=null){
                                        console.log(error);
                                        callbackUserHero(error,null);
                                    }
                                    else
                                    {
                                        PVPTroops[index].UserHero = resultsUser;
                                        var fighting_Force = 0;
                                        resultsUser.forEach(function(userHero){
                                        var editHero = new edit.Hero(userHero);
                                            console.log("userHero:",editHero);
                                        //console.log("editHero:",editHero);
                                        fighting_Force += editHero.Fighting_Force;
                                    });
                                        PVPTroops[index].FightingForce = fighting_Force;
                                        callbackUserHero(null,resultsUser);
                                    }
                                })
                            })
                        });
                        async.parallel(funcs,function(error,resultsUserHero){
                            if(error!=null){
                                console.log(error);
                                callback(error,null);
                            }
                            else
                            {
                                console.log('PVPTroopsForce:',PVPTroops);
                                callback(null,{PVPTroops:PVPTroops});
                            }
                        });
                    }
                });
            }
            else
            {
                callback(code.UserGameFunction.Arena_Not_Open,null);
            }

        }
    })
};

userRank.getUserRank =  function(user_Id,callback){
    userRankProviter.getUserRank(user_Id,function(error,result){
        if(error!=null){
            console.log(error);
            callback(code.UserRank.Get_User_Rank_Error,null);
        }
        else
        {
            callback(null,result);
        }
    })
}

userRank.checkPVPRank =  function(user_Id,Rank_Num,callback){
    userRankProviter.getUserRank(user_Id,function(error,resultsUserRank){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            if(resultsUserRank.Rank_Num == Rank_Num){
                userRankProviter.getUserUnfinishDefendPVP(user_Id,function(error,resultsUnfinish){
                    if(error!=null){
                        console.log(error);
                        callback(error,null);
                    }
                    else
                    {
                        if(resultsUnfinish.length == 0){
                            callback(code.SUCCESS,null);
                        }
                        else
                        {
                            callback(code.UserRank.Competito_Is_Fighting,null);
                        }
                    }
                })

            }
            else
            {
                callback(code.UserRank.Competitor_Rank_Is_Changed,null);
            }
        }
    })
}

userRank.updateUserTopRank =  function(user_Id,rank_Num,callback){
    var results={Top_Rank:{}};
    userRankProviter.getUserTopRank(user_Id,function(error,resultUserTopRank){
        if(error!= null){
            console.log(error);
            callback(code.UserRank.Get_User_Rank_Error,null);
        }
        else
        {
            results.Top_Rank = {
                old_Rank:resultUserTopRank.Rank_Num,
                new_Rank:rank_Num,
                reward: 0
            };
                userBagDomain.getCurrencys(function(error,resultsCurrency){
                    if(error!=null){
                        console.log(error);
                        callback(error,null);
                    }
                    else
                    {
                        if(resultUserTopRank.Rank_Num > rank_Num){
                            resultUserTopRank.Rank_Num = rank_Num;
                            console.log("updateUserTopRank");
                            userRankProviter.updateUserTopRank(resultUserTopRank,function(error,result){
                                if(error!=null){
                                    console.log(error);
                                    callback(error,null);
                                }
                                else
                                {
                                    editRankProviter.getRewardsByType(gameEnum.Rank_Rewards_Type.TopRewards,function(error,resultsRewards){
                                        if(error!=null){
                                            console.log(error);
                                            callback(error,null);
                                        }
                                        else
                                        {
                                            console.log('resultRewards:',resultsRewards);
                                            if(resultsRewards.length != 0){
                                                var newRankFlag = false;
                                                var oldRankFlag = false;
                                                var totalRewards = 0.01;
                                                var rewards_Item_Id = resultsRewards[0].Item_Id;
                                                console.log('resultsRewards:',resultsRewards);
                                                resultsRewards.forEach(function(reward){
                                                    if(!newRankFlag && (results.Top_Rank.new_Rank <= reward.Min_Rank &&
                                                        results.Top_Rank.new_Rank >= reward.Max_Rank)){
                                                        console.log(resultsRewards);
                                                        totalRewards = totalRewards + reward.Item_Amount * (reward.Min_Rank - results.Top_Rank.new_Rank + 1);
                                                        newRankFlag = true;
                                                        console.log("1:",totalRewards,reward);
                                                    }
                                                    else if(newRankFlag && !oldRankFlag){
                                                        totalRewards = totalRewards + reward.Item_Amount * (reward.Min_Rank - reward.Max_Rank +1);
                                                        console.log("2:",totalRewards,reward);
                                                    }
                                                    if(!oldRankFlag && newRankFlag && (results.Top_Rank.old_Rank <= reward.Min_Rank &&
                                                        results.Top_Rank.old_Rank >= reward.Max_Rank)){
                                                        totalRewards = totalRewards - reward.Item_Amount * (reward.Min_Rank - results.Top_Rank.old_Rank + 1);
                                                        oldRankFlag = 1;
                                                        console.log("3:",totalRewards,reward);
                                                    }
                                                });
                                                console.log(totalRewards);
                                                if(totalRewards != 0.01){
                                                    totalRewards -= 0.01;
                                                };
                                                console.log(totalRewards);
                                                results.Top_Rank.reward = Math.ceil(totalRewards);
                                                var rewards = [{
                                                    Id:rewards_Item_Id,
                                                    Count:results.Top_Rank.reward
                                                }];
                                                console.log(rewards);
                                                userMailDomain.CreatePvpRankAwardMail(user_Id,rewards,results.Top_Rank.new_Rank,
                                                    results.Top_Rank.old_Rank-results.Top_Rank.new_Rank,function(error,resultsPVPMail){
                                                        console.log(resultsPVPMail);
                                                        console.log(error);
                                                        if(error!=null){
                                                            console.log(error);
                                                            callback(error,null);
                                                        }
                                                        else
                                                        {
                                                            callback(null,results);
                                                        }
                                                    })
                                            }

                                            else{
                                                callback(null,results);
                                            }
                                        }
                                    })

                                }
                            })
                        }
                        else
                        {
                            callback(null,results);
                        }
                    }

                })

        }
    })
}

userRank.RefreshStore = function(user_Id,Store_Id,callback){
    var gameFunctionType = gameEnum.GameFunction.Arena;
    if(Store_Id == editGlobal.FarFightStore)
    {
        //console.log("远征");
        gameFunctionType = gameEnum.GameFunction.Expedition;
    }
    gameUserDomain.checkGameFunction(user_Id,gameFunctionType,function(error,resultCheckResult){
        if(error!=null)
        {
            console.log(error);
            callback(error,null);
        }
        else
        {
            console.log(resultCheckResult);
            if(resultCheckResult.checkStatus)
            {
                var userModel = {
                    User_Id:user_Id,
                    Pool_Id:0
                }
                //获取商店
                console.log("获取商店");
                editStoreProviter.getStoreById(Store_Id,function(error,resultStore){
                    if(error!=null) {
                        console.log(error);
                        callback(error, null);
                    }
                    else
                    {
                        userModel.Lottery_Method_Id = resultStore.Pool_Id;
                        //商店商品抽奖生成
                        userLotteryProviter.lootItem(userModel,function(error,result){
                            if(error!=null){
                                console.log(error);
                                callback(error,null);
                            }
                            else
                            {
                                //获取用户商店商品列表
                                userRankProviter.getStoreByUserIdStoreId(user_Id,Store_Id,function(error,resultsUserStore){
                                    if(error!=null){
                                        console.log(error);
                                        callback(error,null);
                                    }
                                    else
                                    {
                                        var userStoreModel =  createUserStoreModel(user_Id);
                                        var Refresh_Times = 0;
                                        var Refresh_Date = new Date();
                                        if(resultsUserStore.length != 0){
                                            Refresh_Times = resultsUserStore[0].Refresh_Times+1;
                                        }
                                        var RefreshExpend = 0;
                                        if(Refresh_Times == 0){
                                            RefreshExpend = 0;
                                        }else if(Refresh_Times <= 2  ){
                                            RefreshExpend = 10;
                                        }
                                        else if(Refresh_Times <=5 ){
                                            RefreshExpend = 50;
                                        }
                                        else if(Refresh_Times <= 8 ){
                                            RefreshExpend = 100;
                                        }
                                        else if(Refresh_Times <= 14){
                                            RefreshExpend = 200;
                                        }
                                        else
                                        {
                                            RefreshExpend = 500;
                                        }
                                        //添加商店商品
                                        userRankProviter.addUserStore(result,Refresh_Times,Refresh_Date,Store_Id,function(error,resultsAddUserStore){
                                            if(error!=null){
                                                console.log(error);
                                                callback(error,null);
                                            }
                                            else
                                            {
                                                userRankProviter.getStoreByUserIdStoreId(user_Id,Store_Id,function(error,resultsUserStoreNew){
                                                    if(error!=null){
                                                        console.log(error);
                                                        callback(error,null);
                                                    }
                                                    else {
                                                        userBagDomain.getCurrencys(function (error, resultsCurrency) {
                                                            if (error != null) {
                                                                console.log(error);
                                                                callback(error, null);
                                                            }
                                                            else {
                                                                var Item_List = {
                                                                    Item_Id: resultsCurrency.PVPCoin,
                                                                    Item_Amount: RefreshExpend,
                                                                    Auto_Open: 0
                                                                };
                                                                if(gameFunctionType == gameEnum.GameFunction.Expedition){
                                                                    Item_List.Item_Id = resultsCurrency.FarFightCoin;
                                                                }
                                                                console.log("useItemById");
                                                                userItemDomain.useItemById(user_Id, Item_List.Item_Id, Item_List.Item_Amount, 0, function (error, resultAddItems) {
                                                                    if (error != null) {
                                                                        console.log(error);
                                                                        callback(error, null)
                                                                    }
                                                                    else {
                                                                        console.log("2");
                                                                        console.log(resultsUserStoreNew);
                                                                        callback(null, {UserStore: resultsUserStoreNew});
                                                                    }
                                                                })

                                                            }
                                                        })
                                                    }
                                                })

                                            }
                                        });
                                    }
                                })
                            }
                        })
                    }
                })
            }
            else
            {
                callback(code.UserGameFunction.Arena_Not_Open,null);
            }
        }
    })

}

userRank.buyGoods = function(user_Id,userStoreId,storeId,callback){
    var gameFunctionType = gameEnum.GameFunction.Arena;
    if(storeId == editGlobal.FarFightStore)
    {
        gameFunctionType = gameEnum.GameFunction.Expedition;
    }
    else if(storeId == editGlobal.GoblinStore || storeId == editGlobal.NormalCoinStore || storeId == editGlobal.NormalDiamondStore){
        gameFunctionType = 0;
    }

editStoreProviter.getStoreById(storeId,function(error,resultEditStore){
    if(error!=null){
        console.log(error);
        callback(error,null);
    }
    else
    {
        gameUserDomain.checkGameFunction(user_Id,gameFunctionType,function(error,resultCheckResult){
            if(error!=null)
            {
                console.log(error);
                callback(error,null);
            }
            else
            {
                if(resultCheckResult.checkStatus){
                    userRankProviter.getUserGoodsByID(user_Id,userStoreId,function(error,resultsUserGoods){
                        if(error!=null){
                            console.log(error);
                            callback(error,null);
                        }
                        else
                        {
                            if(resultsUserGoods.Goods_Amount >= 1){
                                editStoreProviter.getGoodsById(resultsUserGoods.Goods_Id,function(error,resultsGoods){
                                    if(error!=null){
                                        console.log(error);
                                        callback(error,null);
                                    }
                                    else
                                    {
                                        userBagDomain.useItemById(user_Id, resultEditStore.Currency_Id, resultsGoods.Price, 0, function (error, resultUseItem) {
                                            if (error != null) {
                                                console.log(error);
                                                callback(error, null);
                                            }
                                            else {
                                                console.log("resultsUserGoods");
                                                console.log(resultsUserGoods);
                                                resultsUserGoods.Goods_Amount = resultsUserGoods.Goods_Amount - 1;
                                                userRankProviter.updateUserGoods(resultsUserGoods, function (error, resultUpdateUserGoods) {
                                                    if (error != null) {
                                                        console.log(error);
                                                        callback(error, null);
                                                    }
                                                    else {
                                                        var item_List = [{
                                                            Item_Id: resultsGoods.Item_Id,
                                                            Item_Amount: resultsGoods.Item_Amount,
                                                            User_Id: user_Id
                                                        }];
                                                        userBagDomain.addItemsToBag(user_Id, item_List, function (error, resultAddItem) {
                                                            if (error != null) {
                                                                console.log(error);
                                                                callback(error, null);
                                                            }
                                                            else {
                                                                callback(null, {});
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
                                callback(code.UserRank.User_Goods_NOt_Enough,null);
                            }
                        }
                    });
                }
                else
                {
                    callback(code.UserGameFunction.Arena_Not_Open,null);
                }
            }
        })
    }
})

}

userRank.buyPVPTimes = function(user_Id,callback){
    gameUserDomain.checkGameFunction(user_Id,gameEnum.GameFunction.Arena,function(error,resultCheckResult){
        if(error!=null)
        {
            console.log(error);
            callback(error,null);
        }
        else
        {
            if(resultCheckResult.checkStatus){
                userRankProviter.getUserPVPResetTimes(user_Id,function(error,resultPVPResetTimes){
                    if(error!=null){
                        console.log(error);
                        callback(error,null);
                    }
                    else
                    {
                        console.log("resultPVPResetTimes:",resultPVPResetTimes);
                        userVIPDomain.checkVIPOfTimes(user_Id,gameEnum.VIPAction.BuyPVPTimes,resultPVPResetTimes[0].ResetTimes,function(error,resultCheckTimes){
                            if(error!=null){
                                console.log(error);
                                callback(error,null);
                            }
                            else
                            {
                                if(resultCheckTimes){
                                    userBagDomain.getCurrencys(function(error,resultsCurrency) {
                                        if (error != null) {
                                            console.log(error);
                                            callback(error, null);
                                        }
                                        else {
                                            userItemDomain.useItemById(user_Id, resultsCurrency.Diamond, 50 * (resultPVPResetTimes[0].ResetTimes + 1), 0, function (error, results) {
                                                if (error != null) {
                                                    console.log(error);
                                                    callback(error, null);
                                                }
                                                else {
                                                    userRankProviter.resetPVPTimes(user_Id, function (error, resultreset) {
                                                        if (error != null) {
                                                            console.log(error);
                                                            callback(error, null);
                                                        }
                                                        else {
                                                            callback(null, resultreset);
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    });
                                }else
                                {
                                    callback(code.UserVIP.VIP_Times_Error,null);
                                }
                            }
                        })
                    }
                })
            }
            else
            {
                callback(code.UserGameFunction.Arena_Not_Open,null);
            }
        }
    })
}

userRank.resetPVPInterval = function(user_Id,callback){
    gameUserDomain.checkGameFunction(user_Id,gameEnum.GameFunction.Arena,function(error,resultCheckResult){
        if(error!=null)
        {
            console.log(error);
            callback(error,null);
        }
        else
        {
            if(resultCheckResult.checkStatus){

                userBagDomain.getCurrencys(function(error,resultsCurrency) {
                    if (error != null) {
                        console.log(error);
                        callback(error, null);
                    }
                    else {
                        userItemDomain.useItemById(user_Id, resultsCurrency.Diamond, 50, 0, function (error, results) {
                            if (error != null) {
                                console.log(error);
                                callback(error, null);
                            }
                            else {
                                userRankProviter.getUserPVPTimes(user_Id, function (error, resultLastPVP) {
                                    if (error != null) {
                                        console.log(error);
                                        callback(error, null);
                                    }
                                    else {
                                        if (resultLastPVP.result.length != 0) {
                                            resultLastPVP.result[0].Is_Reset = 1;
                                            userRankProviter.updatePVPFight(resultLastPVP.result[0], function (error, resultupdatePVP) {
                                                if (error != null) {
                                                    console.log(error);
                                                    callback(error, null);
                                                }
                                                else {
                                                    callback(null, resultupdatePVP);
                                                }
                                            })
                                        }

                                    }
                                })


                            }
                        })
                    }
                });
            }
            else
            {
                callback(code.UserGameFunction.Arena_Not_Open,null);
            }
        }
    })
}

userRank.getUnfinishedPVP =  function(user_Id,callback){
    userRankProviter.finishUserTimeOutPVP(user_Id,function(error,result){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            userRankProviter.getUserUnfinishPVP(user_Id,function(error,resultsUserPVP){
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    callback(null,resultsUserPVP);
                }
            })
        }
    })
}

var createUserRankModel = function(userId){
    var user_Rank_Model = {
        User_Id:userId,
        Rank_Id:0,
        Rank_Num:0,
        Pre_Rank_Num:0,
        Pre_User_Lvl:0,
        Update_Date:'',
        Win_Times:0
    };
    return user_Rank_Model;
}

var createUserStoreModel = function(userId){
    var user_Store_Model = {
        User_Id:userId,
        Store_Id:0,
        Goods_Id:0,
        Refresh_Times:0,
        Refresh_Date:'',
        Goods_Amount:0
    };
    return user_Store_Model;
}