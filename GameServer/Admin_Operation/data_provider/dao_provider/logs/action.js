/**
 * Created with JetBrains WebStorm.
 * User: Andy.Chen
 * Date: 14-6-25
 * Time: 下午12:15
 * To change this template use File | Settings | File Templates.
 */
var code = require('../../../config/code');
var sqlClient = require('../../dao/sqlClient').tinylogs;
var sqlCommand = require('../../dao/sqlCommand');
var logger = require('log4js').getLogger("db");

var action = module.exports;

action.getList = function(actions, opts, callback){
    var condition = {};

    if(actions.length == 1){
        condition = {
            query : ' WHERE a.action_id=?',
            values : [actions[0]]
        };
    }
    else{
        var query = '',values = [];
        actions.forEach(function(action_id, i){
            if(i==0)
                query+='a.action_id=?'
            else
                query+=' OR a.action_id=?'

            values.push(action_id);
        });

        query = 'WHERE (' + query + ') ';

        condition = {
            query : query,
            values : values
        };
    }
    where(opts, condition);

    var query1 = "SELECT COUNT(1) AS count FROM actions AS a " + condition.query;


    var sql1 = new sqlCommand(query1, condition.values);
    sqlClient.query(sql1, function(error, total){
        if(error)
            callback(new Error(code.DB.SELECT_DATA_ERROR), code.DB.SELECT_DATA_ERROR);
        else{
            var query2 = "SELECT * FROM actions AS a " + condition.query + ' ORDER BY a.create_date DESC LIMIT ?,?';
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

action.excel = function(actions, opts, callback){
    var condition = {};

    if(actions.length == 1){
        condition = {
            query : ' WHERE a.action_id=?',
            values : [actions[0]]
        };
    }
    else{
        var query = '',values = [];
        actions.forEach(function(action_id, i){
            if(i==0)
                query+='a.action_id=?'
            else
                query+=' OR a.action_id=?'

            values.push(action_id);
        });

        query = 'WHERE (' + query + ') ';

        condition = {
            query : query,
            values : values
        };
    }
    where(opts, condition);

    var query2 = "SELECT * FROM actions AS a " + condition.query + ' ORDER BY a.create_date DESC';

    var sql2 = new sqlCommand(query2, condition.values);

    sqlClient.query(sql2, function(error, results){
        if(error)
            callback(new Error(code.DB.SELECT_DATA_ERROR), code.DB.SELECT_DATA_ERROR);
        else
            callback(null, results);
    });
};

function where(opts, condition){
    if(!!opts.begin_date){
        condition.query+=' AND a.create_date>=?';
        condition.values.push(opts.begin_date);
    }

    if(!!opts.end_date){
        condition.query+=' AND a.create_date<=?';
        condition.values.push(opts.end_date);
    }

    if(!!opts.account){
        condition.query+=' AND a.account=?';
        condition.values.push(opts.account);
    }

    if(!!opts.player_id){
        condition.query+=' AND a.player_id=?';
        condition.values.push(opts.player_id);
    }

    if(!!opts.nickname){
        condition.query+=' AND a.nickname=?';
        condition.values.push(opts.nickname);
    }

    if(opts.loop_id>=0){
        condition.query+=' AND a.i3=?';
        condition.values.push(opts.loop_id);
    }

    if(opts.round_id>=0){
        condition.query+=' AND a.i4=?';
        condition.values.push(opts.round_id);
    }

    if(opts.region_id>=0){
        condition.query+=' AND a.i2=?';
        condition.values.push(opts.region_id);
    }


    if(!!opts.region_name){
        condition.query+=' AND a.v1=?';
        condition.values.push(opts.region_name);
    }
};
