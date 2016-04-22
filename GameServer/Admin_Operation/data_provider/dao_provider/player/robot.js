/**
 * Created with JetBrains WebStorm.
 * User: Andy.Chen
 * Date: 14-7-16
 * Time: 下午4:57
 * To change this template use File | Settings | File Templates.
 */
var code = require('../../../config/code');
var sqlClient = require('../../dao/sqlClient').tinygame;
var sqlCommand = require('../../dao/sqlCommand');
var logger = require('log4js').getLogger("db");

var robot = module.exports;

robot.getList = function(opts, callback){
    var condition = {
        query : ' WHERE a.type=?',
        values : [2]
    };

    where(opts, condition);

    var query1 = "SELECT COUNT(1) AS count FROM player AS a " + condition.query;

    var sql1 = new sqlCommand(query1, condition.values);
    sqlClient.query(sql1, function(error, total){
        if(error)
            callback(new Error(code.DB.SELECT_DATA_ERROR), code.DB.SELECT_DATA_ERROR);
        else{
            var query2 = "SELECT * FROM player AS a " + condition.query + ' ORDER BY status ASC,chips DESC LIMIT ?,?';
            condition.values.push(opts.start);
            condition.values.push(opts.page_size);

            var sql2 = new sqlCommand(query2, condition.values);

            sqlClient.query(sql2, function(error, results){
                if(error)
                    callback(new Error(code.DB.SELECT_DATA_ERROR), code.DB.SELECT_DATA_ERROR);
                else
                    callback(null, {
                        total : total[0].count,
                        list : results
                    });
            });
        }
    });
};

robot.excel = function(opts, callback){
    var condition = {
        query : ' WHERE a.type=?',
        values : [2]
    };
    where(opts, condition);

    var query2 = "SELECT * FROM player AS a " + condition.query + ' ORDER BY status ASC,chips DESC';

    var sql2 = new sqlCommand(query2, condition.values);

    sqlClient.query(sql2, function(error, results){
        if(error)
            callback(new Error(code.DB.SELECT_DATA_ERROR), code.DB.SELECT_DATA_ERROR);
        else
            callback(null, results);
    });
};

robot.updateStatus = function (player_id, status) {
    return new sqlCommand('UPDATE player SET status=? WHERE player_id=?',
        [status, player_id]);
};

function where(opts, condition){
    if(opts.status != 0){
        console.log(opts.status);
        if(opts.status==2){
            condition.query+=' AND a.status=?';
            condition.values.push(2);
        }
        else{
            condition.query+=' AND (a.status=? OR a.status=?)';
            condition.values.push(0);
            condition.values.push(1);
        }
    }

    if(opts.chips_min>=0){
        condition.query+=' AND a.chips>=?';
        condition.values.push(opts.chips_min);
    }

    if(opts.chips_max>=0){
        condition.query+=' AND a.chips<=?';
        condition.values.push(opts.chips_max);
    }
};