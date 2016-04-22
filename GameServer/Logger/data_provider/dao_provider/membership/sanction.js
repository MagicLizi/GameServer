/**
 * Created with JetBrains WebStorm.
 * User: andy.chen
 * Date: 14-5-22
 * Time: 下午3:08
 * To change this template use File | Settings | File Templates.
 */
var code = require('../../../config/code');
var sqlClient = require('../../dao/sqlClient').admin;
var sqlCommand = require('../../dao/sqlCommand');
var logger = require('log4js').getLogger("db");

var sanction = module.exports;

sanction.getAllSanction = function (membership_id, page_start, page_size, callback) {
    var sql = new sqlCommand('SELECT * FROM admin.membership_sanction WHERE membership_id=? LIMIT ?,?',[membership_id, page_start, page_size]);
    sqlClient.query(sql, function(error, results){
        if(error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, results);
        }
    });
};

sanction.getCount = function (membership_id, callback) {
    var sql = new sqlCommand('SELECT COUNT(*) AS count FROM admin.membership_sanction WHERE membership_id=?',[membership_id]);
    sqlClient.query(sql, function(error, results){
        if(error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, results[0]);
        }
    });
};


sanction.getAllList = function (begin_date, end_date, page_start, page_size, callback) {
    var p = where(begin_date, end_date);

    var sql = 'SELECT A.sanction_id,A.membership_id,A.type,A.name,A.reason,A.create_date,B.account FROM admin.membership_sanction AS A,membership.membership_users AS B WHERE A.membership_id=B.membership_id '+ p.sql+ ' LIMIT ?,?';
    p.value.push(page_start);
    p.value.push(page_size);

    sqlClient.query(new sqlCommand(sql, p.value), function(error, results){
        if(error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, results);
        }
    });
};

sanction.getAllCount = function (begin_date, end_date, callback) {
    var p = where(begin_date, end_date);
    var sql = 'SELECT COUNT(*) AS count FROM admin.membership_sanction WHERE 0=0 '+ p.sql;

    sqlClient.query(new sqlCommand(sql, p.value), function(error, results){
        if(error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, results[0]);
        }
    });
};

sanction.insertQuery = function (model) {
    return new sqlCommand('INSERT INTO admin.membership_sanction(type,membership_id,name,reason,create_date) VALUES(?,?,?,?,?)',
        [model.type,model.membership_id,model.name,model.reason,model.create_date]);
};

function where(begin_date, end_date){
    var query = '', value = [];

    if(begin_date!=''&&end_date!=''){
        query += ' AND create_date>=? AND create_date<=?';
        value.push(begin_date);
        value.push(end_date);
    }
    else if(begin_date!=''){
        query += ' AND create_date>=?';
        value.push(begin_date);
    }
    else if(end_date!=''){
        query += ' AND create_date<=?';
        value.push(end_date);
    }

    return {
        sql : query,
        value : value
    };
}