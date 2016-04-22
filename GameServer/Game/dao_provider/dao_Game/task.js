/**
 * Created by David_shen on 2/5/15.
 */

var code = require('../../../ServerConfigs/code');
var gameCode = require('../../code');
var sqlClient = require('../../../Util/dao/sqlClient').Game;
var sqlCommand = require('../../../Util/dao/sqlCommand');
var task = module.exports;

task.getUserTaskInfo = function(User_Id,callback)
{
    var sql =  new sqlCommand('SELECT * FROM Task WHERE User_Id = ?',[User_Id]);
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.SELECT_DATA_ERROR,null);
        }
        else
        {
            callback(null,results);
        }
    });
};

task.getVipTaskByListID = function(User_Id,ListID,vipTaskType,callback)
{
    var sql =  new sqlCommand('SELECT * FROM Task WHERE User_Id = ? And CurCount = ? And Is_Circle = ?)',[User_Id,ListID,vipTaskType]);
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.SELECT_DATA_ERROR,null);
        }
        else
        {
            callback(null,results);
        }
    });
};


task.getTaskInfoByStateOrTaskType = function(User_Id,State,TaskType,callback)
{
    var sql =  new sqlCommand('SELECT * FROM Task WHERE User_Id = ? And (State = ? Or Is_Circle = ?)',[User_Id,State,TaskType]);
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.SELECT_DATA_ERROR,null);
        }
        else
        {
            callback(null,results);
        }
    });
};


//task.getTaskInfoByState = function(User_Id,State,callback)
//{
//    var sql =  new sqlCommand('SELECT * FROM Task WHERE User_Id = ? And State = ?',[User_Id,State]);
//    sqlClient.query(sql,function(error,results){
//        if(error!=null){
//            console.log(error);
//            callback(code.DB.SELECT_DATA_ERROR,null);
//        }
//        else
//        {
//            callback(null,results);
//        }
//    });
//};


task.updateTaskByID = function(TaskModel,needState,callback)
{
    var sql = new sqlCommand('UPDATE Task SET State = ?,CurCount =?,LastGetTime =?' +
        ' WHERE User_Id = ? And Task_Id = ? And State <> ?',[TaskModel.State,TaskModel.CurCount,TaskModel.LastGetTime,TaskModel.User_Id,TaskModel.Task_Id,needState]);
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.SELECT_DATA_ERROR,null);
        }
        else
        {
            console.log('updateTaskResult:',results);
           if(results.affectedRows==0)
           {
               callback(gameCode.UserTask.Has_Get_Reward,null);
           }
           else
           {
               callback(null,results[0]);
           }
        }
    });
};

task.updateTaskStateBatch = function(task_List,callback)
{
    var sqls = [];
    task_List.forEach(function(TaskModel){
        var sql = new sqlCommand('UPDATE Task SET State = ?' +
            ' WHERE User_Id = ? And Task_Id = ?',[TaskModel.State,TaskModel.User_Id,TaskModel.Task_Id]);
        sqls.push(sql);
    });
    console.log("updateTaskStateBatch");
    console.log(sqls);
    if(sqls.length!=0){
        sqlClient.transaction(sqls, function(error, result){
            if(error != null)
            {
                console.log(error);
                callback(code.DB.INSERT_DATA_ERROR, error);
            }
            else
            {
                callback(null,null);
            }
        });
    }
    else
    {
        callback(null,null);
    }
};


task.updateTaskBatch = function(task_List,callback)
{
    var sqls = [];
    task_List.forEach(function(TaskModel){
        console.log("update Task batch");
        console.log(TaskModel);
        var sql = new sqlCommand('UPDATE Task SET State = ?,CurCount =?,TargetCount = ?,LastGetTime =?' +
            ' WHERE User_Id = ? And Task_Id = ?',[TaskModel.State,TaskModel.CurCount,TaskModel.TargetCount,TaskModel.LastGetTime,TaskModel.User_Id,TaskModel.Task_Id]);
        sqls.push(sql);
    });
    if(sqls.length!=0){
        sqlClient.transaction(sqls, function(error, result){
            if(error != null)
            {
                console.log(error);
                callback(code.DB.INSERT_DATA_ERROR, error);
            }
            else
            {
                callback(null,null);
            }
        });
    }
    else
    {
        callback(null,null);
    }
};

task.addTaskBatch = function(task_List,callback)
{
    if(task_List.length == 0)
    {
       return callback(null,null);
    }
    var sqls = [];
    console.log("task_List");
    console.log(task_List);
    task_List.forEach(function(model){
        console.log(model);
        var sql = new sqlCommand('INSERT INTO Task(User_Id,Task_Id,State,Task_Target_Type,CurCount,TargetCount,Open_Time,Over_Time,Is_Circle,LastGetTime,Stage_Id)' +
            'Select ?,?,?,?,?,?,?,?,?,?,? From dual WHERE not exists(SELECT User_Id From Task WHERE User_Id =? AND Task_Id = ?)'
            ,[model.User_Id,model.Task_Id,model.State,model.Task_Target_Type,model.CurCount,model.TargetCount,model.Open_Time,model.Over_Time,model.Is_Circle,model.LastGetTime,model.Stage_Id,model.User_Id,model.Task_Id]);
        sqls.push(sql);
    });
    if(sqls.length!=0){
        sqlClient.transaction(sqls, function(error, result){
            if(error != null)
            {
                console.log(error);
                callback(code.DB.INSERT_DATA_ERROR, error);
            }
            else
            {
                callback(null,null);
            }
        });
    }
    else
    {
        callback(null,null);
    }
};


task.addTask = function(model,callback)
{
    var sql = new sqlCommand('INSERT INTO Task(User_Id,Task_Id,State,Task_Target_Type,CurCount,TargetCount,Open_Time,Over_Time,Is_Circle,Stage_Id)' +
        'VALUES(?,?,?,?,?,?,?,?,?,?)',[model.User_Id,model.Task_Id,model.State,mode.Task_Target_Type,model.CurCount,model.TargetCount,model.Open_Time,model.Over_Time,model.Is_Circle,model.Stage_Id]);
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.SELECT_DATA_ERROR,null);
        }
        else
        {
            callback(null,results);
        }
    });
};

task.getTaskByID = function(User_Id,Task_Id,callback)
{
    var sql = new sqlCommand('SELECT * FROM Task WHERE User_Id = ? And Task_Id = ?',[User_Id,Task_Id]);
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.SELECT_DATA_ERROR,null);
        }
        else
        {
            callback(null,results);
        }
    });
};

task.getTaskByTaskTypeAndNotState = function(User_Id,TaskType,State,callback)
{
    var sql = new sqlCommand('SELECT * FROM Task WHERE User_Id = ? And Is_Circle = ? And State != ?',[User_Id,TaskType,State]);
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.SELECT_DATA_ERROR,null);
        }
        else
        {
            callback(null,results);
        }
    });
};

