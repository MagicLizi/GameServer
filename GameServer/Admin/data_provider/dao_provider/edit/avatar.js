/**
 * Created by peihengyang on 14/12/3.
 */

var code = require('../../../config/code');
var sqlClient = require('../../dao/sqlClient').admin;
var sqlCommand = require('../../dao/sqlCommand');
var logger = require('log4js').getLogger("db");
var apple = module.exports;

apple.addAvatar = function (model, callback) {
        var sql = new sqlCommand('INSERT INTO Avatar (Avatar_Type, Avatar_Icon_Url, Avatar_Description, ' +
                'Avatar_Name, Avatar_Order,Avatar_Grade,Create_Date) VALUES (?,?,?,?,?,?,?);',
            [model.Avatar_Type,model.Avatar_Icon_Url,model.Avatar_Description,model.Avatar_Name,
                model.Avatar_Order,model.Avatar_Grade,model.Create_Date]);
        sqlClient.insert(sql, function(error, result){
            if(error)
            {
                console.log(error);
                callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
            }
            else{
                callback(null, model);
            }
        });
    };

apple.getAll = function (callback) {
    var sql = new sqlCommand('SELECT * FROM Avatar ORDER BY Avatar_Id');
    sqlClient.query(sql, function(error, results){
        console.log(error);
        if(error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, results);
        }
    });
};


apple.getAvatarById = function (Avatar_Id,callback) {
    var sql = new sqlCommand('SELECT * FROM Avatar WHERE Avatar_Id = ?',[Avatar_Id]);
    sqlClient.query(sql, function(error, results){
        if(error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, results);
        }
    });
};

apple.editAvatar = function (model, callback) {
    var sql = new sqlCommand('UPDATE Avatar SET Avatar_Type = ?, Avatar_Icon_Url = ?, Avatar_Description = ?, ' +
            'Avatar_Name = ?, Avatar_Order = ? ,Avatar_Grade = ? WHERE Avatar_Id =?',
        [model.Avatar_Type,model.Avatar_Icon_Url,model.Avatar_Description,model.Avatar_Name,model.Avatar_Order,
        model.Avatar_Grade,model.Avatar_Id]);
    sqlClient.update(sql, function (error, result) {
        console.log(error);
        if (error) {
            console.log(error);
            callback(new Error(code.DB.UPDATE_DATA_ERROR), code.DB.UPDATE_DATA_ERROR);
        }
        else {
            callback(null, model);
        }
    });
};

apple.getAvatarByGrade = function (Avatar_Grades,callback) {
    var sql = new sqlCommand('SELECT * FROM Avatar WHERE Avatar_Grade IN ('+Avatar_Grades+')');
    sqlClient.query(sql, function(error, results){
        if(error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, results);
        }
    });
};