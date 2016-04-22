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

var robotsanction = module.exports;

robotsanction.getAllSanction = function (player_id, page_start, page_size, callback) {
    var sql = new sqlCommand('SELECT * FROM robot_sanction WHERE player_id=? ORDER BY create_date DESC LIMIT ?,?',[player_id, page_start, page_size]);
    sqlClient.query(sql, function(error, results){
        if(error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, results);
        }
    });
};

robotsanction.getCount = function (player_id, callback) {
    var sql = new sqlCommand('SELECT COUNT(*) AS count FROM robot_sanction WHERE player_id=?',[player_id]);
    sqlClient.query(sql, function(error, results){
        if(error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, results[0]);
        }
    });
};


robotsanction.getAllList = function (begin_date, end_date, page_start, page_size, callback) {
    var p = where(begin_date, end_date);

    var sql = 'SELECT * FROM robot_sanction WHERE 0=0 '+ p.sql+ ' ORDER BY create_date DESC LIMIT ?,?';
    p.value.push(page_start);
    p.value.push(page_size);

    sqlClient.query(new sqlCommand(sql, p.value), function(error, results){
        if(error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, results);
            console.log(results);
        }
    });
};

robotsanction.getAllCount = function (begin_date, end_date, callback) {
    var p = where(begin_date, end_date);
    var sql = 'SELECT COUNT(*) AS count FROM robot_sanction WHERE 0=0 '+ p.sql;

    sqlClient.query(new sqlCommand(sql, p.value), function(error, results){
        if(error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, results[0]);
        }
    });
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

robotsanction.insertQuery = function (model) {
    return new sqlCommand('INSERT INTO robot_sanction(type,name,player_id,nickname,chips,create_date) VALUES(?,?,?,?,?,?)',
        [model.type,model.name,model.player_id,model.nickname,model.chips,model.create_date]);
};