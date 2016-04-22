/**
 * Created by peihengyang on 15/3/25.
 */
var code = require('../../../config/code');
var sqlClient = require('../../dao/sqlClient').admin;
var sqlCommand = require('../../dao/sqlCommand');
var logger = require('log4js').getLogger("db");
var rank = module.exports;

rank.getAll = function(callback){
    var sql = new sqlCommand('SELECT eRR.*,eI.Item_Name AS Item_Name FROM edit_Rank_Rewards AS eRR JOIN edit_Items AS eI ON eRR.Item_Id = eI.Item_Id');
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


rank.getRewardsByType = function(Rewards_Type,callback){
    var sql = new sqlCommand('SELECT eRR.*,eI.Item_Name AS Item_Name FROM edit_Rank_Rewards AS eRR JOIN edit_Items AS eI ' +
    'ON eRR.Item_Id = eI.Item_Id WHERE eRR.Rewards_Type = ?',[Rewards_Type]);
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

rank.getRewardsById = function(rewardsId,callback){
    var sql = new sqlCommand('SELECT eRR.*,eI.Item_Name AS Item_Name FROM edit_Rank_Rewards AS eRR JOIN edit_Items AS eI ' +
    'ON eRR.Item_Id = eI.Item_Id WHERE eRR.Rewards_Id = ?',[rewardsId]);
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            callback(null,results[0]);
        }
    })
}

rank.addRewards =  function(model,callback){
    var sql = new sqlCommand('INSERT INTO edit_Rank_Rewards(Max_Rank,Min_Rank,Item_Id,Item_Amount,Create_Date,Enable,Rewards_Type) ' +
    'VALUES (?,?,?,?,?,?,?)',[model.Max_Rank,model.Min_Rank,model.Item_Id,model.Item_Amount,model.Create_Date,model.Enable,
    model.Rewards_Type]);
    sqlClient.insert(sql,function(error,resultsAddRewards){
        if(error!=null){
            console.log(error);
            callback(code.DB.INSERT_DATA_ERROR,null);
        }
        else
        {
            callback(null,resultsAddRewards);
        }
    })
}

rank.updateRewards =  function(model,callback){
    console.log(model);
    var sql = new sqlCommand('UPDATE edit_Rank_Rewards SET Max_Rank = ?,Min_Rank = ?,Item_Id = ?,Item_Amount = ?,' +
    'Create_Date = ?,Enable = ?,Rewards_Type = ? WHERE Rewards_Id = ?;',[model.Max_Rank,model.Min_Rank,model.Item_Id,
        model.Item_Amount,model.Create_Date,model.Enable,model.Rewards_Type,model.Rewards_Id]);
    sqlClient.update(sql,function(error,resultsAddRewards){
        if(error!=null){
            console.log(error);
            callback(code.DB.INSERT_DATA_ERROR,null);
        }
        else
        {
            callback(null,resultsAddRewards);
        }
    })
}