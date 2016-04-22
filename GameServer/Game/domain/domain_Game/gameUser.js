/**
 * Created by peihengyang on 14/12/4.
 */
var code = require('../../code');
var gameEnum = require('../../enum');
var gameUserProviter = require('../../dao_provider/dao_Game/gameUser');
var heroProviter = require('../../dao_provider/dao_Game/hero');
var userBagProviter = require('../../dao_provider/dao_Game/Bag');
var userRankProviter = require('../../dao_provider/dao_Game/rank');
var userDungeonProviter = require('../../dao_provider/dao_Game/dungeon');
var editGolbalProviter = require('../../dao_provider/dao_edit/global');
var editHeroProviter =  require('../../dao_provider/dao_edit/hero');
var editAvatarProviter = require('../../dao_provider/dao_edit/avatar');
var VIPProviter = require('../../dao_provider/dao_Game/VIP');
var userLotteryDomain =  require('./userLottery');
var userRankDomain = require('./userRank');
var userTaskDomain = require('./userTask');
var userFightDomain = require('./userFight');
var userMailDomain = require('./userMail');
var userStoreDomain = require('./gameStore');
var userVIPDomain = require('./userVIP');
var userActivityDomain = require('./userActivity');
var editProvider = require('../domain_config/config');
var editDungeon = editProvider.getConfig("dungeon").info;
var async =  require('async');
var gameUser = module.exports;
//初始化玩家拥有英雄
var initgameUserModel = function(){
    var gameUserModel = {
        "User_Hero_Id":0,
        "Membership_Id":0,
        "Hero_Id":166,
        "Hero_Lvl":1,
        "Hero_Star":1,
        "InitiativeSkill_Lvl":1,
        "PassiveSkill_Lvl":1,
        "CharacteristicSkill_Lvl":1,
        "Hero_Experience":0,
        "Hero_Equipment1":0,
        "Hero_Equipment2":0,
        "Hero_Equipment3":0,
        "Hero_Equipment4":0,
        "Hero_Equipment5":0,
        "Hero_Equipment6":0,
        "Troop_Id":0,
        "Troop_Lvl":3,
        "Troop_Current_Experience":17,
        "Troop_Stamina":0,
        "Troop_Name":"",
        "Troop_Max_Stamina":0,
        "Troop_Avatar_Id":0,
        "Troop_Avatar_Frame_Id":0,
        "Troop_Skill_Point_Last_Use_Date":0,
        "Troop_Skill_Point":0,
        "Troop_Stamina_Last_Use_Date":0,
        "CurUserFarFightInfo":{}
    }
    return gameUserModel;
}

gameUser.getUser = function(userId,callback){
    editGolbalProviter.getGlobal(function(error,resultGolbal) {
        if (error != null) {
            console.log(error);
            callback(error, null);
        }
        else {
            userBagProviter.getBagByUserId(userId, function (error, resultBag) {
                if (error != null) {
                    console.log(error);
                    callback(error, null);
                }
                else {
                    userDungeonProviter.getUserTroopRecord(userId,function (error1, resultsUserTroopRecord) {
                        if (error1 != null) {
                            console.log(error1);
                            callback(error1, null);
                        }
                        else {
                            var gameUserModel = initgameUserModel();
                            var itemInit = JSON.parse(resultGolbal.userInit.Items);
                            var heroInit = JSON.parse(resultGolbal.userInit.Heros);
                            var hero_List = [];
                            var first_Heros = [];
                            var item_Diff = [];
                            heroInit.forEach(function(userHero){
                                userHero = userHero.split(',');
                                hero_List.push({
                                    Hero_Id:userHero[0],
                                    Hero_Lvl:1,
                                    Is_First:userHero[3],
                                    Hero_Experience:userHero[2],
                                    PassiveSkill_Lvl:userHero[4],
                                    InitiativeSkill_Lvl:userHero[5],
                                    CharacteristicSkill_Lvl:userHero[6]
                                });
                                if(Number(userHero[3]) == 1){
                                    first_Heros.push(userHero[0]);
                                }
                            });
                            itemInit.forEach(function(userItem){
                                userItem = userItem.split(',');
                                if(Number(userItem[3])!=0){
                                    item_Diff.push({
                                        ItemId:userItem[0],
                                        ItemAmount:userItem[3]
                                    })
                                }
                            })
                            var beginnerData  = {
                                Heros:first_Heros,
                                Items:item_Diff
                            };
                            checkUserExist(userId, function (error, resultCheckUser) {
                                if (error != null) {
                                    console.log('checkUser:',error);
                                    if (error == code.GameUser.User_Not_Exist) {
                                        console.log('addUserId')
                                        gameUserModel.User_Id = Number(userId);
                                        gameUserModel.Create_Date = new Date();
                                        //lizi 添加 添加远征记录
                                        console.log('add UserFarFight');
                                        gameUserProviter.addUserFarFight(userId,function(error,farfightResult)
                                        {
                                            if(error)
                                            {
                                                callback(error, null);
                                            }
                                            else
                                            {

                                                console.log('getNickname');
                                                gameUser.getNickname(userId,function(error,resultNickNames){
                                                    console.log('resultNickNames:',resultNickNames);
                                                    if(error!=null){
                                                        console.log(error);
                                                        callback(error,null);
                                                    }
                                                    else
                                                    {
                                                        console.log("addUserHeros!!!!!!!!!!!!!!!!!!!!");
                                                        gameUserProviter.addUserHeros(gameUserModel, hero_List, function (error, resultHero) {
                                                            if (error != null) {
                                                                console.log(error);
                                                                callback(code.GameUser.Add_User_Fail, null);
                                                            }
                                                            else
                                                            {
                                                                console.log("resultHeros:");
                                                                console.log(resultHero);
                                                                var itemInit = JSON.parse(resultGolbal.userInit.Items);
                                                                var item_List = [];
                                                                itemInit.forEach(function(userItem){
                                                                    userItem = userItem.split(',');
                                                                    item_List.push({
                                                                        User_Id:userId,
                                                                        Item_Id:userItem[0],
                                                                        Item_Amount:userItem[2]
                                                                    })
                                                                });
                                                                console.log("insterItemsToBag");
                                                                userBagProviter.insertItemsToBag(gameUserModel,item_List,function(error,resultItem){
                                                                    if(error!=null){
                                                                        console.log(error);
                                                                        callback(error,null);
                                                                    }
                                                                    else
                                                                    {
                                                                        resultBag = resultItem;
                                                                        var nowTime = new Date();
                                                                        gameUserModel.Troop_Skill_Point_Last_Use_Date = nowTime;
                                                                        gameUserModel.Troop_Stamina_Last_Use_Date = nowTime;
                                                                        console.log("getTroopGrowing");
                                                                        editGolbalProviter.getTroopGrowing(function (error, resultTroopGrowing) {

                                                                            if (error != null) {
                                                                                console.log(error);
                                                                                callback(error, null);
                                                                            }
                                                                            else {
                                                                                editAvatarProviter.getAvatarByGrade(gameEnum.AvatarGrade.NormalAvatarFrame,function(error,resultsNormalAvatarFrame){
                                                                                    if(error!=null){
                                                                                        console.log(error,null);
                                                                                        callback(error,null);
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        gameUserProviter.addAvatar(userId,resultsNormalAvatarFrame[0].Avatar_Id,function(error,resultUserAvatar){
                                                                                            if(error!=null){
                                                                                                console.log(error);
                                                                                                callback(error,null);
                                                                                            }
                                                                                            else
                                                                                            {
                                                                                                editAvatarProviter.getAvatarByGrade(gameEnum.AvatarGrade.NormalAvatar,function(error,resultNormalAvatar){
                                                                                                    if(error!=null){
                                                                                                        console.log(error);
                                                                                                        callback(error,null);
                                                                                                    }
                                                                                                    else
                                                                                                    {
                                                                                                        gameUserModel.Troop_Skill_Point = resultGolbal.skill_point_limit;
                                                                                                        gameUserModel.Troop_Max_Stamina = resultTroopGrowing[gameUserModel.Troop_Lvl].Stamina;
                                                                                                        gameUserModel.Troop_Stamina = 47;
                                                                                                        gameUserModel.Troop_Avatar_Id = resultNormalAvatar[0].Avatar_Id;
                                                                                                        gameUserModel.Troop_Avatar_Frame_Id = resultsNormalAvatarFrame[0].Avatar_Id;
                                                                                                        gameUserModel.Troop_Lvl = 4;
                                                                                                        console.log("addUserTroop");
                                                                                                        gameUserProviter.addUserTroop(gameUserModel, function (error, troopResult) {
                                                                                                            //console.log('resultsDungeon:',resultsDungeon,error);
                                                                                                            if (error != null) {
                                                                                                                console.log(error);
                                                                                                                callback(code.GameUser.Add_User_Fail, null);
                                                                                                            }
                                                                                                            else {
                                                                                                                console.log(userId);
                                                                                                                console.log(gameUserModel);
                                                                                                                //gameUser.addHerosExperience(userId,hero_List,0,function(error,resultAddHeroExp){
                                                                                                                //    if(error!=null){
                                                                                                                //        console.log(error);
                                                                                                                //        callback(error,null);
                                                                                                                //    }
                                                                                                                //    else
                                                                                                                //    {
                                                                                                                userDungeonProviter.getUserDungeonByUserId(userId, function (error, resultsDungeon) {
                                                                                                                    if (error != null) {
                                                                                                                        console.log(error);
                                                                                                                        callback(error, null);
                                                                                                                    }
                                                                                                                    else {
                                                                                                                        console.log('initUserTask beting ======================');
                                                                                                                        userTaskDomain.initUserTask(userId,gameUserModel.Troop_Lvl,function(error,result){
                                                                                                                            if(error!=null){
                                                                                                                                console.log(error);
                                                                                                                                callback(error,null)
                                                                                                                            }
                                                                                                                            else
                                                                                                                            {
                                                                                                                                userTaskDomain.getTaskInfo(userId,function(error,resultUserTask){
                                                                                                                                    console.log("resultUserTask");
                                                                                                                                    console.log(resultUserTask);
                                                                                                                                    if (error != null) {
                                                                                                                                        console.log(error);
                                                                                                                                        callback(error, null);
                                                                                                                                    }
                                                                                                                                    else
                                                                                                                                    {
                                                                                                                                        userTaskDomain.batchRefreshTaskStateForGuide(userId,function(error,resultGuideTask){
                                                                                                                                            if(error != null){
                                                                                                                                                console.log(error);
                                                                                                                                                callback(error,null);
                                                                                                                                            }
                                                                                                                                            else
                                                                                                                                            {

                                                                                                                                                userLotteryDomain.Lottery(userId,4,-1,function(error,resultUserLottery){
                                                                                                                                                    if(error!=null){
                                                                                                                                                        console.log(error);
                                                                                                                                                        callback(error,null);
                                                                                                                                                    }
                                                                                                                                                    else
                                                                                                                                                    {
                                                                                                                                                        userLotteryDomain.getFreeLottery(userId,function(error,resultFreeLottery){
                                                                                                                                                            if(error!=null){
                                                                                                                                                                console.log(error);
                                                                                                                                                                callback(error,null);
                                                                                                                                                            }
                                                                                                                                                            else
                                                                                                                                                            {
                                                                                                                                                                console.log('getTaskInfo success ======================');
                                                                                                                                                                userRankDomain.addUserRank(userId,resultHero,function(error,resultTroopRecord){
                                                                                                                                                                    if(error!=null){
                                                                                                                                                                        console.log(error);
                                                                                                                                                                        callback(code.UserRank.Add_User_Rank_Error,null);
                                                                                                                                                                    }
                                                                                                                                                                    else
                                                                                                                                                                    {
                                                                                                                                                                        userActivityDomain.getUserNotReceivingActivity(userId,function(error,resultUserActivity){
                                                                                                                                                                            if(error!=null){
                                                                                                                                                                                console.log(error);
                                                                                                                                                                                callback(error,null);
                                                                                                                                                                            }
                                                                                                                                                                            else
                                                                                                                                                                            {
                                                                                                                                                                                gameUserProviter.getUserHerosByUserId(userId,function(error,resultsUserHeros){
                                                                                                                                                                                    if(error)
                                                                                                                                                                                    {
                                                                                                                                                                                        console.log(error);
                                                                                                                                                                                        callback(error,null);
                                                                                                                                                                                    }
                                                                                                                                                                                    else{
                                                                                                                                                                                        var UserVIPModel = {
                                                                                                                                                                                            User_Id:userId,
                                                                                                                                                                                            VIP_Lvl:0,
                                                                                                                                                                                            Total_Recharge:0
                                                                                                                                                                                        }
                                                                                                                                                                                        VIPProviter.addUserVIP(UserVIPModel,function(error,resultAddUserVIP){
                                                                                                                                                                                            if(error!=null){
                                                                                                                                                                                                console.log(error);
                                                                                                                                                                                                callback(error,null);
                                                                                                                                                                                            }
                                                                                                                                                                                            else
                                                                                                                                                                                            {
                                                                                                                                                                                                VIPProviter.getUserVIPByUserId(userId,function(error,resultUserVIP){
                                                                                                                                                                                                    if(error!=null){
                                                                                                                                                                                                        console.log(error);
                                                                                                                                                                                                        callback(error,null);
                                                                                                                                                                                                    }
                                                                                                                                                                                                    else
                                                                                                                                                                                                    {
                                                                                                                                                                                                        userStoreDomain.InitStore(userId,function(error,resultsUserStore){
                                                                                                                                                                                                            if (error != null) {
                                                                                                                                                                                                                console.log(error);
                                                                                                                                                                                                                callback(error, null);
                                                                                                                                                                                                            }
                                                                                                                                                                                                            else {
                                                                                                                                                                                                                userRankProviter.addUserPVPResetTimes(userId,function(error,resultAddUserPVPReset){
                                                                                                                                                                                                                    if(error!=null){
                                                                                                                                                                                                                        console.log(error);
                                                                                                                                                                                                                        callback(error,null);
                                                                                                                                                                                                                    }
                                                                                                                                                                                                                    else
                                                                                                                                                                                                                    {
                                                                                                                                                                                                                        if (resultsDungeon.length == 0 || resultsDungeon == null) {
                                                                                                                                                                                                                            userDungeonProviter.initUserDungeon(userId, function (error, resultUserDungeon) {
                                                                                                                                                                                                                                if (error != null) {
                                                                                                                                                                                                                                    console.log(error);
                                                                                                                                                                                                                                    callback(error, null);
                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                else {
                                                                                                                                                                                                                                    userTaskDomain.initUserTask(userId, gameUserModel.Troop_Lvl, function (error, resultTaseAfterGuide) {
                                                                                                                                                                                                                                        if (error != null) {
                                                                                                                                                                                                                                            console.log(error);
                                                                                                                                                                                                                                            callback(error, null);
                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                        else {
                                                                                                                                                                                                                                            gameUser.addHerosExperience(userId, resultsUserHeros, 0, function (error, resultsAddHeroExp) {
                                                                                                                                                                                                                                                if (error) {
                                                                                                                                                                                                                                                    console.log(error);
                                                                                                                                                                                                                                                    callback(error, null);
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                else {
                                                                                                                                                                                                                                                    console.log("1===============");
                                                                                                                                                                                                                                                    callback(null, {
                                                                                                                                                                                                                                                        userTask: resultUserTask,
                                                                                                                                                                                                                                                        heroResult: resultHero,
                                                                                                                                                                                                                                                        troopResult: troopResult[0],
                                                                                                                                                                                                                                                        userTroopList: resultTroopRecord,
                                                                                                                                                                                                                                                        nickNames: resultNickNames.Nicknames,
                                                                                                                                                                                                                                                        userBag: resultBag,
                                                                                                                                                                                                                                                        dungeonResult: resultUserDungeon,
                                                                                                                                                                                                                                                        nowDateTime: new Date(),
                                                                                                                                                                                                                                                        timeZone: new Date().getTimezoneOffset() / (-60),
                                                                                                                                                                                                                                                        userLottery: resultFreeLottery,
                                                                                                                                                                                                                                                        userPVP: {
                                                                                                                                                                                                                                                            PVPTimes: 0,
                                                                                                                                                                                                                                                            LastPVPDate: '1970-01-01 00:00:00',
                                                                                                                                                                                                                                                            userUnfinishPVP: -1,
                                                                                                                                                                                                                                                            userResetPVPTimes:0
                                                                                                                                                                                                                                                        },
                                                                                                                                                                                                                                                        userUnfinishPVE: -1,
                                                                                                                                                                                                                                                        UnfinishTreasureHouse: -1,
                                                                                                                                                                                                                                                        beginnerData: beginnerData,
                                                                                                                                                                                                                                                        userAvatar: resultUserAvatar,
                                                                                                                                                                                                                                                        CurUserFarFightInfo: {
                                                                                                                                                                                                                                                            "FarFightCount": 1,
                                                                                                                                                                                                                                                            "UserCurFarFightInfo": ""
                                                                                                                                                                                                                                                        },
                                                                                                                                                                                                                                                        CurUserFarFightHerosInfo: [],
                                                                                                                                                                                                                                                        userActivity: resultUserActivity,
                                                                                                                                                                                                                                                        userStore: resultsUserStore,
                                                                                                                                                                                                                                                        IsNew: 1,
                                                                                                                                                                                                                                                        FirstBuy:[],
                                                                                                                                                                                                                                                        userVIP:resultUserVIP
                                                                                                                                                                                                                                                    });
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                            });
                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                    })
                                                                                                                                                                                                                                }
                                                                                                                                                                                                                            })

                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        //    })
                                                                                                                                                                                                                        //}
                                                                                                                                                                                                                        else {
                                                                                                                                                                                                                            gameUser.addHerosExperience(userId, resultsUserHeros, 0, function (error, resultsAddHeroExp) {
                                                                                                                                                                                                                                if (error) {
                                                                                                                                                                                                                                    console.log(error);
                                                                                                                                                                                                                                    callback(error, null);
                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                else {
                                                                                                                                                                                                                                    console.log("2===============");

                                                                                                                                                                                                                                    callback(null, {
                                                                                                                                                                                                                                        userTask: resultUserTask,
                                                                                                                                                                                                                                        heroResult: resultHero,
                                                                                                                                                                                                                                        troopResult: troopResult[0],
                                                                                                                                                                                                                                        userTroopList: resultTroopRecord,
                                                                                                                                                                                                                                        nickNames: resultNickNames,
                                                                                                                                                                                                                                        userBag: resultBag,
                                                                                                                                                                                                                                        dungeonResult: resultsDungeon,
                                                                                                                                                                                                                                        nowDateTime: new Date(),
                                                                                                                                                                                                                                        timeZone: new Date().getTimezoneOffset() / (-60),
                                                                                                                                                                                                                                        userLottery: resultFreeLottery,
                                                                                                                                                                                                                                        userPVP: {
                                                                                                                                                                                                                                            PVPTimes: 0,
                                                                                                                                                                                                                                            LastPVPDate: '1970-01-01 00:00:00',
                                                                                                                                                                                                                                            userUnfinishPVP: -1,
                                                                                                                                                                                                                                            userResetPVPTimes:0
                                                                                                                                                                                                                                        },
                                                                                                                                                                                                                                        userUnfinishPVE: -1,
                                                                                                                                                                                                                                        UnfinishTreasureHouse: -1,
                                                                                                                                                                                                                                        beginnerData: beginnerData,
                                                                                                                                                                                                                                        userAvatar: resultUserAvatar,
                                                                                                                                                                                                                                        CurUserFarFightInfo: {
                                                                                                                                                                                                                                            "FarFightCount": 1,
                                                                                                                                                                                                                                            "UserCurFarFightInfo": ""
                                                                                                                                                                                                                                        },
                                                                                                                                                                                                                                        CurUserFarFightHerosInfo: [],
                                                                                                                                                                                                                                        userActivity: resultUserActivity,
                                                                                                                                                                                                                                        userStore: resultsUserStore,
                                                                                                                                                                                                                                        IsNew: 1,
                                                                                                                                                                                                                                        FirstBuy:[],
                                                                                                                                                                                                                                        userVIP:resultUserVIP
                                                                                                                                                                                                                                    });
                                                                                                                                                                                                                                }
                                                                                                                                                                                                                            })
                                                                                                                                                                                                                        }
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
                                                                                                        });
                                                                                                        //    }
                                                                                                        //})

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
                                        });

                                    }
                                    else {
                                        callback(error, null);
                                    }
                                }
                                else {
                                    userStoreDomain.getUserFirstBuyOfStoreId(userId,resultGolbal.DiamondStore,function(error,resultFirstBuy){
                                        if(error!=null){
                                            console.log(error);
                                            callback(error,null);
                                        }
                                        else
                                        {
                                            gameUserProviter.getUserFarFightInfo(userId,function(error,farFightResult)
                                            {
                                                if(error)
                                                {
                                                    console.log("!!!!!lizilizi");
                                                    callback(error, null);
                                                }
                                                else
                                                {
                                                    console.log("get~~~~lizilizi");
                                                    console.log(farFightResult);
                                                    resultCheckUser.CurUserFarFightInfo = farFightResult[0][0];
                                                    resultCheckUser.CurUserFarFightHerosInfo = farFightResult[1];
                                                    userFightDomain.GetUserPVP(userId,function(error,resultUserPVP){
                                                        if(error!=null){
                                                            console.log(error);
                                                            callback(error,null);
                                                        }
                                                        else
                                                        {
                                                            userRankDomain.getUnfinishedPVP(userId,function(error,resultsUnfinishPVP){
                                                                if(error!=null){
                                                                    console.log(error);
                                                                    callback(error,null);
                                                                }
                                                                else
                                                                {
                                                                    var UnfinishPVP = -1;
                                                                    if(resultsUnfinishPVP.length!= 0){
                                                                        UnfinishPVP = resultsUnfinishPVP[0].PVP_Fighting_Id;
                                                                    }
                                                                    var UnfinishPVE = -1;
                                                                    userDungeonProviter.getUnfinishedPVE(userId,function(error,resultUnfinishPVE){
                                                                        if(error!=null){
                                                                            console.log(error);
                                                                            callback(error,null);
                                                                        }
                                                                        else
                                                                        {
                                                                            if(resultUnfinishPVE.length!=0){
                                                                                UnfinishPVE = resultUnfinishPVE[0].Fight_Id;
                                                                            }
                                                                            var UnfinishTreasureHouse = -1;
                                                                            userDungeonProviter.getUnfinishedTreasureHouse(userId,function(error,resultUnfinishTreasureHouse){
                                                                                if(error!=null){
                                                                                    console.log("getUnfinishedTreasureHouse:",error);
                                                                                    callback(error,null);
                                                                                }
                                                                                else
                                                                                {
                                                                                    if(resultUnfinishTreasureHouse.length != 0){
                                                                                        UnfinishTreasureHouse = resultUnfinishTreasureHouse[0].Fight_Id;
                                                                                    }
                                                                                    userLotteryDomain.getFreeLottery(userId,function(error,resultFreeLottery) {
                                                                                        if (error != null) {
                                                                                            console.log(error);
                                                                                            callback(error, null);
                                                                                        }
                                                                                        else {
                                                                                            gameUserProviter.getUserAvatarByUserId(userId,function(error,resultUserAvatar){
                                                                                                if(error!=null){
                                                                                                    console.log(error);
                                                                                                    callback(error,null);
                                                                                                }
                                                                                                else
                                                                                                {
                                                                                                    console.log("initUserTask!!!!!!!!!!!!!!!!!!!!");
                                                                                                    userTaskDomain.initUserTask(userId,resultCheckUser.troopResult.Troop_Lvl,function(error,result){
                                                                                                        if(error!=null){
                                                                                                            console.log(error);
                                                                                                            callback(error,null);
                                                                                                        }
                                                                                                        else
                                                                                                        {
                                                                                                            userTaskDomain.getTaskInfo(userId,function(error,resultUserTask){
                                                                                                                if (error != null) {
                                                                                                                    console.log(error);
                                                                                                                    callback(error, null);
                                                                                                                }
                                                                                                                else {
                                                                                                                    var nickNames = [];
                                                                                                                    console.log('checkTodayActivity');
                                                                                                                    userActivityDomain.getUserNotReceivingActivity(userId, function (error, resultUserActivity) {
                                                                                                                        if (error != null) {
                                                                                                                            console.log(error);
                                                                                                                            callback(error, null);
                                                                                                                        }
                                                                                                                        else {
                                                                                                                            userStoreDomain.InitStore(userId,function(error,resultsUserStore){
                                                                                                                                if(error!=null){
                                                                                                                                    console.log(error);
                                                                                                                                    callback(error,null);
                                                                                                                                }
                                                                                                                                else
                                                                                                                                {
                                                                                                                                    VIPProviter.getUserVIPByUserId(userId,function(error,resultsUserVIP){
                                                                                                                                        if(error!=null){
                                                                                                                                            console.log(error);
                                                                                                                                            callback(error,null);
                                                                                                                                        }
                                                                                                                                        else
                                                                                                                                        {
                                                                                                                                            userRankProviter.getUserPVPResetTimes(userId,function(error,resultPVPResetTimes){
                                                                                                                                                if(error!=null){
                                                                                                                                                    console.log(error);
                                                                                                                                                    callback(error,null);
                                                                                                                                                }
                                                                                                                                                else
                                                                                                                                                {
                                                                                                                                                    resultCheckUser.FirstBuy = resultFirstBuy;
                                                                                                                                                    resultCheckUser.userVIP=resultsUserVIP;
                                                                                                                                                    if(resultCheckUser.troopResult.Troop_Name == ''){
                                                                                                                                                        gameUser.getNickname(userId,function(error,resultNickname){
                                                                                                                                                            if(error!=null){
                                                                                                                                                                console.log(error);
                                                                                                                                                                callback(error,null);
                                                                                                                                                            }
                                                                                                                                                            else
                                                                                                                                                            {

                                                                                                                                                                nickNames = resultNickname;
                                                                                                                                                                console.log("3===============");
                                                                                                                                                                resultCheckUser.userTask = resultUserTask;
                                                                                                                                                                resultCheckUser.userTroopList = resultsUserTroopRecord;
                                                                                                                                                                resultCheckUser.userBag = resultBag;
                                                                                                                                                                resultCheckUser.nowDateTime = new Date();
                                                                                                                                                                resultCheckUser.timeZone=new Date().getTimezoneOffset()/(-60);
                                                                                                                                                                resultCheckUser.userLottery = resultFreeLottery;
                                                                                                                                                                resultCheckUser.userPVP = resultUserPVP;
                                                                                                                                                                resultCheckUser.userPVP.userResetPVPTimes = resultPVPResetTimes[0].ResetTimes;
                                                                                                                                                                resultCheckUser.userPVP.userUnfinishPVP = -1;//UnfinishPVP;
                                                                                                                                                                resultCheckUser.userUnfinishPVE = -1;//UnfinishPVE;
                                                                                                                                                                resultCheckUser.userUnfinishTreasureHouse = -1;//UnfinishTreasureHouse;
                                                                                                                                                                resultCheckUser.beginnerData = beginnerData;
                                                                                                                                                                resultCheckUser.userAvatar = resultUserAvatar;
                                                                                                                                                                resultCheckUser.nickNames = nickNames.Nicknames;
                                                                                                                                                                resultCheckUser.userActivity=resultUserActivity;
                                                                                                                                                                resultCheckUser.IsNew = 0;
                                                                                                                                                                resultCheckUser.userStore = resultsUserStore;
                                                                                                                                                                callback(null, resultCheckUser);
                                                                                                                                                            }
                                                                                                                                                        })
                                                                                                                                                    }
                                                                                                                                                    else
                                                                                                                                                    {
                                                                                                                                                        console.log("3===============");
                                                                                                                                                        resultCheckUser.userTask = resultUserTask;
                                                                                                                                                        resultCheckUser.userTroopList = resultsUserTroopRecord;
                                                                                                                                                        resultCheckUser.userBag = resultBag;
                                                                                                                                                        resultCheckUser.nowDateTime = new Date();
                                                                                                                                                        resultCheckUser.timeZone=new Date().getTimezoneOffset()/(-60);
                                                                                                                                                        resultCheckUser.userLottery = resultFreeLottery;
                                                                                                                                                        resultCheckUser.userPVP = resultUserPVP;
                                                                                                                                                        resultCheckUser.userPVP.userResetPVPTimes = resultPVPResetTimes[0].ResetTimes;
                                                                                                                                                        resultCheckUser.userPVP.userUnfinishPVP = -1;//UnfinishPVP;
                                                                                                                                                        resultCheckUser.userUnfinishPVE = -1;//UnfinishPVE;
                                                                                                                                                        resultCheckUser.userUnfinishTreasureHouse = -1;//UnfinishTreasureHouse;
                                                                                                                                                        resultCheckUser.beginnerData = beginnerData;
                                                                                                                                                        resultCheckUser.userAvatar = resultUserAvatar;
                                                                                                                                                        resultCheckUser.nickNames = nickNames.Nicknames;
                                                                                                                                                        resultCheckUser.userActivity=resultUserActivity;
                                                                                                                                                        resultCheckUser.IsNew = 0;
                                                                                                                                                        resultCheckUser.userStore = resultsUserStore;
                                                                                                                                                        callback(null, resultCheckUser);
                                                                                                                                                    }
                                                                                                                                                }
                                                                                                                                            })

                                                                                                                                        }

                                                                                                                                    })

                                                                                                                                }
                                                                                                                            })
                                                                                                                        }
                                                                                                                    });
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
                                                    });
                                                }
                                            });
                                        }
                                    })
                                }
                            });
                        }
                    })
                }
            });
        }
    });
}

gameUser.heroEvolution = function(userId,Hero_Id,callback){
    console.log(Hero_Id);
    checkUeserHero(userId,Hero_Id,function(error,result){
        if (result.result == false){
            return callback(code.GameUser.User_Hero_Not_Match,{
                result:error
            });
        }
        else {
            var gameUserModel =updateUserHeroModel(result.result);
            checkEvolutionCondition(gameUserModel,function(error,result){
                if(result.result){
                    gameUserModel.Hero_Star++;
                    gameUserProviter.updateUser(gameUserModel, function (error, result) {
                        if(error != null)
                        {
                            console.log(error);
                            callback(error, null);
                        }
                        else
                        {
                            callback(null,result);
                        }
                    });
                }
                else
                {
                    callback(error,null);
                }
            });
        }
    })

}

gameUser.heroEquipAll = function(userId,heroId,equipments,callback){
    var heroEquipFun = [];
    var heroEquipResults = [];
    equipments.forEach(function(item){
        heroEquipFun.push(function(callbackEquip) {
                gameUser.heroEquip(userId,heroId,item.itemid,item.position,function(error,resultEquip){
                    if(error!=null){
                        console.log(error);
                        heroEquipResults.push({"position":item.position,"code":error});
                        callbackEquip(error,{"position":item.position,"code":error});
                    }
                    else
                    {
                        heroEquipResults.push({"position":item.position,"code":200});
                        callbackEquip(null,{"position":item.position,"code":200});
                    }
                })
            }
        )
    });
    async.series(heroEquipFun,function(error,resultUseItem){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            console.log(resultUseItem);
            callback(null,{"resultEquip":resultUseItem});
        }
    });
}

gameUser.heroEquip = function(userId,heroId,itemId,position,callback){
    gameUserProviter.getUserByUserIdHeroId(userId,heroId,function(error,resultUserHero){
        console.log("userHeroModel");
        console.log(resultUserHero);
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            editHeroProviter.getHeroById(heroId,function(error,resultEditHero){
                if (error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    var checkFlag = false;
                    switch (Number(position))
                    {
                        case 1:
                            if(resultEditHero.Hero_Equipment1 == itemId){
                                checkFlag = true;
                            }
                            break;
                        case 2:
                            if(resultEditHero.Hero_Equipment2 == itemId){
                                checkFlag = true;
                            }
                            break;
                        case 3:
                            if(resultEditHero.Hero_Equipment3 == itemId){
                                checkFlag = true;
                            }
                            break;
                        case 4:
                            if(resultEditHero.Hero_Equipment4 == itemId){
                                checkFlag = true;
                            }
                            break;
                        case 5:
                            if(resultEditHero.Hero_Equipment5 == itemId){
                                checkFlag = true;
                            }
                            break;
                        case 6:
                            if(resultEditHero.Hero_Equipment6 == itemId){
                                checkFlag = true;
                            }
                            break;
                    }
                    if(checkFlag){
                        var userHeroModel =  updateUserHeroModel(resultUserHero);
                        console.log('userHeroModel:',userHeroModel);
                        checkUserItem(userId,itemId,1,function(error,result){
                            if(error!=null){
                                console.log(error);
                                callback(error,null);
                            }
                            else
                            {
                                if(result){
                                    var errorCode = null;
                                    switch (Number(position))
                                    {
                                        case 1:
                                            if(userHeroModel.Hero_Equipment1!=itemId){
                                                userHeroModel.Hero_Equipment1 = itemId;
                                            }
                                            else
                                            {
                                                errorCode =  code.UserHero.Equipment_Already_Equip;
                                            }

                                            break;
                                        case 2:
                                            if(userHeroModel.Hero_Equipment2!=itemId){
                                                userHeroModel.Hero_Equipment2 = itemId;
                                            }
                                            else
                                            {
                                                errorCode =  code.UserHero.Equipment_Already_Equip;
                                            }
                                            break;
                                        case 3:
                                            if(userHeroModel.Hero_Equipment3!=itemId){
                                                userHeroModel.Hero_Equipment3 = itemId;
                                            }
                                            else
                                            {
                                                errorCode =  code.UserHero.Equipment_Already_Equip;
                                            }
                                            break;
                                        case 4:
                                            if(userHeroModel.Hero_Equipment4!=itemId){
                                                userHeroModel.Hero_Equipment4 = itemId;
                                            }
                                            else
                                            {
                                                errorCode =  code.UserHero.Equipment_Already_Equip;
                                            }
                                            break;
                                        case 5:
                                            if(userHeroModel.Hero_Equipment5!=itemId){
                                                userHeroModel.Hero_Equipment5 = itemId;
                                            }
                                            else
                                            {
                                                errorCode =  code.UserHero.Equipment_Already_Equip;
                                            }
                                            break;
                                        case 6:
                                            if(userHeroModel.Hero_Equipment6!=itemId){
                                                userHeroModel.Hero_Equipment6 = itemId;
                                            }
                                            else
                                            {
                                                errorCode =  code.UserHero.Equipment_Already_Equip;
                                            }
                                            break;
                                    }
                                    if(errorCode!=null){
                                        callback(errorCode,null);
                                    }
                                    else
                                    {
                                        userBagProviter.getUserBagById(userId,itemId,function(error,result){
                                            if(error!=null){
                                                console.log(error);
                                                callback(error,null);
                                            }
                                            else
                                            {
                                                var userBagModel =  result[0];
                                                userBagModel.Item_Amount--;
                                                userBagProviter.updateUserBag(userBagModel,function(error,result){
                                                    if(error!=null){
                                                        console.log(error);
                                                        callback(error,null);
                                                    }
                                                    else
                                                    {
                                                        gameUserProviter.updateUser(userHeroModel,function(error,result){
                                                            if(error!=null){
                                                                console.log(error);
                                                                callback(error,null);
                                                            }
                                                            else
                                                            {
                                                                callback(null,result);
                                                            }
                                                        });
                                                    }
                                                })
                                            }
                                        });

                                    }
                                }
                                else
                                {
                                    callback(code.UserHero.Hero_Equipment_Error,null);
                                }

                            }
                        });
                    }
                    else
                    {
                        callback(code.UserHero.Hero_Equipment_Position_Error,null);
                    }
                }
            })
        }
    })
}

gameUser.heroAdvanced = function(userId,Hero_Id,callback){
    checkUeserHero(userId,Hero_Id,function(error,result){
        if (result.result == false){
            return callback(code.GameUser.User_Hero_Not_Match,{
                result:error
            });
        }
        else {
            var gameUserModel = updateUserHeroModel(result.result);
            checkAdvancedCondition(gameUserModel,function(error,result){
                if(result.result){
                    heroProviter.getNextQualityHero(Hero_Id,function(error,result){
                        if(result.length>0){//品质没有达到上限
                            gameUserModel.Hero_Id = result[0].recharge_id;
                            gameUserModel.Hero_Equipment1 = 0;
                            gameUserModel.Hero_Equipment2 = 0;
                            gameUserModel.Hero_Equipment3 = 0;
                            gameUserModel.Hero_Equipment4 = 0;
                            gameUserModel.Hero_Equipment5 = 0;
                            gameUserModel.Hero_Equipment6 = 0;
                            gameUserProviter.updateUser(gameUserModel, function (error, result) {
                                if(error != null)
                                {
                                    return callback(code.GameUser.Update_User_Fail, {
                                        result : error
                                    });
                                }
                                else
                                {
                                    return callback(null,result);
                                }
                            });
                        }
                        else
                        {
                            /*品质达到上限*/
                            callback(code.UserHero.Hero_Quality_Limit,null);
                        }

                    });
                }
                else
                {
                    callback(code.GameUser.Advanced_Hero_Condition_Fail,{
                        result:false
                    });
                }
            });


        }
    })

}

gameUser.heroSkillLvlUp = function(userId,Hero_Id,skill_Type,callback){
    console.log('checkUserHero');
    checkUeserHero(userId,Hero_Id,function(error,result){
        if (result.result == false){
            return callback(code.GameUser.User_Hero_Not_Match,{
                result:error
            });
        }
        else {
            var gameUserModel= updateUserHeroModel(result.result);
            checkSkillLvlUpCondition(gameUserModel,skill_Type,function(error,result){
                console.log("error~~~~~~~~~~~~~~~~~")
                console.log(error);
                console.log(result);
                if(result.result){
                    var checkStatus = null;
                    switch(Number(skill_Type))
                    {
                        case gameEnum.skill_Type.InitiativeSkill:
                            if(gameUserModel.InitiativeSkill_Lvl<gameUserModel.Hero_Lvl){
                                gameUserModel.InitiativeSkill_Lvl++;
                            }else{
                                checkStatus = code.UserHero.Hero_Skill_Limit;
                            };
                            break;
                        case gameEnum.skill_Type.PassiveSkill:
                            if(gameUserModel.PassiveSkill_Lvl<gameUserModel.Hero_Lvl){
                                gameUserModel.PassiveSkill_Lvl++;
                            }else{
                                checkStatus = code.UserHero.Hero_Skill_Limit;
                            };
                            break;
                        case gameEnum.skill_Type.CharacteristicSkill:
                            if(gameUserModel.CharacteristicSkill_Lvl<gameUserModel.Hero_Lvl){
                                gameUserModel.CharacteristicSkill_Lvl++;
                            }else{
                                checkStatus = code.UserHero.Hero_Skill_Limit;
                            };
                            break;
                        default :

                    };
                    if(checkStatus == null){
                        console.log("updateUser");
                        gameUserProviter.updateUser(gameUserModel, function (error, result) {
                            if(error != null)
                            {
                                callback(code.GameUser.Update_User_Fail, {
                                    result : error
                                });
                            }
                            else
                            {
                                var actionInfo={
                                    playTimes:1
                                }
                                console.log('checkTask');
                                userTaskDomain.checkTask(userId,gameEnum.Action_Type.UpSkillLvlTimes,actionInfo,function(error,resultcheckTask){
                                    console.log('checkTask IN');
                                    if(error!=null){
                                        console.log('checkTask:',error);
                                        callback(error,null);
                                    }
                                    else
                                    {
                                        console.log('callback task',result);
                                        callback(null,{
                                            result:true
                                        });
                                    }
                                });
                            }
                        });
                    }
                    else
                    {
                        callback(checkStatus,null);
                    }


                }
                else
                {
                    callback(error,{
                        result:false
                    });
                }
            });

        }
    })

}

gameUser.addTroopStamina = function(userId,stamina,callback){
    gameUserProviter.getTroopByUserId(userId,function(error,resultTroop){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else{
            var userTroopModel = updateUserTroopModel(resultTroop[0]);
            console.log("userTroopModel:");
            console.log(userTroopModel);
            editGolbalProviter.getGlobal(function(error,resultGolbal){
                userVIPDomain.getVIPData(userId,gameEnum.VIPType.SkillPointLimit,function(error,resultSkillPoint){
                    if(error!=null){
                        console.log(error);
                        //callback(error,null);
                    }
                    else
                    {
                        resultGolbal.skill_point_limit = resultSkillPoint;
                        if(error!=null){
                            console.log(error);
                            callback(error,null);
                        }
                        else
                        {
                            userTroopModel =  checkUserState(userTroopModel,resultGolbal);
                            if(userTroopModel.Troop_Stamina+stamina < 0){
                                callback(code.UserTroop.Troop_Stamina_Not_Enough,null);
                            }
                            else
                            {
                                userTroopModel.Troop_Stamina = userTroopModel.Troop_Stamina+stamina;
                                checkTroopExperience(userTroopModel,function(error,result){
                                    if(error!=null){
                                        console.log(error);
                                        callback(error,null);
                                    }
                                    else
                                    {
                                        callback(null,result);
                                    }
                                })
                            }
                        }
                    }
                })

            })
        }
    })
}

gameUser.addHeroExperience = function(userId,heroId,experience,callback){
    gameUserProviter.getUserByUserIdHeroId(userId,heroId,function(error,resultHero){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            if(resultHero!=null){
                var userHeroModel =  updateUserHeroModel(resultHero);
                userHeroModel.Hero_Experience =  userHeroModel.Hero_Experience + experience;
                gameUser.checkHeroExperience(userHeroModel,function(error,result){
                    if(error!=null){
                        console.log(error);
                        callback(error,null);
                    }else
                    {
                        if(result){
                            callback(null,'success');
                        }
                        else
                        {
                            callback('unknow error',null);
                        }
                    }

                });
            }
            else
            {
                callback(code.GameUser.User_Hero_Cannot_Found,null);
            }
        }
    })
}

gameUser.addHerosExperience = function(userId,heroIds,experience,callback){
    var userHeroModels = [];
    if(heroIds!=null){
        heroIds.forEach(function(herouser){
            var userHeroModel =  createUserHeroModel(herouser);
            userHeroModel.Hero_Experience =  userHeroModel.Hero_Experience + experience;
            userHeroModels.push(userHeroModel);
        });

        gameUser.checkHerosExperience(userHeroModels,function(error,result){
            if(error!=null){
                console.log(error);
                callback(error,null);
            }else
            {
                if(result){
                    callback(null,'success');
                }
                else
                {
                    callback('unknow error',null);
                }
            }

        });
    }
    else
    {
        callback(code.GameUser.User_Hero_Cannot_Found,null);
    }

}

gameUser.addTroopExperience = function(userId,troop_Experience,callback){
    gameUserProviter.getTroopByUserId(userId,function(error,resultTroop){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            if(resultTroop!=null){
                var userTroopModel =  updateUserTroopModel(resultTroop[0]);
                var originalTroopLvl = userTroopModel.Troop_Lvl;
                console.log("-------------------");
                console.log(troop_Experience);
                console.log(userTroopModel);
                userTroopModel.Troop_Current_Experience =  userTroopModel.Troop_Current_Experience + troop_Experience;

                console.log("addTroopExperience =================== 3");
                checkTroopExperience(userTroopModel,function(error,result){
                    if(error!=null){
                        console.log(error);
                        callback(error,null);
                    }else
                    {
                        console.log("addTroopExperience =================== 4");
                        console.log(result);
                        if(result){
                            if(originalTroopLvl< userTroopModel.Troop_Lvl){
                                var actionInfo = {
                                    teamLvl:userTroopModel.Troop_Lvl
                                }
                                console.log("addTroopExperience =================== 5");
                                userTaskDomain.checkTask(userId,gameEnum.Action_Type.UPTeamLvl,actionInfo,function(error,resultCheckTask){
                                    if(error!=null){
                                        console.log(error);
                                        callback(error,null);
                                    }
                                    else
                                    {
                                        callback(null,'success');
                                    }
                                })
                            }
                            else
                            {
                                callback(null,'success');
                            }

                        }
                        else
                        {
                            callback('unknow error',null);
                        }
                    }

                });
            }
            else
            {
                callback(code.GameUser.User_Hero_Cannot_Found,null);
            }
        }
    })
}

var checkSkillLvlUpCondition = function(model,skill_Type,callback){
    /*
     添加技能升级条件判断，
     技能校验
     */
    editGolbalProviter.getGlobal(function(error,resultGlobal){
        if(error!=null){
            console.log(error);
            callback(error,{result:false});
        }
        else
        {
            gameUserProviter.getTroopByUserId(model.User_Id,function(error,resultUserTroop){
                if(error!=null){
                    console.log(error);
                    callback(error,{result:false});
                }
                else {
                    userVIPDomain.getVIPData(model.User_Id,gameEnum.VIPType.SkillPointLimit,function(error,resultSkillPoint) {
                        if (error != null) {
                            console.log(error);
                            //callback(error,null);
                        }
                        else {
                            resultGlobal.skill_point_limit = resultSkillPoint;
                            resultUserTroop[0] = checkUserState(resultUserTroop[0], resultGlobal);
                            var skilllvl = 0;
                            console.log(resultUserTroop);
                            editHeroProviter.getRecharge(model.Hero_Id,function(error,resultHero){
                                if(error!=null){
                                    console.log(error);
                                    callback(error,null);
                                }
                                else
                                {
                                    switch (Number(skill_Type)) {
                                        case gameEnum.skill_Type.InitiativeSkill:
                                            skilllvl = model.InitiativeSkill_Lvl;
                                            if(resultHero.quality<resultGlobal.initiative_skill_enable){
                                                callback(code.UserHero.Hero_SKill_Not_Enable,null);
                                            }
                                            break;
                                        case gameEnum.skill_Type.PassiveSkill:
                                            skilllvl = model.PassiveSkill_Lvl;
                                            if(resultHero.quality<resultGlobal.passive_skill_enable){
                                                callback(code.UserHero.Hero_SKill_Not_Enable,null);
                                            }
                                            break;
                                        case gameEnum.skill_Type.CharacteristicSkill:
                                            skilllvl = model.CharacteristicSkill_Lvl;
                                            if(resultHero.quality<resultGlobal.characteristic_skill_enable){
                                                callback(code.UserHero.Hero_SKill_Not_Enable,null);
                                            }
                                            break;
                                    }
                                }
                            });
                            if(skilllvl>=model.Hero_Lvl){
                                callback(code.UserHero.Hero_Skill_Limit,{result:false});
                            }
                            if(resultUserTroop[0].Troop_Skill_Point>0){
                                userBagProviter.getUserBagById(model.User_Id,resultGlobal.Gold,function(error,resultUserCoin){
                                    if(error!=null){
                                        console.log(error);
                                        callback(error,{result:false});
                                    }
                                    else {
                                        if (resultUserCoin[0].Item_Amount >= resultGlobal.skilllvl[skilllvl] && resultUserTroop[0].Troop_Skill_Point>0) {
                                            resultUserCoin[0].Item_Amount =  resultUserCoin[0].Item_Amount - resultGlobal.skilllvl[skilllvl];
                                            //resultUserTroop[0]=checkUserState(resultUserTroop[0],resultGlobal);
                                            resultUserTroop[0].Troop_Skill_Point --;
                                            var userTroopModel = updateUserTroopModel(resultUserTroop[0]);
                                            //以下这句原来被注释，不明原因，先取消注释，观察情况 20050529 Steve
                                            userTroopModel.Troop_Skill_Point_Last_Use_Date = new Date();
                                            userBagProviter.updateUserBag(resultUserCoin[0],function(error,result){
                                                if(error!=null){
                                                    console.log(error);
                                                    callback(error,{result:false});
                                                }
                                                else
                                                {
                                                    console.log("updateUserTroop");
                                                    gameUserProviter.updateUserTroop(userTroopModel,function(error,result){
                                                        if(error!=null){
                                                            console.log(error);
                                                            callback(error,{result:false});
                                                        }
                                                        else
                                                        {
                                                            callback(null,{result:true});
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                        else
                                        {
                                            callback(code.UserBag.Item_Not_Enough,{result:false});
                                        }
                                    }
                                });
                            }
                            else
                            {
                                callback(code.GameUser.Skill_Point_Not_Enough,{result:false});
                            }
                        }
                    })


                }
            })
        }
    })
}

var checkEvolutionCondition = function(model,callback){
    /*
     添加升星条件判断，使用的灵魂石数量检测
     星级数量未达到上限
     */
    if(model.Hero_Star>=5){
        callback(code.UserHero.Hero_Star_Limit,{result:false})
    }else
    {
        editHeroProviter.getHeroById(model.Hero_Id,function(error,resultEditHero){
            if(error!=null){
                console.log(error);
                callback(error,null);
            }
            else
            {
                editGolbalProviter.getGlobal(function(error,resultGlobal){
                    if(error!=null){
                        console.log(error);
                        callback(error,{result:false});
                    }
                    else
                    {
                        var needSoulStoneAmount = resultGlobal.soulStone[model.Hero_Star].Upgrade_Expend;
                        checkUserItem(model.Membership_Id,resultEditHero.soul_Stone_Id,needSoulStoneAmount,
                            function(error,resultCheck){
                                if(error!=null){
                                    console.log(error);
                                    callback(error,{result:false});
                                }
                                else
                                {
                                    if(resultCheck){
                                        userBagProviter.getUserBagById(model.Membership_Id,resultEditHero.soul_Stone_Id,
                                            function(error,resultUserItem){
                                                if(error!=null){
                                                    console.log(error);
                                                    callback(error,{result:false});
                                                }
                                                else
                                                {
                                                    resultUserItem[0].Item_Amount = resultUserItem[0].Item_Amount-needSoulStoneAmount;
                                                    if(resultUserItem[0].Item_Amount >=0){
                                                        userBagProviter.updateUserBag(resultUserItem[0],function(error,result){
                                                            if(error!=null){
                                                                console.log(error);
                                                                callback(error,{result:false});
                                                            }
                                                            else
                                                            {
                                                                callback(null,{result:true});
                                                            }
                                                        })
                                                    }
                                                    else
                                                    {
                                                        callback(code.UserBag.Item_Not_Enough,{result:false});
                                                    }
                                                }
                                            })
                                    }
                                }
                            })
                    }
                })
            }
        })
    }

}

gameUser.checkUserHero = checkUeserHero;

gameUser.checkUserExist = function(userId,callback){
    checkUserExist(userId,function(error,result){
        callback(error,result);
    })
};
var checkAdvancedCondition = function(model,callback){
    /*
     添加升阶条件判断，使用的装备检测
     阶数未达到上限
     */
    editHeroProviter.getHeroById(model.Hero_Id,function(error,resultEditHero){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            var checkStatus =  true;
            if(resultEditHero.Hero_Equipment1 != model.Hero_Equipment1){
                checkStatus = false
            };
            if(resultEditHero.Hero_Equipment2 != model.Hero_Equipment2){
                checkStatus = false
            };
            if(resultEditHero.Hero_Equipment3 != model.Hero_Equipment3){
                checkStatus = false
            };
            if(resultEditHero.Hero_Equipment4 != model.Hero_Equipment4){
                checkStatus = false
            };
            if(resultEditHero.Hero_Equipment5 != model.Hero_Equipment5){
                checkStatus = false
            };
            if(resultEditHero.Hero_Equipment6 != model.Hero_Equipment6){
                checkStatus = false
            };
            callback(null,{
                result:checkStatus
            });
        }

    })

}

var checkUeserHero = function(userId,Hero_Id,callback){
    gameUserProviter.getUserByUserIdHeroId(userId,Hero_Id,function(error,result){
        if(error != null)
        {
            return callback(code.GameUser.Get_User_Fail, {
                result : error
            });
        }
        if(typeof(result) != "undefined"){

            callback(null,{
                result:result
            });
        }

        else
        {
            callback(code.GameUser.User_Hero_Cannot_Found,{
                result:false
            });
        }

    })
}

var checkUserExist = function(userId,callback){
    gameUserProviter.getUserById(userId,function(error,resultHero){
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
                    console.log('resultGlobal',resultGlobal.CoinStore);
                    gameUserProviter.getTroopStoreByUserId(userId,resultGlobal,function(error,troopResult){
                        if(error != null)
                        {
                            callback(code.GameUser.Get_User_Fail,null);
                        }
                        else
                        {
                            console.log("troopResult:");
                            console.log(troopResult);
                            if(resultHero.length==0 && troopResult.length == 0){
                                console.log('code.GameUser.User_Not_Exist');
                                callback(code.GameUser.User_Not_Exist,null);
                            }
                            else if(troopResult.length==0 || resultHero.length == 0)
                            {
                                console.log('code.GameUser.User_Data_Error')
                                callback(code.GameUser.User_Data_Error,null);
                            }
                            else
                            {
                                var gameTroopModel =  updateUserTroopModel(troopResult[0]);
                                console.log("gameTroopModel:",gameTroopModel);
                                //console.log(troopResult[0]);
                                //userVIPDomain.getVIPData(userId,gameEnum.VIPType.SkillPointLimit,function(error,resultSkillPoint) {
                                //    if (error != null) {
                                //        console.log(error);
                                //        //callback(error,null);
                                //    }
                                //    else {
                                //    }
                                //})
                                userVIPDomain.getVIPData(userId,gameEnum.VIPType.SkillPointLimit,function(error,resultSkillPoint){
                                if(error!=null){
                                    console.log(error);
                                    callback(error,null);
                                }
                                else
                                {
                                    resultGlobal.skill_point_limit = resultSkillPoint;
                                    gameTroopModel = checkUserState(gameTroopModel,resultGlobal);
                                    console.log("gameTroopModel2:",gameTroopModel);
                                    gameUserProviter.getUserById(userId,function(error,resultUserHero){
                                        var gameUserModels = [];
                                        var i = 0;
                                        console.log(resultUserHero);
                                        resultUserHero.forEach(function(gameUser){
                                            var gameUserMode = createUserHeroModel(gameUser);
                                            gameUserModels.push(gameUserMode);
                                            i++;
                                        });
                                        console.log("checkHerosExperience");
                                        gameUser.checkHerosExperience(gameUserModels,function(error,resultChkHero){
                                            if(error!=null){
                                                console.log(error);
                                                callback(error,null);
                                            }
                                            else
                                            {
                                                console.log("updateUserTroop");
                                                gameUserProviter.updateUserTroop(gameTroopModel,function(error,result){
                                                    if(error!=null){
                                                        console.log(error);
                                                        callback(error,null);
                                                    }
                                                    else
                                                    {
                                                        gameUserProviter.getTroopStoreByUserId(userId,resultGlobal,function(error,result){
                                                            if(error!=null){
                                                                console.log(error);
                                                                callback(error,null);
                                                            }
                                                            else
                                                            {

                                                                userDungeonProviter.getUserDungeonByUserId(userId,function(error,resultDungeon){
                                                                    if(error!=null){
                                                                        console.log(error);
                                                                        callback(error,null);
                                                                    }else
                                                                    {
                                                                        if(resultDungeon.length==0 || resultDungeon==null){
                                                                            userDungeonProviter.initUserDungeon(userId,function(error,results){
                                                                                if(error!=null){
                                                                                    console.log(error);
                                                                                    callback(error,null);
                                                                                }
                                                                                else
                                                                                {
                                                                                    resultDungeon = results;
                                                                                }
                                                                            })
                                                                        }
                                                                        callback(null,{
                                                                            heroResult:resultChkHero.userHeros,
                                                                            troopResult:result[0],
                                                                            dungeonResult:resultDungeon
                                                                        });
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    });
                                }
                            });
                            }
                        }
                    });
                }
            });
        }
    });
}

var checkUserState = function(model,modelGlobal){
    var nowTime = new Date();
    console.log('checkUserModel:',model);
    //上次恢复时间为空或0，将最后恢复时间设置为当前
    if(model.Troop_Stamina_Last_Use_Date == null || model.Troop_Stamina_Last_Use_Date=='0000-00-00 00:00:00'){
        model.Troop_Stamina_Last_Use_Date = nowTime;
    }
    if(model.Troop_Skill_Point_Last_Use_Date == null || model.Troop_Skill_Point_Last_Use_Date=='0000-00-00 00:00:00'){
        model.Troop_Skill_Point_Last_Use_Date = nowTime;
    }
    //计算上次回复到当前累加点数

    //modelGlobal.skill_point_limit = resultSkillPoint;
    if(model.Troop_Skill_Point < modelGlobal.skill_point_limit){
        model.Troop_Skill_Point = model.Troop_Skill_Point +
            parseInt(((nowTime.getTime()-model.Troop_Skill_Point_Last_Use_Date.getTime())
                /1000)/modelGlobal.skill_point_recovery_interval);
        if(model.Troop_Skill_Point>modelGlobal.skill_point_limit){
            model.Troop_Skill_Point = modelGlobal.skill_point_limit;
            model.Troop_Skill_Point_Last_Use_Date = nowTime;
        }
    }

    //记录上次回复到当前的时间差
    var diffSkillTime = (nowTime.getTime()-model.Troop_Skill_Point_Last_Use_Date.getTime());
    //恢复时间差大于技能恢复间隔，更新最后恢复时间
    if(diffSkillTime!=0 && (diffSkillTime/1000)>=modelGlobal.skill_point_recovery_interval &&
        model.Troop_Skill_Point<=modelGlobal.skill_point_limit){
        model.Troop_Skill_Point_Last_Use_Date = new Date(nowTime.getTime()-(diffSkillTime-parseInt(diffSkillTime
                /modelGlobal.skill_point_recovery_interval/1000)*modelGlobal.skill_point_recovery_interval*1000));
    }
    console.log("time:");
    console.log(nowTime);
    console.log(model.Troop_Skill_Point_Last_Use_Date);

    //if(model.Troop_Skill_Point>modelGlobal.skill_point_limit){
    //    model.Troop_Skill_Point = modelGlobal.skill_point_limit;
    //    model.Troop_Skill_Point_Last_Use_Date = nowTime;
    //}
    if(model.Troop_Stamina<=model.Troop_Max_Stamina){
        model.Troop_Stamina = model.Troop_Stamina+parseInt((nowTime.getTime() -
                model.Troop_Stamina_Last_Use_Date.getTime())/1000/
                modelGlobal.stamina_recover_interval);
        var diffTroopTime = (nowTime.getTime()-model.Troop_Stamina_Last_Use_Date.getTime());
        if(diffTroopTime!=0 && (diffTroopTime/1000)>=modelGlobal.stamina_recover_interval){
            model.Troop_Stamina_Last_Use_Date = new Date(nowTime.getTime()-(diffTroopTime-parseInt(diffTroopTime/
                    modelGlobal.stamina_recover_interval)*modelGlobal.stamina_recover_interval));
        }
        if(model.Troop_Stamina>model.Troop_Max_Stamina){
            model.Troop_Stamina =  model.Troop_Max_Stamina;
            model.Troop_Stamina_Last_Use_Date = nowTime;
        }
    }
    return model;
}

var checkUserTroopStamina = function(userTroopModel,callback){
    editGolbalProviter.getTroopGrowing(function(error,resultEditTroop){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            if(userTroopModel.troop_Stamina > resultEditTroop[userTroopModel.trooplvl].Stamina){
                userTroopModel.troop_Stamina = resultEditTroop[userTroopModel.trooplvl].Stamina;
            }
            gameUserProviter.updateUserTroop(userTroopModel,function(error,result){
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    callback(null,result);
                }
            })
        }
    })
}

var checkUserItem = function(userId,itemId,Amount,callback){
    console.log('input:',itemId,'||',Amount)
    userBagProviter.getUserBagById(userId,itemId,function(error,result){
        console.log(result);
        if(error != null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            if(result.length>0){
                if(result[0].Item_Amount >= Amount){
                    callback(null,true);
                }
                else
                {
                    callback(code.UserBag.Item_Not_Enough,false)
                }

            }
            else
            {
                callback(code.UserBag.Item_Not_Found,false);
            }
        }
    })
}

gameUser.checkHeroExperience = function(userHeroModel,callback){
    editGolbalProviter.getHeroGrowing(function(error,resultEditHero){
        if(error!=null){
            console.log(error);
            callback(error,{result:false});
        }
        else
        {
            gameUserProviter.getTroopByUserId(userHeroModel.User_Id,function(error,resultUserTroop) {
                if (error != null) {
                    console.log(error);
                    callback(error, null);
                }
                else {
                    if (userHeroModel != null) {
                        while (userHeroModel.Hero_Experience >= resultEditHero[userHeroModel.Hero_Lvl]
                        && userHeroModel.Hero_Lvl < resultUserTroop.Troop_Lvl) {
                            if (userHeroModel.Hero_Lvl < resultUserTroop.Troop_Lvl) {
                                userHeroModel.Hero_Experience = userHeroModel.Hero_Experience - resultEditHero[userHeroModel.Hero_Lvl];
                                userHeroModel.Hero_Lvl++;
                            }
                            else
                            {
                                userHeroModel.Hero_Lvl = resultUserTroop.Troop_Lvl;
                                if(userHeroModel.Hero_Experience > resultEditHero[userHeroModel.Hero_Lvl]){
                                    userHeroModel.Hero_Experience = resultEditHero[userHeroModel.Hero_Lvl];
                                }
                            }
                        }
                        console.log("userHeroModel==----======");
                        console.log(userHeroModel.Hero_Lvl);
                        gameUserProviter.updateUser(userHeroModel, function (error, result) {
                            if (error != null) {
                                console.log(error);
                                callback(error, {result: false});
                            }
                            else {
                                callback(null, {result: true});
                            }
                        });
                    }
                    else {
                        callback(null, {result: true});
                    }
                }
            });

        }
    });
}
gameUser.checkHerosExperience = function(userHeroModels,callback){
    console.log("userHeroModels:");
    console.log(userHeroModels);
    editGolbalProviter.getHeroGrowing(function(error,resultEditHero){
        if(error!=null){
            console.log(error);
            callback(error,{result:false});
        }
        else
        {
            gameUserProviter.getTroopByUserId(userHeroModels[0].User_Id,function(error,resultUserTroop){
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {

                    var i = 0;
                    var userHeroModela = [];
                    console.log('resultUserTroop:',resultUserTroop);
                    userHeroModels.forEach(function(userHeroModel){
                        while(Number(userHeroModel.Hero_Experience) >= Number(resultEditHero[userHeroModel.Hero_Lvl])
                        && (userHeroModel.Hero_Lvl < resultUserTroop[0].Troop_Lvl)){
                            userHeroModel.Hero_Experience = userHeroModel.Hero_Experience - resultEditHero[userHeroModel.Hero_Lvl];
                            userHeroModel.Hero_Lvl++;
                        }
                        if(userHeroModel.Hero_Lvl >= resultUserTroop[0].Troop_Lvl) {
                            userHeroModel.Hero_Lvl = resultUserTroop[0].Troop_Lvl;
                            if (userHeroModel.Hero_Experience > resultEditHero[userHeroModel.Hero_Lvl]) {
                                userHeroModel.Hero_Experience = resultEditHero[userHeroModel.Hero_Lvl];
                            }
                        }
                        userHeroModela.push(userHeroModel);
                        i++;
                    });
                    console.log("userHeroModel");
                    console.log(userHeroModels)
                    console.log("===============");
                    console.log(userHeroModela);
                    gameUserProviter.updateUsers(userHeroModela,function(error,result){
                        if(error!=null){
                            console.log(error);
                            callback(error,{result:false});
                        }
                        else
                        {
                            callback(null,{result:true,
                                userHeros:userHeroModels});
                        }
                    });
                }
            });

        }
    });
    //callback(null,{result:false});
}

var checkTroopExperience = function(userTroopModel,callback){
    console.log("checkTroopExperience--------------");
    console.log(userTroopModel);
    editGolbalProviter.getTroopGrowing(function(error,resultEditTroop){
        if(error!=null){
            console.log(error);
            callback(error,false);
        }
        else
        {
            editGolbalProviter.getGlobal(function(error,resultEditGolbal){
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    while(userTroopModel.Troop_Current_Experience >= resultEditTroop[userTroopModel.Troop_Lvl].Experience
                    && userTroopModel.Troop_Lvl<resultEditGolbal.troop_Lvl_Limit){
                        if(userTroopModel.Troop_Lvl<resultEditGolbal.troop_Lvl_Limit){
                            userTroopModel.Troop_Current_Experience =  userTroopModel.Troop_Current_Experience -
                                resultEditTroop[userTroopModel.Troop_Lvl].Experience;
                            userTroopModel.Troop_Lvl++;
                            userTroopModel.Troop_Stamina += Number(resultEditTroop[userTroopModel.Troop_Lvl].StaminaRecovery);
                        }
                        else
                        {
                            userTroopModel.Troop_Lvl = resultEditGolbal.troop_Lvl_Limit;
                            if(userTroopModel.Troop_Current_Experience > resultEditTroop[userTroopModel.Troop_Lvl].Experience){
                                userTroopModel.Troop_Current_Experience = resultEditTroop[userTroopModel.Troop_Lvl].Experience;
                            }
                        }

                    }
                    userTroopModel.Troop_Max_Stamina = resultEditTroop[userTroopModel.Troop_Lvl].Stamina;
                    gameUserProviter.updateUserTroop(userTroopModel,function(error,result){
                        if(error!=null){
                            console.log(error);
                            callback(error,false);
                        }
                        else
                        {
                            callback(null,true);
                        }
                    })
                }
            })
        }
    });

}

gameUser.updateMainTown = function(user_Id,update_Time,callback){
    userMailDomain.CheckUnReadMail(user_Id,function(error,resultUnRead){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            userRankProviter.getUserLastNPVPRecord(user_Id,1,function(error,resultsPVPRecord){
                var has_New_PVP = false;
                console.log("resultsPVPRecord");
                console.log(resultsPVPRecord);
                if(resultsPVPRecord.length == 0){

                }
                else if(resultsPVPRecord[0].Last_Update_Date.getTime()> update_Time){
                    has_New_PVP = true;
                }
                var results = {};
                results.HasNewMail =  resultUnRead;
                results.HasNewPVP = has_New_PVP;
                results.NowTime = new Date().getTime().toString();
                callback(null,results);
            });
        }

    })
}

gameUser.getPVPInfo = function(user_Id,callback){
    editGolbalProviter.getGlobal(function(error,resultGlobal){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            gameUser.checkGameFunction(user_Id,gameEnum.GameFunction.Arena,function(error,resultCheckResult){
                if(error!=null)
                {
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    if(resultCheckResult.checkStatus){
                        //获取PVP战斗记录
                        userRankProviter.getUserLastNPVPRecord(user_Id,10,function(error,resultsPVPRecord){
                            if(error!=null){
                                console.log(error);
                                callback(error,null);
                            }
                            else
                            {
                                var results = {};
                                console.log("resultsPVPRecord");
                                console.log(resultsPVPRecord);
                                results.PVPRecord = resultsPVPRecord;
                                results.PVPStoreGoods = [];
                                //PVP匹配
                                userRankDomain.PVPMatch(user_Id,function(error,resultPVPMatch){
                                    if(error!=null){
                                        console.log(error);
                                        callback(error,null);
                                    }
                                    else
                                    {
                                        results.PVPTroops = resultPVPMatch.PVPTroops;
                                        //获取用户排名
                                        userRankProviter.getUserRank(user_Id,function(error,resultUserRank){
                                            if(error!=null){
                                                console.log(error);
                                                callback(error,null);
                                            }
                                            else
                                            {
                                                //获取用户商店商品
                                                userRankProviter.getStoreByUserIdStoreId(user_Id,resultGlobal.ArenaStore,function(error,resultsUserStore){
                                                    if(error!=null){
                                                        console.log(error);
                                                        callback(error,null);
                                                    }
                                                    else
                                                    {
                                                        results.PVPStoreGoods = resultsUserStore;
                                                        results.UserRank = resultUserRank;
                                                        console.log("resultsUserStore");
                                                        console.log(resultsUserStore.length);
                                                        if(resultsUserStore.length == 0){
                                                            console.log(0);
                                                            //如果用户商店为空，那么刷新商店
                                                            userRankDomain.RefreshStore(user_Id,resultGlobal.ArenaStore,function(error,resultsUserStoreNew){
                                                                if(error!=null){
                                                                    console.log(error);
                                                                    callback(error,null);
                                                                }
                                                                else{
                                                                    results.PVPStoreGoods = resultsUserStoreNew.UserStore;
                                                                    console.log(resultsUserStoreNew);
                                                                    console.log("results");
                                                                    callback(null,results);
                                                                }
                                                            });
                                                        }else
                                                        {

                                                            console.log(results);
                                                            callback(null,results);
                                                        }

                                                    }
                                                })
                                            }
                                        })
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

        }
    })

}

gameUser.getRank =  function(user_Id,callback){
    console.log(user_Id);
    gameUser.checkGameFunction(user_Id,gameEnum.GameFunction.Leaderboard,function(error,resultCheckResult){
        if(error!=null)
        {
            console.log(error);
            callback(error,null);
        }
        else
        {
            if(resultCheckResult.checkStatus){
                console.log("getAllRank");
                userRankProviter.getAllRank(function(error,resultsAllRank){
                    var results = {};
                    if(error!=null){
                        console.log(error);
                        callback(error,null);
                    }
                    else
                    {
                        console.log("getAllPreRank");
                        userRankProviter.getAllPreRank(function(error,resultAllPreRank){
                            if(error!=null){
                                console.log(error);
                                callback(error,null);
                            }
                            else
                            {
                                console.log("result");
                                results.TodayRank = resultsAllRank;
                                results.YesterdayRank = resultAllPreRank;
                                callback(null,results);
                            }
                        })

                    }
                })
            }
            else
            {
                callback(code.UserGameFunction.Leaderboard_Not_Open,null);
            }
        }
    })
}

gameUser.UpdateAvatar = function(userId,avatarId,avatarFrameId,callback){
    gameUserProviter.getTroopByUserId(userId,function(error,resultUserTroop){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            checkUserAvatar(userId,avatarId,gameEnum.AvatarType.Avatar,function(error,resultCheckAvatar){
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    checkUserAvatar(userId,avatarFrameId,gameEnum.AvatarType.AvatarFrame,function(error,resultCheckAvatarFrame){
                        if(error!=null){
                            console.log(error);
                            callback(error,null);
                        }
                        else
                        {
                            resultUserTroop[0].Troop_Avatar_Id = avatarId;
                            resultUserTroop[0].Troop_Avatar_Frame_Id = avatarFrameId;
                            gameUserProviter.updateUserTroop(resultUserTroop[0],function(error,resultUpdateUser){
                                if(error!=null){
                                    console.log(error);
                                    callback(error,null);
                                }
                                else
                                {
                                    var results = {
                                        code :code.SUCCESS
                                    };
                                    callback(null,results);
                                }
                            })
                        }
                    })
                }
            })

        }
    })
}

gameUser.getNickname = function(userId,callback){
    console.log("getNickname");
    gameUserProviter.getNickname(userId,function(error,resultNickname){
        console.log('resultNickname:',resultNickname);
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            callback(null,{Nicknames:resultNickname});
        }
    })
}

gameUser.updateNickname = function(userId,nickName ,callback){
    editGolbalProviter.getGlobal(function(error,resultGlobal){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            gameUserProviter.getTroopByUserId(userId,function(error,resultUserTroop) {
                console.log("resultUserTroop");
                console.log(resultUserTroop);
                if (error != null) {
                    console.log(error);
                    callback(error, null);
                }
                else {
                    console.log("getTroopByNickname");
                    gameUserProviter.getTroopByNickname(nickName,function(error,resultNickname){
                        console.log(resultNickname);
                        if(error!=null){
                            console.log(error);
                            callback(error,null);
                        }
                        else
                        {
                            if(resultNickname.length == 0){
                                if(resultUserTroop[0].Troop_Name == ''){
                                    console.log("new");
                                    gameUserProviter.updateNickname(userId, nickName, function (error, resultUpdateName) {
                                        if (error != null) {
                                            console.log(error);
                                            callback(error, null);
                                        }
                                        else {
                                            callback(null, {result: resultUpdateName});
                                        }
                                    });
                                }else
                                {
                                    console.log("use");
                                    userBagProviter.useItemById(userId, resultGlobal.Diamond, resultGlobal.DiamondExpend.ChangeNickname, 0,
                                        function (error, resultUseItem) {
                                            if (error != null) {
                                                console.log(error);
                                                callback(error, null);
                                            }
                                            else {
                                                gameUserProviter.updateNickname(userId, nickName, function (error, resultUpdateName) {
                                                    if (error != null) {
                                                        console.log(error);
                                                        callback(error, null);
                                                    }
                                                    else {
                                                        callback(null, {result: resultUpdateName});
                                                    }
                                                });
                                            }
                                        });
                                }
                            }
                            else{
                                callback(code.UserNickname.Nickname_Is_Used,null);
                            }
                        }

                    })

                }
            });
        }
    })
}

var checkUserAvatar = function(userId,avatarId,avatarType,callback){
    editAvatarProviter.getAvatarById(avatarId,function(error,resultGetAvatar){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            console.log("resultGetAvatar");
            console.log(resultGetAvatar);
            console.log(avatarType);
            if(resultGetAvatar[0].Avatar_Type == avatarType){
                if(resultGetAvatar[0].Avatar_Grade == 2){
                    gameUserProviter.getUserHeroByHeroTag(userId,resultGetAvatar[0].Hero_Tag,function(error,resultsUserHero){
                        if(error!=null){
                            console.log(error);
                            callback(error,null);
                        }
                        else
                        {
                            console.log("resultsUserHero");
                            console.log(resultsUserHero);
                            if(resultsUserHero.length > 0 ){
                                callback(null,{result:true});
                            }
                            else
                            {
                                callback(code.UserAvatar.Hero_Avatar_Error,null);
                            }
                        }
                    })
                }
                else
                {
                    if(resultGetAvatar[0].Avatar_Type ==  gameEnum.AvatarType.AvatarFrame){
                        gameUserProviter.getUserAvatarByUserId(userId,function(error,resultUserAvatar){
                            var avatar_Enable = false;
                            resultUserAvatar.forEach(function(userAvatar){
                                if(userAvatar.Avatar_Id == avatarId){
                                    avatar_Enable = true;
                                }
                            });
                            if(avatar_Enable){
                                callback(null,{result:true});
                            }
                            else
                            {
                                callback(code.UserAvatar.Avatar_Not_Matched,null);
                            }
                        })
                    }
                    else
                    {
                        callback(null,{result:true});
                    }

                }
            }
            else
            {
                console.log("error");
                console.log(resultGetAvatar);
                callback(code.UserAvatar.Avatar_Type_Error,null);
            }
        }
    })
}

var updateUserHeroModel = function(result){
    var gameUserModel = {};
    gameUserModel.User_Hero_Id =  result.User_Hero_Id;
    gameUserModel.Membership_Id = result.Membership_Id;
    gameUserModel.User_Id =  result.Membership_Id;
    gameUserModel.Hero_Id = result.Hero_Id;
    gameUserModel.Hero_Lvl =  result.Hero_Lvl;
    gameUserModel.Hero_Star = result.Hero_Star;
    gameUserModel.InitiativeSkill_Lvl = result.InitiativeSkill_Lvl;
    gameUserModel.PassiveSkill_Lvl = result.PassiveSkill_Lvl;
    gameUserModel.CharacteristicSkill_Lvl = result.CharacteristicSkill_Lvl;
    gameUserModel.Hero_Experience = result.Hero_Experience;
    gameUserModel.Hero_Equipment1 =  result.Hero_Equipment1;
    gameUserModel.Hero_Equipment2 =  result.Hero_Equipment2;
    gameUserModel.Hero_Equipment3 =  result.Hero_Equipment3;
    gameUserModel.Hero_Equipment4 =  result.Hero_Equipment4;
    gameUserModel.Hero_Equipment5 =  result.Hero_Equipment5;
    gameUserModel.Hero_Equipment6 =  result.Hero_Equipment6;
    return gameUserModel;
};

var createUserHeroModel = function(result){
    var userHeroModel = {

    };
    userHeroModel.User_Hero_Id =  result.User_Hero_Id;
    userHeroModel.Membership_Id = result.Membership_Id;
    userHeroModel.User_Id =  result.Membership_Id;
    userHeroModel.Hero_Id = result.Hero_Id;
    userHeroModel.Hero_Lvl =  result.Hero_Lvl;
    userHeroModel.Hero_Star = result.Hero_Star;
    userHeroModel.InitiativeSkill_Lvl = result.InitiativeSkill_Lvl;
    userHeroModel.PassiveSkill_Lvl = result.PassiveSkill_Lvl;
    userHeroModel.CharacteristicSkill_Lvl = result.CharacteristicSkill_Lvl;
    userHeroModel.Hero_Experience = result.Hero_Experience;
    userHeroModel.Hero_Equipment1 =  result.Hero_Equipment1;
    userHeroModel.Hero_Equipment2 =  result.Hero_Equipment2;
    userHeroModel.Hero_Equipment3 =  result.Hero_Equipment3;
    userHeroModel.Hero_Equipment4 =  result.Hero_Equipment4;
    userHeroModel.Hero_Equipment5 =  result.Hero_Equipment5;
    userHeroModel.Hero_Equipment6 =  result.Hero_Equipment6;
    return userHeroModel;
};

var updateUserTroopModel = function(result){
    var gameUserModel={};
    gameUserModel.User_Id = result.User_Id;
    gameUserModel.Membership_Id = result.User_Id;
    gameUserModel.Troop_Id =  result.Troop_Id;
    gameUserModel.Troop_Lvl = result.Troop_Lvl;
    gameUserModel.Troop_Current_Experience = result.Troop_Current_Experience;
    gameUserModel.Troop_Stamina =  result.Troop_Stamina;
    gameUserModel.Troop_Name =  result.Troop_Name;
    gameUserModel.Troop_Max_Stamina = result.Troop_Max_Stamina;
    gameUserModel.Troop_Avatar_Id = result.Troop_Avatar_Id;
    gameUserModel.Troop_Avatar_Frame_Id = result.Troop_Avatar_Frame_Id;
    gameUserModel.Troop_Skill_Point_Last_Use_Date = result.Troop_Skill_Point_Last_Use_Date;
    gameUserModel.Troop_Skill_Point = result.Troop_Skill_Point;
    gameUserModel.Troop_Stamina_Last_Use_Date = result.Troop_Stamina_Last_Use_Date;
    return gameUserModel;

}

gameUser.checkGameFunction =  function(userId,gameFunction,callback){
    gameUserProviter.getTroopByUserId(userId,function(error,resultUserTroop){
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
                    var gameFunctionStatus = false;
                    switch (gameFunction){
                        case gameEnum.GameFunction.Arena:
                            if(resultUserTroop[0].Troop_Lvl >= resultGlobal.Game_Function.Arena)
                            {
                                gameFunctionStatus = true;
                            }
                            else
                            {
                                gameFunctionStatus =  false;
                            };
                            break;
                        case gameEnum.GameFunction.Buried_Treasure:
                            if(resultUserTroop[0].Troop_Lvl >= resultGlobal.Game_Function.Buried_Treasure)
                            {
                                gameFunctionStatus = true;
                            }
                            else
                            {
                                gameFunctionStatus =  false;
                            };
                            break;
                        case gameEnum.GameFunction.Businessman:
                            if(resultUserTroop[0].Troop_Lvl >= resultGlobal.Game_Function.Businessman)
                            {
                                gameFunctionStatus = true;
                            }
                            else
                            {
                                gameFunctionStatus =  false;
                            };
                            break;
                        case gameEnum.GameFunction.Caverns_Of_Time:
                            if(resultUserTroop[0].Troop_Lvl >= resultGlobal.Game_Function.Caverns_Of_Time)
                            {
                                gameFunctionStatus = true;
                            }
                            else
                            {
                                gameFunctionStatus =  false;
                            };
                            break;
                        case gameEnum.GameFunction.Elite_Stage:
                            if(resultUserTroop[0].Troop_Lvl >= resultGlobal.Game_Function.Elite_Stage)
                            {
                                gameFunctionStatus = true;
                            }
                            else
                            {
                                gameFunctionStatus =  false;
                            };
                            break;
                        case gameEnum.GameFunction.Enchanting:
                            if(resultUserTroop[0].Troop_Lvl >= resultGlobal.Game_Function.Enchanting)
                            {
                                gameFunctionStatus = true;
                            }
                            else
                            {
                                gameFunctionStatus =  false;
                            };
                            break;
                        case gameEnum.GameFunction.Expedition:
                            if(resultUserTroop[0].Troop_Lvl >= resultGlobal.Game_Function.Expedition)
                            {
                                gameFunctionStatus = true;
                            }
                            else
                            {
                                gameFunctionStatus =  false;
                            };
                            break;
                        case gameEnum.GameFunction.Guild:
                            if(resultUserTroop[0].Troop_Lvl >= resultGlobal.Game_Function.Guild)
                            {
                                gameFunctionStatus = true;
                            }
                            else
                            {
                                gameFunctionStatus =  false;
                            };
                            break;
                        case gameEnum.GameFunction.Hero_Trial:
                            if(resultUserTroop[0].Troop_Lvl >= resultGlobal.Game_Function.Hero_Trial)
                            {
                                gameFunctionStatus = true;
                            }
                            else
                            {
                                gameFunctionStatus =  false;
                            };
                            break;
                        case gameEnum.GameFunction.Leaderboard:
                            if(resultUserTroop[0].Troop_Lvl >= resultGlobal.Game_Function.Leaderboard)
                            {
                                gameFunctionStatus = true;
                            }
                            else
                            {
                                gameFunctionStatus =  false;
                            };
                            break;
                        case gameEnum.GameFunction.Pool_Of_Prophecy:
                            if(resultUserTroop[0].Troop_Lvl >= resultGlobal.Game_Function.Pool_Of_Prophecy)
                            {
                                gameFunctionStatus = true;
                            }
                            else
                            {
                                gameFunctionStatus =  false;
                            };
                            break;
                        case 0:

                            gameFunctionStatus = true;

                            break;
                    }
                    callback(null,{checkStatus:gameFunctionStatus});
                }
            })
        }
    })
}