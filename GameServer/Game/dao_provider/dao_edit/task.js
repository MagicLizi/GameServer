/**
 * Created by David_shen on 2/9/15.
 */

var code = require('../../../Game/code');
var sqlClient = require('../../../Util/dao/sqlClient').Admin;
var sqlCommand = require('../../../Util/dao/sqlCommand');
var task = module.exports;

//task.getTaskInfoByPreTaskID = function(Pre_Task_Id,callback)
//{
//    var sql =  new sqlCommand('SELECT * FROM edit_task WHERE Pre_Task_Id = ?',[Pre_Task_Id]);
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

task.getTaskInfoByPreTaskIDBatch = function(task_id_ary,callback)
{
    var sqls = [];
    task_id_ary.forEach(function(task_id){
        console.log(task_id);
        var sql =  new sqlCommand('SELECT * FROM edit_task WHERE Pre_Task_Id = ?',[task_id]);
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
                callback(null,result);
            }
        });
    }
    else
    {
        callback(null,[]);
    }
};

task.getTaskByOrderIDBatch = function(order_id_ary,callback)
{
    var sql =  new sqlCommand('SELECT * FROM edit_task WHERE Order_Id in( '+order_id_ary+')');
console.log("getTask");
    console.log(sql);
        sqlClient.query(sql, function(error, result) {
            if (error != null) {
                console.log(error);
                callback(code.DB.EXEC_QUERY_ERROR, error);
            }
            else {
                callback(null, result);
            }
        })
};

task.getTaskInfoByTaskID = function(Task_Id,callback)
{
    var sql =  new sqlCommand('SELECT * FROM edit_task WHERE Task_Id = ?',[Task_Id]);
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

task.getTaskInfoByTaskOrderId = function(OrderID,callback)
{
    var sql =  new sqlCommand('SELECT * FROM edit_task WHERE Order_Id = ?',[OrderID]);
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

task.getVipTaskByLvl = function(vipLvl,vipTaskType,callback)
{
    var sql =  new sqlCommand('SELECT * FROM edit_task WHERE Open_Lvl <= ? And Type = ?',[vipLvl,vipTaskType]);
    console.log('sql:',sql);
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



task.getAllTaskByLvl = function(user_lvl,callback)
{
    var sql =  new sqlCommand('SELECT * FROM edit_task WHERE Open_Lvl <= ?',[user_lvl]);
    console.log('sql:',sql);
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
