/**
 * Created by David_shen on 10/14/14.
 */
var code = require('../../../Game/code');
var sqlClient = require('../../../Util/dao/sqlClient').Admin;
var sqlCommand = require('../../../Util/dao/sqlCommand');
var apple = module.exports;

apple.addRecharge = function (model, callback) {
    var sql = new sqlCommand('INSERT INTO skill(name,name_tag,type,need_direction,need_target,use_range,effect_range,recover_energy_type,energy_consume,target_num,create_date) ' +
            'VALUES(?,?,?,?,?,?,?,?,?,?,?)',
        [model.name,model.name_tag,model.type,model.need_direction,model.need_target,model.use_range,model.effect_range
            ,model.recover_energy_type,model.energy_consume,model.target_num,model.create_date]);
    sqlClient.insert(sql, function(error, result){
        if(error)
        {
            console.log(error);
            callback(code.DB.INSERT_DATA_ERROR, code.DB.INSERT_DATA_ERROR);
        }
        else{
            callback(null, model);
        }
    });
};

apple.editRecharge = function (model, callback) {
    var sql = new sqlCommand('UPDATE skill SET name = ?,name_tag = ?,type = ?,need_direction = ?,need_target = ?,use_range = ?,effect_range = ?,recover_energy_type = ?,energy_consume = ?,target_num = ? WHERE recharge_id=?',
        [model.name,model.name_tag,model.type,model.need_direction,model.need_target,model.use_range,model.effect_range
            ,model.recover_energy_type,model.energy_consume,model.target_num,model.recharge_id]);
    sqlClient.update(sql, function(error, result){
        if(error)
        {
            console.log(error);
            callback(code.DB.UPDATE_DATA_ERROR, code.DB.UPDATE_DATA_ERROR);
        }
        else{
            callback(null, model);
        }
    });
};

apple.getAll = function (callback) {
    var sql = new sqlCommand('SELECT * FROM skill');
    sqlClient.query(sql, function(error, results){
        if(error)
            callback(code.DB.INSERT_DATA_ERROR, code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, results);
        }
    });
};

apple.getRecharge = function (recharge_id, callback) {
    var sql = new sqlCommand('SELECT * FROM skill WHERE recharge_id=?', [recharge_id]);
    sqlClient.query(sql, function(error, results){
        if(error)
            callback(code.DB.INSERT_DATA_ERROR, code.DB.INSERT_DATA_ERROR);
        else{
            if(results.length > 0)
                callback(null, results[0]);
            else
                callback(null, null);
        }
    });
};