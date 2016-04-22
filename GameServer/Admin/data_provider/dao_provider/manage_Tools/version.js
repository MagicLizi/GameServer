/**
 * Created by peihengyang on 15/8/26.
 */

var code = require('../../../config/code');
var sqlClient = require('../../dao/sqlClient').admin;
var sqlCommand = require('../../dao/sqlCommand');
var logger = require('log4js').getLogger("db");
var resource = module.exports;

resource.getAll = function (callback) {
    var sql = new sqlCommand('SELECT * FROM manage_Tools_Version ORDER BY Version_Order DESC');
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
    console.log(model);
    var sql = new sqlCommand('INSERT INTO manage_Tools_Version (Version_Name,Is_Force_Update,Create_Date,' +
    'Update_Url,Version_Order,Enable) VALUE (?,?,?,?,?,?)',[model.Version_Name,model.Is_Force_Update,
        model.Create_Date,model.Update_Url,model.Version_Order,model.Enable]);
    sqlClient.query(sql, function(error, results){
        if(error){
            console.log('Insert Into mamage_Tools_Version:',error);
            callback(code.DB.INSERT_DATA_ERROR, null);
        }
        else{
            callback(null,results);
        }
    })
};

resource.getVersionById = function (version_Id,callback) {
    var sql = new sqlCommand('SELECT * FROM manage_Tools_Version WHERE Version_Id = ? ORDER BY Create_Date DESC'
        ,version_Id);
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


resource.deleteVersion = function (version_Id,callback) {
    var sql = new sqlCommand('UPDATE manage_Tools_Version SET Enable = 0 WHERE Version_Id = ?',
        [version_Id]);
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


resource.updateVersion = function (model,callback) {
    var sql = new sqlCommand('UPDATE manage_Tools_Version SET Version_Name = ?,Is_Force_Update = ?,Update_Url = ?,' +
        'Version_Order = ?,Enable = ? WHERE Version_Id = ?', [model.Version_Name,model.Is_Force_Update,model.Update_Url,
    model.Version_Order,model.Enable,model.Version_Id]);
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