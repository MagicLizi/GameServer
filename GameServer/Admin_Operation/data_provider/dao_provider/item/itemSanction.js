/**
 * Created with JetBrains WebStorm.
 * User: apple
 * Date: 14-8-4
 * Time: 上午11:16
 * To change this template use File | Settings | File Templates.
 */

var code = require('../../../config/code');
var sqlClient = require('../../dao/sqlClient').admin;
var sqlCommand = require('../../dao/sqlCommand');
var logger = require('log4js').getLogger("db");

var item = module.exports;
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

item.getList = function (begin_date, end_date, page_start, page_size, callback)  {
    var p = where(begin_date, end_date);

    var sql = 'SELECT * FROM item_sanction WHERE 0=0 '+ p.sql+ ' ORDER BY create_date DESC LIMIT ?,?';
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

item.add = function (model, callback) {
    var sql = new sqlCommand('insert INTO item_sanction(user_id, description, admin, create_date, item_id, item_count) VALUES(?,?,?,?,?,?)',
        [model.user_id, model.description, model.admin, model.create_date, model.item_id, model.item_count]);
    sqlClient.insert(sql, function (error, result) {
        if (error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else {
            callback(null, model);
        }
    });
};



item.getAllCount = function (begin_date, end_date, callback) {
    var p = where(begin_date, end_date);
    var sql = 'SELECT COUNT(*) AS count FROM admin.item_sanction WHERE 0=0 '+ p.sql;

    sqlClient.query(new sqlCommand(sql, p.value), function(error, results){
        if(error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, results[0]);
        }
    });
};
