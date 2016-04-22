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
var where = require('./where');
var logger = require('log4js').getLogger("db");

var chips = module.exports;

chips.getByPlayerId = function(action_id, opts, callback){
    var condition = {
        query : ' WHERE a.action_id=?',
        values : [action_id]
    };

    where.date(opts, condition);

    where.type(opts, condition);

    var query1 = "SELECT COUNT(1) AS count FROM chips AS a LEFT JOIN membership.membership_users as c ON a.player_id=c.membership_id LEFT JOIN tinygame.player AS b ON c.membership_id=b.player_id" + condition.query;

    var sql1 = new sqlCommand(query1, condition.values);
    sqlClient.query(sql1, function(error, total){
        if(error)
            callback(new Error(code.DB.SELECT_DATA_ERROR), code.DB.SELECT_DATA_ERROR);
        else{
            var query2 = "SELECT a.action_id,c.account,a.create_date,b.nickname,a.chips,a.total FROM chips AS a LEFT JOIN membership.membership_users as c ON a.player_id=c.membership_id LEFT JOIN tinygame.player AS b ON c.membership_id=b.player_id" + condition.query + ' ORDER BY a.create_date DESC LIMIT ?,?';
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
