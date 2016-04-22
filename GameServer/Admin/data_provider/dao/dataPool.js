/**
 * Created with JetBrains WebStorm.
 * User: Andy.Chen
 * Date: 14-5-6
 * Time: 上午10:40
 * To change this template use File | Settings | File Templates.
 */
var pool = require('generic-pool');
global.process
exports.createPool = function(pool_name, app){
    var config = require('../../config/mysql.json');
    return pool.Pool(
        {
            name: pool_name,
            create: function(callback){
                var mysql = require('mysql');
                var client = mysql.createConnection(config[global.process.argv[2]][pool_name]);
                callback(null, client);
            },
            destroy: function(client) {
                client.end();
            },
            max: 10,
            idleTimeoutMillis : 30000,
            log : false
        }
    );
};