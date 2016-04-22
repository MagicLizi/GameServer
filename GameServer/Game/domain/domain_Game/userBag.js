/**
 * Created by peihengyang on 14/12/20.
 */
var code = require('../../code');
var gameEnum = require('../../enum');
var gameBagProviter = require('../../dao_provider/dao_Game/Bag');
var domainUserHero = require('../../domain/domain_Game/gameUser');
var gameUserProviter = require('../../dao_provider/dao_Game/gameUser');
var editGlobalProviter = require('../../dao_provider/dao_edit/global');
var util = require('../../../Util/txUtil');
var userBag = module.exports;
var async =  require('async');

userBag.getBagByUserId = function(userId,callback) {
    gameBagProviter.getBagByUserId(userId,function(error,result){
        if(error){
            console.log(error);
        }else{
            callback(null,result);
        }
    });
};

userBag.addItemToBag = function(userId,ItemId,amount,callback){
    var userBagModel ={};
    userBagModel.User_Id = userId;
    userBagModel.Item_Amount = amount;
    userBagModel.Item_Id = ItemId;
    userBagModel.Create_Date = new Date();
    var userItems = [];
    userItems.push(userBagModel);
    console.log('oneItem');
    console.log(ItemId);
    gameBagProviter.insertItemsToBag(userBagModel,userItems,function(error,result){
        if(error){
            console.log(error);
            return callback(error,null);
            callback(error,null);
        }else{
            async.eachSeries(userItems,function(item,callback){
                //userItems.forEach(function (item) {
                console.log("eachSeries");
                gameBagProviter.getUserBagById(item.User_Id,item.Item_Id,function(error,resultUserItem){
                    console.log(resultUserItem);
                    if(error!=null){
                        console.log(error);
                    }
                    else
                    {
                        if(resultUserItem[0].Auto_Open==1){
                            console.log("aaaa");
                            console.log(item);
                            console.log(resultUserItem[0]);
                            userBag.useItemById(item.User_Id,item.Item_Id,resultUserItem[0].Item_Amount,0,function(error,resultUseItem){
                                if(error!=null){
                                    console.log(error);
                                    return callback(error,null);
                                }
                                else
                                {

                                    callback(null,resultUseItem);
                                }
                            })
                        }
                        else
                        {
                            callback(null,resultUserItem);
                        }
                    }

                });
                //});
            },function(error,result){
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    console.log("resultUseItem++++++++++++");
                    console.log(result);
                    callback(null,result);
                }
            });

            callback(null,result);
        }
    });
};

/*
 Item_List:[{
 Item_Id: resultsGoods.Item_Id,
 Item_Amount: resultsGoods.Item_Amount,
 User_Id: user_Id
 }]
 */
userBag.addItemsToBag = function(userId,Item_List,callback){
    var userBagModel ={};
    userBagModel.User_Id = userId;
    userBagModel.Create_Date = new Date();
    var userItems = Item_List;
    console.log("userItems:");
    console.log(userItems);
    gameBagProviter.insertItemsToBag(userBagModel,userItems,function(error,result){
        if(error){
            console.log(error);
            callback(error,null);
        }else{
            var itemFun = [];
            userItems.forEach(function(item){
                itemFun.push(function(callbackItem) {
                        console.log("item");
                        console.log(item);
                        gameBagProviter.getUserBagById(item.User_Id, item.Item_Id, function (error, resultUserItem) {
                            console.log("resultUserItem:");
                            console.log(resultUserItem);
                            if (error != null) {
                                console.log(error);
                                callbackItem(error, null);
                            }
                            else {
                                if (resultUserItem.length != 0){
                                    if (resultUserItem[0].Auto_Open == 1) {
                                        console.log("dddd");
                                        console.log(item);
                                        console.log(resultUserItem);
                                        userBag.useItemById(item.User_Id, item.Item_Id, resultUserItem[0].Item_Amount, item.Target_Id, function (error, resultUseItem) {
                                            if (error != null) {
                                                console.log(error);
                                                callbackItem(error, null);
                                            }
                                            else {
                                                domainUserHero.addTroopExperience(userId,0,function(error,resultAddTroopExp){
                                                    if(error!=null){
                                                        console.log(error);
                                                        callbackItem(error,null);
                                                    }
                                                    else
                                                    {
                                                        callbackItem(null, resultUseItem);
                                                    }
                                                })
                                            }
                                        });
                                    }
                                    else
                                    {
                                        callbackItem(null,result);
                                    }
                                }


                            }

                        });
                    }
                )
            });
            async.parallel(itemFun,function(error,resultUseItem){
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    callback(null,resultUseItem);
                }
            });
        }
    });
}
userBag.useItemById = function(userId,itemId,item_Amount,target_Id,callback){
    console.log('useItemId:',itemId);
    editGlobalProviter.getGlobal(function(error,resultGlobal){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            //钻石使用专门处理
            if(itemId == resultGlobal.Diamond || itemId == resultGlobal.Purchased_Diamond){
                gameBagProviter.getUserBagById(userId,resultGlobal.Diamond,function(error,resultDiamond){
                    if(error!=null){
                        console.log(error);
                        callback(error,null);
                    }
                    else
                    {
                        gameBagProviter.getUserBagById(userId,resultGlobal.Purchased_Diamond,function(error,resultPurchasedDiamond){
                            if(error!=null){
                                console.log(error);
                                callback(error,null);
                            }
                            else
                            {
                                var diamond = 0;
                                var p_Diamond = 0;
                                if(resultPurchasedDiamond[0]!=null){
                                    p_Diamond = resultPurchasedDiamond[0].Item_Amount;
                                }
                                if(resultDiamond[0]!=null){
                                    diamond = resultDiamond[0].Item_Amount;
                                }
                                if(diamond+p_Diamond<item_Amount){
                                    callback(code.UserBag.Item_Not_Enough,result);
                                }
                                if(p_Diamond!=0){
                                    //购买的钻石够用情况
                                    if(p_Diamond>= item_Amount){
                                        gameBagProviter.useItemById(userId,resultGlobal.Purchased_Diamond,item_Amount,target_Id,function(error,result){
                                            console.log("userItemResult");
                                            console.log(result,'|',item_Amount);
                                            if(error!= null ){
                                                console.log(error);
                                                if(error = 0){
                                                    callback(code.UserBag.Item_Use_Fail,null)
                                                }
                                                else
                                                {
                                                    callback(error,null);
                                                }

                                            }
                                            else
                                            {
                                                if(result != 1){
                                                    console.log(code.UserBag.Item_Not_Enough);
                                                    callback(code.UserBag.Item_Not_Enough,null);
                                                }
                                                else
                                                {
                                                    util.paym(userId,item_Amount,function(error,resultPaym){
                                                        if(error!=null){
                                                            console.log(error);
                                                            callback(error,null);
                                                        }
                                                        else
                                                        {
                                                            callback(null,resultPaym);
                                                        }
                                                    })
                                                }
                                            }
                                        })
                                    }
                                    else
                                    {
                                        //购买的钻石不够使用
                                        var freeDiamond = item_Amount - p_Diamond;
                                        gameBagProviter.useItemById(userId,resultGlobal.Purchased_Diamond,p_Diamond,target_Id,function(error,result){
                                            console.log("userItemResult");
                                            console.log(result,'|',item_Amount);
                                            if(error!= null ){
                                                console.log(error);
                                                if(error = 0){
                                                    callback(code.UserBag.Item_Use_Fail,null)
                                                }
                                                else
                                                {
                                                    callback(error,null);
                                                }

                                            }
                                            else
                                            {
                                                if(result != 1){
                                                    console.log(code.UserBag.Item_Not_Enough);
                                                    callback(code.UserBag.Item_Not_Enough,null);
                                                }
                                                else
                                                {
                                                    util.paym(userId,p_Diamond,function(error,resultPaym){
                                                        if(error!=null){
                                                            console.log(error);
                                                            callback(error,null);
                                                        }
                                                        else
                                                        {
                                                            //使用免费钻石
                                                            gameBagProviter.useItemById(userId,resultGlobal.Diamond,freeDiamond,0,function(error,resultUseItem){
                                                                if(error!=null){
                                                                    console.log(error);
                                                                    callback(error,null);
                                                                }
                                                                else
                                                                {

                                                                    callback(null,resultPaym);
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            }
                                        })

                                    }
                                }
                                else if (diamond != 0)  //免费钻石
                                {
                                    console.log('diamond');
                                    gameBagProviter.useItemById(userId,resultGlobal.Diamond,item_Amount,target_Id,function(error,result){
                                        console.log("userItemResult");
                                        console.log(result,'|',item_Amount);
                                        if(error!= null ){
                                            console.log(error);
                                            if(error = 0){
                                                callback(code.UserBag.Item_Use_Fail,null)
                                            }
                                            else
                                            {
                                                callback(error,null);
                                            }

                                        }
                                        else
                                        {
                                            if(result != 1){
                                                console.log(code.UserBag.Item_Not_Enough);
                                                callback(code.UserBag.Item_Not_Enough,null);
                                            }
                                            else
                                            {
                                                callback(null,result);

                                            }
                                        }
                                    })
                                }
                                else
                                {
                                    callback(code.UserBag.Item_Not_Found,null);
                                }


                            }
                        })
                    }
                })
            }
            else
            {
                gameBagProviter.useItemById(userId,itemId,item_Amount,target_Id,function(error,result){
                    console.log("userItemResult");
                    console.log(result,'|',item_Amount);
                    if(error!= null ){
                        console.log(error);
                        if(error = 0){
                            callback(code.UserBag.Item_Use_Fail,null)
                        }
                        else
                        {
                            callback(error,null);
                        }

                    }
                    else
                    {
                        if(result != 1){
                            console.log(code.UserBag.Item_Not_Enough);
                            callback(code.UserBag.Item_Not_Enough,null);
                        }
                        else
                        {
                            //util.paym(userId,item_Amount,function(error,resultPaym){
                            //    if(error!=null){
                            //        console.log(error);
                            //        callback(error,null);
                            //    }
                            //    else
                            //    {

                                    console.log("getUserByUserIdHeroId");
                                    gameUserProviter.getUserByUserIdHeroId(userId,target_Id,function(error,resultHero){
                                        if(error!=null){
                                            console.log(error);
                                            callback(error,null);
                                        }
                                        else
                                        {
                                            var resultHeros = [];
                                            if(resultHero != null){
                                                resultHero.User_Id = resultHero.Membership_Id;
                                                resultHeros.push(resultHero)
                                                console.log("checkHerosExperience");
                                                domainUserHero.checkHerosExperience(resultHeros,function(error,result){
                                                    if(error!=null){
                                                        console.log(error);
                                                        callback(error,null);
                                                    }
                                                    else
                                                    {
                                                        console.log("addTroopExperience");
                                                        domainUserHero.addTroopExperience(userId,0,function(error,resultAddTroopExp){
                                                            if(error!=null){
                                                                console.log(error);
                                                                callback(error,null);
                                                            }
                                                            else
                                                            {
                                                                console.log(resultHero);
                                                                callback(null,resultHero);
                                                            }
                                                        })

                                                    }
                                                })
                                            }
                                            else
                                            {
                                                callback(null,null);
                                            }
                                        }
                                    });
                            //    }
                            //})
                        }
                    }
                })

            }
        }
    })
}

userBag.sellItemById = function(userId,itemId,item_Amount,callback){
    gameBagProviter.getUserBagById(userId,itemId,function(error,result){
        if(error != null){
            console.log(error);
        }
        else
        {
            var userBagModel = createUserBagModel(result[0]);
            console.log(userBagModel);
            if(userBagModel.Item_Amount>= item_Amount){
                userBagModel.Item_Amount = userBagModel.Item_Amount - item_Amount;
                gameBagProviter.updateUserBag(userBagModel,function(error,result){
                    if(error!=null){
                        console.log(error);
                    }
                    else
                    {
                        var userCoinModel = createUserBagModel(null)
                        userCoinModel.User_Id = userId;
                        userCoinModel.Item_Id = 4;
                        userCoinModel.Item_Amount = item_Amount*userBagModel.Price;

                        gameBagProviter.insertItemToBag(userCoinModel,function(error,result){
                            if(error != null){
                                console.log(error);
                            }
                            else
                            {
                                callback(null,result);
                            }
                        });
                    }
                });
            }
            else
            {
                callback(code.UserBag.Item_Not_Enough,result);
            }
        }


    });
}

userBag.mergeItem = function(userId,itemId,callback){
    gameBagProviter.getMergerByItemId(itemId,function(error,results){
        console.log("MergerItem:",results);
        checkItemsAmount(userId,results,function(error,result){
            if(error != null){
                console.log(error);
                callback(error,null);
            }
            else
            {
                console.log("MergerResult:",result);
                if (result){
                    gameBagProviter.mergeItemOne(userId,results,function(error,result){
                        if(error != null){
                            console.log(error);
                        }
                        else
                        {
                            callback(null,result);
                        }
                    })
                }
            }
        })

    });
}

var checkItemsAmount = function(userId,models,callback){
    var modelFun = [];
    models.forEach(function(item){
        modelFun.push(function(callbackCheck){
            gameBagProviter.getUserBagById(userId,item.Source_Item_Id,function(error,result){
                if(error != null){
                    console.log(error);
                    callbackCheck(error,false);
                }
                else
                {
                    if(result[0].Item_Amount < item.Source_Item_Amount){
                        callbackCheck(code.UserBag.Item_Not_Enough,false);
                    }
                }
            });
        }
        );
    });
    var checkIt = true;
    async.parallel(modelFun,function(error,callbackCheckResult){
        if(error!=null){
            console.log('CheckItem:',error);
            checkIt =  false;
            //callback(error,false);
        }
        else
        {
            if(!callbackCheckResult){
                checkIt =  false;
            }
        }
    })
    console.log('checkIt:',checkIt);
    callback(null,checkIt);
}

function createUserBagModel(result){
    if(result==null){
        var userBagModel = {
            User_Bag_Id : 0,
            User_Id:0,
            Item_Id:0,
            Item_Amount :0,
            Price : 0,
            Create_Date:new Date()
        };
    }else {
        var userBagModel = {
            User_Bag_Id: result.User_Bag_Id,
            User_Id: result.User_Id,
            Item_Id: result.Item_Id,
            Item_Amount: result.Item_Amount,
            Price: result.Price,
            Create_Date: new Date()
        }
    }

    return userBagModel;
}

function itemEffect(userId,userItems,target_Id,callback){
    var effect_Flag = false;
    userItems.forEach(function(item){
        switch (item.Effect_Type)
        {
            case gameEnum.Item_Effect_Type.Coin:
                var userBagCoin =  createUserBagModel(null);
                userBagCoin.User_Id = userId;
                userBagCoin.Item_Id = 4;//金币物品编号为4
                userBagCoin.Price = 1;
                userBagCoin.Item_Amount = item.Effect_Value;
                gameBagProviter.insertItemToBag(userBagCoin,function(error,result){
                    if(error!= null){
                        console.log(error);
                    }
                    else
                    {
                        callback(null,true);
                    }
                })
                break;
            case gameEnum.Item_Effect_Type.HeroExperience:
                console.log("HeroExperience");
                domainUserHero.addHeroExperience(userId,target_Id,item.Effect_Value,function(error,result){
                    if(error!= null){
                        console.log(error);
                        callback(error,null);
                    }
                    else
                    {
                        callback(null,result);
                    }
                })
                break;
            case gameEnum.Item_Effect_Type.Stamina:
                console.log('Stamina');

                break;
        }
    })
    return callback(null,false);
}

userBag.getCurrencys = function(callback){
    editGlobalProviter.getGlobal(function(error,results){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            callback(null,{Gold:results.Gold,
                Diamond:results.Diamond,
                PVPCoin:results.PVPCoin,
                FarFightCoin:results.FarFightCoin})
        }
    })

}