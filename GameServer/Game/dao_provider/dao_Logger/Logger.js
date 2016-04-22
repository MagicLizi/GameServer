/**
 * Created by peihengyang on 15/7/14.
 */
var code = require('../../../ServerConfigs/code');
var sqlClient = require('../../../Util/dao/sqlClient').Logger;
var sqlCommand = require('../../../Util/dao/sqlCommand');
var logger = module.exports;

logger.addRequest = function(model,callback){
    //console.log('add',model);
    var sql = new sqlCommand('INSERT INTO Request_Logger (Route,Method,Request,Response,Create_Date,Response_Date,Headers) VALUES' +
    ' (?,?,?,?,?,?,?)',[model.Route,model.Method,'',model.Response,model.Create_Date,model.Response_Date,JSON.stringify(model.Headers)]);
    sqlClient.query(sql,function(error,result){
        if(error != null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR, error);
        }

        else
        {
            callback(null, result);
        }

    });
}


logger.addParams = function(models,callback){
    var sqls = [];
    if(models.length != 0){
        models.forEach(function(model){
            var sql = new sqlCommand('INSERT INTO Request_Parameter(Parameter_Name,Parameter_Value,Parameter_Type,' +
                'Request_Log_Id,Create_Date)VALUES(?,?,?,?,?);',[model.Parameter_Name,model.Parameter_Value,model.Parameter_Type,
                model.Request_Log_Id,model.Create_Date]);
            sqls.push(sql);
        })
        sqlClient.transaction(sqls,function(error,result){
            if(error != null){
                console.log(error);
                callback(code.DB.EXEC_QUERY_ERROR, error);
            }
            else
            {
                callback(null, result);
            }

        });
    }
    else
    {
        callback(null,null);
    }
}

logger.addBuyHistory = function(models,callback){
    var sqls = [];
    models.forEach(function(model){
        var sql = new sqlCommand('INSERT INTO Buy_History(User_Id,Diamond_Amount,Source,Store_Id,Create_Date)VALUES(?,?,?,?,?);',[model.Parameter_Name,model.Parameter_Value,model.Parameter_Type,
            model.Request_Log_Id,model.Create_Date]);
        sqls.push(sql);
    })
    sqlClient.transaction(sqls,function(error,result){
        if(error != null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR, error);
        }
        else
        {
            callback(null, result);
        }

    });
}