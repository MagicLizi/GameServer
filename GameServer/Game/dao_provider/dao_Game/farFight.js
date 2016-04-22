/**
 * Created by lizi on 15/9/9.
 */
var code = require('../../../ServerConfigs/code');
var sqlClient = require('../../../Util/dao/sqlClient').Game;
var sqlClientAdmin = require('../../../Util/dao/sqlClient').Admin;
var sqlCommand = require('../../../Util/dao/sqlCommand');
var gameUserProvider = require("../dao_Game/gameUser");
var farFight = module.exports;
var async = require('async');
var farFightCode = require("../../code");
var heroModel = require("../../domain/domain_Game/Hero");
farFight.MacthEndRefresh = function(userId,FarFightCount,MacthState,callback)
{
    var sql = new sqlCommand('UPDATE User_FarFight SET CurMatchState = ? , FarFightCount = ? WHERE UserId = ?',[MacthState,FarFightCount,userId]);
    sqlClient.update(sql,function(error,result){
        if(error != null)
        {
            callback(code.DB.UPDATE_DATA_ERROR,error);
        }
        else
        {
            callback(null,null);
        }
    });
};

farFight.MatchUserByAllArea = function(callback)
{
    var sql = new sqlCommand('select * from User_FarFightPower order by CurPower');
    sqlClient.update(sql,function(error,result){
        if(error != null)
        {
            callback(code.DB.UPDATE_DATA_ERROR,error);
        }
        else
        {
            callback(null,farFight.sortSameByUserId(result));
        }
    });
}

farFight.MathchUserByArea = function(down,up,callback)
{
    var sql = new sqlCommand('select * from User_FarFightPower where CurPower >=? AND  CurPower <=? order by CurPower',[down,up]);
    sqlClient.update(sql,function(error,result){
        if(error != null)
        {
            callback(code.DB.UPDATE_DATA_ERROR,error);
        }
        else
        {
            callback(null,farFight.sortSameByUserId(result));
        }
    });
};

farFight.sortSameByUserId = function(all)
{
    //console.log("sort");
    //console.log(all);
    for(var i = 0;i<all.length;i++)
    {
        for(var j=i+1;j<all.length;j++)
        {
            var l = all[i];
            var n = all[j];
            if(l.CurPower == n.CurPower)
            {
                if(l.UserId> n.UserId)
                {
                    //交换
                    var temp=all[i];
                    all[i]=all[j];
                    all[j]=temp;
                }
            }
        }
    }
   // console.log(all);
    return all;
}

farFight.RefreshFarFightMatchingState = function(userId,MacthState,callback)
{
    var sql = new sqlCommand('UPDATE User_FarFight SET CurMatchState = ? WHERE UserId = ?',[MacthState,userId]);
    sqlClient.update(sql,function(error,result){
        if(error != null)
        {
            callback(code.DB.UPDATE_DATA_ERROR,error);
        }
        else
        {
            callback(null,null);
        }
    });
};

farFight.RefreshUserFightPowers = function(infos,callback)
{

    //UPDATE Game_DEV.User_FarFightPower
    //SET CurPower = CASE UserId
    //WHEN 100000731 THEN 1
    //WHEN 100000732 THEN 2
    //END
    //WHERE UserId IN (100000731,100000732)
    console.log(infos);
    var ws = "";
    var us = "";
    var ds = "";
    for(var i = 0;i<infos.length;i++)
    {
        var info = infos[i];
        var uid = info.uid;
        var power = info.power;
        var date = new Date();
        var dateStr = date.getFullYear()+"-"+(date.getMonth() + 1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
        //console.log(dateStr);
        ws = ws + "WHEN "+uid +" THEN "+power+" ";
        ds = ds + "WHEN "+uid +" THEN '"+dateStr+"' ";
        us = us + uid;
        if(i<infos.length - 1)
        {
            us = us+",";
        }
    }
    var s = "UPDATE User_FarFightPower " +
        "SET CurPower = CASE UserId " +
        ws +
        "END, "+
        "LastUpdate_Date = Case UserId "+
        ds +
        "END " +
        "Where UserId IN ("+
        us+
        ")";

    var sql = new sqlCommand(s);
    console.log("update");
    //console.log(sql);
    sqlClient.update(sql,function(error,result)
    {
        if(error != null)
        {
            callback(code.DB.UPDATE_DATA_ERROR,error);
        }
        else
        {
            callback(null,result);
        }
    });
};

farFight.CreateUserFarFightPower = function(userId,callback)
{
    var sql1 = new sqlCommand("INSERT INTO User_FarFightPower (UserId,CurPower,LastUpdate_Date)VALUES (?,?,?)",
        [userId,0,new Date()]);
    //insert
    sqlClient.insert(sql1, function(error, result)
    {
        if (error != null)
        {
            console.log('error:',error,'sql:',sql1);
            callback(code.DB.INSERT_DATA_ERROR, error);
        }
        else
        {
            callback(null, result);
        }
    });
};

farFight.GetUserAll = function(callback)
{
    var sql1 = new sqlCommand("select * from User_troop");
    //insert
    sqlClient.query(sql1, function(error, result)
    {
        if (error != null)
        {
            callback(code.DB.INSERT_DATA_ERROR, error);
        }
        else
        {
            callback(null, result);
        }
    });
}

farFight.TaskRefreshFarFightCount = function(farFightCount,callback)
{
    var sql = new sqlCommand('UPDATE User_FarFight SET FarFightCount = ?,CurMatchState = 0',[farFightCount]);
    sqlClient.update(sql,function(error,result){
        if(error != null)
        {
            callback(code.DB.UPDATE_DATA_ERROR,error);
        }
        else
        {
            callback(null,null);
        }
    });
};

farFight.TaskRefreshAllUserPvpDefendFightPower = function(callback)
{
    var sql = new sqlCommand("select * from Troop_Record where Troop_Type = 2 AND Is_Defend = 1");
    sqlClient.query(sql,function(error,result) {
        if(error)
        {
            callback(error,null);
        }
        else
        {
            var UserHeroIds = [];
            var j =0;
            for(var i = 0;i<result.length;i++)
            {
                var pvpDefendTroop = result[i];
                var userHeroIds = pvpDefendTroop.Troop_Heros;
                if(userHeroIds!= undefined)
                {
                    var UserHeroIdArray =userHeroIds.split(",");
                    for(var k = 0;k<UserHeroIdArray.length;k++)
                    {
                        if(UserHeroIdArray[k]!=""&&UserHeroIdArray[k]!="undefined")
                        {
                            UserHeroIds.push(UserHeroIdArray[k]);
                        }
                    }
                }
            }
            gameUserProvider.getUserHerosByHeroIds(UserHeroIds,function(e,r)
            {
                if(e)
                {
                    callback(e,e);
                }
                else
                {
                    var PowerInfos = [];
                    for(var i = 0;i< r.length;i++)
                    {
                        var heroData = r[i];
                        var uid = heroData.Membership_Id;
                        var hero = new heroModel.Hero(heroData);
                        var userPowerInfo = farFight.Exist(uid,PowerInfos);
                        if(userPowerInfo == null)
                        {
                            var power = parseInt(hero.Fighting_Force);
                            if(isNaN(hero.Fighting_Force))
                            {
                                power = 0;
                            }
                            var pi =
                            {
                                uid:uid,
                                power:power
                            }
                            PowerInfos.push(pi);
                        }
                        else
                        {
                            if(!isNaN(hero.Fighting_Force))
                            {
                                userPowerInfo.power = userPowerInfo.power + parseInt(hero.Fighting_Force);
                            }
                        }
                    }
                    if(PowerInfos.length>0)
                    {
                        farFight.RefreshUserFightPowers(PowerInfos,callback);
                    }
                    else
                    {
                        callback(null,null);
                    }
                }
            });
        }
    });
};

farFight.Exist = function(uid,PowerInfos)
{
    for(var i = 0;i<PowerInfos.length;i++)
    {
        var powerInfo = PowerInfos[i];
        if(powerInfo.uid == uid)
        {
            return powerInfo;
        }
    }
    return null;
};

farFight.TaskClearAllFarFightHeros = function(callback)
{
    //每天刷新的时候清空表
    var sql = new sqlCommand("delete from User_FarFightTroopHeroInfo");
    sqlClient.delete(sql,callback);
}

farFight.TaskRefreshAllUserFarFightHeros = function(callback)
{
    //刷新 时间点PVP防守英雄数据备份
    //删除之前的内容(之后改为存到HISTORY)
    //更新表
    var tasks = [];
    var task1 = function(cb)
    {
        farFight.BackUpAndClearUserFarFightHeros(cb);
    };
    var task2 = function(cb)
    {
        farFight.InsertTodayUserFarFightHeros(cb);
    };
    tasks.push(task1);
    tasks.push(task2);

    async.series(tasks,function(error,result)
    {
        callback(error,result);
    });
};

farFight.BackUpAndClearUserFarFightHeros = function(callback)
{
    var sql = new sqlCommand("delete from User_FarFightHeros");
    sqlClient.delete(sql,callback);
};

farFight.InsertFarFightHeros = function(herosData,callback)
{
    var ParamList = [];
    var kuohao = "";
    var length =herosData.length;
    for(var i = 0;i<length;i++)
    {
        var heroData = herosData[i];
        ParamList.push(heroData.User_Hero_Id);
        ParamList.push(heroData.Membership_Id);
        ParamList.push(heroData.Hero_Id);
        ParamList.push(heroData.Hero_Lvl);
        ParamList.push(heroData.Hero_Star);
        ParamList.push(heroData.InitiativeSkill_Lvl);
        ParamList.push(heroData.PassiveSkill_Lvl);
        ParamList.push(heroData.CharacteristicSkill_Lvl);
        ParamList.push(new Date());
        ParamList.push(heroData.Hero_Experience);
        ParamList.push(heroData.Hero_Equipment1);
        ParamList.push(heroData.Hero_Equipment2);
        ParamList.push(heroData.Hero_Equipment3);
        ParamList.push(heroData.Hero_Equipment4);
        ParamList.push(heroData.Hero_Equipment5);
        ParamList.push(heroData.Hero_Equipment6);
        ParamList.push(heroData.Hero_Tag);
        ParamList.push(1);
        kuohao = kuohao+"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        if(i<length - 1)
        {
            kuohao = kuohao+",";
        }
    }

    var s ="INSERT INTO User_FarFightHeros (" +
        "User_Hero_Id," +
        "Membership_Id," +
        "Hero_Id," +
        "Hero_Lvl," +
        "Hero_Star," +
        "InitiativeSkill_Lvl," +
        "PassiveSkill_Lvl," +
        "CharacteristicSkill_Lvl," +
        "Create_Date," +
        "Hero_Experience," +
        "Hero_Equipment1," +
        "Hero_Equipment2," +
        "Hero_Equipment3," +
        "Hero_Equipment4," +
        "Hero_Equipment5," +
        "Hero_Equipment6," +
        "Hero_Tag," +
        "state) VALUES "+kuohao;
    var sql = new sqlCommand(s,ParamList);
    console.log("开始批量INSERT "+ length);
    sqlClient.insert(sql,function(error,result)
    {
        callback(error,result);
    });
};

farFight.ExistInArray = function(ary,item)
{
    for(var i = 0;i<ary.length;i++)
    {
        var a = ary[i];
        if(a==item)
        {
            return true;
        }
    }
    return false;
};

farFight.RefreshUserCurFarFightInfo = function(uid,curInfo,callback)
{
    var sql = new sqlCommand('UPDATE User_FarFight SET UserCurFarFightInfo = ? WHERE UserId = ?',[JSON.stringify(curInfo),uid]);
    sqlClient.update(sql,function(error,result)
    {
        if(error != null)
        {
            callback(code.DB.UPDATE_DATA_ERROR,error);
        }
        else
        {
            callback(null,null);
        }
    });
};


farFight.getUserFarFightDefendHeros = function(uid,callback)
{
    var sql = new sqlCommand("select * from User_FarFightHeros where Membership_Id =?",[uid]);
    sqlClient.query(sql,function(error,result)
    {
        callback(error,result);
    });
};

farFight.InsertTodayUserFarFightHeros = function(callback)
{
    var sql = new sqlCommand('call Save_TR');
    sqlClient.query(sql,function(error,result)
    {
        callback(error,result);
    });
};

farFight.SetUserFarFightHerosInfo = function(uid,heroList,callback)
{
    //设置所有 UID INTEAM 为0
    var tasks = [];
    var task1 = function(cb)
    {
        var sql = new sqlCommand("UPDATE User_FarFightTroopHeroInfo SET InTeam = 0 WHERE UserId = ?",[uid]);
        sqlClient.update(sql,cb);
    };
    tasks.push(task1);
    //判断 herolist 英雄是否存在，存在UPDATE 血量 INTEAM Energy ,不存在 INSERT
    var task2 = function(cb)
    {
        //console.log(heroList);
        var heroIds = "(";
        for(var i = 0;i<heroList.length;i++)
        {
            var h = heroList[i];
            var hid = h.hid;
            heroIds = heroIds+hid;
            if(i<heroList.length - 1)
            {
                heroIds = heroIds+ ",";
            }
        }
        heroIds = heroIds+")";
        var sql = new sqlCommand("select * from User_FarFightTroopHeroInfo where userId = ? and userHeroId In"+heroIds,[uid]);
        sqlClient.query(sql,function(e,r)
        {
            if(e)
            {
                cb(e,e);
            }
            else
            {
                for(var i = 0;i<heroList.length;i++)
                {
                    var h = heroList[i];
                    var hid = h.hid;
                    var exist = false;
                    for(var j = 0;j< r.length;j++)
                    {
                        if(r[j].userHeroId == hid)
                        {
                            exist = true;break;
                        }
                    }
                    h.exist = exist;
                }

                var tasks1 = [];
                var j = 0;
                for(var i = 0;i<heroList.length;i++)
                {
                    var task1 = function(cb1)
                    {
                        //console.log("执行TASK1");
                        var h= heroList[j];
                        j++;
                        if(h.exist)
                        {
                            //up
                            var sql1 = new sqlCommand('UPDATE User_FarFightTroopHeroInfo SET hpPersent = ?,InTeam = 1,PassSkillEnergy = ?,IniSkillEnergy = ? WHERE UserHeroId = ?',[h.hp,h.PassSkillEnergy,h.IniSkillEnergy,h.hid]);
                            sqlClient.update(sql1,cb1);
                        }
                        else
                        {
                            //console.log("insert");
                            //in
                            var sql1 = new sqlCommand("INSERT INTO User_FarFightTroopHeroInfo (userHeroId,hpPersent,InTeam,userId,PassSkillEnergy,IniSkillEnergy)VALUES (?,?,?,?,?,?)",
                                [h.hid, h.hp,1,uid,0,0]);
                            sqlClient.insert(sql1,cb1);
                        }
                    }
                    tasks1.push(task1);
                }
                async.series(tasks1,cb);

            }
        });

    };
    tasks.push(task2);
    async.series(tasks,callback);

};



farFight.SetEndDefendHerosInfo = function(uid,defendHeros,auid,callback)
{
    var sql = new sqlCommand("select * from User_FarFight where UserId = ?",[uid]);
    sqlClient.query(sql,function(e,r)
    {
        if (e)
        {
            callback(e, e);
        }
        else
        {
            console.log("--------");
            console.log(r[0]);
            var matchUsers = JSON.parse(r[0].UserCurFarFightInfo).FarFightMatchUsers;
            var loops = JSON.parse(r[0].UserCurFarFightInfo).lvlLoops;
            var attackMatchUser = null;
            for(var i = 0;i<matchUsers.length;i++)
            {
                var matchUser = matchUsers[i];
                if(matchUser.userId == auid)
                {
                    attackMatchUser = matchUser;break;
                }
            }
            var dhs = attackMatchUser.defendHeros;

            for(var i = 0;i<dhs.length;i++)
            {
                var dh = dhs[i];
                var hInfo = farFight.GetHInfo(defendHeros,dh.User_Hero_Id);
                if(hInfo)
                {
                    dh.curLifePersent = hInfo.hp;
                    dh.PassSkillEnergy = hInfo.PassSkillEnergy;
                    dh.IniSkillEnergy = hInfo.IniSkillEnergy;
                }
            }
            //console.log(matchUser);
            for(var i = 0;i<matchUsers.length;i++)
            {
                var mu = matchUsers[i];
                if(mu.userId == matchUser.userId)
                {
                    mu = matchUser;
                }
            }


            var curFarFightInfo =
            {
                "FarFightMatchUsers":matchUsers,
                "lvlLoops":loops
            };

            console.log("curFarFightInfo:"+JSON.stringify(matchUsers));
            farFight.RefreshFarFightInfo(uid,JSON.stringify(curFarFightInfo),callback);
        }
    });
};

farFight.GetHInfo = function(defendHeros,hid)
{
    for(var i = 0;i<defendHeros.length;i++)
    {
        var dh = defendHeros[i];
        if(dh.hid == hid)
        {
            return dh;break;
        }
    }
};

farFight.SetEndFarFightDefendState = function(uid,auid,callback)
{
    var sql = new sqlCommand("select * from User_FarFight where UserId = ?",[uid]);
    sqlClient.query(sql,function(e,r)
    {
        if(e)
        {
            callback(e,e);
        }
        else
        {
            var matchUsers = JSON.parse(r[0].UserCurFarFightInfo).FarFightMatchUsers;
            var attackMatchUser = null;
            for(var i = 0;i<matchUsers.length;i++)
            {
                var matchUser = matchUsers[i];
                if(matchUser.userId == auid)
                {
                    attackMatchUser = matchUser;break;
                }
            }
            if(attackMatchUser.state == 1)
            {
                attackMatchUser.state = 2;
                for(var j = 0;j<attackMatchUser.defendHeros.length;j++)
                {
                    var ah = attackMatchUser.defendHeros[j];
                    ah.curLifePersent = 0;
                }
                var info =
                {
                    "FarFightMatchUsers":matchUsers,
                    "lvlLoops":JSON.parse(r[0].UserCurFarFightInfo).lvlLoops
                }
                console.log(info);
                farFight.RefreshFarFightInfo(uid,JSON.stringify(info),function(e1,r1)
                {
                    callback(e1,r1);
                });
            }
            else if(attackMatchUser.state == 0)
            {
                var e1 = new Error("farFightCode.FarFight.MatchUserNotBegin");
                e1.statusCode = farFightCode.FarFight.MatchUserNotBegin;
                callback(e1,farFightCode.FarFight.MatchUserNotBegin);
            }
            else if(attackMatchUser.state == 2)
            {
                var e1 = new Error("farFightCode.FarFight.MatchUserHasFighted");
                e1.statusCode = farFightCode.FarFight.MatchUserHasFighted;
                callback(e1,farFightCode.FarFight.MatchUserHasFighted);
            }
        }
    });
};

farFight.SetBeginFarFightDefendState = function(uid,auid,callback)
{
    var sql = new sqlCommand("select * from User_FarFight where UserId = ?",[uid]);
    sqlClient.query(sql,function(e,r)
    {
        if(e)
        {
            callback(e,e);
        }
        else
        {
            console.log("!!!!!");
            console.log(r[0]);
            var matchUsers = JSON.parse(r[0].UserCurFarFightInfo).FarFightMatchUsers;
            var attackMatchUser = null;
            for(var i = 0;i<matchUsers.length;i++)
            {
                var matchUser = matchUsers[i];
                if(matchUser.userId == auid)
                {
                    attackMatchUser = matchUser;break;
                }
            }
            attackMatchUser.state = 1;
            var info =
            {
                "FarFightMatchUsers":matchUsers,
                "lvlLoops":JSON.parse(r[0].UserCurFarFightInfo).lvlLoops
            }
            console.log(info);
            farFight.RefreshFarFightInfo(uid,JSON.stringify(info),function(e1,r1)
            {
                if(e1)
                {
                    callback(e1,e1);
                }
                else
                {
                    callback(null,attackMatchUser);
                }
            });


        }
    });
};

farFight.RefreshFarFightInfo = function(uid,info,callback)
{
    console.log(uid);
    console.log(JSON.stringify(info));
    var sql = new sqlCommand('UPDATE User_FarFight SET UserCurFarFightInfo= ? where UserId = ?',[info,uid]);
    sqlClient.update(sql,function(error,result){
        if(error != null)
        {
            console.log("ee!!!");
            callback(code.DB.UPDATE_DATA_ERROR,error);
        }
        else
        {
            console.log("upsuccess!!!");
            callback(null,null);
        }
    });
};

farFight.ClearUserFarFightHeros = function(uid,callback)
{
    var sql = new sqlCommand("delete from User_FarFightTroopHeroInfo where userId = ?",[uid]);
    sqlClient.delete(sql,callback);
};

farFight.UpdateTroopHeroInfos = function(herosInfo,callback)
{
    var ws = "";
    var ps = "";
    var ins = ""
    var whs = "(";
    for(var i = 0;i<herosInfo.length;i++)
    {
        var h = herosInfo[i];
        ws = ws + "WHEN "+ h.hid+" THEN "+ h.hp+" ";
        ps = ps + "WHEN "+ h.hid+" THEN "+ h.PassSkillEnergy+" ";
        ins = ins + "WHEN "+ h.hid+" THEN "+ h.IniSkillEnergy+" ";
        whs = whs + h.hid;
        if(i<herosInfo.length - 1)
        {
            whs = whs +",";
        }
    }
    whs = whs+")";
    var s = new sqlCommand("UPDATE User_FarFightTroopHeroInfo SET " +
    "hpPersent = CASE userHeroId "+ws+" END," +
    "PassSkillEnergy = CASE userHeroId "+ps+" END,"+
    "IniSkillEnergy = CASE userHeroId "+ins+" END "+
    "WHERE userHeroId IN "+whs);
    console.log(s);
    sqlClient.update(s,callback);
};

farFight.loopType =
{
    Small : 1,
    L1:2,
    L2:3,
    L3:4,
    L4:5,
    L5:6,
    L6:7
}

farFight.GetLvlPoolIds = function(userLvl,loopType,callback)
{
    var s = new sqlCommand("select * from edit_FarFight where (? BETWEEN Min_Lvl AND Max_Lvl) AND FarFight_Type IN (?)",[userLvl,loopType]);
    sqlClientAdmin.query(s,function(e,r)
    {
        if(e)
        {
            callback(e,e);
        }
        else
        {
            var LvlPoolIds = [];
            //console.log(r);
            for(var i = 0;i< r.length;i++)
            {
                //console.log(r[i]);
                var lp =
                {
                    "type":r[i].FarFight_Type,
                    "ids":r[i].Pool_Id.split(',')
                }
                LvlPoolIds.push(lp);
            }
            callback(null,{"LvlPoolIds":LvlPoolIds});
        }
    });
};