/**
 * Created by peihengyang on 15/6/11.
 */

var code = require('../../../config/code');
var sqlClient = require('../../dao/sqlClient').admin;
var sqlCommand = require('../../dao/sqlCommand');
var logger = require('log4js').getLogger("db");
var resource = module.exports;

resource.getAll = function (callback) {
    var sql = new sqlCommand('SELECT * FROM (SELECT * FROM manage_Tools_resource WHERE Enable = 1 ' +
    'ORDER BY Create_Date DESC) AS resource_Ordered GROUP BY Resource_Tag');
    sqlClient.query(sql, function(error, results){
        if(error){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR, null);
        }
        else{
            callback(null,results);
        }
    })
};

resource.add = function (model,callback) {
    var sqlMax = new sqlCommand('SELECT CASE WHEN ISNULL(MAX(Resource_Version)) THEN 0 ELSE MAX(Resource_Version) ' +
    'END AS MaxVersion FROM manage_Tools_resource WHERE Resource_Tag = ?',model.Resource_Tag);
    sqlClient.query(sqlMax,function(error,resultMax){
        if(error!=null){
            console.log('sqlMax '+error);
            callback(error);
        }
        else
        {
            console.log(resultMax);
            var sql = new sqlCommand('INSERT INTO manage_Tools_resource (Resource_Version,Resource_Tag,Resource_Url,' +
            'Create_Date,Enable) VALUE (?,?,?,?,?)',[resultMax[0].MaxVersion+1,model.Resource_Tag,model.Resource_Url,
                model.Create_Date,model.Enable]);
            sqlClient.query(sql, function(error, results){
                if(error){
                    console.log(error);
                    callback(code.DB.EXEC_QUERY_ERROR, null);
                }
                else{
                    callback(null,results);
                }
            })
        }
    })

};

resource.getResourceById = function (resource_Id,callback) {
    var sql = new sqlCommand('SELECT * FROM (SELECT * FROM manage_Tools_resource WHERE Enable = 1 ' +
    ' AND Resource_Id = ? ORDER BY Create_Date DESC) AS resource_Ordered GROUP BY Resource_Tag',resource_Id);
    sqlClient.query(sql, function(error, results){
        if(error){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR, null);
        }
        else{
            callback(null,results);
        }
    })
};


resource.deleteResource = function (resource_Tag,callback) {
    var sql = new sqlCommand('UPDATE manage_Tools_resource SET Enable = 0 WHERE Resource_Tag = ?',
        [resource_Tag]);
    sqlClient.query(sql, function(error, results){
        if(error){
            console.log(error);
            callback(code.DB.UPDATE_DATA_ERROR, null);
        }
        else{
            callback(null,results);
        }
    })
};
