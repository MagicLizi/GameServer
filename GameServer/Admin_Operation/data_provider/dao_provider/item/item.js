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
function where(begin_date, end_date, type){
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
    else if (type) {
        query += ' AND order_type=?';
        value.push(type);
    }
    return {
        sql : query,
        value : value
    };
}

var item = module.exports;

item.updateItem = function (model, callback) {
    console.log(model);
    var sql = new sqlCommand('replace INTO user_item(user_id, item_id, item_count) VALUES(?,?,?)',
        [model.user_id, model.item_id, model.item_count]);
    sqlClient.insert(sql, function (error, result) {
        if (error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else {
            callback(null, model);
        }
    });
};


item.getUserItems = function (user_id, callback) {
    var sql = new sqlCommand('SELECT * FROM user_item where user_id=?', [user_id]);
    sqlClient.query(sql, function (error, results) {
        if (error)
            callback(new Error(code.DB.SELECT_DATA_ERROR), code.DB.SELECT_DATA_ERROR);
        else {
            callback(null, results);
        }
    });
};


item.getItemUseList = function (begin_date, end_date, page_start, page_size, type, callback)  {
    var p = where(begin_date, end_date, type);
    var sql = 'SELECT * FROM user_item_order WHERE 0=0 '+ p.sql+ ' ORDER BY create_date DESC LIMIT ?,?';
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

item.getAllCount = function (begin_date, end_date, type, callback) {
    var p = where(begin_date, end_date, type);
    var sql = 'SELECT COUNT(*) AS count FROM user_item_order WHERE 0=0 '+ p.sql;

    sqlClient.query(new sqlCommand(sql, p.value), function(error, results){
        if(error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, results[0]);
        }
    });
};
