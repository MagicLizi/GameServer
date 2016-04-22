/**
 * Created by peihengyang on 15/1/6.
 */
var code = require('../../code');
var async =  require('async');
var gameEnum = require('../../enum');
var gameUserProviter = require('../../dao_provider/dao_Game/gameUser');
var userBagProviter = require('../../dao_provider/dao_Game/Bag');
var gameUserDomain = require('./gameUser');
var userBagDomain = require('./userBag');
var gameStoreDomain = require('./gameStore');
var userTaskDomain = require('./userTask');
var userRankDomain =  require('./userRank');
var userRankProviter = require('../../dao_provider/dao_Game/rank');
var userDungeonProviter = require('../../dao_provider/dao_Game/dungeon');
var lotteryProviter = require('../../dao_provider/dao_Game/lottery');
var editDungeonProviter = require('../../dao_provider/dao_edit/DP_Dungeon');
var editItemProviter = require('../../dao_provider/dao_edit/item');
var editGolbalProviter = require('../../dao_provider/dao_edit/global');
var editProvider = require('../domain_config/config');
var editGolbal = editProvider.getConfig("global").info;
var userVIPDomain = require('./userVIP');
var userFight = module.exports;

userFight.StartPVEFight = function(user_Id,stage_Id,hero_List,callback){
    userBagProviter.getUserBagById(user_Id,editGolbal.FourLeaf,function(error,resultFourLeaf){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            var fourLeafCount = 0;
            if(resultFourLeaf.length != 0){
                fourLeafCount = resultFourLeaf[0].Item_Amount;
            }

            checkUserStage(user_Id,stage_Id,function(error,resultsCheckUserStage){
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    console.log(resultsCheckUserStage);
                    if(!resultsCheckUserStage.checked){
                        callback(code.UserDungeon.User_Stage_Times_Limit,null);
                    }
                    else
                    {
                        var fight_Type = resultsCheckUserStage.Dungeon_Type;
                        console.log('updateUserTroopRecord');
                        userDungeonProviter.updateUserTroopRecord(user_Id,fight_Type,hero_List,0,function(error,results){
                            if(error!=null){
                                console.log(error);
                                callback(error,null);
                            }
                            else
                            {
                                var userFight = createUserDungeonModel(resultsCheckUserStage.resultsUserDungeon[0]);
                                userFight.Create_Date =  new Date();
                                userFight.Loot_List = '[]';
                                userFight.Fight_Status = gameEnum.FightStatus.Start;
                                userFight.Hero_List = hero_List;
                                console.log("userFight:")
                                console.log(userFight);
                                itemLoot(userFight,function(error,result){
                                    if(error!=null){
                                        console.log(error);
                                        callback(error,null);
                                    }
                                    else
                                    {
                                        userFight.Loot_List = JSON.stringify(result);
                                        var resultFight = {
                                            Loot_List:result
                                        };
                                        console.log('addUserFing');
                                        userDungeonProviter.addUserFight(userFight,function(error,results){
                                            if(error!=null){
                                                console.log(error);
                                                callback(error,null);
                                            }
                                            else
                                            {
                                                resultFight.Fight_Id = results[0].Fight_Id;
                                                gameUserProviter.getUserHeroByHeroIds(user_Id,hero_List,function(error,resultHeros){
                                                    if(error!=null){
                                                        console.log(error);
                                                        callback(error,null);
                                                    }
                                                    else
                                                    {
                                                        gameStoreDomain.getGoblinStore(user_Id,1,function(error,resultGoblinStore){
                                                            if(error){
                                                                console.log(error);
                                                                callback(error,null);
                                                            }
                                                            else
                                                            {
                                                                resultFight.User_Store = resultGoblinStore;
                                                                resultFight.User_Troop = resultHeros;
                                                                resultFight.refresh = resultsCheckUserStage.refresh;
                                                                resultFight.remainderOfTimes = resultsCheckUserStage.remainderOfTimes;
                                                                resultFight.FourLeaf = fourLeafCount;
                                                                console.log('resultFight:',resultFight);
                                                                callback(null,resultFight);
                                                            }
                                                        })

                                                    }
                                                })

                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    })
}

userFight.FinishPVEFight =  function(Fight_Id,Finish_Type,clear_Star,Boss_Life,FourLeaf_Amount,callback){
    userDungeonProviter.getFightById(Fight_Id,function(error,results){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            if(results.length==0){
                callback(code.UserDungeon.User_Fight_Not_Found,null);
            }
            else if(results.length!=1)
            {
                callback(code.UserDungeon.User_Fight_Data_Error,null);
            }
            else
            {
                console.log("Fight");
                console.log(results[0]);
                console.log("EndFight");
                var user_Fight = createUserFightModel(results[0]);
                user_Fight.Fight_Id = results[0].Fight_Id;
                (clear_Star > 3)?clear_Star = 3:null;
                user_Fight.Clear_Star = clear_Star;
                if(user_Fight.Fight_Status!=gameEnum.FightStatus.Start){
                    console.log('FightStatus:',code.UserDungeon.User_Fight_Status_Error)
                    return callback(code.UserDungeon.User_Fight_Status_Error,null);
                }
                var stamina_Expend = 0;
                var troop_Exp = 0
                var goNextDungeon = 0;
                switch (Number(Finish_Type)){
                    case gameEnum.FightStatus.Cancel:
                        user_Fight.Fight_Status =  gameEnum.FightStatus.Cancel;
                        stamina_Expend = results[0].Stamina_Expend/6;
                        user_Fight.Loot_List = '[]';
                        break;
                    case gameEnum.FightStatus.Victory:
                        user_Fight.Fight_Status =  gameEnum.FightStatus.Victory;
                        stamina_Expend = results[0].Stamina_Expend;
                        goNextDungeon = 1;
                        troop_Exp = results[0].Stamina_Expend;
                        break;
                    case gameEnum.FightStatus.PVERaid:
                        user_Fight.Fight_Status =  gameEnum.FightStatus.PVERaid;
                        stamina_Expend = results[0].Stamina_Expend;
                        goNextDungeon = 1;
                        troop_Exp = results[0].Stamina_Expend;
                        break;
                    case gameEnum.FightStatus.Failure:
                    user_Fight.Fight_Status =  gameEnum.FightStatus.Failure;
                    stamina_Expend = results[0].Stamina_Expend/6;
                    user_Fight.Loot_List = '[]';
                    break;
                    default :
                        user_Fight.Fight_Status =  gameEnum.FightStatus.Error;
                        stamina_Expend = 0;
                        user_Fight.Loot_List = '[]';
                        break;
                }
                userBagDomain.useItemById(results[0].User_Id,editGolbal.FourLeaf,FourLeaf_Amount,0,function(error,resultUseItem){
                    if(error!=null){
                        console.log(error);
                        user_Fight.Fight_Status =  gameEnum.FightStatus.Error;
                        stamina_Expend = 0;
                        user_Fight.Loot_List = '[]';
                        finish_Fight(user_Fight,stamina_Expend,troop_Exp,goNextDungeon,Boss_Life,function(error,result){
                            if(error!=null){
                                console.log(error);
                                callback(code.UserDungeon.User_Fight_Finish_Error,null);
                            }
                            else
                            {
                                callback(null,result);
                            }
                        })
                    }
                    else
                    {
                        finish_Fight(user_Fight,stamina_Expend,troop_Exp,goNextDungeon,Boss_Life,function(error,result){
                            if(error!=null){
                                console.log(error);
                                callback(code.UserDungeon.User_Fight_Finish_Error,null);
                            }
                            else
                            {
                                callback(null,result);
                            }
                        })
                    }
                })

            }
        }
    })
}

var finish_Fight = function(userFightModel,stamina_Expend,troop_Exp,goNextDungeon,BossLife,callback){
    console.log("getUserHeroByHeroIds");
    userFightModel.Loot_List = JSON.parse(userFightModel.Loot_List);
    gameUserProviter.getUserHeroByHeroIds(userFightModel.User_Id,userFightModel.Hero_List,function(error,resultHeroIds){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {

            console.log("addHerosExperience");
            editDungeonProviter.getStage(userFightModel.Stage_Id,function(error,resultStage){
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    var Hero_Experience = 0 ;
                    if(userFightModel.Fight_Status == gameEnum.FightStatus.Victory){
                        Hero_Experience = Math.round(resultStage[0].Heros_Experience/(resultHeroIds.length));
                    };
                    if(userFightModel.Fight_Status == gameEnum.FightStatus.PVERaid)
                    {
                        Hero_Experience = 0;
                        userFightModel.Fight_Status = gameEnum.FightStatus.Victory;
                    };
                    console.log("addTroopExperience");
                    gameUserDomain.addTroopExperience(userFightModel.User_Id,troop_Exp,function(error,resultAddTroopExp){
                        if(error!=null){
                            console.log(error);
                            callback(code.UserTroop.Troop_Add_Experience_Error,null);
                        }
                        else
                        {
                            console.log("addHerosExperience ========= 1");
                            console.log(Hero_Experience);
                            gameUserDomain.addHerosExperience(userFightModel.User_Id,resultHeroIds,Hero_Experience,
                                function(error,resultAddHeroExp){
                                    if(error!=null){
                                        console.log(error);
                                        callback(code.UserHero.Hero_Add_Experience_Error,null);
                                    }
                                    else
                                    {
                                        console.log("addTroopStamina ========= 1");
                                        gameUserDomain.addTroopStamina(userFightModel.User_Id,0-stamina_Expend,function(error,resultAddTroopSta){
                                            if(error!=null){
                                                console.log(error);
                                                callback(code.UserTroop.Troop_Add_Stamina_Error,null);
                                            }
                                            else
                                            {
                                                if(userFightModel.Fight_Status ==  gameEnum.FightStatus.Victory){
                                                    editItemProviter.getItemEffectByType(gameEnum.Item_Effect_Type.HeroExperience,function(error,resultHeroExpItems){
                                                        if(error!=null){
                                                            console.log(error);
                                                            callback(error,null);
                                                        }
                                                        else {
                                                            console.log("addItemsToBag ========= 1");
                                                            console.log(userFightModel.Loot_List);
                                                            if(resultStage[0].Stage_Type == gameEnum.StageType.Coin ||
                                                                resultStage[0].Stage_Type == gameEnum.StageType.Experience){
                                                                userFightModel.Loot_List.forEach(function(item,index){
                                                                    userFightModel.Loot_List[index].Item_Amount = item.Item_Amount * BossLife/10000;
                                                                });
                                                            }
                                                            if(resultStage[0].Stage_Type == gameEnum.StageType.Experience){
                                                                var Item_List = [];
                                                                var Item_One = {
                                                                    Item_Id: resultHeroExpItems[0].Item_Id,
                                                                    Item_Amount: 0,
                                                                    User_Id: userFightModel.User_Id
                                                                };
                                                                var StageExp = userFightModel.Loot_List[0].Item_Amount;
                                                                console.log("resultHeroExpItems:")
                                                                console.log(resultHeroExpItems);
                                                                console.log(StageExp);
                                                                console.log(resultHeroExpItems[0].Effect_Value);
                                                                console.log(StageExp / resultHeroExpItems[1].Effect_Value);
                                                                console.log(parseInt(StageExp / resultHeroExpItems[1].Effect_Value));
                                                                resultHeroExpItems.forEach(function (HeroExpItem) {
                                                                    console.log("======================");
                                                                    console.log(HeroExpItem);
                                                                    if (StageExp >= HeroExpItem.Effect_Value) {
                                                                        var ExpRemain = parseInt(StageExp / HeroExpItem.Effect_Value);
                                                                        console.log(ExpRemain);
                                                                        StageExp = StageExp - ExpRemain * HeroExpItem.Effect_Value;
                                                                        Item_List.push({
                                                                            Item_Id: HeroExpItem.Item_Id,
                                                                            Item_Amount: ExpRemain,
                                                                            User_Id: userFightModel.User_Id
                                                                        });
                                                                        Item_One.Item_Id = HeroExpItem.Item_Id;
                                                                    }
                                                                });
                                                                if (StageExp > 0) {
                                                                    Item_One.Item_Amount = 1;
                                                                    Item_List.push(Item_One);
                                                                }
                                                                console.log('userFightModel.Loot_List');
                                                                userFightModel.Loot_List = Item_List;
                                                            }
                                                            console.log(userFightModel.Loot_List);
                                                            userBagDomain.addItemsToBag(userFightModel.User_Id,userFightModel.Loot_List,function(error,resultAddItem){
                                                                if(error!=null){
                                                                    console.log(error);
                                                                    callback(code.UserBag.Item_Add_Fail,null);
                                                                }
                                                                else
                                                                {
                                                                    console.log("updateUserFight");
                                                                    userDungeonProviter.updateUserFight(userFightModel,function(error,results){
                                                                        if(error!=null){
                                                                            console.log(error);
                                                                            callback(code.UserDungeon.User_Fight_Update_Error,null);
                                                                        }
                                                                        else
                                                                        {

                                                                            console.log("getUserDungeonByUserIdStageId");
                                                                            userDungeonProviter.getUserDungeonByUserIdStageId(userFightModel.User_Id,userFightModel.Stage_Id,function(error,result){
                                                                                if(error!=null){
                                                                                    console.log(error);
                                                                                    callback(code.UserDungeon.User_Stage_Not_Found,null);
                                                                                }
                                                                                else
                                                                                {
                                                                                    var userDungeonStage = result[0];
                                                                                    console.log("userDungeonStage");
                                                                                    console.log(userDungeonStage);
                                                                                    (userDungeonStage.Clear_Star < userFightModel.Clear_Star)?userDungeonStage.Clear_Star = userFightModel.Clear_Star:null;
                                                                                    userDungeonStage.Clear_Date = new Date();
                                                                                    userFightModel.Stage_Type = userDungeonStage.PVE_Type;
                                                                                    console.log("updateUserDungeon");
                                                                                    userDungeonProviter.updateUserDungeon(userDungeonStage,function(error,result){
                                                                                        if(error!=null){
                                                                                            console.log(error);
                                                                                            callback(code.UserDungeon.User_Stage_Update_Error,null);
                                                                                        }
                                                                                        else
                                                                                        {
                                                                                            if(goNextDungeon==1 && resultStage[0].Stage_Type<=2 ){
                                                                                                console.log("go into task");
                                                                                                var  actionInfo  =
                                                                                                {
                                                                                                    stageId:userFightModel.Stage_Id,
                                                                                                    playTimes:1
                                                                                                }
                                                                                                userTaskDomain.checkTask(userFightModel.User_Id,gameEnum.Action_Type.OverStage,actionInfo,function(error,results){
                                                                                                    if(error!=null){
                                                                                                        console.log(error);
                                                                                                        callback(error,null)
                                                                                                    }
                                                                                                    else
                                                                                                    {
                                                                                                        console.log("getNextDungeon");
                                                                                                        userDungeonProviter.getNextDungeon(userFightModel.User_Id,userFightModel.Stage_Id,
                                                                                                            userFightModel.Dungeon_Id,userFightModel.Stage_Type,function(error,result){
                                                                                                                if(error!=null){
                                                                                                                    console.log(error);
                                                                                                                    callback(error,null);

                                                                                                                }
                                                                                                                else
                                                                                                                {
                                                                                                                    callback(null,{Loot_List:userFightModel.Loot_List});
                                                                                                                }
                                                                                                            })
                                                                                                    }

                                                                                                })
                                                                                            }
                                                                                            else if(resultStage[0].Stage_Type >= gameEnum.StageType.Coin || resultStage[0].Stage_Type <= gameEnum.StageType.PhysicalEquipment){
                                                                                                console.log("go into task Equipment");
                                                                                                var  actionInfo  =
                                                                                                {
                                                                                                    stageId:userFightModel.Stage_Id,
                                                                                                    //stageType:gameEnum.Stage_Type.Normal
                                                                                                    playTimes:1
                                                                                                }
                                                                                                userTaskDomain.checkTask(userFightModel.User_Id,gameEnum.Action_Type.OverTimeCage,actionInfo,function(error,results){
                                                                                                    if(error!=null){
                                                                                                        console.log(error);
                                                                                                        callback(error,null)
                                                                                                    }
                                                                                                    else
                                                                                                    {
                                                                                                        console.log('checkTaskresults',results);
                                                                                                        callback(null,{Loot_List:userFightModel.Loot_List});
                                                                                                    }

                                                                                                })
                                                                                            }
                                                                                            else
                                                                                            {
                                                                                                callback(null, {Loot_List:userFightModel.Loot_List});
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
                                                    });}
                                                else
                                                {
                                                    callback(null, {Loot_List:[]});
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

};

userFight.PVERaid = function(user_Id,stage_Id,raid_Times,raid_Type,callback){
        userVIPDomain.checkVIP(user_Id,gameEnum.VIP_Authority.TenRaid,function(error,resultCheckVIP){
            if(error!=null){
                console.log(error);
                callback(error,null);
            }
            else
            {
                if(raid_Times == 1 || (resultCheckVIP && raid_Times >=2)){
                    userDungeonProviter.getUserDungeonByUserIdStageId(user_Id,stage_Id,function(error,resultUserDungeon){
                        if(error!=null){
                            console.log(error);
                            callback(error,null);
                        }
                        else
                        {
                            if(resultUserDungeon[0].Clear_Star != 3 ){
                                callback(code.UserDungeon.User_Stage_Can_Not_Raid,null);
                            }
                            else
                            {
                                userDungeonProviter.getTodayUserFightByStageId(user_Id,stage_Id,function(error,resultTodayStage){
                                    if(error!=null){
                                        console.log(error);
                                        callback(error,null);
                                    }
                                    else
                                    {
                                        if(typeof resultTodayStage != "undefined"){
                                            resultTodayStage = [];
                                        }
                                        if(resultUserDungeon[0].Attack_Times_Limit - resultTodayStage.length >= raid_Times){
                                            editDungeonProviter.getStage(stage_Id,function(error,resultEditStage){
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
                                                            var RaidCoin = null;
                                                            if(raid_Type ==  gameEnum.Raid_Type.RaidCoin){
                                                                RaidCoin = resultGlobal.RaidCoin;
                                                            }
                                                            else
                                                            {
                                                                RaidCoin = resultGlobal.Diamond;
                                                            }
                                                            console.log("RaidCoin:",RaidCoin);
                                                            userBagDomain.useItemById(user_Id,RaidCoin,raid_Times,0,function(error,resultUseItem){
                                                                var StageExp = resultEditStage[0].Heros_Experience * raid_Times;
                                                                console.log('resultEditStage:',resultEditStage);
                                                                console.log(raid_Times);

                                                                editDungeonProviter.getStage(stage_Id,function(error,resultEditStage){
                                                                    if(error!=null){
                                                                        console.log(error);
                                                                        callback(error,null);
                                                                    }
                                                                    else
                                                                    {
                                                                        var Stamina_Expend = resultEditStage[0].Stamina_Expend * raid_Times;
                                                                        console.log('Stamina_Expend:',Stamina_Expend)
                                                                        gameUserDomain.addTroopExperience(user_Id,Stamina_Expend,function(error,resultAddTroopExp){
                                                                            if(error!=null){
                                                                                console.log(error);
                                                                                callback(error,null);
                                                                            }
                                                                            else
                                                                            {
                                                                                gameUserDomain.addTroopStamina(user_Id,0-Stamina_Expend,function(error,resultAddTroopSta){
                                                                                    if(error!=null){
                                                                                        console.log(error);
                                                                                        callback(error,null);
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        editItemProviter.getItemEffectByType(gameEnum.Item_Effect_Type.HeroExperience,function(error,resultHeroExpItems){
                                                                                            if(error!=null){
                                                                                                console.log(error);
                                                                                                callback(error,null);
                                                                                            }
                                                                                            else
                                                                                            {
                                                                                                var Item_List = [];
                                                                                                var Item_One = {
                                                                                                    Item_Id:resultHeroExpItems[0].Item_Id,
                                                                                                    Item_Amount:0,
                                                                                                    User_Id:user_Id
                                                                                                };
                                                                                                //console.log("resultHeroExpItems:")
                                                                                                //console.log(resultHeroExpItems);
                                                                                                //console.log(StageExp);
                                                                                                //console.log(resultHeroExpItems[0].Effect_Value);
                                                                                                //console.log(StageExp/resultHeroExpItems[1].Effect_Value);
                                                                                                //console.log(parseInt(StageExp/resultHeroExpItems[1].Effect_Value));
                                                                                                resultHeroExpItems.forEach(function(HeroExpItem){
                                                                                                    console.log("======================");
                                                                                                    if(StageExp >= HeroExpItem.Effect_Value){
                                                                                                        var ExpRemain = parseInt(StageExp/HeroExpItem.Effect_Value);
                                                                                                        console.log(ExpRemain);
                                                                                                        StageExp = StageExp - ExpRemain*HeroExpItem.Effect_Value;
                                                                                                        Item_List.push({
                                                                                                            Item_Id:HeroExpItem.Item_Id,
                                                                                                            Item_Amount:ExpRemain,
                                                                                                            User_Id:user_Id
                                                                                                        });
                                                                                                    }
                                                                                                    Item_One.Item_Id = HeroExpItem.Item_Id;
                                                                                                });
                                                                                                if(StageExp > 0 ){
                                                                                                    Item_One.Item_Amount = 1;
                                                                                                    Item_List.push(Item_One);
                                                                                                }
                                                                                                userBagDomain.addItemsToBag(user_Id,Item_List,function(error,resultAddItems){
                                                                                                    if(error!=null){
                                                                                                        console.log(error)
                                                                                                        callback(error,null);
                                                                                                    }
                                                                                                    else
                                                                                                    {
                                                                                                        var fightFun = [];
                                                                                                        //var fightResults = [];
                                                                                                        for(var i = 0; i < raid_Times; i++){
                                                                                                            fightFun.push(function(callbackFight){
                                                                                                                var userFight = createUserDungeonModel(resultUserDungeon[0]);
                                                                                                                userFight.Create_Date =  new Date();
                                                                                                                userFight.Loot_List = '[]';
                                                                                                                userFight.Fight_Status = gameEnum.FightStatus.PVERaid;
                                                                                                                userFight.Hero_List = '';
                                                                                                                console.log("userFight1:")
                                                                                                                console.log(userFight);
                                                                                                                itemLoot(userFight,function(error,result){
                                                                                                                    if(error!=null){
                                                                                                                        console.log(error);
                                                                                                                        callbackFight(error,null);
                                                                                                                    }
                                                                                                                    else
                                                                                                                    {
                                                                                                                        userFight.Loot_List = JSON.stringify(result);
                                                                                                                        console.log('LootResult:',result);
                                                                                                                        if(userFight.PVE_Type == gameEnum.StageType.Experience)
                                                                                                                        {
                                                                                                                            var Item_List = [];
                                                                                                                            var Item_One = {
                                                                                                                                Item_Id:resultHeroExpItems[0].Item_Id,
                                                                                                                                Item_Amount:0,
                                                                                                                                User_Id:user_Id
                                                                                                                            };
                                                                                                                            StageExp = result[0].Item_Amount;
                                                                                                                            //console.log("resultHeroExpItems1:")
                                                                                                                            //console.log(resultHeroExpItems);
                                                                                                                            //console.log(StageExp);
                                                                                                                            //console.log(resultHeroExpItems[0].Effect_Value);
                                                                                                                            //console.log(StageExp/resultHeroExpItems[1].Effect_Value);
                                                                                                                            //console.log(parseInt(StageExp/resultHeroExpItems[1].Effect_Value));
                                                                                                                            resultHeroExpItems.forEach(function(HeroExpItem){
                                                                                                                                console.log("======================");
                                                                                                                                if(StageExp >= HeroExpItem.Effect_Value){
                                                                                                                                    var ExpRemain = parseInt(StageExp/HeroExpItem.Effect_Value);
                                                                                                                                    console.log(ExpRemain);
                                                                                                                                    StageExp = StageExp - ExpRemain*HeroExpItem.Effect_Value;
                                                                                                                                    Item_List.push({
                                                                                                                                        Item_Id:HeroExpItem.Item_Id,
                                                                                                                                        Item_Amount:ExpRemain,
                                                                                                                                        User_Id:user_Id
                                                                                                                                    });
                                                                                                                                }
                                                                                                                                Item_One.Item_Id = HeroExpItem.Item_Id;
                                                                                                                            });
                                                                                                                            if(StageExp > 0 ){
                                                                                                                                Item_One.Item_Amount = 1;
                                                                                                                                Item_List.push(Item_One);
                                                                                                                            }
                                                                                                                            result = Item_List;
                                                                                                                        }
                                                                                                                        var resultFight = {
                                                                                                                            Loot_List:result
                                                                                                                        };
                                                                                                                        userDungeonProviter.addUserFight(userFight,function(error,results){
                                                                                                                            if(error!=null){
                                                                                                                                console.log(error);
                                                                                                                                callbackFight(error,null);
                                                                                                                            }
                                                                                                                            else
                                                                                                                            {
                                                                                                                                userBagDomain.addItemsToBag(user_Id,resultFight.Loot_List,function(error,resultAddItem){
                                                                                                                                    if(error!=null){
                                                                                                                                        console.log(error);
                                                                                                                                        callbackFight(error,null);
                                                                                                                                    }
                                                                                                                                    else
                                                                                                                                    {
                                                                                                                                        var  actionInfo  =
                                                                                                                                        {
                                                                                                                                            stageId:userFight.Stage_Id,
                                                                                                                                            //stageType:gameEnum.Stage_Type.Normal
                                                                                                                                            playTimes:1
                                                                                                                                        }
                                                                                                                                        var Task_Action_Type;
                                                                                                                                        if(userFight.PVE_Type <= 2){
                                                                                                                                            Task_Action_Type = gameEnum.Action_Type.OverStage;
                                                                                                                                        }
                                                                                                                                        else if(userFight.PVE_Type >= gameEnum.StageType.Coin && userFight.PVE_Type <= gameEnum.StageType.PhysicalEquipment)
                                                                                                                                        {
                                                                                                                                            Task_Action_Type = gameEnum.Action_Type.OverTimeCage;
                                                                                                                                        }
                                                                                                                                        console.log('Task_Action_Type',Task_Action_Type,'   PVE_Type:',userFight.PVE_Type);
                                                                                                                                        userTaskDomain.checkTask(userFight.User_Id,Task_Action_Type,actionInfo,function(error,results) {
                                                                                                                                            if (error != null) {
                                                                                                                                                console.log(error);
                                                                                                                                                callbackFight(error, null)
                                                                                                                                            }
                                                                                                                                            else {
                                                                                                                                                callbackFight(null,{
                                                                                                                                                    Loot_List:resultFight.Loot_List
                                                                                                                                                });
                                                                                                                                            }
                                                                                                                                        });

                                                                                                                                    }
                                                                                                                                })
                                                                                                                            }
                                                                                                                        });
                                                                                                                    }
                                                                                                                });

                                                                                                            })
                                                                                                        }
                                                                                                        gameStoreDomain.getGoblinStore(user_Id,raid_Times,function(error,resultUserStore){
                                                                                                            if(error!=null){
                                                                                                                console.log(error);
                                                                                                                callback(error,null);
                                                                                                            }
                                                                                                            else
                                                                                                            {
                                                                                                                async.series(fightFun,function(error,resultRaidFight){
                                                                                                                    if(error!=null){
                                                                                                                        console.log(error);
                                                                                                                        callback(error,null);
                                                                                                                    }
                                                                                                                    else
                                                                                                                    {
                                                                                                                        console.log(resultRaidFight);
                                                                                                                        callback(null,{raidResult:resultRaidFight,
                                                                                                                            Hero_Exp_Item:Item_List,
                                                                                                                        User_Store:resultUserStore});
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
                                                            })

                                                        }
                                                    })
                                                }
                                            })
                                        }
                                        else
                                        {
                                            callback(code.UserDungeon.User_Stage_Times_Limit,null);
                                        }
                                    }
                                })
                            }
                        }
                    });
                }
                else
                {
                    callback(code.UserVIP.VIP_Lvl_Error,null);
                }
            }
        })
};

var itemLoot =  function(userFight,callback){
    console.log(userFight);
    console.log("---------------");
    lotteryProviter.lootItem(userFight,function(error,result){
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

var checkUserStage = function(userId,stageId,callback){
    userDungeonProviter.getTodayUserFightByStageId(userId,stageId,function(error,resultsUserDungeon){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            console.log("getUserDungeonByUserIdStageId2")
            userDungeonProviter.getUserDungeonByUserIdStageId(userId,stageId,function(error,resultsUserStage){
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    if(resultsUserStage.length==0){
                        callback(code.UserDungeon.User_Stage_Not_Found,null);
                    }
                    else if(resultsUserStage.length>1){
                        callback(code.UserDungeon.User_Stage_Data_Fail,null);
                    }
                    else
                    {
                        editDungeonProviter.getStage(stageId,function(error,result){
                            if(error!=null){
                                console.log(error);
                                callback(error,null);
                            }
                            else
                            {
                                if(typeof resultsUserDungeon == "undefined"){
                                    resultsUserDungeon = [];
                                }
                                if(resultsUserDungeon.length>=result[0].Attack_Times_Limit){
                                    callback(null,{checked:false});
                                }
                                else
                                {
                                    editDungeonProviter.getDungeon(result[0].Dungeon_Id,function(error,resultEditDungeon){
                                        if(error!=null){
                                            console.log(error);
                                            callback(error,null);
                                        }
                                        else {
                                            gameUserProviter.getTroopByUserId(userId, function (error, resultUserTroop) {
                                                if (error != null) {
                                                    console.log(error);
                                                    callback(error, null);
                                                }
                                                else {
                                                    if(resultEditDungeon[0][0].Dungeon_Type == gameEnum.FightType.PVE){
                                                        //PVE关卡判定
                                                        if (resultEditDungeon[0][0].Dungeon_Lvl_Limit > resultUserTroop[0].Troop_Lvl){
                                                            callback(code.UserDungeon.User_Level_Not_Match,null);
                                                        }
                                                        else
                                                        {
                                                            var results = {checked:true,
                                                                remainderOfTimes:result[0].Attack_Times_Limit-resultsUserDungeon.length,
                                                                refresh:false,
                                                                Dungeon_Type:resultEditDungeon[0][0].Dungeon_Type,
                                                                resultsUserDungeon:resultsUserStage};
                                                            if(result[0].Stage_Type == gameEnum.Stage_Type.Special){
                                                                gameUserDomain.checkGameFunction(userId,gameEnum.GameFunction.Elite_Stage,function(error,resultCheckResult){
                                                                    if(error!=null)
                                                                    {
                                                                        console.log(error);
                                                                        callback(error,null);
                                                                    }
                                                                    else
                                                                    {
                                                                        if(resultCheckResult.checkStatus){
                                                                            if(resultsUserDungeon.length==0){
                                                                                userDungeonProviter.getTodayUserFight(userId,function(error,results){
                                                                                    if(results.length==0){
                                                                                        results.refresh =  true;
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        results.refresh = false;
                                                                                    }
                                                                                });
                                                                            }
                                                                            callback(null,results);
                                                                        }
                                                                        else
                                                                        {
                                                                            callback(code.UserGameFunction.Elite_Stage_Not_Open,null);
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                            else
                                                            {
                                                                if(resultsUserDungeon.length==0){
                                                                    userDungeonProviter.getTodayUserFight(userId,function(error,results){
                                                                        if(results.length==0){
                                                                            results.refresh =  true;
                                                                        }
                                                                        else
                                                                        {
                                                                            results.refresh = false;
                                                                        }
                                                                    });
                                                                }
                                                                callback(null,results);
                                                            }

                                                        }
                                                    }
                                                    else if(resultEditDungeon[0][0].Dungeon_Type == gameEnum.FightType.TreasureHouse)
                                                    {
                                                    //地精宝库关卡判定
                                                        gameUserDomain.checkGameFunction(userId,gameEnum.GameFunction.Caverns_Of_Time,function(error,resultCheckResult){
                                                            if(error!=null)
                                                            {
                                                                console.log(error);
                                                                callback(error,null);
                                                            }
                                                            else
                                                            {
                                                                if(resultCheckResult.checkStatus){
                                                                    if(resultsUserDungeon.length==0){
                                                                        userDungeonProviter.getTodayUserFight(userId,function(error,results){
                                                                            if(results.length==0){
                                                                                results.refresh =  true;
                                                                            }
                                                                            else
                                                                            {
                                                                                results.refresh = false;
                                                                            }
                                                                        });
                                                                    }

                                                                    if (result[0].Stage_Lvl_Limit > resultUserTroop[0].Troop_Lvl){
                                                                        callback(code.UserDungeon.User_Level_Not_Match,null);
                                                                    }
                                                                    else
                                                                    {
                                                                        var nowDay = new Date();
                                                                        console.log('resultEditDungeon:',resultEditDungeon);
                                                                        var openDay = resultEditDungeon[0][0].Open_Day.split(',');
                                                                        var IsOpen = false;
                                                                        openDay.forEach(function(d){
                                                                            if(d == nowDay.getDay()){
                                                                                IsOpen = true;
                                                                            }
                                                                        });
                                                                        if(!IsOpen){
                                                                            console.log("IsOpen:",IsOpen);
                                                                            callback(code.UserDungeon.Stage_Not_Open,null);
                                                                        }
                                                                        var results = {checked:true,
                                                                            remainderOfTimes:result[0].Attack_Times_Limit-resultsUserDungeon.length,
                                                                            refresh:false,
                                                                            Dungeon_Type:resultEditDungeon[0][0].Dungeon_Type,
                                                                            resultsUserDungeon:resultsUserStage};
                                                                        userDungeonProviter.getTodayUserFight(userId,function(error,resultsFight){
                                                                            if(resultsFight.length==0){
                                                                                results.refresh =  true;
                                                                            }
                                                                            else
                                                                            {
                                                                                results.refresh = false;
                                                                            }
                                                                            callback(null,results);
                                                                        });
                                                                    }
                                                                }
                                                                else
                                                                {
                                                                    callback(code.UserGameFunction.Caverns_Of_Time_Not_Open,null);
                                                                }
                                                            }
                                                        })

                                                    }


                                                }
                                            })
                                        }
                                    })

                                }
                            }
                        });
                    }
                }
            });


        }
    })
}

userFight.StartPVPFight = function(user_Id,competitor_Id,competitor_Rank,hero_List,callback){
    userRankProviter.finishAllTimeOutPVP(function(error,resultFinishAll){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            var actionInfo  =
            {
                PvpResult: gameEnum.FightResult.UnKnown,
                playTimes:1
            };
            userTaskDomain.checkTask(user_Id,gameEnum.Action_Type.PlayPvp,actionInfo,function(error,resultTask) {
                if(error!=null){
                    console.log(error);
                    callback(error,null)
                }
                else
                {
                    userRankProviter.getUserPVPTimes(user_Id,function(error,resultsPVPTimes){
                        if(error!=null){
                            console.log(error);
                            callback(error,null);
                        }
                        else
                        {
                            if(resultsPVPTimes.PVPTimes >= 5){
                                callback(code.UserRank.User_Has_No_PVPTimes,null);
                            }
                            else
                            {
                                userRankDomain.getUserRank(competitor_Id,function(error,resultsCompetitorRank){
                                    if(resultsCompetitorRank.Rank_Num == competitor_Rank){
                                        userRankProviter.getUserUnfinishDefendPVP(competitor_Id,function(error,resultUnfinishPVP){
                                            if(error!=null){
                                                console.log(error);
                                                callback(error,null);
                                            }
                                            else
                                            {
                                                if(resultUnfinishPVP.length == 0){
                                                    userRankDomain.getUserRank(user_Id,function(error,resultUserRank){
                                                        if(error!=null){
                                                            console.log(error);
                                                            callback(error,null)
                                                        }
                                                        else
                                                        {
                                                            if(resultUserRank.Rank_Num > resultsCompetitorRank.Rank_Num){
                                                                userDungeonProviter.updateUserTroopRecord(user_Id,gameEnum.FightType.PVP,hero_List,0,function(error,results){
                                                                    if(error!=null){
                                                                        console.log(error);
                                                                        callback(error,null);
                                                                    }
                                                                    else
                                                                    {
                                                                        var PVPFightModel = createUserPVPFightModel();
                                                                        PVPFightModel.User_Id = user_Id;
                                                                        PVPFightModel.Competitor_Id = competitor_Id;
                                                                        PVPFightModel.Hero_List = hero_List;
                                                                        PVPFightModel.Fight_Status = gameEnum.FightStatus.Start;
                                                                        var now = new Date();
                                                                        PVPFightModel.Last_Update_Date = now;
                                                                        PVPFightModel.Create_Date = now;
                                                                        console.log("AddPVPFight");

                                                                        userRankProviter.getUserUnfinishPVP(user_Id,function(error,resultsUnfinishPVP){
                                                                            if(resultsUnfinishPVP.length == 0){
                                                                                userRankProviter.AddPVPFight(PVPFightModel,function(error,result){
                                                                                    if(error!=null){
                                                                                        console.log(error);
                                                                                        callback(error,null);
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        PVPFightModel.PVP_Fighting_Id =  result.PVP_Fighting_Id;
                                                                                        console.log("checkUserExist");
                                                                                        gameUserDomain.checkUserExist(competitor_Id,function(error,resultCheckUser){
                                                                                            if(error!=null){
                                                                                                console.log(error);
                                                                                                callback(error,null);
                                                                                            }
                                                                                            else
                                                                                            {
                                                                                                console.log("getUserOneTroopRecord");
                                                                                                var Is_Defend = 1;
                                                                                                userDungeonProviter.getUserOneTroopRecord(competitor_Id, gameEnum.FightType.PVP,Is_Defend, function (error1, resultsUserTroopRecord) {
                                                                                                    if (error1 != null) {
                                                                                                        console.log(error1);
                                                                                                        callback(error1, null);
                                                                                                    }
                                                                                                    else {
                                                                                                        gameUserProviter.getTroopByUserId(competitor_Id,function(error,resultCompetitor){
                                                                                                            if(error!=null){
                                                                                                                console.log(error);
                                                                                                                callback(error,null);
                                                                                                            }
                                                                                                            else
                                                                                                            {
                                                                                                                console.log("3===============");
                                                                                                                PVPFightModel.Competitor_Lvl = resultCompetitor[0].Troop_Lvl;
                                                                                                                resultCheckUser.userTroopList = resultsUserTroopRecord;
                                                                                                                resultCheckUser.PVPFight = PVPFightModel;
                                                                                                                callback(null, resultCheckUser);
                                                                                                            }
                                                                                                        })

                                                                                                    }
                                                                                                });
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                });
                                                                            }
                                                                            else
                                                                            {
                                                                                if(resultsUnfinishPVP[0].Fight_Status == 1) {
                                                                                    resultsUnfinishPVP[0].Fight_Status = 5;
                                                                                }
                                                                                userRankProviter.updateUserPVPStatus(user_Id,resultsUnfinishPVP[0].Fight_Status,function(error,resultUpdatePVP){
                                                                                    if(error!=null){
                                                                                        console.log(error);
                                                                                        callback(error,null);
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        userRankProviter.AddPVPFight(PVPFightModel,function(error,result){
                                                                                            if(error!=null){
                                                                                                console.log(error);
                                                                                                callback(error,null);
                                                                                            }
                                                                                            else
                                                                                            {
                                                                                                PVPFightModel.PVP_Fighting_Id =  result.PVP_Fighting_Id;
                                                                                                console.log("checkUserExist");
                                                                                                gameUserDomain.checkUserExist(competitor_Id,function(error,resultCheckUser){
                                                                                                    if(error!=null){
                                                                                                        console.log(error);
                                                                                                        callback(error,null);
                                                                                                    }
                                                                                                    else
                                                                                                    {
                                                                                                        console.log("getUserOneTroopRecord");
                                                                                                        var Is_Defend = 1;
                                                                                                        userDungeonProviter.getUserOneTroopRecord(competitor_Id, gameEnum.FightType.PVP,Is_Defend, function (error1, resultsUserTroopRecord) {
                                                                                                            if (error1 != null) {
                                                                                                                console.log(error1);
                                                                                                                callback(error1, null);
                                                                                                            }
                                                                                                            else {
                                                                                                                gameUserProviter.getTroopByUserId(competitor_Id,function(error,resultCompetitor){
                                                                                                                    if(error!=null){
                                                                                                                        console.log(error);
                                                                                                                        callback(error,null);
                                                                                                                    }
                                                                                                                    else
                                                                                                                    {
                                                                                                                        console.log("3===============");
                                                                                                                        PVPFightModel.Competitor_Lvl = resultCompetitor[0].Troop_Lvl;
                                                                                                                        resultCheckUser.userTroopList = resultsUserTroopRecord;
                                                                                                                        resultCheckUser.PVPFight = PVPFightModel;
                                                                                                                        callback(null, resultCheckUser);
                                                                                                                    }
                                                                                                                })

                                                                                                            }
                                                                                                        });
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
                                                            else
                                                            {
                                                                callback(code.UserRank.PVP_Not_Matched,null);
                                                            }
                                                        }
                                                    });
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
                                })

                            }

                        }
                    })

                }
            })
        }
    })
}

userFight.FinishPVPFight =  function(PVP_Fighting_Id,Finsih_Type,callback){
    console.log("getPVPFightingById");
    userRankProviter.getPVPFightingById(PVP_Fighting_Id,function(error,resultPVPFighting){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            resultPVPFighting.Replay_Url = '/fightData/'+PVP_Fighting_Id+'.rec';
            var now = new Date();
            var Is_Time_Out = 0;
            if(resultPVPFighting.Fight_Status == 1 && (now.getTime()-resultPVPFighting.Create_Date.getTime()> 20*60*1000)){
                Is_Time_Out = 1;
                resultPVPFighting.Fight_Status =  5;
            }else
            {
                resultPVPFighting.Fight_Status =  Finsih_Type;
            }
            console.log("updatePVPFight");
            if(resultPVPFighting.Fight_Status == 2){
                console.log("getUserRank");
                userRankDomain.getUserRank(resultPVPFighting.User_Id,function(errorAttack,resultUserAttack){
                    userRankDomain.getUserRank(resultPVPFighting.Competitor_Id,function(errorDefend,resultDefend){
                        if(errorAttack!=null || errorDefend !=null){
                            console.log(errorDefend + errorAttack);
                            callback(code.UserRank.Get_User_Rank_Error,null);
                        }
                        else
                        {
                            if(resultUserAttack == null || resultDefend == null){
                                console.log("fightuser is null");
                                callback(code.UserRank.PVP_User_Error,null);
                            }
                            else
                            {
                                console.log("PVP_Fighting");
                                resultPVPFighting.Rank_Change = resultUserAttack.Rank_Num - resultDefend.Rank_Num;
                                var temp = resultDefend.Rank_Num;
                                resultDefend.Rank_Num = resultUserAttack.Rank_Num;
                                resultUserAttack.Rank_Num =  temp;
                                console.log("updatePVPFight");
                                console.log(resultPVPFighting);
                                userRankProviter.updatePVPFight(resultPVPFighting,function(error,resultsUpdateRank){
                                    if(error!=null){
                                        console.log(error);
                                        callback(error,null);
                                    }
                                    else
                                    {
                                        console.log("updateUserRank");
                                        userRankProviter.updateUserRank(resultDefend,function(error,resultUpdateDefend){
                                            if(error!=null){
                                                console.log(error);
                                                callback(error,null);
                                            }
                                            else
                                            {
                                                userRankProviter.updateUserRank(resultUserAttack,function(error,resultUpdateAttack){
                                                    if(error!=null){
                                                        console.log(error);
                                                        callback(error,null);
                                                    }
                                                    else
                                                    {
                                                        console.log("updateUserTopRank");
                                                        userRankDomain.updateUserTopRank(resultUserAttack.User_Id,
                                                            resultUserAttack.Rank_Num,function(error,resultUserTop_Rank){
                                                                if(error!=null){
                                                                    console.log(error);
                                                                    callback(error,null);
                                                                }
                                                                else
                                                                {
                                                                    var actionInfo  =
                                                                    {
                                                                        PvpResult: gameEnum.FightResult.Win,
                                                                        playTimes:1
                                                                    }
                                                                    console.log("userTaskDomain.checkTask win");
                                                                    userTaskDomain.checkTask(resultPVPFighting.User_Id,gameEnum.Action_Type.PlayPvp,actionInfo,function(error,resultTask){
                                                                        if(error!=null){
                                                                            console.log(error);
                                                                            callback(error,null);
                                                                        }
                                                                        else
                                                                        {
                                                                            console.log("check callback");
                                                                            callback(null,resultUserTop_Rank);
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
                    });
                });
            }
            else
            {
                userRankProviter.updatePVPFight(resultPVPFighting,function(error,resultsUpdateRank){
                    if(error!=null){
                        console.log(error);
                        callback(error,null);
                    }
                    else
                    {
                        var actionInfo  =
                        {
                            PvpResult: gameEnum.FightResult.Lose,
                            playTimes:1
                        }
                        console.log("userTaskDomain.checkTask");
                        userTaskDomain.checkTask(resultPVPFighting.User_Id,gameEnum.Action_Type.PlayPvp,actionInfo,function(error,resultTask){
                            if(error!=null){
                                console.log(error);
                                callback(error,null);
                            }
                            else
                            {
                                console.log("Is_Time_Out");
                                if(Is_Time_Out){
                                    callback(code.UserRank.PVP_Time_Out,null);
                                }
                                else
                                {
                                    callback(null,{});
                                }
                            }
                        })
                    }
                })

            }
        }
    });
}


userFight.SavePVPDefendTroop =  function(user_Id,Hero_List,callback){
    var Is_Defend = 1;
    userDungeonProviter.updateUserTroopRecord(user_Id,gameEnum.FightType.PVP,Hero_List,Is_Defend,function(error,result){
        if(error!=null){
            console.log(error);
            callback(code.UserDungeon.Update_User_Troop_Record_Error,null);
        }
        else
        {
            callback(null,result);
        }
    })
}

userFight.GetUserPVP = function(user_Id,callback){
    userRankProviter.getUserPVPTimes(user_Id,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.UserRank.Get_User_PVP_Times_Error,null);
        }
        else
        {
            var resultsPVP = {
                PVPTimes:results.PVPTimes,
                LastPVPDate:results.LastPVPDate
            }
            callback(null,resultsPVP);
        }
    })
}
var createUserPVPFightModel =  function(){
    //console.log(result);
    var userPVPFightModel = {
        PVP_Fighting_Id : 0,
        User_Id:0,
        Competitor_Id : 0,
        Hero_List:'',
        Fight_Status:0,
        Last_Update_Date:'',
        Create_Date:''
    };
    return userPVPFightModel;
}

var createUserFightModel =  function(result){
    console.log(result);
    var userFightModel = {
        Fight_Id:0,
        User_Id:0,
        Start_Date:'',
        Loot_List:[],
        Dungeon_Id:0,
        Fight_Status:gameEnum.FightStatus.None,
        Last_Update_Date:'',
        Stage_Id:0,
        Hero_List:[]

    }
    userFightModel.User_Id = result.User_Id;
    userFightModel.Start_Date =  result.Start_Date;
    userFightModel.Loot_List =  result.Loot_List;
    userFightModel.Dungeon_Id =  result.Dungeon_Id;
    userFightModel.Fight_Status =  result.Fight_Status;
    userFightModel.Last_Update_Date =  result.Last_Update_Date;
    userFightModel.Stage_Id =  result.Stage_Id;
    userFightModel.Hero_List = result.Hero_List;
    return userFightModel;
}

var createUserDungeonModel = function(result){
    var userDungeonModel = {
        User_dungeon_Id:0,
        User_Id:0,
        Dungeon_Id:0,
        Stage_Id:0,
        Clear_Star:0,
        Clear_Date:'',
        Create_Date:'',
        Dungeon_Order:0,
        Stage_Order:0,
        PVE_Type:0,
        Lottery_Method_Id:""
    }
    userDungeonModel.User_Id =  result.User_Id;
    userDungeonModel.Dungeon_Id = result.Dungeon_Id;
    userDungeonModel.Stage_Id =  result.Stage_Id;
    userDungeonModel.Clear_Star = result.Clear_Star;
    userDungeonModel.Clear_Date = result.Clear_Date;
    userDungeonModel.Dungeon_Order = result.Dungeon_Order;
    userDungeonModel.Stage_Order = result.Stage_Order;
    userDungeonModel.PVE_Type = result.PVE_Type;
    userDungeonModel.Lottery_Method_Id = result.Lottery_Method_Id;
    return userDungeonModel;
}