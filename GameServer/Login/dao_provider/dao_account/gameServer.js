/**
 * Created by steve on 15/11/13.
 */
var code = require('../../../ServerConfigs/code');
var sqlClient = require('../../../Util/dao/sqlClient').Login;
var sqlCommand = require('../../../Util/dao/sqlCommand');
//var logger = require('pomelo-logger').getLogger("db");

var gameServer = module.exports

gameServer.getGameServerByType = function (serverType, callback) {
    var sql = new sqlCommand('SELECT * FROM membership.game_Server_List WHERE Server_Type = ? AND Server_Status = 1',[serverType]);
    sqlClient.query(sql, function(error, results){
        if(error)
            callback(null, []);
        else {
            if(results.length > 0)
                callback(null, results);
            else
                callback(null, null);
        }
    });
};
