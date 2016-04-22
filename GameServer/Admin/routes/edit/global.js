/**
 * Created by David_shen on 10/14/14.
 */

var date = require('../../util/date');
var gameEnum = require('../enum');
var dataProvider = require('../../data_provider/dao_provider/system/config');
var editHeroProvider = require('../../data_provider/dao_provider/edit/hero');
var editItemProvider = require('../../data_provider/dao_provider/edit/item');
var editStoreProvider = require('../../data_provider/dao_provider/edit/store');
var editLotteryProvider = require('../../data_provider/dao_provider/edit/lottery');
var body = {
    title : '全局配置',
    message : null
};
var key = 'global';
var herolvllenght = "0";
var soulStonelenght = "0";
var trooplvllenght = "0";
var globalModel = {
    attack_crit_lvl_adjust_coe:"0",
    attack_crit_lvl_coe:"0",
    attack_crit_damage_addition_lvl_adjust_coe:"0",
    attack_crit_damage_addition_lvl_coe:"0",
    avoid_lvl_adjust_coe:"0",
    avoid_lvl_coe:"0",
    hit_lvl_adjust_coe:"0",
    hit_lvl_coe:"0",
    suck_blood_lvl_adjust_coe:"0",
    suck_blood_lvl_coe:"0",
    skill_cure_lvl_adjust_coe:"0",
    skill_cure_lvl_coe:"0",
    pre_step_energy_restore:"0",
    initiative_skill_energy_less_lvl_coe:"0",
    passive_skill_energy_less_lvl_adjust_coe:"0",
    passive_skill_energy_less_lvl_coe:"0",
    Elite_Dungeon_Reset_Cycle:"0",
    Elite_Dungeon_Lvl_Limit:"0",
    troop_max_stamina:"0",
    stamina_recover_interval:"0",
    initiative_skill_enable:"0",
    passive_skill_enable:"0",
    characteristic_skill_enable:"0",
    skill_point_recovery_interval:"0",
    skill_point_limit:"0",
    vip_skill_point_limit:"0",
    troop_Lvl_Limit:"0",
    server_reset_time:"0",
    life_enhance:"0",
    attack_enhance:"0",
    spell_enhance:"0",
    round_limit:"0",
    deduction:"0",
    herolvl:null,
    skilllvl:null,
    trooplvl:null,
    soulStone:null,
    Gold:"0",
    Diamond:"0",
    Purchased_Diamond:'0',
    PVPCoin:"0",
    FarFightCoin:"0",
    FourLeaf:"0",
    ArenaStore:"0",
    DiamondStore:"0",
    StaminaStore:"0",
    SkillPointStore:"0",
    PVETimesStore:"0",
    CoinStore:"0",
    FarFightStore:"0",
    NormalDiamondStore:"0",
    NormalCoinStore:"0",
    GoblinStore:"0",
    hero_lvl_fighting_force:"0",
    hero_skill_fighting_force:"0",
    skill_unlock_fighting_force:"0",
    FarFight_Base_Coin:0,
    FarFight_Lvl_Coe:0,
    FarFight_FightForce_Coe:0,
    FarFight_FightForce_Match_Coe:0,
    DiamondExpend:{
        ChangeNickname:0,
        FourLeafPrice:0
    },
    userInit:{
        Heros:null,
        Items:null
    },
    Game_Function:{
        Arena:null,
        Elite_Stage:null,
        Leaderboard:null,
        Expedition:null,
        Caverns_Of_Time:null,
        Businessman:null,
        Guild:null,
        Hero_Trial:null,
        Enchanting:null,
        Buried_Treasure:null,
        Pool_Of_Prophecy:null
    },
    Notice:{
        Notice_Url:'',
        Is_Popup:0,
        Notice_Version:0
    },
    farfight_life_enhance:"0",
    farfight_attack_enhance:"0",
    farfight_spell_enhance:"0",
    farfight_grid_colour:"0"
};

exports.userInit = function(req,res){
    body.message = null;
    var route = "edit/global/userInit";
    var method = req.method;
    dataProvider.getConfig(key,function(error,data){
        var result = JSON.parse(data.config).data;
        globalModel = result;
        editHeroProvider.getAll(function(error,resultHeros){
            if(error != null){
                console.log(error);
                callback(error,null);
            }
            else
            {
                editItemProvider.getAll(function(error,resultItem){
                    if(error!=null){
                        console.log(error);
                        callback(error,null);
                    }
                    else
                    {
                        if(method === 'POST'){
                            globalModel.userInit = {
                                Heros:req.body.result_UserHero,
                                Items:req.body.result_UserItem
                            };
                            //console.log(req.body.result_UserHero);
                            //console.log(globalModel.userInit.Heros);
                            var configData = {
                                "data" : globalModel
                            };
                            data.config = JSON.stringify(configData);
                            dataProvider.editConfig(data, function(error){
                                if(error)
                                    return render(res, route, '配置文件写入失败.');
                                body.message = '设置成功.';
                                body.result = configData.data;
                                body.result.editHero = resultHeros;
                                body.result.editItem =  resultItem.Item;
                                res.render(route, body);
                            });
                        }
                        else{
                            //console.log(result);
                            body.result = result;
                            body.result.editHero = resultHeros;
                            body.result.editItem =  resultItem.Item;
                            res.render(route, body);
                        }
                    }
                })

            }

        })

    })
}

exports.herolvl = function(req,res){
    body.message = null;
    var route = "edit/global/herolvl";
    var method = req.method;
    //key = "herolvl";
    dataProvider.getConfig(key,function(error,data){
        var result = JSON.parse(data.config).data;
        //console.log(result.data);
        globalModel = result;
        if(!result.herolvl || result.herolvl.length==0){
            result.herolvl = initHerolvl(50);//英雄等级初始化
        }
        herolvllenght = result.herolvl.length;
        if(error){
            return render(res, route, '配置文件读取失败.');
        }
        if(method === 'POST'){
            var herolvl = getHerolvl(req,herolvllenght);
            globalModel.herolvl = herolvl;
            var configData = {
                "data" : globalModel
            };
            data.config = JSON.stringify(configData);
            dataProvider.editConfig(data, function(error){
                if(error)
                    return render(res, route, '配置文件写入失败.');

                body.message = '设置成功.';
                body.result = configData.data;
                res.render(route, body);
            });
        }
        else{
            body.result = result;
            res.render(route, body);
        }
    })
}


exports.skilllvl = function(req,res){
    body.message = null;
    var route = "edit/global/skilllvl";
    var method = req.method;
    //key = "herolvl";
    dataProvider.getConfig(key,function(error,data){
        var result = JSON.parse(data.config).data;

        globalModel = result;
        if(!result.skilllvl || result.skilllvl.length==0){
            result.skilllvl = initHerolvl(50);//英雄等级初始化
        }
        herolvllenght = result.skilllvl.length;
        if(error){
            return render(res, route, '配置文件读取失败.');
        }
        if(method === 'POST'){
            var skilllvl = getHerolvl(req,herolvllenght);
            globalModel.skilllvl = skilllvl;
            var configData = {
                "data" : globalModel
            };
            data.config = JSON.stringify(configData);
            dataProvider.editConfig(data, function(error){
                if(error)
                    return render(res, route, '配置文件写入失败.');

                body.message = '设置成功.';
                body.result = configData.data;
                res.render(route, body);
            });
        }
        else{
            body.result = result;
            res.render(route, body);
        }
    })
}


exports.trooplvl = function(req,res){
    body.message = null;
    var route = "edit/global/trooplvl";
    var method = req.method;
    //key = "herolvl";
    dataProvider.getConfig(key,function(error,data){
        var result = JSON.parse(data.config).data;
        globalModel = result;
        if(!result.trooplvl || result.trooplvl.length==0){
            result.trooplvl = initTrooplvl(50);//英雄等级初始化
        }
        trooplvllenght = result.trooplvl.length;
        if(error){
            return render(res, route, '配置文件读取失败.');
        }
        if(method === 'POST'){
            var trooplvl = getTrooplvl(req,trooplvllenght);
            globalModel.trooplvl = trooplvl;
            var configData = {
                "data" : globalModel
            };
            data.config = JSON.stringify(configData);
            dataProvider.editConfig(data, function(error){
                if(error)
                    return render(res, route, '配置文件写入失败.');

                body.message = '设置成功.';
                body.result = configData.data;
                res.render(route, body);
            });
        }
        else{
            body.result = result;
            res.render(route, body);
        }
    })
}



exports.soulStone = function(req,res){
    body.message = null;
    var route = "edit/global/soulStone";
    var method = req.method;
    //key = "herolvl";

    dataProvider.getConfig(key,function(error,data){
        var result = JSON.parse(data.config).data;
        globalModel = result;
        if(result.soulStone == null || result.soulStone.length==0){
            result.soulStone = initSoulStone(10);//英雄星级初始化
        };
        soulStonelenght = result.soulStone.length;
        if(error){
            return render(res, route, '配置文件读取失败.');
        }
        if(method === 'POST'){
            var soulStone = getSoulStone(req,trooplvllenght);
            globalModel.soulStone = soulStone;
            var configData = {
                "data" : globalModel
            };
            data.config = JSON.stringify(configData);
            dataProvider.editConfig(data, function(error){
                if(error)
                    return render(res, route, '配置文件写入失败.');

                editHeroProvider.updateSoulStone(soulStone,function(error,results){
                    if(error!=null){
                        console.log(error);
                        callback(error,null);
                    }
                    else
                    {
                        body.message = '设置成功.';
                        body.result = configData.data;
                        res.render(route, body);
                    }
                })

            });
        }
        else{
            body.result = result;
            res.render(route, body);
        }
    })
}



exports.index = function(req, res){
    body.message = null;
    var route = 'edit/global/index';
    var method = req.method;
    dataProvider.getConfig(key, function(error, data){
        editStoreProvider.getAllStore(function(error,resultStore){
            if(error!=null){
                console.log(error);
                callback(error,null);
            }
            else
            {

                editItemProvider.getItemByType(gameEnum.Item_Type.Currency,function(error,resultCurrency){
                    editItemProvider.getItemByType(gameEnum.Item_Type.Consumables,function(error,resultConsumables){
                        if(error!=null){
                            console.log(error);
                            callback(error,null);
                        }
                        else
                        {
                            if(error!=null){
                                console.log(error);
                                callback(error,null);
                            }
                            else
                            {
                                var result = JSON.parse(data.config);
                                //console.log("rrr:"+JSON.stringify(result));
                                if(!result)
                                {
                                    result =  globalModel;
                                }
                                if(error)
//            globalModel.attack_crit_damage_addition_lvl_adjust_coe = req.body.attack_crit_damage_addi
                                {
                                    return render(res, route, '配置文件读取失败.');
                                }
                                if(method === 'POST'){
                                    editLotteryProvider.getAll(function(error,resultLotterys){
                                        if(error!=null){
                                            console.log(error);
                                            callback(error,null);
                                        }
                                        else
                                        {
                                            console.log('resultLotterys.Lottery:',resultLotterys.Lottery);
                                            if(resultLotterys.Lottery.length != 0){
                                                globalModel.Lotterys =  resultLotterys.Lottery;
                                            }
                                            else
                                            {
                                                globalModel.Lotterys =  result.data.Lotterys;
                                            }
                                            console.log(globalModel.Lotterys);
                                            globalModel.attack_crit_lvl_adjust_coe = req.body.attack_crit_lvl_adjust_coe;
                                            globalModel.attack_crit_lvl_coe = req.body.attack_crit_lvl_coe;
                                            globalModel.attack_crit_damage_addition_lvl_coe = req.body.attack_crit_damage_addition_lvl_coe;
                                            globalModel.attack_crit_damage_addition_lvl_adjust_coe = req.body.attack_crit_damage_addition_lvl_adjust_coe;
                                            globalModel.avoid_lvl_adjust_coe = req.body.avoid_lvl_adjust_coe;
                                            globalModel.avoid_lvl_coe = req.body.avoid_lvl_coe;
                                            globalModel.hit_lvl_adjust_coe = req.body.hit_lvl_adjust_coe;
                                            globalModel.hit_lvl_coe = req.body.hit_lvl_coe;
                                            globalModel.suck_blood_lvl_adjust_coe = req.body.suck_blood_lvl_adjust_coe;
                                            globalModel.suck_blood_lvl_coe = req.body.suck_blood_lvl_coe;
                                            globalModel.skill_cure_lvl_adjust_coe = req.body.skill_cure_lvl_adjust_coe;
                                            globalModel.skill_cure_lvl_coe = req.body.skill_cure_lvl_coe;
                                            globalModel.initiative_skill_energy_less_lvl_adjust_coe = req.body.initiative_skill_energy_less_lvl_adjust_coe;
                                            globalModel.initiative_skill_energy_less_lvl_coe = req.body.initiative_skill_energy_less_lvl_coe;
                                            globalModel.pre_step_energy_restore = req.body.pre_step_energy_restore;
                                            globalModel.passive_skill_energy_less_lvl_coe = req.body.passive_skill_energy_less_lvl_coe;
                                            globalModel.Elite_Dungeon_Reset_Cycle = req.body.Elite_Dungeon_Reset_Cycle;
                                            globalModel.Elite_Dungeon_Lvl_Limit = req.body.Elite_Dungeon_Lvl_Limit;
                                            globalModel.troop_max_stamina = req.body.troop_max_stamina;
                                            globalModel.stamina_recover_interval = req.body.stamina_recover_interval;
                                            globalModel.initiative_skill_enable = req.body.initiative_skill_enable;
                                            globalModel.passive_skill_enable = req.body.passive_skill_enable;
                                            globalModel.characteristic_skill_enable = req.body.characteristic_skill_enable;
                                            globalModel.skill_point_recovery_interval = req.body.skill_point_recovery_interval;
                                            globalModel.skill_point_limit = req.body.skill_point_limit;
                                            globalModel.vip_skill_point_limit = req.body.vip_skill_point_limit;
                                            globalModel.troop_Lvl_Limit = req.body.troop_Lvl_Limit;
                                            globalModel.herolvl = result.data.herolvl;
                                            globalModel.skilllvl = result.data.skilllvl;
                                            globalModel.trooplvl = result.data.trooplvl;
                                            globalModel.soulStone = result.data.soulStone;
                                            globalModel.userInit = result.data.userInit;
                                            globalModel.server_reset_time = req.body.server_reset_time;
                                            globalModel.life_enhance = req.body.life_enhance;
                                            globalModel.attack_enhance = req.body.attack_enhance;
                                            globalModel.spell_enhance = req.body.spell_enhance;
                                            globalModel.round_limit = req.body.round_limit;
                                            globalModel.deduction = req.body.deduction;
                                            globalModel.Gold = req.body.Gold;
                                            globalModel.Diamond = req.body.Diamond;
                                            globalModel.Purchased_Diamond = req.body.Purchased_Diamond;
                                            globalModel.PVPCoin = req.body.PVPCoin;
                                            globalModel.RaidCoin =  req.body.RaidCoin;
                                            globalModel.FarFightCoin =  req.body.FarFightCoin;
                                            globalModel.FourLeaf = req.body.FourLeaf;
                                            globalModel.ArenaStore = req.body.ArenaStore;
                                            globalModel.DiamondStore = req.body.DiamondStore;
                                            globalModel.StaminaStore =  req.body.StaminaStore;
                                            globalModel.SkillPointStore = req.body.SkillPointStore;
                                            globalModel.CoinStore = req.body.CoinStore;
                                            globalModel.PVETimesStore = req.body.PVETimesStore;
                                            globalModel.FarFightStore = req.body.FarFightStore;
                                            globalModel.NormalDiamondStore = req.body.NormalDiamondStore;
                                            globalModel.NormalCoinStore = req.body.NormalCoinStore;
                                            globalModel.GoblinStore = req.body.GoblinStore;
                                            globalModel.DiamondExpend.ChangeNickname = req.body.ChangeNickname;
                                            globalModel.DiamondExpend.FourLeafPrice = req.body.FourLeafPrice;
                                            globalModel.FarFight_Base_Coin = req.body.FarFight_Base_Coin;
                                            globalModel.FarFight_Lvl_Coe = req.body.FarFight_Lvl_Coe;
                                            globalModel.FarFight_FightForce_Coe = req.body.FarFight_FightForce_Coe;
                                            globalModel.FarFight_FightForce_Match_Coe = req.body.FarFight_FightForce_Match_Coe;
                                            globalModel.Game_Function={
                                                Arena:req.body.Arena,
                                                Elite_Stage:req.body.Elite_Stage,
                                                Leaderboard:req.body.Leaderboard,
                                                Expedition:req.body.Expedition,
                                                Caverns_Of_Time:req.body.Caverns_Of_Time,
                                                Businessman:req.body.Businessman,
                                                Guild:req.body.Guild,
                                                Hero_Trial:req.body.Hero_Trial,
                                                Enchanting:req.body.Enchanting,
                                                Buried_Treasure:req.body.Buried_Treasure,
                                                Pool_Of_Prophecy:req.body.Pool_Of_Prophecy
                                            };
                                            globalModel.IOS_App_Key = req.body.IOS_App_Key;
                                            globalModel.Android_App_Key = req.body.Android_App_Key;
                                            globalModel.hero_lvl_fighting_force = req.body.hero_lvl_fighting_force;
                                            globalModel.hero_skill_fighting_force = req.body.hero_skill_fighting_force;
                                            globalModel.skill_unlock_fighting_force = req.body.skill_unlock_fighting_force;
                                            globalModel.Notice.Notice_Url =  req.body.Notice_Url;
                                            globalModel.Notice.Is_Popup = req.body.Notice_Is_Popup;
                                            globalModel.Notice.Notice_Version = req.body.Notice_Version;
                                            globalModel.farfight_life_enhance = req.body.farfight_life_enhance;
                                            globalModel.farfight_attack_enhance = req.body.farfight_attack_enhance;
                                            globalModel.farfight_spell_enhance = req.body.farfight_spell_enhance;
                                            globalModel.farfight_grid_colour = req.body.farfight_grid_colour;
                                            var configData = {
                                                "data" : globalModel
                                            };

                                            data.config = JSON.stringify(configData);
                                            console.log("editConfig",globalModel);
                                            dataProvider.editConfig(data, function(error){
                                                console.log(error);
                                                if(error)
                                                    return render(res, route, '配置文件写入失败.');
                                                body.message = '设置成功.';
                                                body.result = globalModel;
                                                body.result.Currency = resultCurrency;
                                                body.result.Consumables = resultConsumables;
                                                body.result.Store = resultStore;
                                                res.render(route, body);
                                            });
                                        }
                                    });
                                }
                                else{
                                    //console.log("result:"+result.data.attack_crit_lvl_adjust_coe);
                                    body.result = result.data;
                                    body.result.Currency = resultCurrency;
                                    body.result.Consumables = resultConsumables;
                                    body.result.Store = resultStore;
                                    console.log('body.result:',body.result);
                                    res.render(route, body);
                                }
                            }
                        }
                    })

                })
            }
        })

    });
};

function initHerolvl(maxLvl){
    var jsonHerolvl= new Array() ;
    for(var i = 0;i<maxLvl;i++){
        jsonHerolvl[i]=i;
    }

    return jsonHerolvl;
}

function getHerolvl(req,herolvllenght){
    var jsonHerolvl= new Array() ;
    for(var i = 0;i<herolvllenght;i++){
        jsonHerolvl[i]=eval("req.body.lvl"+i);
    }
    return jsonHerolvl;

}

function getUserInit(req){

}


function initTrooplvl(maxLvl){
    var jsonTrooplvl= new Array() ;
    for(var i = 0;i<maxLvl;i++){
        {
            jsonTrooplvl[i]  ={
                "Experience":i,
                "Stamina":i,
                "StaminaRecovery":i
            }
        }
    }

    return jsonTrooplvl;
}


function initSoulStone(maxLvl){
    var jsonSoulStone= new Array() ;
    for(var i = 0;i<=maxLvl;i++){
        {
            jsonSoulStone[i]  ={
                "Summon_Expend":i,
                "Upgrade_Expend":i,
                "Decompose":i
            }
        }
    }

    return jsonSoulStone;
}

function getSoulStone(req,trooplvllenght){
    var jsonSoulStone= new Array() ;
    for(var i = 0;i<soulStonelenght;i++){
        jsonSoulStone[i] = {
            "Summon_Expend":eval("req.body.summon"+i),
            "Upgrade_Expend":eval("req.body.upgrade"+i),
            "Decompose":eval("req.body.decompose"+i)
        }
    }
    return jsonSoulStone;

}

function getTrooplvl(req,trooplvllenght){
    var jsonTrooplvl= new Array() ;
    for(var i = 0;i<trooplvllenght;i++){
        jsonTrooplvl[i] = {
            "Experience":eval("req.body.lvl"+i),
            "Stamina":eval("req.body.stamina"+i),
            "StaminaRecovery":(eval("req.body.staminaRecovery"+i) == "")?0:eval("req.body.staminaRecovery"+i)
        }
    }
    return jsonTrooplvl;
}
function render(res, route, message){
    body.message = message;
    res.render(route, body);
}