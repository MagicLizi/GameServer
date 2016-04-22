/**
 * Created by steve on 15/11/19.
 */
var code = require('../../../ServerConfigs/code');
var sqlClient = require('../../../Util/dao/sqlClient').Game;
var sqlClientAdmin = require('../../../Util/dao/sqlClient').Admin;
var sqlCommand = require('../../../Util/dao/sqlCommand');
var VIP = module.exports;

VIP.getUserVIPByUserId = function(userId,callback){
    var sql = new sqlCommand('SELECT * FROM User_VIP WHERE User_Id = ? ',[userId]);
    sqlClient.query(sql,function(error,result){
        console.log(result);
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


VIP.updateUserVIP = function(model,callback){
    var sql = new sqlCommand('UPDATE User_VIP SET VIP_Lvl = ?,Total_Recharge = ? WHERE User_Id = ? ',[model.VIP_Lvl,
    model.Total_Recharge,model.User_Id]);
    sqlClient.query(sql,function(error,result){
        console.log(result);
        if(error != null){
            console.log(error);
            callback(code.DB.UPDATE_DATA_ERROR, error);
        }
        else
        {
            callback(null, result);
        }
    });
}

VIP.addUserVIP = function(model,callback){
    var sql = new sqlCommand('INSERT INTO User_VIP (VIP_Lvl,Total_Recharge,User_Id,Create_Date) VALUE (?,?,?,NOW()) ',
        [model.VIP_Lvl, model.Total_Recharge,model.User_Id]);
    sqlClient.query(sql,function(error,result){
        console.log(result);
        if(error != null){
            console.log(error);
            callback(code.DB.UPDATE_DATA_ERROR, error);
        }
        else
        {
            callback(null, result);
        }
    });
}