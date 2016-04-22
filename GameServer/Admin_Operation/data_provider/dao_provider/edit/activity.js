/**
 * Created by peihengyang on 15/10/28.
 */
var code = require('../../../config/code');
var sqlClient = require('../../dao/sqlClient').admin;
var sqlCommand = require('../../dao/sqlCommand');
var logger = require('log4js').getLogger("db");
var editItemProvider = require('./item');
var activity = module.exports;

activity.getAll = function(callback){
    var sql = new sqlCommand('SELECT * FROM edit_Activity WHERE Enable = 1 ORDER BY Enable DESC,Activity_Type,' +
    'Reward_Order,Activity_Id ');
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            editItemProvider.getAll(function(error,resultsAllItem){
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    callback(null,{Activity:results,
                        items:resultsAllItem.Item});
                }
            });
        }
    })
}

activity.add =  function(model,callback){
    var sql = new sqlCommand('INSERT INTO edit_Activity (Activity_Type,Reward_Item_Id,Reward_Item_Amount,' +
    'Reward_Order,Create_Date,Enable,Double_VIP_Lvl) VALUES (?,?,?,?,?,?,?)',[model.Activity_Type,model.Reward_Item_Id,
        model.Reward_Item_Amount, model.Reward_Order,model.Create_Date,model.Enable,model.Double_VIP_Lvl]);
    sqlClient.insert(sql,function(error,resultsAdd){
        if(error!=null){
            console.log(error);
            callback(code.DB.INSERT_DATA_ERROR,null);
        }
        else
        {
            callback(null,resultsAdd);
        }
    })
}

activity.getActivityById =  function(activityId,callback){
    var sql = new sqlCommand('SELECT * FROM edit_Activity WHERE Activity_Id = ?',[activityId]);
    sqlClient.query(sql,function(error,resultActivity){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            callback(null,resultActivity[0]);
        }
    })
}


activity.update =  function(model,callback){
    var sql = new sqlCommand('UPDATE edit_Activity SET Activity_Type = ?,Reward_Item_Id = ?,' +
    'Reward_Item_Amount =?,Reward_Order = ?,Enable= ?,Double_VIP_Lvl = ? WHERE Activity_Id = ?',[model.Activity_Type,model.Reward_Item_Id,model.Reward_Item_Amount,
        model.Reward_Order,model.Enable,model.Double_VIP_Lvl,model.Activity_Id]);
    sqlClient.insert(sql,function(error,resultsAdd){
        if(error!=null){
            console.log(error);
            callback(code.DB.INSERT_DATA_ERROR,null);
        }
        else
        {
            callback(null,resultsAdd);
        }
    })
}