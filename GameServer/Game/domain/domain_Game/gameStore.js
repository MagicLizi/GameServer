/**
 * Created by peihengyang on 15/7/6.
 */

var code = require('../../code');
var gameEnum = require('../../enum');
var storeProviter = require('../../dao_provider/dao_Game/store');
var gameUserProviter = require('../../dao_provider/dao_Game/gameUser');
var userDungeonProviter = require('../../dao_provider/dao_Game/dungeon');
var editGolbalProviter = require('../../dao_provider/dao_edit/global');
var editStoreProviter =  require('../../dao_provider/dao_edit/store');
var gameBagProviter = require('../../dao_provider/dao_Game/Bag');
var userLotteryProviter = require('../../dao_provider/dao_Game/lottery');
var VIPProviter = require('../../dao_provider/dao_Game/VIP');
var userVIPDomain = require('./userVIP');
var userBagDomain = require('./userBag');
var gameUserDomain = require('./gameUser');
var userTaskDomain = require('./userTask');
var util = require('../../../Util/txUtil');
var editProvider = require('../domain_config/config');
var async = require('async');
var gameStore = module.exports;

var editStore = editProvider.getConfig('store').info;
var editGolbal = editProvider.getConfig('global').info;
gameStore.buyStamina = function(userId,callback){
    editGolbalProviter.getGlobal(function(error,resultsGolbal){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            buyGoods(userId,resultsGolbal.StaminaStore,resultsGolbal,0,function(error,resultBuyGoods){
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    callback(null,resultBuyGoods);
                }
            })
        }
    })
}

gameStore.buyCoin = function(userId,callback){
    editGolbalProviter.getGlobal(function(error,resultsGolbal){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            gameUserProviter.getTroopByUserId(userId,function(error,resultUserTroop){
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    buyGoods(userId,resultsGolbal.CoinStore,resultsGolbal,resultUserTroop[0].Troop_Lvl,function(error,resultBuyGoods){
                        if(error!=null){
                            console.log(error);
                            callback(error,null);
                        }
                        else
                        {
                            callback(null,resultBuyGoods);
                        }
                    })

                }
            })
        }
    })
}

gameStore.buyFourLeaf = function(userId,callback){
    var Items = [{
        User_Id:userId,
        Item_Id:editGolbal.FourLeaf,
        Item_Amount:1
    }];
    console.log('editGolbal.FourLeafPrice:',editGolbal.DiamondExpend.FourLeafPrice);
    userBagDomain.useItemById(userId,editGolbal.Purchased_Diamond,editGolbal.DiamondExpend.FourLeafPrice,0,function(error,resultUserItem){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            userBagDomain.addItemsToBag(userId,Items,function(erro,resultaddItem){
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    callback(null,null);
                }
            })
        }
    })
}

gameStore.buyPVETimes = function(userId,stageId,callback){
    editGolbalProviter.getGlobal(function(error,resultsGolbal){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            buyGoods(userId,resultsGolbal.PVETimesStore,resultsGolbal,stageId,function(error,resultBuyGoods){
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    callback(null,resultBuyGoods);
                }
            })
        }
    })
}

gameStore.buySkillPoint = function(userId,callback){
    editGolbalProviter.getGlobal(function(error,resultsGolbal){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            gameUserDomain.checkUserExist(userId,function(error,resultCheckUser){
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    buyGoods(userId,resultsGolbal.SkillPointStore,resultsGolbal,0,function(error,resultBuyGoods){
                        if(error!=null){
                            console.log(error);
                            callback(error,null);
                        }
                        else
                        {
                            callback(null,resultBuyGoods);
                        }
                    })
                }
            })

        }
    })
}

gameStore.buyDiamond = function(userId,source,amount,callback){
    if(source == gameEnum.SourceType.Oauth || source == gameEnum.SourceType.WXOauth){

        util.getBalance(userId,source,function(error,resultBalance){
            if(error != null){
                console.log(error);
                callback(code.ThirdPart.TX_Get_Balance_Error,null);
            }
            else
            {
                editGolbalProviter.getGlobal(function(error,resultGolbal){
                    if(error!=null){
                        console.log(error);
                        callback(error,null);
                    }
                    else
                    {
                        console.log('getUserBagById');
                        gameBagProviter.getUserBagById(userId,resultGolbal.Purchased_Diamond,function(error,resultsUserBag){
                            if(error!=null){
                                console.log(error);
                                callback(error,null);
                            }
                            else
                            {
                                var userBagModel = {};
                                console.log(resultGolbal.Purchased_Diamond,resultsUserBag.length);
                                if(resultsUserBag.length == 0){
                                    console.log('userBag Is Null');
                                    userBagModel.User_Id = userId;
                                    userBagModel.Item_Id = resultGolbal.Purchased_Diamond;
                                    userBagModel.Item_Amount = resultBalance.diamond;
                                    gameBagProviter.insertItemsToBag('',[userBagModel],function(error,resultsInsertItem){
                                        if(error!=null){
                                            console.log(error);
                                            callback(error,null);
                                        }
                                        else
                                        {
                                            var goodsModel = {
                                                Goods_Id:0,
                                                Store_Id:resultGolbal.DiamondStore,
                                                Item_Amount:amount
                                            }
                                            storeProviter.addStoreHistory(userId,goodsModel,function(error,resultaddHis){
                                                if(error!=null){
                                                    console.log(error);
                                                    callback(error,null);
                                                }
                                                else
                                                {
                                                    console.log(resultsInsertItem);
                                                    callback(null,resultsInsertItem);
                                                }
                                            })
                                        }
                                    })
                                }
                                else
                                {
                                    userBagModel = resultsUserBag[0];
                                    console.log('update bag');
                                    userBagModel.Item_Amount = resultBalance.diamond;
                                    gameBagProviter.updateUserBag(userBagModel,function(error,resultUpdateUserBag){
                                        if(error!=null){
                                            console.log(error);
                                            callback(error,null);
                                        }
                                        else
                                        {
                                            var goodsModel = {
                                                Goods_Id:0,
                                                Store_Id:resultGolbal.DiamondStore,
                                                Item_Amount:amount
                                            }
                                            storeProviter.addStoreHistory(userId,goodsModel,function(error,resultaddHis){
                                                if(error!=null){
                                                    console.log(error);
                                                    callback(error,null);
                                                }
                                                else
                                                {
                                                    console.log('resultaddHis:',resultaddHis);
                                                    callback(null, resultaddHis);
                                                }
                                            })
                                        }
                                    });
                                }
                            }
                        })
                    }
                })
            }
        })
    }
    else if (source ==  gameEnum.SourceType.WXIOS || source == gameEnum.SourceType.Normal
    || source == gameEnum.SourceType.SanLiuLing || source == gameEnum.SourceType.XiaoMi
        || source == gameEnum.SourceType.HuaWei)
    {
        //var ratio = 100;
        //var price = 0;
        //switch (source){
        //    case gameEnum.SourceType.SanLiuLing:
        //        price =
        //        break;
        //
        //}
        editGolbalProviter.getGlobal(function(error,resultsGolbal){
            if(error!=null){
                console.log(error);
                callback(error,null);
            }
            else
            {
                var Goods_Id = amount;
                buyGoods(userId,resultsGolbal.DiamondStore,resultsGolbal,Goods_Id,function(error,resultBuyGoods){
                    if(error!=null){
                        console.log(error);
                        callback(error,null);
                    }
                    else
                    {
                        callback(null,resultBuyGoods);
                    }
                })
            }
        })
    }
    else
    {
        callback(code.UserBag.Item_Add_Fail,null);
    }
}

gameStore.getGoblinStore =  function(user_Id,Times,callback){
    editGolbalProviter.getGlobal(function(error,resultGlobal){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            var GoblinFlag = 0;
            //console.log('editStore:',editStore);
            editStore.Store.forEach(function(store){
                if(store.Store_Id == resultGlobal.GoblinStore){
                    var appear_Pre = (1-Math.pow((1-store.Appear_Pre/10000),Times))*10000;
                    console.log('appear_Pre:',appear_Pre);
                    if(appear_Pre >= Math.random()*10000){
                        GoblinFlag = 1;
                    }
                }
            })
            console.log('GoblinFlag12:',GoblinFlag);
            if(GoblinFlag == 1){
                var Store_Id = resultGlobal.GoblinStore;
                editStoreProviter.getStoreById(Store_Id,function(error,resultStore){
                    if(error!=null) {
                        console.log(error);
                        callback(error, null);
                    }
                    else
                    {
                        storeProviter.getStoreByUserIdStoreId(user_Id,resultGlobal.GoblinStore,function(error,resultsUserGoblinStore) {
                            if (error != null) {
                                console.log(error);
                                callback(error, null);
                            }
                            else {
                                var GoblinCreateHour = 0 ,nowTimeHour = 0;
                                if(resultsUserGoblinStore.length != 0){
                                    GoblinCreateHour = resultsUserGoblinStore[0].Create_Date.getTime();
                                    nowTimeHour = new Date().getTime();
                                }
                                if(resultsUserGoblinStore.length == 0 || nowTimeHour - GoblinCreateHour >= 2 * 60 * 3600){
                                    var userModel = {};
                                    userModel.User_Id = user_Id;
                                    userModel.Lottery_Method_Id = resultStore.Pool_Id;
                                    //商店商品抽奖生成
                                    console.log('lootItem');
                                    userLotteryProviter.lootItem(userModel,function(error,result){
                                        if(error!=null){
                                            console.log(error);
                                            callback(error,null);
                                        }
                                        else
                                        {
                                            //添加商店商品
                                            console.log('addUserStore');
                                            storeProviter.addUserStore(result,0,new Date(),new Date(),Store_Id,GoblinFlag,function(error,resultsAddUserStore){
                                                if(error!=null){
                                                    console.log(error);
                                                    callback(error,null);
                                                }
                                                else
                                                {
                                                    storeProviter.getStoreByUserIdStoreId(user_Id,resultGlobal.GoblinStore,function(error,resultsUserGoblinStoreNew){
                                                        if(error!=null){
                                                            console.log(error);
                                                            callback(error,null);
                                                        }
                                                        else {

                                                            console.log("2");
                                                            callback(null, {
                                                                GoblinStore:resultsUserGoblinStoreNew});
                                                        }
                                                    })

                                                }
                                            });
                                        }
                                    })
                                }
                                else
                                {
                                    callback(null, {
                                        GoblinStore:resultsUserGoblinStore});
                                }
                            }
                        });

                    }
                })
            }
            else
            {
                callback(null, {
                    GoblinStore:[]});
            }
        }
    })
}
gameStore.RefreshStore = function(user_Id,Store_Id,callback){
    var userModel = {
        User_Id:user_Id,
        Pool_Id:0
    };
    var Create_Date = new Date();
    editGolbalProviter.getGlobal(function(error,resultGlobal){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            if(Store_Id == resultGlobal.NormalDiamondStore || Store_Id == resultGlobal.NormalCoinStore){
                Store_Id = resultGlobal.NormalDiamondStore;
                //获取商店
                console.log("获取普通钻石商店");
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
                                storeProviter.getStoreByUserIdStoreId(user_Id,Store_Id,function(error,resultsUserStore){
                                    if(error!=null){
                                        console.log(error);
                                        callback(error,null);
                                    }
                                    else
                                    {
                                        var userStoreModel =  createUserStoreModel(user_Id);
                                        var Refresh_Times = 0;
                                        var Refresh_Date = new Date();
                                        var Refresh_Expend_List = resultStore.Refresh_Expend.split(',');
                                        if(resultsUserStore.length != 0){
                                            Refresh_Times = resultsUserStore[0].Refresh_Times+1;
                                        }
                                        var RefreshExpend = 0;
                                        console.log('Refresh_Times:',Refresh_Times);
                                        if(Refresh_Times >= Refresh_Expend_List.length){
                                            RefreshExpend = Refresh_Expend_List[Refresh_Expend_List.length-1];
                                        }
                                        else
                                        {
                                            RefreshExpend = Refresh_Expend_List[Refresh_Times-1];
                                        }
                                        //添加商店商品
                                        storeProviter.addUserStore(result,Refresh_Times,Refresh_Date,
                                            Create_Date,Store_Id,1,function(error,resultsAddUserStore){
                                            if(error!=null){
                                                console.log(error);
                                                callback(error,null);
                                            }
                                            else
                                            {
                                                Store_Id = resultGlobal.NormalCoinStore;
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
                                                                //添加商店商品
                                                                storeProviter.addUserStore(result,Refresh_Times,Refresh_Date,
                                                                    Create_Date,Store_Id,1,function(error,resultsAddUserStore){
                                                                    if(error!=null){
                                                                        console.log(error);
                                                                        callback(error,null);
                                                                    }
                                                                    else
                                                                    {
                                                                        storeProviter.getNormalStoreByUserId(user_Id,resultGlobal,function(error,resultsUserNormalStoreNew){
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
                                                                                            Item_Id: resultsCurrency.Diamond,
                                                                                            Item_Amount: RefreshExpend,
                                                                                            Auto_Open: 0
                                                                                        };
                                                                                        console.log("useItemById:",Item_List);
                                                                                        userBagDomain.useItemById(user_Id, Item_List.Item_Id, Item_List.Item_Amount, 0, function (error, resultAddItems) {
                                                                                            if (error != null) {
                                                                                                console.log(error);
                                                                                                callback(error, null)
                                                                                            }
                                                                                            else {
                                                                                                console.log("2");
                                                                                                console.log(resultsUserNormalStoreNew);
                                                                                                callback(null, {UserStore: resultsUserNormalStoreNew});
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
                                storeProviter.getStoreByUserIdStoreId(user_Id,Store_Id,function(error,resultsUserStore){
                                    if(error!=null){
                                        console.log(error);
                                        callback(error,null);
                                    }
                                    else
                                    {
                                        var userStoreModel =  createUserStoreModel(user_Id);
                                        var Refresh_Times = 0;
                                        var Refresh_Date = new Date();
                                        var Refresh_Expend_List = resultStore.Refresh_Expend.split(',');
                                        if(resultsUserStore.length != 0){
                                            Refresh_Times = resultsUserStore[0].Refresh_Times+1;
                                            Create_Date = resultsUserStore[0].Create_Date;
                                        }
                                        var RefreshExpend = 0;
                                        if(Refresh_Times >= Refresh_Expend_List.length){
                                            RefreshExpend = Refresh_Expend_List[Refresh_Expend_List.length-1];
                                        }
                                        else
                                        {
                                            RefreshExpend = Refresh_Expend_List[Refresh_Times-1];
                                        }
                                        //添加商店商品
                                        storeProviter.addUserStore(result,Refresh_Times,Refresh_Date,
                                            Create_Date,Store_Id,1,function(error,resultsAddUserStore){
                                            if(error!=null){
                                                console.log(error);
                                                callback(error,null);
                                            }
                                            else
                                            {
                                                storeProviter.getStoreByUserIdStoreId(user_Id,Store_Id,function(error,resultsUserStoreNew){
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
                                                                Item_List.Item_Id = resultsCurrency.Diamond;

                                                                console.log("useItemById:",Item_List);
                                                                userBagDomain.useItemById(user_Id, Item_List.Item_Id, Item_List.Item_Amount, 0, function (error, resultAddItems) {
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
        }
    })

}

gameStore.InitStore = function(user_Id,callback){
    var userModel = {
        User_Id:user_Id,
        Pool_Id:0
    };
    var Store_Id;
    storeProviter.addStoreInitLog(user_Id,function(error,resultAddStoreLog){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {

            editGolbalProviter.getGlobal(function(error,resultGlobal){
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    Store_Id = resultGlobal.NormalDiamondStore;
                    var nowTime = new Date().getHours();
                    var updateTime,Refresh_Times,createTime;
                    var Refresh_Date = new Date();
                    var Create_Date = new Date();
                    var Refresh_Time_List;
                    var NormalFlag = 0;
                    //获取商店
                    console.log("获取普通商店");
                    storeProviter.getNormalStoreByUserId(user_Id,resultGlobal,function(error,resultsUserStore){
                        if(error!=null){
                            console.log(error);
                            callback(error,null);
                        }
                        else
                        {
                            editStoreProviter.getStoreById(Store_Id,function(error,resultStore){
                                if(error!=null) {
                                    console.log(error);
                                    callback(error, null);
                                }
                                else
                                {
                                    if(resultsUserStore.length != 0){
                                        console.log('resultsUserStore:',resultsUserStore[0]);
                                        console.log('resultStore:',resultStore);
                                        updateTime = resultsUserStore[0].Refresh_Date.getHours();
                                        createTime = resultsUserStore[0].Create_Date.getHours();
                                        Create_Date =  resultsUserStore[0].Create_Date;
                                        if(resultStore.Refresh_Time == ''){
                                            Refresh_Time_List = ',';
                                        }
                                        else
                                        {
                                            Refresh_Time_List = resultStore.Refresh_Time.split(',');
                                        }
                                        console.log('updateTime1:',updateTime);
                                        console.log('nowTime1:',nowTime);
                                        Refresh_Time_List.forEach(function(Refresh_Time){
                                            console.log('Refresh_Time1:',Refresh_Time);
                                            if(((Refresh_Time > updateTime && Refresh_Time < nowTime + 1) ||
                                                    //||(((Refresh_Time < updateTime && Refresh_Time < nowTime + 1)
                                                    //||(Refresh_Time > updateTime && Refresh_Time > nowTime - 1)) &&
                                                (Refresh_Time < nowTime + 1 &&
                                                new Date().getDate()-resultsUserStore[0].Refresh_Date.getDate() >= 1 ))
                                                && NormalFlag == 0 ){
                                                console.log('true');
                                                NormalFlag = 1;
                                                Refresh_Times = resultsUserStore[0].Refresh_Times;
                                            }
                                        })
                                    }
                                    else{
                                        NormalFlag = 1;
                                        Refresh_Times = 0;
                                    }
                                    userModel.Lottery_Method_Id = resultStore.Pool_Id;
                                    //商店商品抽奖生成
                                    userLotteryProviter.lootItem(userModel,function(error,result){
                                        if(error!=null){
                                            console.log(error);
                                            callback(error,null);
                                        }
                                        else
                                        {
                                            //添加商店商品
                                            storeProviter.addUserStore(result,Refresh_Times,Refresh_Date,
                                                Create_Date,Store_Id,NormalFlag,function(error,resultsAddUserStore){
                                                    if(error!=null){
                                                        console.log(error);
                                                        callback(error,null);
                                                    }
                                                    else
                                                    {
                                                        Store_Id = resultGlobal.NormalCoinStore;
                                                        editStoreProviter.getStoreById(Store_Id,function(error,resultCoinStore){
                                                            if(error!=null) {
                                                                console.log(error);
                                                                callback(error, null);
                                                            }
                                                            else
                                                            {
                                                                userModel.Lottery_Method_Id = resultCoinStore.Pool_Id;
                                                                //商店商品抽奖生成
                                                                userLotteryProviter.lootItem(userModel,function(error,result){
                                                                    if(error!=null){
                                                                        console.log(error);
                                                                        callback(error,null);
                                                                    }
                                                                    else
                                                                    {
                                                                        //添加商店商品
                                                                        storeProviter.addUserStore(result,Refresh_Times,Refresh_Date,
                                                                            Create_Date,Store_Id,NormalFlag,
                                                                            function(error,resultsAddUserStore){
                                                                                if(error!=null){
                                                                                    console.log(error);
                                                                                    callback(error,null);
                                                                                }
                                                                                else
                                                                                {
                                                                                    storeProviter.getNormalStoreByUserId(user_Id,resultGlobal,function(error,resultsUserNormalStoreNew){
                                                                                        if(error!=null){
                                                                                            console.log(error);
                                                                                            callback(error,null);
                                                                                        }
                                                                                        else {

                                                                                            Store_Id = resultGlobal.GoblinStore;
                                                                                            console.log('resultGlobal.GoblinStore:',Store_Id)
                                                                                            editStoreProviter.getStoreById(Store_Id,function(error,resultGoblinStore){
                                                                                                if(error!=null){
                                                                                                    console.log(error);
                                                                                                    callback(error,null);
                                                                                                }
                                                                                                else
                                                                                                {
                                                                                                    storeProviter.getStoreByUserIdStoreId(user_Id,Store_Id,function(error,resultsUserStore){
                                                                                                        if(error!=null){
                                                                                                            console.log(error);
                                                                                                            callback(error,null);
                                                                                                        }
                                                                                                        else
                                                                                                        {
                                                                                                            VIPProviter.getUserVIPByUserId(user_Id,function(error,resultUserVIP){
                                                                                                                if(error!=null){
                                                                                                                    console.log(error);
                                                                                                                    callback(error,null);
                                                                                                                }
                                                                                                                else
                                                                                                                {
                                                                                                                    var resultCheckVIPAuth = userVIPDomain.checkVIPNormal(resultUserVIP,gameEnum.VIP_Authority.ForeverGoblinStore);
                                                                                                                    if(resultsUserStore.length != 0 ){//非VIP用户,商店不为空的时候,并且没有超时,或者VIP用户并且商店不为空,则进行刷新
                                                                                                                        updateTime = resultsUserStore[0].Refresh_Date.getHours();
                                                                                                                        createTime = resultsUserStore[0].Create_Date.getHours();
                                                                                                                        Create_Date =  resultsUserStore[0].Create_Date;
                                                                                                                        if(resultGoblinStore.Refresh_Time == ''){
                                                                                                                            Refresh_Time_List = [];
                                                                                                                        }
                                                                                                                        else
                                                                                                                        {
                                                                                                                            Refresh_Time_List = resultGoblinStore.Refresh_Time.split(',');
                                                                                                                        }
                                                                                                                        console.log('Refresh_Time_List',Refresh_Time_List);
                                                                                                                        console.log('updateTime1:',updateTime);
                                                                                                                        console.log('nowTime1:',nowTime);
                                                                                                                        var GoblinFlag = 0;
                                                                                                                        Refresh_Time_List.forEach(function(Refresh_Time){
                                                                                                                            console.log('Refresh_Time1:',Refresh_Time);
                                                                                                                            //是否自动刷新时间
                                                                                                                            //if(((Refresh_Time > updateTime && Refresh_Time < nowTime)
                                                                                                                            //    ||(((Refresh_Time < updateTime && Refresh_Time < nowTime)
                                                                                                                            //    ||(Refresh_Time > updateTime && Refresh_Time > nowTime)) &&
                                                                                                                            //    new Date().getDate()-resultsUserStore[0].Refresh_Date.getDate() >= 1 ))
                                                                                                                            if(((Refresh_Time > updateTime && Refresh_Time < nowTime + 1) ||
                                                                                                                                    //||(((Refresh_Time < updateTime && Refresh_Time < nowTime + 1)
                                                                                                                                    //||(Refresh_Time > updateTime && Refresh_Time > nowTime - 1)) &&
                                                                                                                                (Refresh_Time < nowTime + 1 &&
                                                                                                                                new Date().getDate()-resultsUserStore[0].Refresh_Date.getDate() >= 1 ))
                                                                                                                                && GoblinFlag == 0){
                                                                                                                                //是否常驻商店
                                                                                                                                console.log('resultCheckVIPAuth:',resultCheckVIPAuth,'resultUserVIP:',resultUserVIP);
                                                                                                                                if(resultCheckVIPAuth){
                                                                                                                                    console.log('1');
                                                                                                                                    GoblinFlag = 1;
                                                                                                                                    Refresh_Times = resultsUserStore[0].Refresh_Times;
                                                                                                                                }
                                                                                                                                else
                                                                                                                                {
                                                                                                                                    if(nowTime - createTime >= 2){
                                                                                                                                        console.log('2');
                                                                                                                                        GoblinFlag = 0;
                                                                                                                                    }
                                                                                                                                    else
                                                                                                                                    {
                                                                                                                                        console.log('3');
                                                                                                                                        GoblinFlag = 1;
                                                                                                                                        Refresh_Times = resultsUserStore[0].Refresh_Times;
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            }
                                                                                                                        })
                                                                                                                    }
                                                                                                                    else if(resultCheckVIPAuth){
                                                                                                                        console.log('4');
                                                                                                                        GoblinFlag = 1;
                                                                                                                        Refresh_Times = 0;
                                                                                                                    }
                                                                                                                    else{
                                                                                                                        console.log('5');
                                                                                                                        GoblinFlag = 0;
                                                                                                                        Refresh_Times = 0;
                                                                                                                    }
                                                                                                                    console.log('GoblinFlag:',GoblinFlag,'||',new Date());
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
                                                                                                                                    //添加商店商品
                                                                                                                                    storeProviter.addUserStore(result,Refresh_Times,Refresh_Date,
                                                                                                                                        Create_Date,Store_Id,GoblinFlag,function(error,resultsAddUserStore){
                                                                                                                                            if(error!=null){
                                                                                                                                                console.log(error);
                                                                                                                                                callback(error,null);
                                                                                                                                            }
                                                                                                                                            else
                                                                                                                                            {
                                                                                                                                                storeProviter.getStoreByUserIdStoreId(user_Id,resultGlobal.GoblinStore,function(error,resultsUserGoblinStoreNew){
                                                                                                                                                    if(error!=null){
                                                                                                                                                        console.log(error);
                                                                                                                                                        callback(error,null);
                                                                                                                                                    }
                                                                                                                                                    else {

                                                                                                                                                        console.log("2");
                                                                                                                                                        console.log(resultsUserNormalStoreNew);
                                                                                                                                                        callback(null, {NormalStore: resultsUserNormalStoreNew,
                                                                                                                                                            GoblinStore:resultsUserGoblinStoreNew});
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
                                                });
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

gameStore.getUserFirstBuyOfStoreId =  function(userId,storeId,callback){
    storeProviter.getFirstBuyOfStoreId(userId,storeId,function(error,resultsFirstBuy){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            callback(null,resultsFirstBuy);
        }
    })
}


gameStore.buyDiamond1 = function(userId,Goods_Id,source,callback){
    editGolbalProviter.getGlobal(function(error,resultsGolbal){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            buyGoods(userId,resultsGolbal.DiamondStore,resultsGolbal,Goods_Id,function(error,resultBuyGoods){
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    callback(null,resultBuyGoods);
                }
            })
        }
    })
}

var getGoodsByStoreId = function(storeId,callback){
    editStoreProviter.getAllGoodsByStoreId(storeId,function(error,resultGoods){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else{
            callback(null,resultGoods);
        }
    })
}

var getBuyTimes =  function(userId,storeId,callback){
    storeProviter.getTodayStore(userId,storeId,function(error,resultTimes){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            callback(null,resultTimes.length);
        }
    })
}

var getAllBuyTimes = function(userId,goodsId,callback){
    storeProviter.getBuyTimesOfGoodId(userId,goodsId,function(error,resultTimes){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            console.log('BuyTimes:',resultTimes[0].BuyTimes);
            callback(null,resultTimes[0].BuyTimes);
        }
    })
}

var buyGoods = function(userId,storeId,golbal,param1,callback){
    console.log('getBuyTimes',storeId);
    getBuyTimes(userId,storeId,function(error,resultTimes){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            getGoodsByStoreId(storeId,function(error,resultGoods){
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    console.log(resultGoods,"|",storeId,"|",golbal.DiamondStore);
                    var goodsModel = null;
                    if(resultGoods.length > resultTimes){
                        goodsModel = resultGoods[resultTimes];
                    }
                    else
                    {
                        goodsModel = resultGoods[resultGoods.length-1];
                    }
                    //检查购买次数与VIP等级是否符合
                    var vipAuth = 0;
                    var vipAction = 0;
                    switch (storeId){
                        case golbal.StaminaStore:
                            vipAction = gameEnum.VIPAction.BuyStaminaTimes;
                            break;
                        case golbal.SkillPointStore:
                            vipAction = gameEnum.VIPAction.BuySkillPoint;
                            vipAuth = gameEnum.VIP_Authority.BuySkillPoint;
                            break;
                        case golbal.CoinStore:
                            vipAction = gameEnum.VIPAction.BuyCoinTimes;
                            break;
                        default:
                    }
                    var targetId = 0;
                    var addAmount = 0;
                    if(storeId == golbal.PVETimesStore){
                        targetId = param1;
                        userDungeonProviter.getUserDungeonByUserIdStageId(userId,targetId,function(error,resultUserDungeon){
                            if(error!=null){
                                console.log(error);
                                callback(error,null);
                            }
                            else
                            {
                                //goodsModel =  resultGoods[resultUserDungeon[0].Purchase_Times];
                                userVIPDomain.checkVIPOfTimes(userId,gameEnum.VIPAction.BuyPVETimes,resultUserDungeon[0].Purchase_Times,function(error,resultCheckTimes){
                                    if(error!=null){
                                        console.log(error);
                                        callback(error,null);
                                    }
                                    else
                                    {
                                        if(resultCheckTimes){
                                            resultUserDungeon[0].Purchase_Times ++;
                                            userDungeonProviter.updateUserDungeon(resultUserDungeon[0],function(error,resultUpateUserDungeon){
                                                if(error!=null){
                                                    console.log(error);
                                                    callback(error,null);
                                                }
                                                else
                                                {
                                                    userBagDomain.useItemById(userId, goodsModel.Currency_Id, goodsModel.Price * goodsModel.Item_Amount,
                                                        targetId, function(error,resultUseItem){
                                                            if (error != null) {
                                                                console.log(error);
                                                                callback(error, null);
                                                            }
                                                            else {
                                                                console.log("goodsModel");
                                                                console.log(goodsModel);
                                                                var item_List = [{
                                                                    Item_Id: goodsModel.Item_Id,
                                                                    Item_Amount: goodsModel.Item_Amount + addAmount,
                                                                    User_Id: userId,
                                                                    Target_Id : targetId
                                                                }];
                                                                userBagDomain.addItemsToBag(userId, item_List, function (error, resultAddItem) {
                                                                    if (error != null) {
                                                                        console.log(error);
                                                                        callback(error, null);
                                                                    }
                                                                    else {
                                                                        //util.paym(userId,source,goodsModel.Price * goodsModel.Item_Amount,function(error,resultPaym){
                                                                        //    if(error!=null){
                                                                        //        console.log(error);
                                                                        //        callback(error,null);
                                                                        //    }
                                                                        //    else
                                                                        //    {
                                                                        storeProviter.addStoreHistory(userId,goodsModel,function(error,resultaddHis){
                                                                            if(error!=null){
                                                                                console.log(error);
                                                                                callback(error,null);
                                                                            }
                                                                            else
                                                                            {
                                                                                callback(null, resultaddHis);
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
                                            callback(code.UserVIP.Check_VIP_BuyPVETime_error,null);
                                        }
                                    }
                                })
                            }
                        })
                        //    }
                        //})
                    }
                    else
                    {
                        if (storeId == golbal.StaminaStore)
                        {
                            targetId = userId
                        }
                        else if(storeId == golbal.DiamondStore)
                        {
                            console.log("DiamondStore",param1);
                            resultGoods.forEach(function(goods){
                                if(goods.Goods_Id == param1){
                                    goodsModel = goods;
                                    goodsModel.Price = 0;
                                }
                            })
                        }
                        else if(storeId == golbal.CoinStore)
                        {
                            addAmount = param1 * 60;
                        }
                        console.log('goodsModel',goodsModel);
                        userVIPDomain.checkVIP(userId,vipAuth,function(error,resultCheckVIP){
                            if(error!=null){
                                console.log(error);
                                callback(error,null);
                            }
                            else
                            {
                                if(resultCheckVIP){
                                    userVIPDomain.checkVIPOfTimes(userId,vipAction,resultTimes,function(error,resultCheckTimes){
                                        if(error!=null){
                                            console.log(error);
                                            callback(error,null);
                                        }
                                        else
                                        {
                                            if(resultCheckTimes){
                                                userTaskDomain.CanByDiamond(userId,goodsModel.Task_Order,function(error,resultCanByDiamond){
                                                    if(error!=null){
                                                        console.log(error);
                                                        callback(error,null);
                                                    }
                                                    else
                                                    {
                                                        userBagDomain.useItemById(userId, goodsModel.Currency_Id, goodsModel.Price ,
                                                            targetId, function(error,resultUseItem){
                                                                if (error != null) {
                                                                    console.log(error);
                                                                    callback(error, null);
                                                                }
                                                                else {
                                                                    console.log("goodsModel");
                                                                    console.log(goodsModel);
                                                                    var item_List = [{
                                                                        Item_Id: goodsModel.Item_Id,
                                                                        Item_Amount: goodsModel.Item_Amount + addAmount,
                                                                        User_Id: userId,
                                                                        Target_Id : targetId
                                                                    }];
                                                                    if(storeId == golbal.DiamondStore && !resultCanByDiamond
                                                                    && goodsModel.Task_Order != 0){
                                                                        console.log('resultCanByDiamond is false');
                                                                        item_List[0].Item_Amount=0;
                                                                    }
                                                                    userBagDomain.addItemsToBag(userId, item_List, function (error, resultAddItem) {
                                                                        if (error != null) {
                                                                            console.log(error);
                                                                            callback(error, null);
                                                                        }
                                                                        else {
                                                                            if(storeId == golbal.DiamondStore){
                                                                                if(resultCanByDiamond){
                                                                                    var actionInfo = {
                                                                                        playTimes:goodsModel.Item_Amount,
                                                                                        willGetTaskId:goodsModel.Task_Order
                                                                                    }
                                                                                    userTaskDomain.checkTask(userId,gameEnum.Action_Type.RechargeDiamond,actionInfo,function(error,resultCheckTask){
                                                                                        if(error!=null){
                                                                                            console.log(error);
                                                                                            callback(error,null);
                                                                                        }
                                                                                        else
                                                                                        {
                                                                                            userVIPDomain.checkVIPLvl(userId,goodsModel.Item_Amount,function(error,resultcheckVIP){
                                                                                                if(error!=null){
                                                                                                    console.log(error);
                                                                                                    callback(error,null);
                                                                                                }
                                                                                                else
                                                                                                {
                                                                                                    getAllBuyTimes(userId,goodsModel.Goods_Id,function(error,resultAllBuyTimes){
                                                                                                        console.log('resultAllBuyTimes:',resultAllBuyTimes);
                                                                                                        if(error!=null){
                                                                                                            console.log(error);
                                                                                                            callback(error,null);
                                                                                                        }
                                                                                                        else
                                                                                                        {
                                                                                                            var item_List_Bouns = [{
                                                                                                                Item_Id: golbal.Diamond,
                                                                                                                Item_Amount: goodsModel.First_Bonus,
                                                                                                                User_Id: userId,
                                                                                                                Target_Id : targetId
                                                                                                            }];
                                                                                                            if(resultAllBuyTimes>=1){
                                                                                                                console.log('No First Bonus');
                                                                                                                item_List_Bouns[0].Item_Amount = 0;
                                                                                                            }
                                                                                                                userBagDomain.addItemsToBag(userId, item_List_Bouns, function (error, resultAddItem) {
                                                                                                                    if (error != null) {
                                                                                                                        console.log(error);
                                                                                                                        callback(error, null);
                                                                                                                    }
                                                                                                                    else {
                                                                                                                        storeProviter.addStoreHistory(userId,goodsModel,function(error,resultaddHis){
                                                                                                                            if(error!=null){
                                                                                                                                console.log(error);
                                                                                                                                callback(error,null);
                                                                                                                            }
                                                                                                                            else
                                                                                                                            {
                                                                                                                                callback(null, resultaddHis);
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
                                                                                    callback(code.UserVIP.Can_Not_Buy_Month_Card,null);
                                                                                }
                                                                            }
                                                                            else if(storeId == golbal.CoinStore){
                                                                                var  actionInfo  =
                                                                                {
                                                                                    playTimes:1
                                                                                };
                                                                                console.log("checkTask CoinStore");
                                                                                userTaskDomain.checkTask(userId,gameEnum.Action_Type.GetMoney,actionInfo,function(error,resultTask){
                                                                                    if(error!=null){
                                                                                        console.log(error);
                                                                                        callback(error,null);
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        storeProviter.addStoreHistory(userId,goodsModel,function(error,resultaddHis){
                                                                                            if(error!=null){
                                                                                                console.log(error);
                                                                                                callback(error,null);
                                                                                            }
                                                                                            else
                                                                                            {
                                                                                                callback(null, resultaddHis);
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                })
                                                                            }
                                                                            else
                                                                            {
                                                                                storeProviter.addStoreHistory(userId,goodsModel,function(error,resultaddHis){
                                                                                    if(error!=null){
                                                                                        console.log(error);
                                                                                        callback(error,null);
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        callback(null, resultaddHis);
                                                                                    }
                                                                                })
                                                                            }
                                                                        }
                                                                    });

                                                                }
                                                            })
                                                    }
                                                })

                                            }
                                            else
                                            {
                                                callback(code.UserVIP.VIP_Times_Error,null);
                                            }
                                        }
                                    })
                                }
                                else
                                {
                                    callback(code.UserVIP.VIP_Lvl_Error,null);
                                }
                            }
                        })

                        //    }
                        //})
                    }

                }
            })
        }
    })
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

