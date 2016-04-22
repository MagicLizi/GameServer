/**
 * Created with JetBrains WebStorm.
 * User: Andy.Chen
 * Date: 14-5-6
 * Time: 上午10:44
 * To change this template use File | Settings | File Templates.
 */
//var slqClient = pomelo.app.get('dbClient');
var loginSqlClient = require('./sqlExecute').init('Login','membership');
var gameSqlClient = require('./sqlExecute').init('Game','game');
var adminSqlClient = require('./sqlExecute').init('Admin','admin');
var loggerSqlClient = require('./sqlExecute').init('Logger','logger');
module.exports = {
    Login : {
        insert : loginSqlClient.insert,

        update : loginSqlClient.update,

        delete : loginSqlClient.delete,

        query: loginSqlClient.query,

        transaction : loginSqlClient.transaction
    },
    Admin : {
        insert : adminSqlClient.insert,

        update : adminSqlClient.update,

        delete : adminSqlClient.delete,

        query: adminSqlClient.query,

        transaction : adminSqlClient.transaction
    }
    ,
    Game : {
        insert : gameSqlClient.insert,

        update : gameSqlClient.update,

        delete : gameSqlClient.delete,

        query: gameSqlClient.query,

        transaction : gameSqlClient.transaction
    },
    Logger : {
        insert : loggerSqlClient.insert,

        update : loggerSqlClient.update,

        delete : loggerSqlClient.delete,

        query: loggerSqlClient.query,

        transaction : loggerSqlClient.transaction
    }
};