/**
 * Created with JetBrains WebStorm.
 * User: apple
 * Date: 14-8-7
 * Time: 下午4:55
 * To change this template use File | Settings | File Templates.
 */
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
var item = module.exports;


item.insertRedeem = function (model, callback) {
    var now = new Date();
    var sql = new sqlCommand('insert into redeem_code(redeem_code, package_id, count, begin_date, end_date, create_date, type) VALUES(?,?,?,?,?,?,?)',
        [model.redeem_code, model.package_id, model.count, model.begin_date, model.end_date, now, model.type]);
    sqlClient.insert(sql, function (error, result) {
        if (error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else {
            callback(null, model);
        }
    });
};

item.updateRedeem = function (model, callback) {
    console.log(model);
    var sql = new sqlCommand('replace INTO redeem_code(redeem_code, package_id, count, begin_date, end_date, type) VALUES(?,?,?,?,?,?)',
        [model.redeem_code, model.package_id, model.count, model.begin_date, model.end_date, model.type]);
    sqlClient.insert(sql, function (error, result) {
        if (error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else {
            callback(null, model);
        }
    });
};

item.deleteRedeem = function (redeem_code, callback) {
    var sql = new sqlCommand('delete from redeem_code where redeem_code=?',
        [redeem_code]);
    sqlClient.delete(sql, function (error, result) {
        if (error)
            callback(new Error(code.DB.DELETE_DATA_ERROR), code.DB.DELETE_DATA_ERROR);
        else {
            callback(null, null);
        }
    });
};

item.getRedeemUsedHistory = function (redeem_code, callback) {
    var sql = new sqlCommand('select * from redeem_use_history where redeem_code=?',
        [redeem_code]);
    sqlClient.query(sql, function (error, results) {
        if (error)
            callback(new Error(code.DB.SELECT_DATA_ERROR), code.DB.SELECT_DATA_ERROR);
        else {
            callback(null, results);
        }
    });
};

item.getRedeemUsedSuccessCount = function (redeem_code, callback) {
    var sql = new sqlCommand('select count(*) from redeem_use_history where redeem_code=? and success=1',
        [redeem_code]);
    sqlClient.query(sql, function (error, results) {
        if (error)
            callback(new Error(code.DB.SELECT_DATA_ERROR), code.DB.SELECT_DATA_ERROR);
        else {
            callback(null, results[0]['count(*)']);
        }
    });
};

item.getRedeemsWithPackageID = function (package_id, callback) {
    var sql = new sqlCommand('select * from redeem_code where package_id=?',
        [package_id]);
    sqlClient.query(sql, function (error, results) {
        if (error)
            callback(new Error(code.DB.SELECT_DATA_ERROR), code.DB.SELECT_DATA_ERROR);
        else {
            callback(null, results);
        }
    });
};




item.getRedeemCodes = function (page_start, page_count, callback) {
    var sql = new sqlCommand('SELECT * FROM redeem_code ORDER BY create_date DESC LIMIT ?,?',[page_start, page_count]);
    sqlClient.query(sql, function (error, results) {
        console.log(error);
        if (error)
            callback(new Error(code.DB.SELECT_DATA_ERROR), code.DB.SELECT_DATA_ERROR);
        else {
            callback(null, results);
        }
    });
};


item.getAllCount = function(callback) {
    var sql = 'SELECT COUNT(*) AS count FROM redeem_code WHERE 0=0 ';
    sqlClient.query(new sqlCommand(sql), function(error, result){
        if(error)
            callback(new Error(code.DB.SELECT_DATA_ERROR), code.DB.SELECT_DATA_ERROR);
        else{
            callback(null, result[0]);
        }
    });
}

item.deleteCode =  function(package_id, callback){
    var sql = new sqlCommand("delete from redeem_code where package_id=?", [package_id]);
    sqlClient.delete(sql, function(error, results){
        if(error)
            callback(new Error(code.DB.DELETE_DATA_ERROR), code.DB.DELETE_DATA_ERROR);
        else
            callback(null, results);
    });
}

item.excel = function(package_id, callback){
    var sql = "SELECT rc.* ,ruh.create_date as use_date,ruh.user_id as uid " +
        "FROM  redeem_code as rc " +
        "left join redeem_use_history as ruh " +
        "on rc.redeem_code = ruh.redeem_code and ruh.success = 1 where rc.package_id=?";
    var sql2 = new sqlCommand(sql, [package_id]);
    sqlClient.query(sql2, function(error, results){
        console.log(error);
        if(error)
            callback(new Error(code.DB.SELECT_DATA_ERROR), code.DB.SELECT_DATA_ERROR);
        else
            callback(null, results);
    });
};