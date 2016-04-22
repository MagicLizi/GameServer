/**
 * Created with JetBrains WebStorm.
 * User: Andy.Chen
 * Date: 14-5-23
 * Time: 下午12:30
 * To change this template use File | Settings | File Templates.
 */
var code = require('../../../../config/code');
var sqlClient = require('../../../dao/sqlClient').tinygame;
var sqlCommand = require('../../../dao/sqlCommand');
var logger = require('log4js').getLogger("db");

var sanction = module.exports;

sanction.getAllList = function (player_id, begin_date, end_date, page_start, page_size, callback) {
    var p = where(player_id, begin_date, end_date);

    var sql = 'SELECT * FROM history_store WHERE 0=0 '+ p.sql+ ' LIMIT ?,?';
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

sanction.getAllCount = function (player_id, begin_date, end_date, callback) {

    var p = where(player_id, begin_date, end_date);
    var sql = 'SELECT COUNT(*) AS count FROM history_store WHERE 0=0 '+ p.sql;

    sqlClient.query(new sqlCommand(sql, p.value), function(error, results){
        if(error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, results[0]);
        }
    });
};

function where(player_id, begin_date, end_date){
    var query = '', value = [];
    if(player_id!=-1){
        query += ' AND playerid=?';
        value.push(player_id);
    }
    if(begin_date!=''&&end_date!=''){
        query += ' AND dateUtc>=? AND dateUtc<=?';
        value.push(begin_date);
        value.push(end_date);
    }
    else if(begin_date!=''){
        query += ' AND dateUtc>=?';
        value.push(begin_date);
    }
    else if(end_date!=''){
        query += ' AND dateUtc<=?';
        value.push(end_date);
    }

    return {
        sql : query,
        value : value
    };
}