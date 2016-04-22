/**
 * Created by peihengyang on 15/1/6.
 */
var code = require('../../../ServerConfigs/code');
var gameEnum =  require('../../enum')
var sqlClient = require('../../../Util/dao/sqlClient').Game;
var sqlClientAdmin = require('../../../Util/dao/sqlClient').Admin;
var sqlCommand = require('../../../Util/dao/sqlCommand');
var dungeon = module.exports;

dungeon.getUserDungeonByUserId =  function(userId,callback){
    var sql = new sqlCommand('SELECT *,IF(Attack_Times_Limit + Additional_Attack_Times -TimesOfFight < 0,0,' +
    'Attack_Times_Limit + Additional_Attack_Times-TimesOfFight) ' +
    'AS RemainderOfTimes FROM (SELECT UD.*,' +
    'IF(ISNULL(TF.TOF),0,TF.TOF) AS TimesOfFight ' +
    'FROM User_Dungeon AS UD LEFT JOIN (SELECT User_Id,Stage_Id,COUNT(1) as TOF FROM Today_Fighting ' +
    'WHERE User_Id = ? AND (Fight_Status = 2 OR Fight_Status = 6) GROUP BY Stage_Id) AS TF ON UD.Stage_Id = TF.Stage_Id ' +
    'WHERE UD.User_Id=? AND UD.PVE_Type <= 2) AS UD_1 UNION SELECT *,IF(Attack_Times_Limit + Additional_Attack_Times -TimesOfFight < 0,0,' +
    'Attack_Times_Limit + Additional_Attack_Times-TimesOfFight) ' +
    'AS RemainderOfTimes FROM (SELECT UD.*,' +
    'IF(ISNULL(TF.TOF),0,TF.TOF) AS TimesOfFight ' +
    'FROM User_Dungeon AS UD LEFT JOIN (SELECT User_Id,Dungeon_Id,COUNT(1) as TOF FROM Today_Fighting ' +
    'WHERE User_Id = ? AND (Fight_Status = 2 OR Fight_Status = 6) GROUP BY Dungeon_Id) AS TF ON UD.Dungeon_Id = TF.Dungeon_Id ' +
    'WHERE UD.User_Id=? AND UD.PVE_Type BETWEEN 3 AND 6) AS UD_2' ,[userId,userId,userId,userId]);
    sqlClient.query(sql,function(error,results){
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

dungeon.getUserDungeonByUserIdStageId =  function(userId,stageId,callback){
    var sql =  new sqlCommand('SELECT * FROM edit_Stage WHERE Stage_Id = ?',[stageId]);
    sqlClientAdmin.query(sql,function(error,resultsEditStage){

        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            var sql = new sqlCommand('SELECT *,? AS Lottery_Method_Id FROM User_Dungeon WHERE User_Id=? AND Stage_Id = ?',
                [resultsEditStage[0].Pool_Id,userId,stageId]);
            sqlClient.query(sql,function(error,results){
                console.log("results-------------");
                console.log(results);
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
    })

}

dungeon.getUserTroopRecord = function(userId, callback){
    var sql = new sqlCommand('SELECT * FROM Troop_Record WHERE User_Id=? ',[userId]);
    sqlClient.query(sql,function(error,results){
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


dungeon.getUserOneTroopRecord = function(user_Id, Troop_Type,Is_Defend, callback){
    var sql = new sqlCommand('SELECT * FROM Troop_Record WHERE User_Id=? AND Troop_Type = ? AND Is_Defend = ?',[user_Id,
    Troop_Type,Is_Defend]);
    sqlClient.query(sql,function(error,results){
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
dungeon.updateUserTroopRecord = function(userId,troopType,hero_List,Is_Defend,callback){
    var now = new Date();
        var sql = new sqlCommand('INSERT INTO Troop_Record (User_Id,Troop_Heros,Troop_Type,Create_Date,Is_Defend) ' +
            'SELECT ?,?,?,?,? FROM dual WHERE not exists(SELECT User_Id FROM Troop_Record WHERE User_Id=? AND' +
                ' Troop_Type = ? AND Is_Defend = ? )',[userId,hero_List,troopType,now,Is_Defend,userId,troopType,Is_Defend]);
    console.log(sql);
    console.log(userId);
    sqlClient.insert(sql,function(error,results){
            if(error!=null){
                console.log('updateUserTroopRecord:',error);
                callback(code.DB.INSERT_DATA_ERROR,null);
            }
            else
            {
                if(results.affectedRows==0){
                    var sql = new sqlCommand('UPDATE Troop_Record SET Troop_Heros = ? WHERE User_Id=? AND' +
                        ' Troop_Type = ? AND Is_Defend = ? ',[hero_List,userId,troopType,Is_Defend]);
                    sqlClient.update(sql,function(error,results){
                        if(error!=null){
                            console.log(error);
                            callback(code.DB.UPDATE_DATA_ERROR,null);
                        }
                        else
                        {
                            callback(null,null);
                        }
                    })
                }
                else
                {
                    callback(null,null);
                }
            }
        })
}



dungeon.initUserDungeon =  function(userId,callback){
    var sql =  new sqlCommand('SELECT * FROM ((SELECT * FROM edit_Stage WHERE Dungeon_Id =' +
    '(SELECT Dungeon_Id FROM edit_Dungeon ORDER BY Dungeon_Order LIMIT 1) AND Stage_Type = 2 AND Stage_Order >= 0 ORDER BY Stage_Order LIMIT 1) UNION' +
    '(SELECT * FROM edit_Stage WHERE Dungeon_Id =' +
    '(SELECT Dungeon_Id FROM edit_Dungeon ORDER BY Dungeon_Order LIMIT 1) AND Stage_Type = 1 AND Stage_Order >= 0 ORDER BY Stage_Order LIMIT 4) UNION ' +
    '(SELECT * FROM edit_Stage WHERE Stage_Type BETWEEN 3 AND 6 ORDER BY Stage_Type,Stage_Order)) AS firstStage');
    sqlClientAdmin.query(sql,function(error,resultEditAdmin){
        console.log('resultEditAdmin:',resultEditAdmin);
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            var sqls = [];
            var lastUserStage = {};
            var firstUserStage = null;
            resultEditAdmin.forEach(function(result){
                result.User_Id = userId;
                if(result.Stage_Type >=2 && result.Stage_Type <=6){
                    result.Clear_Star = 0;
                }
                else
                {
                    lastUserStage = result;
                    result.Clear_Star = 3;
                }
                result.Clear_Date = new Date();
                result.Create_Date = new Date();
                var sql =  new sqlCommand('INSERT INTO User_Dungeon (User_Id,Dungeon_Id,Stage_Id,Clear_Star,' +
                        'Clear_Date,Create_Date,Stage_Order,PVE_Type,Attack_Times_Limit) ' +
                    'SELECT ?,?,?,?,?,?,?,?,? FROM dual WHERE not exists(SELECT User_Id FROM User_Dungeon' +
                        ' WHERE User_Id=? AND Stage_Id = ?)',
                [result.User_Id,result.Dungeon_Id,result.Stage_Id,result.Clear_Star,result.Clear_Date,
                result.Create_Date,result.Stage_Order,result.Stage_Type,result.Attack_Times_Limit,result.User_Id,
                    result.Stage_Id]);
                sqls.push(sql);
            });
            sqlClient.transaction(sqls,function(error,resultsqls){
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    //console.log('sqlslog:',sqls,'   results:',resultsqls);
                    if(lastUserStage.Stage_Type <=2){
                        dungeon.getNextDungeon(lastUserStage.User_Id,lastUserStage.Stage_Id,lastUserStage.Dungeon_Id,1,
                            function(error,resultNex){
                                if(error!=null){
                                    console.log('DungeonInit:',error);
                                    callback(error,null);
                                }
                                else
                                {
                                    dungeon.getUserDungeonByUserId(userId,function(error,results){
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
                            })
                    }
                    else
                    {
                        dungeon.getUserDungeonByUserId(userId,function(error,results){
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

                }
            })
        }
    })
}

dungeon.addUserFight =  function(model,callback){
    console.log("addUserFightmodel:");
    console.log(model);
    var sqlFinishErrorFight = new sqlCommand('UPDATE Today_Fighting SET Fight_Status = ? WHERE User_Id = ? ' +
        'AND Fight_Status <> 2 AND Fight_Status <> 6',[gameEnum.FightStatus.Cancel,model.User_Id]);//gameEnum.FightStatus.Start
    sqlClient.update(sqlFinishErrorFight,function(error,resultFinishError){
        if(error!=null){
            console.log(error);
            callback(code.DB.UPDATE_DATA_ERROR,null);
        }
        else
        {
            var sql =  new sqlCommand('INSERT INTO Today_Fighting (User_Id,Start_Date,Loot_List,Dungeon_Id,' +
                'Fight_Status,Last_Update_Date,Stage_Id,Hero_List,Stage_Type) SELECT ?,?,?,?,?,?,?,?,? FROM dual ',
                [model.User_Id,model.Create_Date,model.Loot_List,model.Dungeon_Id,
                model.Fight_Status,model.Create_Date,model.Stage_Id,model.Hero_List,model.PVE_Type]);
            sqlClient.insert(sql,function(error,resultAddFight){
                console.log("addFight");
                if(error!=null){
                    console.log(error);
                    callback(code.DB.INSERT_DATA_ERROR,null);
                }
                else
                {
                    var sql1 =  new sqlCommand('SELECT * FROM Today_Fighting WHERE User_Id = ? AND Fight_Status = ?',
                        [model.User_Id,model.Fight_Status]);
                    sqlClient.query(sql1,function(error,results){
                        if(error!=null){
                            console.log(error);
                            callback(code.DB.SELECT_DATA_ERROR,null);
                        }
                        else
                        {
                            console.log(results);
                            callback(null,results);
                        }
                    })
                }
            })
        }
    })

};

dungeon.getNextDungeon =  function(User_Id,Stage_Id,Dungeon_Id,Stage_Type,callback){
    console.log(Stage_Type);
    var sql = new sqlCommand('SELECT * FROM (SELECT eS.*,eD.Dungeon_Order AS Dungeon_Order FROM edit_Stage AS eS ' +
    'JOIN edit_Dungeon AS eD ON eS.Dungeon_Id = eD.Dungeon_Id WHERE Stage_Order >=(SELECT Stage_Order ' +
    'FROM edit_Stage WHERE Stage_Id = ? LIMIT 1) AND eS.Dungeon_Id=? AND Stage_Type = ? union ' +
    'SELECT eS.*,eD.Dungeon_Order AS Dungeon_Order FROM edit_Stage AS eS JOIN edit_Dungeon AS eD ' +
    'ON eS.Dungeon_Id = eD.Dungeon_Id WHERE Dungeon_Order > (SELECT Dungeon_Order FROM edit_Dungeon WHERE Dungeon_Id=?) ' +
    ' AND Stage_Type = ?) AS All_Stage ORDER BY Dungeon_Order,Stage_Order LIMIT 2',
        [Stage_Id,Dungeon_Id,Stage_Type,Dungeon_Id,Stage_Type]);
    sqlClientAdmin.query(sql,function(error,resultsEditStage){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else {
            if (resultsEditStage.length == 2) {
                var next_StageModel = resultsEditStage[1];
                next_StageModel.User_Id = User_Id;
                next_StageModel.Clear_Star = 0;
                next_StageModel.Clear_Date = '';
                next_StageModel.Create_Date = new Date();
                console.log("next_StageModel------------");
                console.log(next_StageModel);
                var sql = new sqlCommand('INSERT INTO User_Dungeon (User_Id,Dungeon_Id,Stage_Id,Clear_Star,' +
                        'Clear_Date,Create_Date,Stage_Order,PVE_Type,Attack_Times_Limit) ' +
                        'SELECT ?,?,?,?,?,?,?,?,? FROM dual WHERE not exists(SELECT User_Id FROM User_Dungeon WHERE ' +
                        'User_Id = ? AND Stage_Id = ?)',
                    [next_StageModel.User_Id, next_StageModel.Dungeon_Id, next_StageModel.Stage_Id,next_StageModel.Clear_Star,
                        next_StageModel.Clear_Date, next_StageModel.Create_Date,next_StageModel.Stage_Order, next_StageModel.Stage_Type,
                        next_StageModel.Attack_Times_Limit,next_StageModel.User_Id, next_StageModel.Stage_Id]);
                sql.after = function(result,share) {
                    console.log('after result');
                    console.log(result.insertId);
                    next_StageModel.User_dungeon_Id = result.insertId;
                }
                sqlClient.insert(sql, function (error, result) {
                    if (error != null) {
                        console.log(error);
                        callback(code.DB.INSERT_DATA_ERROR, null);
                    }
                    else {
                        callback(null, next_StageModel);
                    }
                })
            }
            else if(resultsEditStage.length == 1){
                callback(null, null);
            }
            else
            {
                callback(code.DB.GET_DATA_ERROR,[]);
            }

        }
    })


}

dungeon.getFightById = function(fight_Id,callback){
    var sql = new sqlCommand('SELECT * FROM Today_Fighting WHERE Fight_Id = ?',[fight_Id]);
    console.log(fight_Id);
    sqlClient.query(sql,function(error,resultsFight){
        if(error!=null){
            console.log(error);
            callback(code.DB.SELECT_DATA_ERROR,null);
        }
        else
        {
            console.log(resultsFight[0]);
            var sql =  new sqlCommand('SELECT * FROM edit_Stage WHERE Stage_Id = ?',[resultsFight[0].Stage_Id]);
            sqlClientAdmin.query(sql,function(error,resultsStage){
                if(error!=null){
                    console.log(error);
                    callback(code.DB.SELECT_DATA_ERROR,null);
                }
                else
                {
                    var resultback = resultsFight[0];
                    resultback.Stamina_Expend = resultsStage[0].Stamina_Expend;
                    callback(null,[resultback]);
                }
            });
        }
    })
}


dungeon.updateUserFight =  function(model,callback){
    console.log('model:',model);
    var sql = new sqlCommand('UPDATE Today_Fighting SET User_Id = ?,Start_Date = ?,Loot_List = ?,Dungeon_Id = ?,' +
        'Fight_Status = ?,Last_Update_Date = ?,Stage_Id = ?,Hero_List = ? WHERE Fight_Id = ?',[model.User_Id,
    model.Start_Date,JSON.stringify(model.Loot_List),model.Dungeon_Id,model.Fight_Status,model.Last_Update_Date,model.Stage_Id,
    model.Hero_List,model.Fight_Id]);
    console.log('sql:',sql);
    sqlClient.update(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.UPDATE_DATA_ERROR,null);
        }
        else
        {
            callback(null,null);
        }
    })
}

dungeon.updateUserDungeon= function(model,callback){
    console.log("model");
    console.log(model);
    var sql = new sqlCommand('UPDATE User_Dungeon SET User_Id = ?,Dungeon_Id = ?,Stage_Id = ?,Clear_Star = ?,' +
        'Clear_Date = ? ,Dungeon_Order = ?,Stage_Order = ?,PVE_Type = ? ,Purchase_Times = ? WHERE User_Dungeon_Id = ?'
        ,[model.User_Id,model.Dungeon_Id,model.Stage_Id,model.Clear_Star,model.Clear_Date,
    model.Dungeon_Order,model.Stage_Order,model.PVE_Type,model.Purchase_Times,model.User_Dungeon_Id]);
    sqlClient.update(sql,function(error,result){
        console.log(error);
        if (error!=null){
            console.log(error);
            callback(code.DB.UPDATE_DATA_ERROR,null);
        }
        else
        {
            console.log(result);
            callback(null,null);
        }
    })
}


dungeon.getTodayUserFightByStageId = function(userId,stageId,callback){
    var sql = new sqlCommand('SELECT * FROM Today_Fighting WHERE User_Id = ? AND Stage_Id = ? AND Fight_Status =2',
        [userId,stageId]);
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            callback(null,results);
        }
    })
}
dungeon.getTodayUserFight = function(userId,callback){
    var sql = new sqlCommand('SELECT * FROM Today_Fighting WHERE User_Id = ? AND Fight_Status =2',[userId]);
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            callback(null,results);
        }
    })
}

dungeon.getUnfinishedPVE = function(userId,callback){
    var sql = new sqlCommand('SELECT * FROM (SELECT * FROM Today_Fighting WHERE User_Id = ? AND Fight_Status = 1 ' +
    'AND Stage_Type <= 2 UNION SELECT * FROM All_Fighting_History WHERE User_Id = ? AND Stage_Type <= 2 ' +
    'AND Fight_Status = 1) All_Fight ORDER BY All_Fight.Start_Date DESC',[userId,userId]);
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            callback(null,results);
        }
    })
}

dungeon.getUnfinishedTreasureHouse = function(userId,callback){
    var sql = new sqlCommand('SELECT * FROM (SELECT * FROM Today_Fighting WHERE User_Id = ? AND Fight_Status = 1 ' +
    'AND (Stage_Type BETWEEN 3 AND 6) UNION SELECT * FROM All_Fighting_History WHERE User_Id = ? ' +
    'AND (Stage_Type BETWEEN 3 AND 6) AND Fight_Status = 1) All_Fight ORDER BY All_Fight.Start_Date DESC',[userId,userId]);
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            callback(null,results);
        }
    })
}

