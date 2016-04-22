/**
 * Created with JetBrains WebStorm.
 * User: Andy.Chen
 * Date: 14-6-25
 * Time: 上午10:27
 * To change this template use File | Settings | File Templates.
 */
var async = require('async');
var logger = require('log4js').getLogger("db");
var code = require('../../config/code');

module.exports = connection;

function connection(pool_name, app){
    var self = this;

    this.app = app;
    this.pool_name = pool_name;
    this.pool = null

    this.init = function(){
        self.pool = require('./dataPool').createPool(this.pool_name, app);
    };

    this.query = function(sqlCommand, callback){
        if(sqlCommand){
            self.pool.acquire(function(error, client) {
                if (!!error)
                    return callback(new Error(code.DB.GET_PROVIDER_ERROR), code.DB.GET_PROVIDER_ERROR);

                client.query(sqlCommand.sql, sqlCommand.params, function(error, result) {
                    self.pool.release(client);

                    callback(error, result);
                });
            });
        }
        else
            callback(new Error(code.DB.SQL_COMMANDS_ISNULL), code.DB.SQL_COMMANDS_ISNULL);
    };

    this.transaction = function(sqlCommands, callback){
        if(sqlCommands && sqlCommands.length > 0){
            var execSqlCommands = [], endTasks = [], allResults = [];
            var lazyConnection = null;
            var share = {};//全局共享变量

            sqlCommands.forEach(function(sqlCommand, index){
                execSqlCommands.push(function(params, callback){
                    if(index == 0)
                        callback = params;//waterfall第一个callback没有参数

                    //执行前置函数
                    if(!!sqlCommand.before && typeof sqlCommand.before === 'function'){
                        if(index == 0)
                            sqlCommand.before(null, share);
                        else
                            sqlCommand.before(params, share);
                    }

                    //最终执行函数
                    if(!!sqlCommand.end && typeof sqlCommand.end === 'function'){
                        endTasks.push(function(cb){
                            sqlCommand.end(function(error, taskResult){
                                cb(error, taskResult);
                            });
                        });
                    }

                    lazyConnection.query(sqlCommand.sql, sqlCommand.params, function(error, queryResult){
                        if(error)
                            callback(error, queryResult);
                        else{
                            allResults.push(queryResult);//保存每次执行的结果

                            //执行后置函数
                            if(sqlCommand.after != null && typeof sqlCommand.after === 'function')
                                sqlCommand.after(queryResult, share);

                            callback(null, queryResult);
                        }
                    });
                });
            });

            self.pool.acquire(function(error, client) {
                if (!!error)
                    return callback(new Error(code.DB.GET_PROVIDER_ERROR), code.DB.GET_PROVIDER_ERROR);

                lazyConnection = client;
                try{
                    client.beginTransaction();

                    async.waterfall(execSqlCommands, function (error, commandResult) {
                        if(error)
                            errorEnd(error, self.pool, lazyConnection, callback);
                        else{
                            //执行最终结束函数
                            async.series(endTasks, function(error, endResult){
                                if(error)
                                    errorEnd(error, self.pool, lazyConnection, callback);
                                else{
                                    allResults.push(share);

                                    commitEnd(allResults, self.pool, lazyConnection, callback);
                                }
                            });
                        }
                    });
                }
                catch(error){
                    errorEnd(error, self.pool, lazyConnection, callback);
                }
            });
        }
        else
            callback(new Error(code.DB.SQL_COMMANDS_ISNULL), code.DB.SQL_COMMANDS_ISNULL);
    };

    this.shutdown = function(){
        self.pool.destroyAllNow();
    };
};



function closeConnection(pool, client) {
    pool.release(client);
};

function errorEnd(error, pool, client, callback){
    logger.error(error);
    client.rollback(function(){
        closeConnection(pool, client);
        callback(error, code.DB.EXEC_TRANS_ERROR);
    });
};

function commitEnd(result, pool, client, callback){
    client.commit(function(){
        closeConnection(pool, client);
        callback(null, result);
    });
};
