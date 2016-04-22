/**
 * Created by David_shen on 10/14/14.
 */

var code = require('../../../config/code');
var sqlClient = require('../../dao/sqlClient').admin;
var sqlCommand = require('../../dao/sqlCommand');
var logger = require('log4js').getLogger("db");
var apple = module.exports;

apple.addSkill = function (model, callback) {
    var sql = new sqlCommand('INSERT INTO edit_skill(Skill_Name,Skill_Type,Need_Target,Skill_Use_Range,Skill_Effect_Range,' +
            'Energy_Expends,Target_Num,Skill_Description,Duration_Rounds,Skill_Icon_Url,Skill_Particle_Url,Skill_Tag,' +
            'Skill_Effect,Skill_Target_Type, Create_Date,Skill_Order) ' +
            'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [model.Skill_Name,model.Skill_Type,model.Need_Target,model.Skill_Use_Range,model.Skill_Effect_Range,
            model.Energy_Expends,model.Target_Num,model.Skill_Description,model.Duration_Rounds,model.Skill_Icon_Url,
            model.Skill_Particle_Url,model.Skill_Tag,model.Skill_Effect,model.Skill_Target_Type,model.Create_Date,model.Skill_Order]);
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


apple.addRange = function (model, callback) {
    var sql = new sqlCommand('INSERT INTO edit_Skill_Range(Range_Name,Range_Description,Range_Json,Create_Date) ' +
            'VALUES(?,?,?,?)',
        [model.Range_Name,model.Range_Description,model.Range_Json,model.Create_Date]);
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

apple.editSkill = function (model, callback) {
    var sql = new sqlCommand('UPDATE edit_skill SET Skill_Name = ?,Skill_Type = ?,Need_Target = ?,Skill_Use_Range = ?,' +
            'Energy_Expends = ?,Target_Num = ?,Skill_Description = ?,Duration_Rounds = ?,Skill_Icon_Url = ?,' +
            'Skill_Particle_Url = ?, Skill_Tag = ?,Skill_Effect_Range = ?,Skill_Effect = ?,Skill_Target_Type = ?,' +
        'Skill_Order = ? WHERE Skill_Id=?',[model.Skill_Name,model.Skill_Type,model.Need_Target,model.Skill_Use_Range,
        model.Energy_Expends, model.Target_Num,model.Skill_Description,model.Duration_Rounds,model.Skill_Icon_Url,
        model.Skill_Particle_Url,model.Skill_Tag,model.Skill_Effect_Range,model.Skill_Effect,model.Skill_Target_Type,
        model.Skill_Order,model.Skill_Id]);
    sqlClient.update(sql, function(error, result){
        console.log(error);
        if(error)
        {
            console.log(error);
            callback(new Error(code.DB.UPDATE_DATA_ERROR), code.DB.UPDATE_DATA_ERROR);
        }
        else{
            callback(null, model);
        }
    });
};




apple.editRange = function (model, callback) {
    var sql = new sqlCommand('UPDATE edit_Skill_Range SET Range_Name = ?,Range_Description = ?,Range_Json = ?' +
            ' WHERE Range_Id=?',
        [model.Range_Name,model.Range_Description,model.Range_Json,model.Range_Id]);
    sqlClient.update(sql, function(error, result){
        if(error)
        {
            console.log(error);
            callback(new Error(code.DB.UPDATE_DATA_ERROR), code.DB.UPDATE_DATA_ERROR);
        }
        else{
            callback(null, model);
        }
    });
};


apple.getAll = function (callback) {
    var sql = new sqlCommand('SELECT * FROM edit_skill');
    sqlClient.query(sql, function(error, results){
        if(error)
        {
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        }
        else{
            //console.log("log:" + JSON.stringify(results));
            callback(null, results);
        }
    });
};

apple.getAllRanges = function (callback) {
    var sql = new sqlCommand('SELECT * FROM edit_Skill_Range');
    sqlClient.query(sql, function(error, results){
        if(error)
        {
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        }
        else{
            callback(null, results);
        }
    });
};


apple.getSkillById = function (Skill_Id, callback) {
    var sql = new sqlCommand('SELECT * FROM edit_skill WHERE Skill_Id=?', [Skill_Id]);
    sqlClient.query(sql, function(error, results){
        if(error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else{
            if(results.length > 0)
                callback(null, results[0]);
            else
                callback(null, null);
        }
    });
};



apple.getRangeById = function (Range_Id,callback) {
    var sql = new sqlCommand('SELECT * FROM edit_Skill_Range WHERE Range_Id = ?',Range_Id );
    sqlClient.query(sql, function(error, results){
        if(error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else{
            console.log("results[0]:"+results.length);
            if(results.length > 0){

                callback(null, results);
            }

            else
                callback(null, null);
        }
    });
};