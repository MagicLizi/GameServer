/**
 * Created by peihengyang on 15/9/16.
 */

var code = require('../../../config/code');
var sqlClient = require('../../dao/sqlClient').admin;
var sqlCommand = require('../../dao/sqlCommand');
var logger = require('log4js').getLogger("db");
var apple = module.exports;

apple.getAll = function (callback) {
    var sql = new sqlCommand('SELECT * FROM edit_FarFight ORDER BY FarFight_Type,Min_Lvl');
    sqlClient.query(sql, function (error, result) {
        if (error) {
            console.log(error);
            callback(new Error(code.DB.EXEC_QUERY_ERROR), null);
        }
        else {
            console.log(result);
            if(result.length == 0){
                callback(null,[]);
            }
            else
            {
                callback(null,result);
            }
        }
    });
};


apple.addFarFight = function (model, callback) {
    var sql = new sqlCommand('INSERT INTO edit_FarFight (FarFight_Name,Create_Date,FarFight_Type,Pool_Id,' +
    'Max_Lvl,Min_Lvl) VALUES (?,?,?,?,?,?)',[model.FarFight_Name,model.Create_Date,model.FarFight_Type,
    '',model.Max_Lvl,model.Min_Lvl]);
    console.log(model);
    sqlClient.query(sql, function (error, result) {
        if (error) {
            console.log(error);
            callback(new Error(code.DB.INSERT_DATA_ERROR), null);
        }
        else {
            callback(null,result);
        }
    });
};



apple.updateFarFight = function (model, callback) {
    var sql = new sqlCommand('UPDATE edit_FarFight SET FarFight_Name = ?,' +
    'FarFight_Type = ?,Pool_Id = ?,Max_Lvl = ? ,Min_Lvl = ? WHERE FarFight_Id = ?',[model.FarFight_Name,
        model.FarFight_Type, model.Pool_Id,model.Max_Lvl,model.Min_Lvl,model.FarFight_Id]);
    sqlClient.query(sql, function (error, result) {
        if (error) {
            console.log(error);
            callback(new Error(code.DB.INSERT_DATA_ERROR), null);
        }
        else {
            callback(null,result);
        }
    });
};


apple.getFarFightById= function (FarFight_Id, callback) {
    var sql = new sqlCommand('SELECT * FROM edit_FarFight WHERE FarFight_Id = ?',FarFight_Id);
    sqlClient.query(sql, function (error, result) {
        if (error) {
            console.log(error);
            callback(new Error(code.DB.EXEC_QUERY_ERROR), null);
        }
        else {
            if(result.length == 1){
                callback(null,result[0]);
            }
            else
            {
                callback(code.DB.GET_DATA_ERROR,null);
            }
        }
    });
};