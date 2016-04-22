/**
 * Created with JetBrains WebStorm.
 * User: andy.chen
 * Date: 14-5-20
 * Time: 下午3:57
 * To change this template use File | Settings | File Templates.
 */
var code = require('../../../config/code');
var sqlClient = require('../../dao/sqlClient').admin;
var sqlCommand = require('../../dao/sqlCommand');
var logger = require('log4js').getLogger("db");

var admin = module.exports;

admin.getAdminById = function(user_id, callback){
    sqlClient.query(self.selectQuery(user_id), function(error, results){
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

admin.getAdminByName = function(name, callback){
    var sql = new sqlCommand('SELECT * FROM membership_admin WHERE account=?',[name]);
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

admin.updatePassword = function(name, password, callback){
    var sql = new sqlCommand('UPDATE membership_admin SET password=? WHERE account=?',[password, name]);
    sqlClient.update(sql, function(error, results){
        if(error)
            callback(new Error(code.DB.UPDATE_DATA_ERROR), code.DB.UPDATE_DATA_ERROR);
        else
            callback(null, null);
    });
};


admin.selectQuery = function(user_id){
    return new sqlCommand('SELECT * FROM membership_admin WHERE user_id=?',
        [user_id]);
};
