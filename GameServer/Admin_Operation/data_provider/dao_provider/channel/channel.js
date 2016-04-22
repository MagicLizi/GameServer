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

var notice = module.exports;

notice.addChannel = function (model, callback) {
    var sql = new sqlCommand('INSERT INTO game_channel(channel_name, remark, create_date) VALUES(?,?,?)',
        [model.name, model.remark, model.create_date]);
    sqlClient.insert(sql, function (error, result) {
        if (error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else {
            callback(null, model);
        }
    });
};

notice.editChannel = function (model, callback) {
    var sql = new sqlCommand('UPDATE game_channel SET channel_name=?, remark=?, create_date=? where channel_id=?',
        [model.channel_name, model.remark, model.create_date, model.channel_id]);
    sqlClient.update(sql, function (error, result) {
        if (error) {
            console.log(error);
            callback(new Error(code.DB.UPDATE_DATA_ERROR), code.DB.UPDATE_DATA_ERROR);
        }
        else {
            callback(null, model);
        }
    });
};

notice.getAll = function (callback) {
    var sql = new sqlCommand('SELECT * FROM game_channel');
    sqlClient.query(sql, function (error, results) {
        if (error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else {
            callback(null, results);
        }
    });
};

notice.getChannel = function (channel_id, callback) {
    var sql = new sqlCommand('SELECT * FROM game_channel where channel_id=?', [channel_id]);
    sqlClient.query(sql, function (error, results) {
        if (error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else {
            if (results.length > 0)
                callback(null, results[0]);
            else
                callback(null, null);
        }
    });
};