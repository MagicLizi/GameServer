/**
 * Created by peihengyang on 15/2/25.
 */
var code = require('../../code');
var gameEnum = require('../../enum');
var userBagDomain =  require('./userBag');
var userLotteryProviter = require('../../dao_provider/dao_Game/lottery');
var userGameUserProviter = require('../../dao_provider/dao_Game/gameUser');
var editItemProviter = require('../../dao_provider/dao_edit/item');
var userTaskDomain = require('./userTask');
var editGlobal = require('../../dao_provider/dao_Game/global');
var userLottery = module.exports;

userLottery.Lottery = function(userId,lotteryType,Is_Free,callback){
    editGlobal.getGlobal(function(error,resultsGlobal){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else {
            var model = {
                User_Id:userId,
                Lottery_Type:lotteryType,
                Is_Free:Is_Free,
                Diamond_Id:resultsGlobal.Diamond,
                P_Diamond_Id:resultsGlobal.Purchased_Diamond
            };
            userLotteryProviter.userLottery(model, function (error, result) {
                if (error != null) {
                    console.log(error);
                    callback(error, null);
                }
                else {
                    var resultCode;
                    switch (result.Code) {
                        case 1:
                            resultCode = code.SUCCESS;
                            break;
                        case -1:
                            resultCode = code.UserLottery.Expense_Not_Enough;
                            break;
                        case -2:
                            resultCode = code.UserLottery.User_Level_Not_Config;
                            break;
                        case -3:
                            resultCode = code.UserLottery.Is_Free_error;
                            break;
                        default :
                            resultCode = null;
                    }
                    var results = {
                        Loot_Items: result.LootItem,
                        User_Heros: []
                    };

                    if (result.LotteryExpense.U_Type_Of_Expense == resultsGlobal.Diamond ||
                        result.LotteryExpense.U_Type_Of_Expense == resultsGlobal.Purchased_Diamond) {
                        console.log('diamond');
                        userBagDomain.useItemById(userId, resultsGlobal.Diamond, result.LotteryExpense.U_Expense_Amount,
                            0, function (error, resultUseItem) {
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
                                                result.LootItem.forEach(function (item) {
                                                    if (item.Item_Id == HeroItem.Item_Id) {
                                                        heros += HeroItem.Effect_Value + ",";
                                                    }
                                                })
                                            });
                                            console.log("heros");
                                            console.log(heros);
                                            var actionInfo =
                                            {
                                                playTimes: 0
                                            };
                                            if (model.Lottery_Type == 3 || model.Lottery_Type == 5) {
                                                actionInfo.playTimes = 10;
                                            }
                                            else {
                                                actionInfo.playTimes = 1;
                                            }
                                            ;
                                            if (resultCode == code.SUCCESS) {
                                                console.log("checkTask");
                                                userTaskDomain.checkTask(userId, gameEnum.Action_Type.GetRewards, actionInfo, function (error, resultTask) {
                                                    if (error != null) {
                                                        console.log(error);
                                                        callback(error, null);
                                                    }
                                                    else {
                                                        userBagDomain.addItemsToBag(userId, results.Loot_Items, function (error, resultAddItem) {
                                                            if (error != null) {
                                                                console.log(error);
                                                                callback(error, null);
                                                            }
                                                            else {
                                                                userGameUserProviter.getUserHeroByHeroIdsL(userId, heros, function (error, resultUserHeros) {
                                                                    if (error != null) {
                                                                        console.log(error);
                                                                        callback(error, null);
                                                                    }
                                                                    else {

                                                                        results.User_Heros = resultUserHeros;
                                                                        callback(null, results);
                                                                    }
                                                                })
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                            else {
                                                console.log(resultCode);
                                                callback(resultCode, null);
                                            }

                                        }
                                    })
                                }
                            })

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
                                    result.LootItem.forEach(function (item) {
                                        if (item.Item_Id == HeroItem.Item_Id) {
                                            heros += HeroItem.Effect_Value + ",";
                                        }
                                    })
                                });
                                console.log("heros");
                                console.log(heros);


                                var actionInfo =
                                {
                                    playTimes: 0
                                };
                                if (model.Lottery_Type == 3 || model.Lottery_Type == 5) {
                                    actionInfo.playTimes = 10;
                                }
                                else {
                                    actionInfo.playTimes = 1;
                                }
                                ;
                                if (resultCode == code.SUCCESS) {
                                    console.log("checkTask");
                                    userTaskDomain.checkTask(userId, gameEnum.Action_Type.GetRewards, actionInfo, function (error, resultTask) {
                                        if (error != null) {
                                            console.log(error);
                                            callback(error, null);
                                        }
                                        else {
                                            userBagDomain.addItemsToBag(userId, results.Loot_Items, function (error, resultAddItem) {
                                                if (error != null) {
                                                    console.log(error);
                                                    callback(error, null);
                                                }
                                                else {
                                                    userGameUserProviter.getUserHeroByHeroIdsL(userId, heros, function (error, resultUserHeros) {
                                                        if (error != null) {
                                                            console.log(error);
                                                            callback(error, null);
                                                        }
                                                        else {

                                                            results.User_Heros = resultUserHeros;
                                                            callback(null, results);
                                                        }
                                                    })
                                                }
                                            });
                                        }
                                    });
                                }
                                else {
                                    console.log(resultCode);
                                    callback(resultCode, null);
                                }

                            }
                        })

                    }

                }

            });
        }
    })

}

userLottery.getFreeLottery = function(userId,callback){
    userLotteryProviter.getFreeLotteryByUserId(userId,function(error,results){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            var nowTime =  new Date();
            var result = {
                SingleCoinTimes:0,
                LastSingleCoinDatetime:'1970-01-01 00:00:00',
                SingleDimDiamondTimes:0,
                LastSingleDiamondDatetime:'1970-01-01 00:00:00'
            };
            results.forEach(function(item){
                if(item.Method_Id == 2){
                    result.SingleCoinTimes++;
                    result.LastSingleCoinDatetime = item.Create_Date;
                }
                if(item.Method_Id == 4){
                    result.SingleDimDiamondTimes++;
                    result.LastSingleDiamondDatetime = item.Create_Date;
                }
            });
            callback(null,result);
        }
    })
}