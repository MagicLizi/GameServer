/**
 * Created by David_shen on 1/30/15.
 */
var code = require('../../../config/code');
var sqlClient = require('../../dao/sqlClient').admin;
var sqlCommand = require('../../dao/sqlCommand');
var logger = require('log4js').getLogger("db");
var task = module.exports;

task.getAll=function(callback){
    var sql =  new sqlCommand('SELECT * FROM edit_task ORDER BY Order_Id');
    sqlClient.query(sql,function(error,resultLotteryPool){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            callback(null,resultLotteryPool);
        }
    })
};

task.add =  function(model,callback){
    var sql =  new sqlCommand('INSERT INTO edit_task(Order_Id,Name,Type,Circul_Open_Time,Circul_Over_Time,Circul_Show_Time,' +
        'Des,Pre_Task_Id,Open_Lvl,Open_Time,Over_Time,State,Targets,Rewards,Pictures,Task_Go_Config,Create_Date,' +
        'Stage_Id,Param_X,Param_Y,Param_Z)' +
        'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[model.Order_Id,model.Name,model.Type,model.Circul_Open_Time,model.Circul_Over_Time,
        model.Circul_Show_Time,model.Des,model.Pre_Task_Id,model.Open_Lvl,model.Open_Time,model.Over_Time,model.State,
    model.Targets,model.Rewards,model.Pictures,model.Task_Go_Config,model.Create_Date,model.Stage_Id,model.Param_X,model.Param_Y,model.Param_Z]);
    sqlClient.insert(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.INSERT_DATA_ERROR,null);
        }
        else
        {
            callback(null,results);
        }
    })
};

task.update = function(model,callback){
    var sql = new sqlCommand('UPDATE edit_task SET Order_Id = ?,' +
        'Name = ?,Type = ?,Circul_Open_Time = ?,Circul_Over_Time = ?,Circul_Show_Time = ?,Des = ?,' +
            'Pre_Task_Id = ?,Open_Lvl = ?,Open_Time = ?,Over_Time = ?,State = ?,Targets = ?,' +
            'Rewards = ?,Pictures = ?,Task_Go_Config = ?,Stage_Id = ?,Param_X = ?,Param_Y= ?,Param_Z= ? WHERE Task_Id = ?',
        [model.Order_Id,model.Name,model.Type,model.Circul_Open_Time,model.Circul_Over_Time,
            model.Circul_Show_Time,model.Des,model.Pre_Task_Id,model.Open_Lvl,model.Open_Time,model.Over_Time,model.State,
            model.Targets,model.Rewards,model.Pictures,model.Task_Go_Config,model.Stage_Id,model.Param_X,model.Param_Y,model.Param_Z,model.Task_Id]);

    console.log(sql);
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.UPDATE_DATA_ERROR,null);
        }
        else
        {
            callback(null,results);
        }
    })
};

task.getTaskById = function(task_Id,callback){
    var sql = new sqlCommand('SELECT * FROM edit_task WHERE Task_Id = ?',[task_Id]);
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            callback(null,results);
        }
    });
};