/**
 * Created with JetBrains WebStorm.
 * User: Andy.Chen
 * Date: 14-5-26
 * Time: 下午5:54
 * To change this template use File | Settings | File Templates.
 */
var code = require('../../code');
var sqlClient = require('../../../Util/dao/sqlClient').Login;
var sqlCommand = require('../../../Util/dao/sqlCommand');
//var logger = require('pomelo-logger').getLogger("db");

module.exports = RelationShip;

function RelationShip(){
    this.getPlayerId = function (membership_id, server_id, callback) {
        var sql = new sqlCommand('SELECT * FROM membership.membership_player_relationship WHERE membership_id=? AND server_id=?',[membership_id,server_id]);
        sqlClient.query(sql, function(error, results){
            if(error)
                callback(code.DB.SELECT_DATA_ERROR, code.DB.SELECT_DATA_ERROR);
            else {
                if(results.length > 0)
                    callback(null, results[0]);
                else
                    callback(null, null);
            }
        });
    };

    this.getRelationship = function (player_id, callback) {
        var sql = new sqlCommand('SELECT * FROM membership.membership_player_relationship WHERE player_id=?',[player_id]);
        sqlClient.query(sql, function(error, results){
            if(error)
                callback(code.DB.SELECT_DATA_ERROR, code.DB.SELECT_DATA_ERROR);
            else {
                if(results.length > 0)
                    callback(null, results[0]);
                else
                    callback(null, null);
            }
        });
    };

    this.createRelationship = function (membership_id, server_id, callback) {
        var model = {
            membership_id : membership_id,
            server_id : server_id
        };
        var sql = new sqlCommand('INSERT INTO membership.membership_player_relationship(membership_id,server_id) VALUES(?,?)',[membership_id, server_id]);
        sql.after = function(result, share){
            model.player_id = result.insertId;
        };
        sqlClient.insert(sql, function(error, results){
            if(error)
                callback(code.DB.INSERT_DATA_ERROR, code.DB.INSERT_DATA_ERROR);
            else
                callback(null, model);
        });
    };

    this.resetRelationship = function (membership_id, player_id, callback) {
        this.getRelationship(player_id, function(error, model){
            if(error)
                return callback(code.DB.SELECT_DATA_ERROR, code.DB.SELECT_DATA_ERROR);

            model.membership_id = membership_id;

            var sql = new sqlCommand('UPDATE membership.membership_player_relationship SET membership_id=? WHERE player_id=?',[membership_id, player_id]);
            sqlClient.update(sql, function(error, result){
                if(error)
                    callback(code.DB.UPDATE_DATA_ERROR, code.DB.UPDATE_DATA_ERROR);
                else
                    callback(null, model);
            });
        });

    };
}

