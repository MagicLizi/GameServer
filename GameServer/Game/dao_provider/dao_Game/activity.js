/**
 * Created by peihengyang on 15/10/29.
 */
var code = require('../../../ServerConfigs/code');
var gameEnum =  require('../../enum')
var sqlClient = require('../../../Util/dao/sqlClient').Game;
var sqlClientAdmin = require('../../../Util/dao/sqlClient').Admin;
var sqlCommand = require('../../../Util/dao/sqlCommand');
var activity = module.exports;

activity.getUserActivityByStatus = function(userId,activityStatus,callback){
    var sql = new sqlCommand('SELECT * FROM User_Activity WHERE User_Id = ? AND Status = ?'
        ,[userId,activityStatus]);
    sqlClient.query(sql,function(error,resultsUserActivity){
        if(error!=null){
            console.log('getUserActivityByStatus:',error);
            callback(error,null);
        }
        else
        {
            callback(null,resultsUserActivity);
        }
    });
}

activity.getTodayUserActivity = function(userId,callback){
    var sql = new sqlCommand('SELECT * FROM User_Activity WHERE User_Id = ? ' +
        'AND DATE(DATE_SUB(Create_Date,INTERVAL 4 HOUR)) = DATE(DATE_SUB(NOW(),INTERVAL 4 HOUR))'
        ,[userId]);
    sqlClient.query(sql,function(error,resultsUserActivity){
        if(error!=null){
            console.log('getUserActivityByStatus:',error);
            callback(error,null);
        }
        else
        {
            callback(null,resultsUserActivity);
        }
    });
}

activity.updateUserActivityStatus = function(model,callback){
    var sql = new sqlCommand('UPDATE User_Activity SET Status = ? WHERE User_Activity_Id = ?'
        ,[model.Status,model.User_Activity_Id]);
    sqlClient.query(sql,function(error,resultsUpdateActivity){
        if(error!=null){
            console.log('updateUserActivityStatus:',error);
            callback(error,null);
        }
        else
        {
            callback(null,resultsUpdateActivity);
        }
    });
}

activity.getNextActivityReward = function(userId,activityType,callback){
    var sql = new sqlCommand('CALL get_Next_Activity(?,?)',[userId,activityType]);
    console.log('sql:',sql);
    sqlClient.query(sql,function(error,resultGetNextActivity){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_PROC_ERROR,null);
        }
        else
        {
            callback(null,resultGetNextActivity);
        }

    })
}

activity.getUserActivityByType = function(userId,activityType,callback){
    var sql = new sqlCommand('SELECT * FROM User_Activity WHERE User_Id = ? AND Status = 1 AND Activity_Type = ?' +
        ' AND DATE(DATE_SUB(Create_Date,INTERVAL 4 HOUR)) = DATE(DATE_SUB(NOW(),INTERVAL 4 HOUR))'
        ,[userId,activityType]);
    console.log('sql:',sql);
    sqlClient.query(sql,function(error,resultsUserActivity){
        if(error!=null){
            console.log('getUserActivityByStatus:',error);
            callback(error,null);
        }
        else
        {
            callback(null,resultsUserActivity);
        }
    });
}