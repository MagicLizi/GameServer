/**
 * Created by peihengyang on 15/3/10.
 */
var code = require('../../../ServerConfigs/code');
var assert = require('assert');
var gameEnum =  require('../../enum');
var sqlClient = require('../../../Util/dao/sqlClient').Game;
var sqlClientAdmin = require('../../../Util/dao/sqlClient').Admin;
var sqlCommand = require('../../../Util/dao/sqlCommand');
var rank = module.exports;

rank.addUserRank =  function(model,callback){
    console.log(model);
    var sql =  new sqlCommand('INSERT INTO Pvp_Rank ( Rank_Num,User_Id,Pre_Rank_Num,Pre_User_Lvl,Win_Times,Update_Date) ' +
    '(SELECT (CASE(ISNULL(MAX(Rank_Num))) WHEN TRUE THEN 0 ELSE MAX(Rank_Num) END )+1,?,?,?,?,? FROM Pvp_Rank)',[model.User_Id,model.Pre_Rank_Num,model.Pre_User_Lvl,
        model.Win_Times,model.Update_Date]);
    sqlClient.insert(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(code.DB.INSERT_DATA_ERROR,null);
        }
        else
        {
            callback(null,result);
        }
    })
}

rank.updateUserRank =  function(model,callback){
    console.log(model);
    var sql =  new sqlCommand('UPDATE Pvp_Rank SET Rank_Num=?,User_Id=?,Pre_Rank_Num=?,Pre_User_Lvl=?,' +
    'Win_Times=?,Update_Date=?  WHERE Rank_Id = ?',[model.Rank_Num,model.User_Id,model.Pre_Rank_Num,model.Pre_User_Lvl,
        model.Win_Times,model.Update_Date,model.Rank_Id]);
    sqlClient.update(sql,function(error,result){
        if(error!=null){
            console.log("aaaaaa");
            console.log(error);
            callback(code.DB.UPDATE_DATA_ERROR,null);
        }
        else
        {
            callback(null,result);
        }
    })
}

rank.PVPMatch =  function(user_Id,callback){
    var sql =  new sqlCommand('CALL PVP_Match (?);',[user_Id]);
    sqlClient.query(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_PROC_ERROR,null);
        }
        else
        {
            console.log(result);
            callback(null,result);
        }
    })
};

rank.AddPVPFight =  function(model,callback){
    console.log("AddPVPFightmodel");
    console.log(model);
    var sql = new sqlCommand('INSERT INTO PVP_Fighting (User_Id,Competitor_Id,Hero_List,Fight_Status,Last_Update_Date,' +
    'Create_Date,Competitor_Lvl,User_Lvl) SELECT ?,?,?,?,?,?,(SELECT Troop_Lvl FROM User_troop WHERE User_Id = ? LIMIT 1),' +
    '(SELECT Troop_Lvl FROM User_troop WHERE User_Id = ? LIMIT 1) FROM dual WHERE not exists(SELECT User_Id FROM PVP_Fighting' +
    ' WHERE User_Id=? AND Competitor_Id = ? AND Fight_Status = ?)',[model.User_Id,model.Competitor_Id,model.Hero_List,
        model.Fight_Status,model.Last_Update_Date,model.Create_Date,model.Competitor_Id,model.User_Id,model.User_Id,
        model.Competitor_Id,model.Fight_Status]);
    sqlClient.insert(sql,function(error,result){
        console.log("AddPVPFight result");
        console.log(result);
        if(error!=null){
            console.log(error);
            callback(code.DB.INSERT_DATA_ERROR,null);
        }
        else
        {
            var sql =  new sqlCommand('SELECT * FROM PVP_Fighting WHERE User_Id = ? AND Fight_Status = ?;',
                [model.User_Id,model.Fight_Status]);
            sqlClient.query(sql,function(error,resultPVPFight){
                if(error!=null){
                    console.log(error);
                    callback(code.DB.EXEC_QUERY_ERROR,null);
                }
                else
                {
                    console.log(resultPVPFight);
                    callback(null,resultPVPFight[0]);
                }
            });
        }
    })
}
rank.updateUserPVPStatus = function(user_Id,Fight_Status,callback){
    var sql = new sqlCommand('UPDATE PVP_Fighting SET Fight_Status = ? WHERE User_Id = ? AND Fight_status = 1;',
        [Fight_Status,user_Id]);
    sqlClient.update(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(code.DB.UPDATE_DATA_ERROR,null);
        }
        else
        {
            console.log(result);
            callback(null,result);
        }
    })
}
rank.updatePVPFight =  function(model,callback){
    console.log(model);
    var sql = new sqlCommand('UPDATE PVP_Fighting SET User_Id = ?,Competitor_Id = ?,Hero_List = ?,Fight_Status = ?,' +
    'Last_Update_Date = ?,Create_Date = ?,Competitor_Lvl = ?,Is_Reset = ?,Rank_Change = ?,Replay_Url = ? ' +
    'WHERE PVP_Fighting_Id = ?;',[model.User_Id,model.Competitor_Id,model.Hero_List,model.Fight_Status,
        model.Last_Update_Date,model.Create_Date,model.Competitor_Lvl,model.Is_Reset,model.Rank_Change,
        model.Replay_Url,model.PVP_Fighting_Id]);
    sqlClient.update(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(code.DB.UPDATE_DATA_ERROR,null);
        }
        else
        {
            console.log(result);
            callback(null,result);
        }
    })
}
rank.getPVPFightingById = function(pvp_Fighting_Id,callback){
    var sql = new sqlCommand('SELECT * FROM PVP_Fighting Where PVP_Fighting_Id = ?',[pvp_Fighting_Id]);
    sqlClient.query(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            console.log(result);
            callback(null,result[0]);

        }
    });
}


rank.getUserPVPTimes = function(user_Id,callback){
    //var FightTimes;
    var sql = new sqlCommand('SELECT * FROM PVP_Fighting Where User_Id = ? ORDER BY Last_Update_Date DESC',[user_Id]);
    sqlClient.query(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            var results = {};
            //if()
            if(result.length != 0){
                if(result[0].Is_Reset == 1){
                    results = {
                        PVPTimes:result.length,
                        LastPVPDate:'1970-01-01 00:00:00'
                    };
                }
                else
                {
                    results = {
                        PVPTimes:result.length,
                        LastPVPDate:result[0].Last_Update_Date
                    };
                }

            }
            else
            {
                results = {
                    PVPTimes:result.length,
                    LastPVPDate:'1970-01-01 00:00:00'
                };
            }
            results.result = result;
            callback(null,results);

        }
    });
}

rank.getUserRank = function(user_Id,callback){
    var sql = new sqlCommand('SELECT * FROM Pvp_Rank Where User_Id = ?',[user_Id]);
    sqlClient.query(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            console.log(result);
            callback(null,result[0]);

        }
    })
}

rank.getUserTopRank = function(user_Id,callback){
    var sql = new sqlCommand('SELECT * FROM User_Top_Rank Where User_Id = ?',[user_Id]);
    sqlClient.query(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            console.log(result);
            callback(null,result[0]);

        }
    })
}


rank.updateUserTopRank =  function(model,callback){
    console.log(model);
    var sql =  new sqlCommand('UPDATE User_Top_Rank SET Rank_Num=?,User_Id=?,Update_Date=?  WHERE User_Top_Rank_Id = ?',
        [model.Rank_Num,model.User_Id,model.Update_Date,model.User_Top_Rank_Id]);
    sqlClient.update(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(code.DB.UPDATE_DATA_ERROR,null);
        }
        else
        {
            callback(null,result);
        }
    })
}



rank.addUserTopRank =  function(userId,callback){
    console.log("addUserTopRank:",userId);
    var sql = new sqlCommand('SELECT * FROM Pvp_Rank WHERE User_Id = ?',userId);
    sqlClient.query(sql,function(error,resultUserRank){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            console.log("addUserTopRankModel:",resultUserRank);
            var model = resultUserRank[0];
            var nowTime =  new Date();
            var sql =  new sqlCommand('INSERT INTO User_Top_Rank ( Rank_Num,User_Id,Update_Date,Create_Date) ' +
            'VALUE (?,?,?,?)',[model.Rank_Num,model.User_Id,nowTime,nowTime]);
            sqlClient.insert(sql,function(error,result){
                if(error!=null){
                    console.log(error);
                    callback(code.DB.INSERT_DATA_ERROR,null);
                }
                else
                {
                    callback(null,result);
                }
            })
        }
    })

}

rank.getUserLastNPVPRecord =  function(user_Id,N,callback){
    console.log(user_Id);
    console.log(N);
    var sql = new sqlCommand(' SELECT * FROM ((SELECT PF.PVP_Fighting_Id AS PVP_Fighting_Id,PF.User_Id,UtU.Troop_Avatar_Id AS User_Avatar_Id,UtU.Troop_Avatar_Frame_Id AS User_Avatar_Frame_Id,' +
    'UtU.Troop_Name AS User_Troop_Name,PF.Competitor_Id,UtC.Troop_Avatar_Id AS Competitor_Avatar_Id,' +
    'UtC.Troop_Avatar_Frame_Id AS Competitor_Avatar_Frame_Id,UtC.Troop_Name AS Competitor_Troop_Name,PF.Hero_List,' +
    'PF.Fight_Status,PF.Last_Update_Date,PF.Create_Date,PF.Competitor_Lvl,PF.User_Lvl,PF.Rank_Change,PF.Replay_Url FROM PVP_Fighting AS PF ' +
    'JOIN User_troop AS UtU ON PF.User_Id = UtU.User_Id JOIN User_troop AS UtC ON PF.Competitor_Id = UtC.User_Id ' +
    'WHERE (PF.Fight_Status = 2 OR PF.Fight_Status = 5) AND(PF.User_Id = ? OR PF.Competitor_Id = ?) ' +
    'ORDER BY PF.Last_Update_Date DESC  LIMIT ?) UNION (SELECT PF.PVP_Fighting_Id AS PVP_Fighting_Id,PF.User_Id,UtU.Troop_Avatar_Id AS User_Avatar_Id,UtU.Troop_Avatar_Frame_Id AS User_Avatar_Frame_Id,' +
    'UtU.Troop_Name AS User_Troop_Name,PF.Competitor_Id,UtC.Troop_Avatar_Id AS Competitor_Avatar_Id,' +
    'UtC.Troop_Avatar_Frame_Id AS Competitor_Avatar_Frame_Id,UtC.Troop_Name AS Competitor_Troop_Name,PF.Hero_List,' +
    'PF.Fight_Status,PF.Last_Update_Date,PF.Create_Date,PF.Competitor_Lvl,PF.User_Lvl,PF.Rank_Change,PF.Replay_Url FROM All_PVP_Fighting_History AS PF ' +
    'JOIN User_troop AS UtU ON PF.User_Id = UtU.User_Id JOIN User_troop AS UtC ON PF.Competitor_Id = UtC.User_Id ' +
    'WHERE (PF.Fight_Status = 2 OR PF.Fight_Status = 5) AND(PF.User_Id = ? OR PF.Competitor_Id = ?)' +
    'ORDER BY PF.Last_Update_Date DESC  LIMIT ?)) AS All_PVP ORDER BY Last_Update_Date DESC LIMIT ? ',[user_Id,user_Id,N,user_Id,user_Id,N,N]);
    sqlClient.query(sql,function(error,resultsTodayPVP){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            console.log("resultsTodayPVP.length");
            console.log(resultsTodayPVP.length);
            callback(null,resultsTodayPVP);
            //if(resultsTodayPVP.length < N){
            //    var sql = new sqlCommand('(SELECT PF.PVP_Fighting_Id AS PVP_Fighting_Id,PF.User_Id,UtU.Troop_Avatar_Id AS User_Avatar_Id,UtU.Troop_Avatar_Frame_Id AS User_Avatar_Frame_Id,' +
            //        'UtU.Troop_Name AS User_Troop_Name,PF.Competitor_Id,UtC.Troop_Avatar_Id AS Competitor_Avatar_Id,' +
            //        'UtC.Troop_Avatar_Frame_Id AS Competitor_Avatar_Frame_Id,UtC.Troop_Name AS Competitor_Troop_Name,PF.Hero_List,' +
            //        'PF.Fight_Status,PF.Last_Update_Date,PF.Create_Date,PF.Competitor_Lvl,PF.User_Lvl,PF.Rank_Change,PF.Replay_Url FROM All_PVP_Fighting_History AS PF ' +
            //        'JOIN User_troop AS UtU ON PF.User_Id = UtU.User_Id JOIN User_troop AS UtC ON PF.Competitor_Id = UtC.User_Id ' +
            //        'WHERE (PF.Fight_Status = 2 OR PF.Fight_Status = 5) AND(PF.User_Id = ? OR PF.Competitor_Id = ?) ' +
            //        'ORDER BY PF.Last_Update_Date DESC  LIMIT ?)',
            //        [user_Id,user_Id,N-resultsTodayPVP.length]);
            //    sqlClient.query(sql,function(error,resultsAllPVP){
            //        if(error!=null){
            //            console.log(error);
            //            callback(code.DB.EXEC_QUERY_ERROR,null);
            //        }
            //        else
            //        {
            //            resultsTodayPVP = resultsTodayPVP.concat(resultsAllPVP);
            //            callback(null,resultsTodayPVP);
            //        }
            //    })
            //}
            //else
            //{
            //    callback(null,resultsTodayPVP);
            //}
        }
    })
}

rank.getAllRank = function(callback){
    var sql = new sqlCommand('SELECT PR.*,Ut.Troop_Lvl,Ut.Troop_Name,Ut.Troop_Avatar_Id,Ut.Troop_Avatar_Frame_Id ' +
    'FROM Pvp_Rank AS PR JOIN User_troop AS Ut ON PR.User_Id = Ut.User_Id ORDER BY Rank_Num LIMIT 50');
    sqlClient.query(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            //console.log(result);
            callback(null,result);

        }
    })
}
rank.getAllPreRank = function(callback){
    var sql = new sqlCommand('SELECT APR.*,Ut.Troop_Lvl,Ut.Troop_Name,Ut.Troop_Avatar_Id,Ut.Troop_Avatar_Frame_Id  ' +
    'FROM All_Pvp_Rank  AS APR JOIN User_troop AS Ut ON APR.User_Id = Ut.User_Id ' +
    'WHERE APR.Update_Times = (SELECT MAX(Update_Times) FROM All_Pvp_Rank) ORDER BY APR.Rank_Num LIMIT 50;');
    sqlClient.query(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            //console.log(result);
            callback(null,result);

        }
    })
}
//'376','100001343','3','1','55','lucas310','63','198','1','2015-05-26 14:07:13','10','2015-05-26 14:07:13'

rank.addUserStore = function(models,Refresh_Times,Refresh_Date,Store_Id,callback){
    console.log("models[0]",Refresh_Times);
    console.log(models[0]);
    var sql = new sqlCommand('DELETE FROM User_Store WHERE User_Id = ? AND Store_Id = ?',[models[0].User_Id,Store_Id]);
    sqlClient.delete(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(code.DB.DELETE_DATA_ERROR,null);
        }
        else
        {
            var sqls = [];
            models.forEach(function(model){
                var sql = new sqlCommand('INSERT INTO User_Store (User_Id,Store_Id,Goods_Id,Refresh_Times,Refresh_Date,Goods_Amount)' +
                'VALUE (?,?,?,?,?,?)',[model.User_Id,Store_Id,model.Item_Id,Refresh_Times,Refresh_Date,
                    model.Item_Amount]);
                sqls.push(sql);
            })

            sqlClient.transaction(sqls,function(error,result){
                if(error!=null){
                    console.log(error);
                    callback(code.DB.INSERT_DATA_ERROR,null);
                }
                else
                {
                    console.log(result);
                    callback(null,result);
                }
            })
        }
    })

}

rank.getStoreByUserId = function(userId,callback){
    //console.log(dataserver);
    var sql = new sqlCommand('SELECT US.*,eG.Goods_Order AS Goods_Order FROM User_Store AS US JOIN admin_' +
    process.argv[3]+'.edit_Goods AS eG ON US.Goods_Id = eG.Goods_Id WHERE User_Id = ? ORDER BY Goods_Order;',userId);
    sqlClient.query(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            //console.log(result);
            callback(null,result);

        }
    })
}


rank.getStoreByUserIdStoreId = function(userId,storeId,callback){
    //console.log(dataserver);
    var sql = new sqlCommand('SELECT US.*,eG.Goods_Order AS Goods_Order FROM User_Store AS US JOIN admin_' +
    process.argv[3]+'.edit_Goods AS eG ON US.Goods_Id = eG.Goods_Id WHERE US.User_Id = ? AND US.Store_Id = ? ' +
    'ORDER BY Goods_Order;',[userId,storeId]);
    console.log('StoreSQL:',sql);
    sqlClient.query(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            //console.log(result);
            callback(null,result);

        }
    })
}


rank.getUserGoodsByID = function(userId,userStoreId,callback){
    var sql = new sqlCommand('SELECT * FROM User_Store WHERE User_Store_Id = ?',[userStoreId]);
    sqlClient.query(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            callback(null,result[0]);
        }
    })
}

rank.updateUserGoods = function(model,callback){
    console.log(model);
    var sql = new sqlCommand('UPDATE User_Store SET User_Id = ?,Store_Id = ?,Goods_Id = ?,Refresh_Times = ?' +
    ',Refresh_Date = ?,Goods_Amount = ? WHERE User_Store_Id = ? ',[model.User_Id,model.Store_Id,model.Goods_Id,
        model.Refresh_Times,model.Refresh_Date,model.Goods_Amount,model.User_Store_ID]);
    sqlClient.query(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            callback(null,result[0]);
        }
    })
}

rank.finishUserTimeOutPVP =  function(user_Id,callback){
    var sql =  new sqlCommand('UPDATE PVP_Fighting SET Fight_Status = 5 WHERE User_Id = ? ' +
    'AND ((Create_Date + INTERVAL 20 MINUTE) <= NOW()) AND Fight_Status = 1;',user_Id);
    sqlClient.update(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(code.DB.UPDATE_DATA_ERROR,null);
        }
        else
        {
            callback(null,result);
        }
    })
}

rank.finishAllTimeOutPVP =  function(callback){
    var sql =  new sqlCommand('UPDATE PVP_Fighting SET Fight_Status = 5 ' +
    'WHERE  ((Create_Date + INTERVAL 20 MINUTE) <= NOW()) AND Fight_Status = 1;');
    sqlClient.update(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(code.DB.UPDATE_DATA_ERROR,null);
        }
        else
        {
            callback(null,result);
        }
    })
}

rank.getUserUnfinishPVP =  function(user_Id,callback){
    var sql =  new sqlCommand('SELECT * FROM PVP_Fighting WHERE Fight_Status = 1 AND User_Id = ?',user_Id);
    sqlClient.update(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.UPDATE_DATA_ERROR,null);
        }
        else
        {
            callback(null,results);
        }
    })
}

rank.getUserPVPResetTimes =  function(user_Id,callback){
    var sql =  new sqlCommand('SELECT * FROM User_PVP_Reset_Times WHERE User_Id = ?',user_Id);
    sqlClient.update(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.UPDATE_DATA_ERROR,null);
        }
        else
        {
            callback(null,results);
        }
    })
}

rank.addUserPVPResetTimes =  function(user_Id,callback){
    var sql =  new sqlCommand('INSERT INTO User_PVP_Reset_Times (User_Id,ResetTimes) VALUE (?,?)',[user_Id,0]);
    sqlClient.update(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.UPDATE_DATA_ERROR,null);
        }
        else
        {
            callback(null,results);
        }
    })
}

rank.getUserUnfinishDefendPVP =  function(user_Id,callback){
    var sql =  new sqlCommand('SELECT * FROM PVP_Fighting WHERE Fight_Status = 1 AND Competitor_Id = ?',user_Id);
    sqlClient.update(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.UPDATE_DATA_ERROR,null);
        }
        else
        {
            callback(null,results);
        }
    })
}

rank.resetPVPTimes =  function(user_Id,callback){
    var sql =  new sqlCommand('CALL resetPVPTimes (?)',user_Id);
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