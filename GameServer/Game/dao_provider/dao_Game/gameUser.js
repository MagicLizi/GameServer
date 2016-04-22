/**
 * Created by peihengyang on 14/12/4.
 */
var code = require('../../../ServerConfigs/code');
var sqlClient = require('../../../Util/dao/sqlClient').Game;
var sqlCommand = require('../../../Util/dao/sqlCommand');
var heroProvider = require('./hero');
var gameUser = module.exports;
var async = require('async');
var farFightProvider = require('../dao_Game/farFight');
gameUser.addUserHero = function(model,callback){
    var sql = new sqlCommand("INSERT INTO User_Hero (Membership_Id,Hero_Id,Hero_Lvl,Hero_Star," +
        "InitiativeSkill_Lvl,PassiveSkill_Lvl,CharacteristicSkill_Lvl,Create_Date,Hero_Experience," +
        "Hero_Equipment1,Hero_Equipment2,Hero_Equipment3,Hero_Equipment4,Hero_Equipment5,Hero_Equipment6,Hero_Tag)" +
        "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?," +
        "SELECT EH.Hero_Tag FROM admin_"+process.argv[3]+".edit_hero AS EH WHERE EH.recharge_id = ?)",
        [model.User_Id,model.Hero_Id,model.Hero_Lvl,model.Hero_Star,
    model.InitiativeSkill_Lvl,model.PassiveSkill_Lvl,model.CharacteristicSkill_Lvl,model.Create_Date,
    model.Hero_Experience,model.Hero_Equipment1,model.Hero_Equipment2,model.Hero_Equipment3,
    model.Hero_Equipment4,model.Hero_Equipment5,model.Hero_Equipment6,model.Hero_Id]);
    sqlClient.insert(sql, function(error, result){

        if(error != null)
            callback(code.DB.INSERT_DATA_ERROR, error);
        else
        {
            gameUser.getUserById(model.User_Id,function(error,result){
                if(error != null)
                {
                    return callback(code.GameUser.Get_User_Fail, {
                        result : error
                    });
                }
                else
                {
                    return callback(null, result);
                }

            })
        }

    });
}

var createUserHero = function(model){
    var UserHero =  model;
    return UserHero;
}

gameUser.addUserHeros = function(model,heros,callback){
    var sqls = [];
    var resultUserHero = [];
    console.log("herosforeach:",heros);
    heros.forEach(function(item){
        var UserHeroModel = {
            Hero_Id:item.Hero_Id,
            Hero_Lvl:item.Hero_Lvl,
            Membership_Id:model.User_Id,
            Hero_Star:model.Hero_Star,
            InitiativeSkill_Lvl:item.InitiativeSkill_Lvl,
            PassiveSkill_Lvl:item.PassiveSkill_Lvl,
            CharacteristicSkill_Lvl:item.CharacteristicSkill_Lvl,
            Create_Date:model.Create_Date,
            Hero_Experience:item.Hero_Experience,
            Hero_Equipment1:model.Hero_Equipment1,
            Hero_Equipment2:model.Hero_Equipment2,
            Hero_Equipment3:model.Hero_Equipment3,
            Hero_Equipment4:model.Hero_Equipment4,
            Hero_Equipment5:model.Hero_Equipment5,
            Hero_Equipment6:model.Hero_Equipment6
        };
        resultUserHero.push(UserHeroModel);
        var sql = new sqlCommand("INSERT INTO User_Hero (Membership_Id,Hero_Id,Hero_Lvl,Hero_Star," +
            "InitiativeSkill_Lvl,PassiveSkill_Lvl,CharacteristicSkill_Lvl,Create_Date,Hero_Experience," +
            "Hero_Equipment1,Hero_Equipment2,Hero_Equipment3,Hero_Equipment4,Hero_Equipment5,Hero_Equipment6,Hero_Tag)" +
            " SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?," +
            "(SELECT EH.Hero_Tag FROM admin_"+process.argv[3]+".edit_hero AS EH WHERE EH.recharge_id = ?) " +
            "FROM dual WHERE NOT EXISTS (SELECT Hero_Id FROM User_Hero WHERE " +
            "Membership_Id = ? AND Hero_Id = ?)",[model.User_Id,item.Hero_Id,item.Hero_Lvl,model.Hero_Star,
            item.InitiativeSkill_Lvl,item.PassiveSkill_Lvl,item.CharacteristicSkill_Lvl,model.Create_Date,
            item.Hero_Experience,model.Hero_Equipment1,model.Hero_Equipment2,model.Hero_Equipment3,
            model.Hero_Equipment4,model.Hero_Equipment5,model.Hero_Equipment6,item.Hero_Id,model.Membership_Id,
            item.Hero_Id]);
        sql.after = function(result,share) {
            console.log('after result');
            console.log(result.insertId);
            resultUserHero.forEach(function(UserHero){
                if(UserHero.Hero_Id == item.Hero_Id){
                    UserHeroModel.User_Hero_Id = result.insertId;
                }
            })
        }
        sqls.push(sql);
    });
    sqlClient.transaction(sqls, function(error, results){

        if(error != null)
        {
            console.log(error);
            callback(code.DB.INSERT_DATA_ERROR, error);
        }

        else
        {
            return callback(null, resultUserHero);
        }

    });
}




gameUser.addUserTroop = function(model,callback){
    console.log("userTroop=---------------");
    console.log(model);
    var sql = new sqlCommand("INSERT INTO User_troop ( User_Id , Troop_Lvl, Troop_Current_Experience, Troop_Stamina , " +
        "Troop_Name ,Troop_Max_Stamina , Troop_Avatar_Id , Troop_Avatar_Frame_Id , Troop_Skill_Point_Last_Use_Date ," +
        "Troop_Skill_Point,Troop_Stamina_Last_Use_Date,Create_Date )VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",[model.User_Id,model.Troop_Lvl,model.Troop_Current_Experience,
    model.Troop_Stamina,model.Troop_Name,model.Troop_Max_Stamina,model.Troop_Avatar_Id,model.Troop_Avatar_Frame_Id,
    model.Troop_Skill_Point_Last_Use_Date,model.Troop_Skill_Point,model.Troop_Stamina_Last_Use_Date,new Date()]);
    console.log(sql);
    sqlClient.insert(sql, function(error, result){
        if(error != null)
        {
            console.log(error,result);
            callback(code.DB.INSERT_DATA_ERROR, error);
        }
        else
        {
            gameUser.getTroopByUserId(model.User_Id,function(error,result){
                if(error != null)
                {
                    return callback(code.GameUser.Get_User_Fail, {
                        result : error
                    });
                }
                else
                {
                        return callback(null, result);

                }

            })
        }

    });
}


gameUser.updateUser = function(model,callback){
    var sql = new sqlCommand('UPDATE User_Hero SET Membership_Id = ?,Hero_Id = ?,Hero_Lvl = ?,Hero_Star = ?,' +
        'InitiativeSkill_Lvl = ?,PassiveSkill_Lvl = ?,CharacteristicSkill_Lvl = ?,Hero_Experience = ?,' +
        'Hero_Equipment1 = ?,Hero_Equipment2 = ?,Hero_Equipment3 = ?,Hero_Equipment4 = ?,Hero_Equipment5 = ?,' +
        'Hero_Equipment6 = ? WHERE User_Hero_Id = ?',[model.Membership_Id,model.Hero_Id,model.Hero_Lvl,
            model.Hero_Star,model.InitiativeSkill_Lvl,model.PassiveSkill_Lvl,model.CharacteristicSkill_Lvl,
            model.Hero_Experience,model.Hero_Equipment1,model.Hero_Equipment2,model.Hero_Equipment3,
            model.Hero_Equipment4,model.Hero_Equipment5,model.Hero_Equipment6,model.User_Hero_Id]);
    sqlClient.update(sql,function(error,result){
        if(error != null && error !='')
            callback(code.DB.UPDATE_DATA_ERROR, error);
        else
            callback(null, null);
    })
}

gameUser.updateUsers = function(models,callback){
    var sqls=[];
    console.log(models);
    models.forEach(function(model){
        var sql = new sqlCommand('UPDATE User_Hero SET Membership_Id = ?,Hero_Id = ?,Hero_Lvl = ?,Hero_Star = ?,' +
            'InitiativeSkill_Lvl = ?,PassiveSkill_Lvl = ?,CharacteristicSkill_Lvl = ?,Hero_Experience = ?,' +
            'Hero_Equipment1 = ?,Hero_Equipment2 = ?,Hero_Equipment3 = ?,Hero_Equipment4 = ?,Hero_Equipment5 = ?,' +
            'Hero_Equipment6 = ? WHERE User_Hero_Id = ?',[model.Membership_Id,model.Hero_Id,model.Hero_Lvl,
            model.Hero_Star,model.InitiativeSkill_Lvl,model.PassiveSkill_Lvl,model.CharacteristicSkill_Lvl,
            model.Hero_Experience,model.Hero_Equipment1,model.Hero_Equipment2,model.Hero_Equipment3,
            model.Hero_Equipment4,model.Hero_Equipment5,model.Hero_Equipment6,model.User_Hero_Id]);
        sqls.push(sql);
    });

    sqlClient.transaction(sqls,function(error,result){
        if(error != null ){
            console.log(error);
            callback(code.DB.UPDATE_DATA_ERROR, null);
        }

        else
            callback(null, null);
    })
}


gameUser.updateUserTroop = function(model,callback){
    console.log('updateUserTroop:',model);
    var sql = new sqlCommand('UPDATE User_troop SET User_Id = ?,Troop_Lvl = ?,Troop_Current_Experience = ?,' +
        'Troop_Stamina = ?,Troop_Name = ?,Troop_Max_Stamina = ?,Troop_Avatar_Id = ?,Troop_Avatar_Frame_Id = ?,' +
        'Troop_Skill_Point_Last_Use_Date = ?,Troop_Skill_Point = ?,Troop_Stamina_Last_Use_Date=? WHERE Troop_Id = ?'
        ,[model.User_Id,model.Troop_Lvl,model.Troop_Current_Experience,model.Troop_Stamina,model.Troop_Name,
    model.Troop_Max_Stamina,model.Troop_Avatar_Id,model.Troop_Avatar_Frame_Id,model.Troop_Skill_Point_Last_Use_Date,
    model.Troop_Skill_Point,model.Troop_Stamina_Last_Use_Date,model.Troop_Id]);
    sqlClient.update(sql,function(error,result){
        console.log(error);
        if(error != null)
            callback(code.DB.UPDATE_DATA_ERROR, error);
        else
            callback(null, result);
    })
}

gameUser.getUserById = function(userId,callback){
    var sql = new sqlCommand('SELECT * FROM User_Hero WHERE Membership_Id = ? ',[userId]);
    sqlClient.query(sql,function(error,result){
        console.log(result);
        if(error != null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR, error);
        }

        else
        {
            callback(null, result);
        }

    });
}


gameUser.getTroopByUserId = function(userId,callback){
    var sql = new sqlCommand('SELECT *, 0 AS SkillPointTimes,0 AS StaminaTimes,0 AS CoinTimes ' +
    'FROM User_troop WHERE User_Id = ? ', [userId]);
    sqlClient.query(sql,function(error,result){
        //console.log(result);
        if(error != null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR, error);
        }

        else
        {
            callback(null, result);
        }

    });
}


gameUser.getTroopStoreByUserId = function(userId,golbal,callback){
    console.log('golbal:',golbal);
    var sql = new sqlCommand('SELECT User_troop.*,(SELECT COUNT(1) FROM Today_Store_History ' +
    'WHERE Store_Id = ? AND User_Id = ?) AS SkillPointTimes,' +
    '(SELECT COUNT(1) FROM Today_Store_History WHERE Store_Id = ? AND User_Id = ?) AS StaminaTimes,' +
    '(SELECT COUNT(1) FROM Today_Store_History WHERE Store_Id = ? AND User_Id = ?) AS CoinTimes' +
    ' FROM User_troop WHERE User_Id = ? ',[golbal.SkillPointStore,userId,golbal.StaminaStore,userId,golbal.CoinStore,
        userId,userId]);
    sqlClient.query(sql,function(error,result){
        console.log(sql);
        if(error != null){
            console.log("getTroopStoreByUserId:",error);
            callback(code.DB.EXEC_QUERY_ERROR, error);
        }

        else
        {
            console.log(result);
            callback(null, result);
        }

    });
}

gameUser.getTroopByNickname = function(nickname,callback){
    var sql = new sqlCommand('SELECT * FROM User_troop WHERE Troop_Name = ? ',[nickname]);
    sqlClient.query(sql,function(error,result){
        console.log(result);
        if(error != null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR, error);
        }

        else
        {
            callback(null, result);


        }

    });
}

gameUser.getUserByUserIdHeroId = function(userId,heroId,callback){
    var sql = new sqlCommand('SELECT * FROM User_Hero WHERE Membership_Id = ? AND Hero_Id = ?',[userId,heroId]);
    sqlClient.query(sql,function(error,result){
        if(error != null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR, error);
        }

        else
        {
            callback(null, result[0]);
        }
    });
}


gameUser.getUserHeroByHeroIds =  function(user_Id,hero_List,callback){
    console.log(user_Id);
    console.log(hero_List);
    var hlist = hero_List.toString().split(',');
    var hlists='0';
    hlist.forEach(function(item){
        if(item!=''){
            hlists=hlists+','+item;
        }

    });
    console.log("hlists");
    console.log(hlists);
    var sql =  new sqlCommand('SELECT * FROM User_Hero WHERE Membership_Id = ? AND  User_Hero_Id IN ('+hlists.toString()+');',[user_Id]);
    sqlClient.query(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(code.DB.SELECT_DATA_ERROR,null);
        }
        else
        {
            console.log("result----------------");
            console.log(result);
            callback(null,result);
        }
    })
}


gameUser.getUserHeroByHeroIdsL =  function(user_Id,hero_List,callback){
    console.log(user_Id);
    console.log(hero_List);
    var hlist = hero_List.toString().split(',');
    var hlists='0';
    hlist.forEach(function(item){
        if(item!=''){
            hlists=hlists+','+item;
        }

    });
    console.log("hlists");
    console.log(hlists);
    var sql =  new sqlCommand('SELECT * FROM User_Hero WHERE Membership_Id = ? AND  Hero_Id IN ('+hlists.toString()+');',[user_Id]);
    sqlClient.query(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(code.DB.SELECT_DATA_ERROR,null);
        }
        else
        {
            console.log("result----------------");
            console.log(result);
            callback(null,result);
        }
    })
}

gameUser.addAvatar =  function(userId,avatarId,callback){
    var sql =  new sqlCommand('INSERT INTO User_Avatar (User_Id,Avatar_Id,Create_Date) VALUE (?,?,now())',[userId,avatarId]);
    sqlClient.insert(sql,function(error,resultAddAvatar){
        if(error!=null){
            console.log(error);
            callback(code.DB.INSERT_DATA_ERROR,null);
        }
        else
        {
            var sqlGet =  new sqlCommand('SELECT * FROM User_Avatar WHERE User_Id = ?',[userId]);
            sqlClient.query(sqlGet,function(error,resultAvatar){
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    callback(null,resultAvatar);
                }
            })
        }
    })
}

gameUser.getUserAvatarByUserId =  function(userId,callback){

            var sqlGet =  new sqlCommand('SELECT * FROM User_Avatar WHERE User_Id = ?',[userId]);
            sqlClient.query(sqlGet,function(error,resultAvatar){
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    callback(null,resultAvatar);
                }
            })
}

gameUser.getNickname = function(userId,callback){
    var sql = new sqlCommand('CALL RandomName (?)',[userId]);
    sqlClient.query(sql,function(error,resultNickname){
        console.log(resultNickname);
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_PROC_ERROR,null);
        }
        else
        {
            console.log(resultNickname[0]);
            callback(null,resultNickname[0]);
        }
    })
}

gameUser.updateNickname = function(userId,nickName,callback){
    console.log('nickname:',nickName,'||userId:',userId);
    var sql = new sqlCommand('CALL UpdateTroopName (?,?)',[userId,nickName]);
    sqlClient.query(sql,function(error,resultUpdateName){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_PROC_ERROR,null);
        }
        else
        {
            //console.log(resultNickname[0]);
            callback(null,resultUpdateName);
        }
    })
}

gameUser.getUserHeroByHeroTag = function(userId,heroTag,callback){
    var sql = new sqlCommand("SELECT * FROM User_Hero WHERE Membership_Id = ? AND Hero_Tag = ?",[userId,heroTag]);
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            console.log(error,null);
            callback(error,null);
        }
        else
        {
            callback(null,results);
        }
    })
}

//lizi add

gameUser.getUserFarFightInfo = function(userId,callback)
{
    var tasks = [];
    var task1 = function(cb)
    {
        gameUser.getUserFarFight(userId,cb);
    };
    tasks.push(task1);
    var task2 = function(cb)
    {
        var sql = new sqlCommand('SELECT * FROM User_FarFightTroopHeroInfo WHERE userId = ? ',[userId]);
        sqlClient.query(sql,cb);
    };
    tasks.push(task2);
    async.series(tasks,callback);
};

gameUser.getUserFarFight = function(userId,callback)
{
    var sql = new sqlCommand('SELECT * FROM User_FarFight WHERE UserId = ? ',[userId]);
    console.log(userId);
    sqlClient.query(sql,function(error,result){
        if(error != null)
        {
            callback(code.DB.EXEC_QUERY_ERROR, error);
        }

        else
        {
            callback(null, result);
        }

    });
};

gameUser.addUserFarFight = function(userId,callback)
{
    var initFarFightCount = 1;
    var sql = new sqlCommand("INSERT INTO User_FarFight (UserId,FarFightCount,CurMatchState,CreateDate,UserCurFarFightInfo)VALUES (?,?,?,?,?)",
        [userId,initFarFightCount,0,new Date(),""]);
    sqlClient.insert(sql, function(error, result)
    {
        console.log(error,sql);
        if (error != null)
        {
            console.log('addUserFarFight:',error);
            callback(code.DB.INSERT_DATA_ERROR, error);
        }
        else
        {
            farFightProvider.CreateUserFarFightPower(userId,function(e,r)
            {
                callback(e, r);
            });
        }
    });
};

gameUser.getUserHeroByHid = function(uhid,callback)
{
    var sql = new sqlCommand("SELECT * FROM User_Hero WHERE User_Hero_Id = ?",[uhid]);
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            callback(error,null);
        }
        else
        {
            callback(null,results);
        }
    })
}

gameUser.getUserHerosByHeroIds = function(hids,callback)
{
    var ids = "";
    for(var i = 0;i<hids.length;i++)
    {

        ids = ids +hids[i];
        if(i!=hids.length-1)
        {
            ids = ids+",";
        }
    }
    var s = "SELECT * FROM User_Hero where User_Hero_Id in ("+ids+")";
    var sql = new sqlCommand(s);
    sqlClient.query(sql,function(error,results)
    {
        if(error!=null){
            callback(error,null);
        }
        else
        {
            //console.log(results.length);
            callback(null,results);
        }
    })
};

gameUser.getUserHerosByUserId = function(uid,callback)
{
    var sql = new sqlCommand("SELECT * FROM User_Hero WHERE Membership_Id = ?",[uid]);
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            callback(error,null);
        }
        else
        {
            callback(null,results);
        }
    })
}

gameUser.getUserTroopByUserId = function(userId,callback)
{
    var sql = new sqlCommand("SELECT * FROM User_troop WHERE User_Id = ?",[userId]);
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            callback(error,null);
        }
        else
        {
            callback(null,results);
        }
    })
};