/**
 * Created with JetBrains WebStorm.
 * User: andy.chen
 * Date: 14-5-22
 * Time: 下午2:22
 * To change this template use File | Settings | File Templates.
 */
var code = require('../../../config/code');
var sqlClient = require('../../dao/sqlClient').tinygame;
var sqlCommand = require('../../dao/sqlCommand');
var logger = require('log4js').getLogger("db");

var role = module.exports;

role.getPlayerById = function(player_id, callback){
    var sql = new sqlCommand('SELECT * FROM player WHERE player_id=?',[player_id]);
    sqlClient.query(sql, function(error, results){
        if(error)
            callback(new Error(code.DB.SELECT_DATA_ERROR), code.DB.SELECT_DATA_ERROR);
        else {
            if(results.length > 0)
                callback(null, results[0]);
            else
                callback(null, null);
        }
    });
};

role.getPlayerByName = function(name, callback){
    var sql = new sqlCommand('SELECT * FROM player WHERE nickname=?',[name]);
    sqlClient.query(sql, function(error, results){
        if(error)
            callback(new Error(code.DB.SELECT_DATA_ERROR), code.DB.SELECT_DATA_ERROR);
        else {
            if(results.length > 0)
                callback(null, results[0]);
            else
                callback(null, null);
        }
    });
};

role.updateQuery = function(player_id, property_name, property_value){
    return new sqlCommand('UPDATE player SET '+property_name+'=? WHERE player_id=?',[property_value,player_id]);
};