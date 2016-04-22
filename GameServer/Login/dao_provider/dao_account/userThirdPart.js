/**
 * Created with JetBrains WebStorm.
 * User: Andy.Chen
 * Date: 14-5-27
 * Time: 上午10:07
 * To change this template use File | Settings | File Templates.
 */
var code = require('../../code');
var sqlClient = require('../../../Util/dao/sqlClient').Login;
var sqlCommand = require('../../../Util/dao/sqlCommand');
//var logger = require('pomelo-logger').getLogger("db");

module.exports = ThirdPart;

function ThirdPart() {
    this.getThirdPart = function(thirdPartID,callback){
        var sql = new sqlCommand('SELECT * FROM membership.membership_thirdparts WHERE ThirdPartID=?',[thirdPartID]);
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

    this.getThirdPartByUserID = function(userID,callback){
        var sql = new sqlCommand('SELECT * FROM membership.membership_thirdparts WHERE UserID=?',[userID]);
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

    this.getThirdPartByAccount = function(ThirdPartName,ThirdPartID,callback){
        var sql = new sqlCommand('SELECT * FROM membership.membership_thirdparts WHERE ThirdPartID=? AND ThirdPartName=?',[ThirdPartID,ThirdPartName]);
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

    this.createThirdPart = function(userID,thirdPartID,thirdPartName,callback){
        var model = {
            UserID: userID,
            ThirdPartID: thirdPartID,
            ThirdPartName: thirdPartName
        };

        var sql = new sqlCommand('INSERT INTO membership.membership_thirdparts' +
            '(UserID,ThirdPartID,ThirdPartName) VALUES(?,?,?)',
            [userID,thirdPartID,thirdPartName]);
        sqlClient.insert(sql, function(error, result){
            if(error)
                callback(code.DB.INSERT_DATA_ERROR, code.DB.INSERT_DATA_ERROR);
            else
                callback(null, model);
        });
    };
}