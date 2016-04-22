/**
 * Created with JetBrains WebStorm.
 * User: Jay
 * Date: 14/10/31
 * Time: 下午12:15
 * To change this template use File | Settings | File Templates.
 */
var code = require('../../code');
var sqlClient = require('../../../Util/dao/sqlClient').Admin;
var sqlCommand = require('../../../Util/dao/sqlCommand');
var config = module.exports;

config.getConfig = function (callback) {
    var key = "config";
    var sql = new sqlCommand('SELECT * FROM config WHERE key_id = ?', [key]);
    sqlClient.query(sql, function(error, results){
        var result = {};
        if(!error)
        {
            if(results.length>0)
            {
                result =results[0];
            }
            else
            {
                error = new Error();
                var error = new Error(code.CONFIG.NO_CONFIGS);
                error.statusCode = code.CONFIG.NO_CONFIGS;
            }
        }
        callback(error,result);
    });
};