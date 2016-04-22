/**
 * Created by peihengyang on 14/12/24.
 */
var code = require('../../../ServerConfigs/code');
var sqlClient = require('../../../Util/dao/sqlClient').Admin;
var sqlCommand = require('../../../Util/dao/sqlCommand');
var global = module.exports;

global.getHeroGrowing = function(callback){
    var sql =  new sqlCommand("SELECT * FROM config WHERE key_id = 'global'");
    sqlClient.query(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            callback(null,JSON.parse(result[0].config).data.herolvl);
        }
    })
}

global.getTroopGrowing = function(callback){
    var sql =  new sqlCommand("SELECT * FROM config WHERE key_id = 'global'");
    sqlClient.query(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            callback(null,JSON.parse(result[0].config).data.trooplvl);
        }
    })
}

global.getGlobal = function(callback){
    var sql =  new sqlCommand("SELECT * FROM config WHERE key_id = 'global'");
    sqlClient.query(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            callback(null,JSON.parse(result[0].config).data);
        }
    })
}