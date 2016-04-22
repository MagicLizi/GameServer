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

/**
 * 获取所有admin账户
 * @param callback
 */
admin.getAdmins = function(callback){
    var sql = new sqlCommand('select * from membership_admin');
    sqlClient.query(sql, function(error, results){
        if(error)
            callback(new Error(code.DB.SELECT_DATA_ERROR), code.DB.SELECT_DATA_ERROR);
        else {
            callback(null, results);
        }
    });
};

/**
 * 添加admin账号
 * @param account
 * @param password
 * @param level
 * @param callback
 */
admin.addAdmin = function(account, password, level, callback){
    var now = new Date();
    var sql = new sqlCommand('insert into membership_admin (account, password, level, name, create_date) values(?,?,?,?,?)',[account, password, level, account, now])
    sqlClient.insert(sql, function(error, results){
        if(error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else {
            callback(null, null);
        }
    });
};

/**
 * 更新admin账号信息
 * @param account
 * @param password
 * @param level
 * @param callback
 */
admin.updateAdmin = function(account, password, level, callback){
    var sql = new sqlCommand('update membership_admin set password=?,level=? where account=?',[password, level, account])
    sqlClient.update(sql, function(error, results){
        if(error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else {
            callback(null, null);
        }
    });
};

/**
 * 账号是否存在
 * @param account
 * @param callback
 */
admin.accountExsit = function(account, callback){
    var sql = new sqlCommand('select * from membership_admin where account=?',[account])
    sqlClient.update(sql, function(error, results){
        if(error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else {
            callback(null, results.length>0);
        }
    });
};

/**
 * 删除admin账号
 * @param account
 * @param password
 * @param level
 * @param callback
 */
admin.deleteAdmin = function(account, callback){
    var sql = new sqlCommand('delete from membership_admin where account=?',[account])
    sqlClient.update(sql, function(error, results){
        if(error)
            callback(new Error(code.DB.DELETE_DATA_ERROR), code.DB.DELETE_DATA_ERROR);
        else {
            callback(null, null);
        }
    });
};

/**
 * 获取用户查看权限页面
 * @param level
 * @param callback
 */
admin.getUserWatchPages = function (level, callback) {
    var sql = new sqlCommand('select * from membership_admin_level where level=?',
        [level]);
    sqlClient.query(sql, function (error, results) {
        if (error)
            callback(new Error(code.DB.SELECT_DATA_ERROR), code.DB.SELECT_DATA_ERROR);
        else {
            if (results.length > 0) {
                callback(null, JSON.parse(results[0]['watch_pages']));
            }
            else {
                callback(null, []);
            }
        }
    });
};

/**
 * 获取用户修改权限配置
 * @param level
 * @param callback
 */
admin.getUserAlterPages = function (level, callback) {
    var sql = new sqlCommand('select * from membership_admin_level where level=?',
        [level]);
    sqlClient.query(sql, function (error, results) {
        if (error)
            callback(new Error(code.DB.SELECT_DATA_ERROR), code.DB.SELECT_DATA_ERROR);
        else {
            if (results.length > 0) {
                callback(null, JSON.parse(results[0]['alter_pages']));
            }
            else {
                callback(null, []);
            }
        }
    });
};


/**
 * 获取用户权限等级
 * @param level
 * @param callback
 */
admin.getAdminLevel = function (level, callback) {
    var sql = new sqlCommand('select * from membership_admin_level where level=?',
        [level]);
    sqlClient.query(sql, function (error, results) {
        if (error)
            callback(new Error(code.DB.SELECT_DATA_ERROR), code.DB.SELECT_DATA_ERROR);
        else {
            if (results.length > 0) {
                callback(null, results[0]);
            }
            else {
                callback(null, null);
            }
        }
    });
};

/**
 * 设置用户权限等级
 * @param level
 * @param watch_pages
 * @param alter_pages
 * @param callback
 */
admin.setAdminLevel = function (level, watch_pages, alter_pages, callback) {
    var sql = new sqlCommand('replace into membership_admin_level (watch_pages, alter_pages, level) values(?,?,?)',
        [JSON.stringify(watch_pages), JSON.stringify(alter_pages), level]);
    sqlClient.query(sql, function (error, results) {
        console.log(error);
        if (error)
            callback(new Error(code.DB.SELECT_DATA_ERROR), code.DB.SELECT_DATA_ERROR);
        else {
            if (results.length > 0) {
                callback(null, results[0]);
            }
            else {
                callback(null, null);
            }
        }
    });
};
