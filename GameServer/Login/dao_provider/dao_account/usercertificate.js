/**
 * Created with JetBrains WebStorm.
 * User: Andy.Chen
 * Date: 14-5-26
 * Time: 下午6:27
 * To change this template use File | Settings | File Templates.
 */
var code = require('../../code');
var sqlClient = require('../../../Util/dao/sqlClient').Login;
var sqlCommand = require('../../../Util/dao/sqlCommand');
//var logger = require('pomelo-logger').getLogger("db");

module.exports = UserCertificate;

function UserCertificate() {
    this.getUserCertificate = function (membership_id, gameID, callback) {
        var sql = new sqlCommand('SELECT * FROM membership.membership_usercertificate WHERE membership_id=? AND GameID=?',[membership_id,gameID]);
        sqlClient.query(sql, function(error, results){
            if(error)
                callback(code.DB.SELECT_DATA_ERROR, code.DB.SELECT_DATA_ERROR);
            else {
                if(results.length > 0)
                    callback(null, results[0]);
                else
                    callback(null, []);
            }
        });
    };

    this.updateUserCertificate = function (membership_id, gameID, certificate, callback) {
        this.getUserCertificate(membership_id, gameID, function(error, model){
            if(error)
                return callback(error, model);

            model.Certificate = certificate;

            var sql = new sqlCommand('UPDATE membership.membership_usercertificate SET Certificate=? WHERE membership_id=? AND GameID=?',[certificate,membership_id,gameID]);
            sqlClient.update(sql, function(error, result){
                if(error)
                    callback(code.DB.UPDATE_DATA_ERROR, code.DB.UPDATE_DATA_ERROR);
                else
                    callback(null, model);
            });
        });
    };

    this.createUserCertificate = function (membership_id, gameID, certificate, createTime, endTime, callback) {
        var model = {
            membership_id: membership_id,
            GameID: gameID,
            Certificate: certificate,
            CreateDateUTC: createTime,
            ExpirationDateUTC: endTime
        };

        var sql = new sqlCommand('replace INTO membership.membership_usercertificate (membership_id,GameID,Certificate,CreateDateUTC,ExpirationDateUTC) VALUES(?,?,?,?,?)',
            [membership_id,gameID,certificate,createTime,endTime]);

        sqlClient.insert(sql, function(error, result){
            if(error)
                callback(code.DB.INSERT_DATA_ERROR, code.DB.INSERT_DATA_ERROR);
            else
                callback(null, model);
        });
    };

    this.deleteUserCertificate = function (membership_id, gameID, callback) {
        var sql = new sqlCommand('DELETE FROM membership.membership_usercertificate WHERE membership_id=? AND GameID=?',[membership_id,gameID]);
        sqlClient.remove(sql, function(error, results){
            if(error)
                callback(code.DB.UPDATE_DATA_ERROR, code.DB.UPDATE_DATA_ERROR);
            else
                callback(null, true);
        });
    };
}