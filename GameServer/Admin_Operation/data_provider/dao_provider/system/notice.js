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

var notice = module.exports;

notice.addNotice = function (model, callback) {
    var sql = new sqlCommand('INSERT INTO system_notice(name,content,is_jump,jump_sort,sort,is_valid,begin_date,end_date,create_date) VALUES(?,?,?,?,?,?,?,?,?)',
        [model.name,model.content,model.is_jump,model.jump_sort,model.sort,model.is_valid,model.begin_date,model.end_date,model.create_date]);
    sqlClient.insert(sql, function(error, result){
        console.log(error);
        if(error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, model);
        }
    });
};

notice.editNotice = function (model, callback) {
    var sql = new sqlCommand('UPDATE system_notice SET name=?,content=?,is_jump=?,jump_sort=?,sort=?,is_valid=?,begin_date=?,end_date=?,create_date=? WHERE notice_id=?',
        [model.name,model.content,model.is_jump,model.jump_sort,model.sort,model.is_valid,model.begin_date,model.end_date,model.create_date,model.notice_id]);
    sqlClient.update(sql, function(error, result){
        if(error)
            callback(new Error(code.DB.UPDATE_DATA_ERROR), code.DB.UPDATE_DATA_ERROR);
        else{
            callback(null, model);
        }
    });
};

notice.getAll = function (callback) {
    var sql = new sqlCommand('SELECT * FROM system_notice');
    sqlClient.query(sql, function(error, results){
        if(error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, results);
        }
    });
};

notice.getNotice = function (notice_id, callback) {
    var sql = new sqlCommand('SELECT * FROM system_notice WHERE notice_id=?', [notice_id]);
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