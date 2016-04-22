/**
 * Created by peihengyang on 15/7/20.
 */
var code = require('../../../config/code');
var sqlClient = require('../../dao/sqlClient').logger;
var sqlCommand = require('../../dao/sqlCommand');
//var logger = require('log4js').getLogger("db");
var loggerBI = module.exports;

loggerBI.getAll = function(callback){
    var sql = new sqlCommand('SELECT * FROM BI_List ORDER BY Enable DESC');
    sqlClient.query(sql,function(error,results){
        console.log(sql);
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            console.log(results);
            callback(null,results);
        }
    })
}

loggerBI.add = function(model,callback){
    console.log("bilog:",model);
    var sql = new sqlCommand('INSERT INTO BI_List (BI_Name,BI_Script,BI_ParamList,Create_Date,Enable) VALUES (?,?,?,?,?)',
    [model.BI_Name,model.BI_Script,model.BI_ParamList,model.Create_Date,model.Enable]);
    console.log(sql);
    sqlClient.insert(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.INSERT_DATA_ERROR,null);
        }
        else
        {
            callback(null,results);
        }
    })
}


loggerBI.getBIById = function(BI_Id,callback){
    var sql = new sqlCommand('SELECT * FROM BI_List WHERE BI_Id = ?', BI_Id);
    console.log(sql);
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            callback(null,results);
        }
    })
}

loggerBI.UpdateBIList = function(model,callback){
    var sql = new sqlCommand('UPDATE BI_List SET BI_Name = ?,BI_Script = ?,BI_ParamList = ?,Create_Date = ?,Enable = ? ' +
    'WHERE BI_Id = ?',[model.BI_Name,model.BI_Script,model.BI_ParamList,model.Create_Date,model.Enable,model.BI_Id]);
    sqlClient.update(sql,function(error,results){
        if(error!=null){
            console.log(sql,error);
            callback(code.DB.UPDATE_DATA_ERROR,null);
        }
        else
        {
            callback(null,results);
        }
    })
}

loggerBI.RunBIScript =  function(model,callback){
    console.log('BunBIScriptmodel:',model);
    var sql = new sqlCommand(model.BI_Script,model.ParamList);
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            console.log(sql,error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            callback(null,results);
        }
    })
}
