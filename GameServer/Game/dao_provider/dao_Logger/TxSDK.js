/**
 * Created by peihengyang on 15/10/20.
 */
var code = require('../../../ServerConfigs/code');
var sqlClient = require('../../../Util/dao/sqlClient').Logger;
var sqlCommand = require('../../../Util/dao/sqlCommand');
var logger = module.exports;

logger.addThirdPartHistory = function(model,callback){
        var sql = new sqlCommand('INSERT INTO Third_Part_Request(User_Id,Host_Name,Url_Path,Params,Create_Date,' +
        'Part_Source,Res_String,Uri)VALUES(?,?,?,?,?,?,?,?);',[model.User_Id,model.Host_Name,model.Url_Path,
            model.Params,model.Create_Date,model.Part_Source,model.Res_String,model.Uri]);

    sqlClient.insert(sql,function(error,result){
        if(error != null){
            console.log(error);
            callback(code.DB.INSERT_DATA_ERROR, error);
        }
        else
        {
            callback(null, result);
        }

    });
}