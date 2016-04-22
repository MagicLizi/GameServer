/**
 * Created with JetBrains WebStorm.
 * User: andy.chen
 * Date: 14-5-20
 * Time: 下午3:57
 * To change this template use File | Settings | File Templates.
 */
var code = require('../../../config/code');
var sqlClient = require('../../dao/sqlClient').tinygame;
var sqlCommand = require('../../dao/sqlCommand');
var logger = require('log4js').getLogger("db");

var system = module.exports;

system.addMessage = function (model, callback) {
    var sql = new sqlCommand('call send_message(?,?,?,?,?,?,?,?,?)',
        [model.type,model.user_id,model.name,model.content,model.sort,model.is_valid,model.begin_date,model.end_date,model.create_date]);
    sqlClient.query(sql, function(error, result){
        console.log(error);
        if(error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, model);
        }
    });
};

system.editMessage = function (model, callback) {
    var sql = new sqlCommand('UPDATE message_system SET user_id=?,name=?,content=?,sort=?,is_valid=?,begin_date=?,end_date=?,create_date=? WHERE message_id=?',
        [model.user_id,model.name,model.content,model.sort,model.is_valid,model.begin_date,model.end_date,model.create_date,model.message_id]);
    sqlClient.update(sql, function(error, result){
        if(error)
            callback(new Error(code.DB.UPDATE_DATA_ERROR), code.DB.UPDATE_DATA_ERROR);
        else{
            callback(null, model);
        }
    });
};

system.getAll = function (callback) {
    var sql = new sqlCommand('SELECT * FROM message_system');
    sqlClient.query(sql, function(error, results){
        if(error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, results);
        }
    });
};

system.getMessage = function (message_id, callback) {
    var sql = new sqlCommand('SELECT * FROM message_system WHERE message_id=?', [message_id]);
    sqlClient.query(sql, function(error, results){
        if(error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else{
            if(results.length > 0)
                callback(null, results[0]);
            else
                callback(null, null);
        }
    });
};