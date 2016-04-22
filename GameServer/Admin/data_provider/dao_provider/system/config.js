/**
 * Created with JetBrains WebStorm.
 * User: andy.chen
 * Date: 14-5-20
 * Time: 下午3:57
 * To change this template use File | Settings | File Templates.
 */
var code = require('../../../config/code');
var sqlClient = require('../../dao/sqlClient').admin;
var sqlCommand = require('../../dao/sqlCommand');
var logger = require('log4js').getLogger("db");

var config = module.exports;

config.editConfig = function (model, callback) {

    this.getConfig(model.key_id,function(err,res)
    {
        if(err)
        {
            callback(new Error(code.DB.UPDATE_DATA_ERROR), code.DB.UPDATE_DATA_ERROR);
        }
        else
        {
            var config_num;
            if(res)
            {
                config_num = res.config_num + 1;
            }
            else
            {
                config_num = 0;
            }
            //console.log("config:"+model.config);
//            var sql = new sqlCommand('replace into config(config,key_id,config_num) values(?,?,?)',
//                [model.config,model.key_id,config_num]);
            //console.log("model");
            //console.log(model);
            var sql = new sqlCommand('update config set config = ?,config_num =? where key_id = ?',
                [model.config,config_num,model.key_id]);
            sqlClient.update(sql, function(error, result){
                if(error)
                {
                    console.log(error);
                    callback(new Error(code.DB.UPDATE_DATA_ERROR), code.DB.UPDATE_DATA_ERROR);
                }
                else{
                    //console.log(result);
                    console.log('update');
                    callback(null, null);
                }
            });
        }
    });
};

config.getAll = function (callback) {
    var sql = new sqlCommand('SELECT * FROM config');
    sqlClient.query(sql, function(error, results){
        if(error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, results);
        }
    });
};

config.getConfig = function (key, callback) {
    var sql = new sqlCommand('SELECT * FROM config WHERE key_id=?', [key]);
    sqlClient.query(sql, function(error, results){
        if(error)
            callback(new Error(code.DB.GET_DATA_ERROR), code.DB.GET_DATA_ERROR);
        else{
            if(results.length > 0)
                callback(null, results[0]);
            else
                callback(null, null);
        }
    });
};

