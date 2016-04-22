/**
 * Created by David_shen on 10/14/14.
 */

var code = require('../../../Game/code');
var sqlClient = require('../../../Util/dao/sqlClient').Admin;
var sqlCommand = require('../../../Util/dao/sqlCommand');

apple.addRecharge = function (model, callback) {
    var sql = new sqlCommand('INSERT INTO edit_monster(' +
            'name,type,ai_type,speed,move_power,attack_range,move_addition,initiative_skill_id,passive_skill_id,description,' +
            'life,attack,spell,armor,magic_resistance,attack_crit_lvl,' +
            'attack_crit_damage_addition_lvl,avoid_lvl,hit_lvl,' +
            'suck_blood_lvl,initiative_skill_use_rate,passive_skill_use_rate,' +
            'create_date) ' +
            'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [model.name,model.type,model.ai_type,model.speed,model.move_power,model.attack_range,model.move_addition,model.initiative_skill_id,model.passive_skill_id,model.description
            ,model.life,model.attack,model.spell,model.armor,model.magic_resistance,model.attack_crit_lvl
            ,model.attack_crit_damage_addition_lvl,model.avoid_lvl,model.hit_lvl
            ,model.suck_blood_lvl,model.initiative_skill_use_rate,model.passive_skill_use_rate
            ,model.create_date]);
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
    var sql = new sqlCommand('UPDATE edit_monster SET name = ?,ai_type = ?,type = ?,speed = ?,move_power = ?,attack_range = ?,move_addition = ?,initiative_skill_id = ?,passive_skill_id = ?,description = ?,' +
            'life = ?,attack = ?,spell = ?,armor = ?,magic_resistance = ?,attack_crit_lvl= ?,' +
            'attack_crit_damage_addition_lvl = ?,avoid_lvl= ?,hit_lvl= ?,' +
            'suck_blood_lvl= ?,initiative_skill_use_rate= ?,passive_skill_use_rate= ? WHERE recharge_id=?',
        [model.name,model.ai_type,model.type,model.speed,model.move_power,model.attack_range,model.move_addition,model.initiative_skill_id,model.passive_skill_id,model.description
            ,model.life,model.attack,model.spell,model.armor,model.magic_resistance,model.attack_crit_lvl
            ,model.attack_crit_damage_addition_lvl,model.avoid_lvl,model.hit_lvl
            ,model.suck_blood_lvl,model.initiative_skill_use_rate,model.passive_skill_use_rate
            ,model.recharge_id]);
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
    var sql = new sqlCommand('SELECT * FROM edit_hero WHERE unit_Type = 2');
    sqlClient.query(sql, function(error, results){
        if(error)
            callback(code.DB.INSERT_DATA_ERROR, code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, results);
        }
    });
};

apple.getAllMonsters = function (callback) {
    var sql = new sqlCommand('SELECT * FROM edit_hero WHERE unit_Type = 2');
    sqlClient.query(sql, function(error, results){
        if(error)
            callback(code.DB.INSERT_DATA_ERROR, code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, results);
        }
    });
};


apple.getRecharge = function (recharge_id, callback) {
    var sql = new sqlCommand('SELECT * FROM edit_monster WHERE recharge_id=?', [recharge_id]);
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