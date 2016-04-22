/**
 * Created by peihengyang on 14/12/8.
 */
var code = require('../../../ServerConfigs/code');
var sqlClient = require('../../../Util/dao/sqlClient').Admin;
var sqlCommand = require('../../../Util/dao/sqlCommand');
var hero = module.exports;


hero.getNextQualityHero = function(heroId,callback){
    console.log('heroid:');
    console.log(heroId);
    var sql = new sqlCommand('SELECT * FROM edit_hero WHERE hero_Tag = (SELECT hero_Tag FROM edit_hero WHERE ' +
        'recharge_id = ?) AND quality =  (SELECT quality FROM edit_hero WHERE recharge_id = ?) + 1 AND unit_Type =1',
        [heroId,heroId]);
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


hero.addRecharge = function (model, callback) {
    var max_hero_idsql =new sqlCommand('SELECT MAX(hero_Id) as max_Hero_Id FROM edit_hero');
    var max_hero_id = null;
    sqlClient.query(max_hero_idsql, function(error, result){
        if(error)
        {
            console.log(error);
            callback(code.DB.INSERT_DATA_ERROR, code.DB.INSERT_DATA_ERROR);
        }
        else{
            max_hero_id = result[0].max_Hero_Id;
            max_hero_id++;
            model.hero_Id = max_hero_id;
            for(var i =0;i<5;i++){
                console.log(model);
                var sql = new sqlCommand('INSERT INTO edit_hero(' +
                        'hero_Id,name,type,star_lvl,quality,element_type,speed,move_power,attack_range,move_addition,initiative_skill_id' +
                        ',passive_skill_id,description,life,life_add,attack,attack_add,spell,spell_add,armor,armor_add' +
                        ',magic_resistance,magic_resistance_add,attack_crit_lvl,attack_crit_lvl_add,attack_crit_damage_addition_lvl' +
                        ',attack_crit_damage_addition_lvl_add,avoid_lvl,avoid_lvl_add,hit_lvl,hit_lvl_add,' +
                        'suck_blood_lvl,suck_blood_lvl_add,initiative_skill_energy_less_lvl,initiative_skill_energy_less_lvl_add' +
                        ',passive_skill_energy_less_lvl,passive_skill_energy_less_lvl_add,skill_cure_lvl,skill_cure_lvl_add,' +
                        'characteristic_skill_id,t_value,t_enable,unit_Type,life_Restore,life_Restore_add,' +
                        'energy_Restore,energy_Restore_add,position_type,first_target_tvalue,hero_Tag,create_date) ' +
                        'VALUES(?,?,?,?,?,?,?,?,?,?,?,' +
                        '?,?,?,?,?,?,?,?,?,?,' +
                        '?,?,?,?,?,' +
                        '?,?,?,?,?,' +
                        '?,?,?,?,' +
                        '?,?,?,?,' +
                        '?,?,?,?,?,?,' +
                        '?,?,?,?,?,?,' +
                        '?,?,?,?,?,?)',
                    [model.hero_Id,model.name,model.type,model.star_lvl,i,model.element_type,model.speed,model.move_power,model.attack_range,model.move_addition,model.initiative_skill_id,
                        model.passive_skill_id,model.description,model.life,model.life_add,model.attack,model.attack_add,model.spell,model.spell_add,model.armor,model.armor_add,
                        model.magic_resistance,model.magic_resistance_add,model.attack_crit_lvl,model.attack_crit_lvl_add,model.attack_crit_damage_addition_lvl,
                        model.attack_crit_damage_addition_lvl_add,model.avoid_lvl,model.avoid_lvl_add,model.hit_lvl,model.hit_lvl_add,
                        model.suck_blood_lvl,model.suck_blood_lvl_add,model.initiative_skill_energy_less_lvl,model.initiative_skill_energy_less_lvl_add,
                        model.passive_skill_energy_less_lvl,model.passive_skill_energy_less_lvl_add,model.skill_cure_lvl,model.skill_cure_lvl_add,
                        model.characteristic_skill_id,model.t_value,model.t_enable,model.unit_Type,model.life_Restore,model.life_Restore_add,
                        model.energy_Restore,model.energy_Restore_add,model.position_type,model.first_target_tvalue,model.hero_Tag,model.create_date]);

                sqlClient.insert(sql, function(error, result){
                    if(error)
                    {
                        console.log(error);
                        callback(code.DB.INSERT_DATA_ERROR, code.DB.INSERT_DATA_ERROR);
                    }
                    else{
                        //model.hero_Id = max_hero_id;
                        callback(null, model);
                    }
                });
            }
        }
    })

};

hero.editRecharge = function (model, callback) {
    console.log("start");
    var sql = new sqlCommand('UPDATE edit_hero SET life = ?,life_add = ?,attack = ?,attack_add = ?,spell = ?,spell_add = ?,' +
            'armor = ?,armor_add = ?,magic_resistance = ?,magic_resistance_add = ?,attack_crit_lvl= ?,attack_crit_lvl_add= ?,' +
            'attack_crit_damage_addition_lvl = ?,attack_crit_damage_addition_lvl_add= ?,avoid_lvl= ?,avoid_lvl_add= ?,hit_lvl= ?,hit_lvl_add= ?,' +
            'suck_blood_lvl= ?,suck_blood_lvl_add= ?,initiative_skill_energy_less_lvl= ?,initiative_skill_energy_less_lvl_add= ?,passive_skill_energy_less_lvl= ?,passive_skill_energy_less_lvl_add= ?,' +
            'skill_cure_lvl= ?,skill_cure_lvl_add = ?,life_Restore=?,life_Restore_add=?,energy_Restore=?,energy_Restore_add=?' +
            ',Hero_Equipment1 =?,Hero_Equipment2=?,Hero_Equipment3=?,Hero_Equipment4=?,Hero_Equipment5=?,' +
            'Hero_Equipment6=?  WHERE recharge_id=?',
        [model.life,model.life_add,model.attack,model.attack_add,model.spell,model.spell_add,model.armor,model.armor_add,model.magic_resistance,model.magic_resistance_add,model.attack_crit_lvl,model.attack_crit_lvl_add
            ,model.attack_crit_damage_addition_lvl,model.attack_crit_damage_addition_lvl_add,model.avoid_lvl,model.avoid_lvl_add,model.hit_lvl,model.hit_lvl_add
            ,model.suck_blood_lvl,model.suck_blood_lvl_add,model.initiative_skill_energy_less_lvl,model.initiative_skill_energy_less_lvl_add,model.passive_skill_energy_less_lvl,model.passive_skill_energy_less_lvl_add
            ,model.skill_cure_lvl,model.skill_cure_lvl_add,model.life_Restore,model.life_Restore_add,model.energy_Restore,
            model.energy_Restore_add, model.Hero_Equipment1,model.Hero_Equipment2,model.Hero_Equipment3,
            model.Hero_Equipment4,model.Hero_Equipment5,model.Hero_Equipment6,model.recharge_id]);
    sqlClient.update(sql, function(error, result){
        if(error)
        {
            console.log("error update1:"+error);
            callback(code.DB.UPDATE_DATA_ERROR, code.DB.UPDATE_DATA_ERROR);
        }
        else{
            var sqlComm = new sqlCommand('UPDATE edit_hero SET name = ?,type = ?,star_lvl = ?,element_type = ?,speed =? ,move_power = ? ,' +
                    'attack_range = ?,move_addition = ?,initiative_skill_id = ?,passive_skill_id = ?,description = ?,characteristic_skill_id = ?,' +
                    't_value =?,t_enable=?,position_type = ?,unit_Type = ?,' +
                    'first_target_tvalue = ?,hero_Tag = ? ,life_add = ?,attack_add = ?,spell_add = ?,armor_add = ?,' +
                    'magic_resistance_add = ?,attack_crit_lvl_add= ?,attack_crit_damage_addition_lvl_add= ?,avoid_lvl_add= ?,hit_lvl_add= ?,' +
                    'suck_blood_lvl_add= ?,initiative_skill_energy_less_lvl_add= ?,passive_skill_energy_less_lvl_add= ?,' +
                    'skill_cure_lvl_add = ?,life_Restore_add=?,energy_Restore_add=? WHERE hero_Id = ?',
                [model.name,model.type,model.star_lvl,model.element_type,model.speed,model.move_power,model.attack_range,
                    model.move_addition,model.initiative_skill_id,model.passive_skill_id,model.description,
                    model.characteristic_skill_id,model.t_value,model.t_enable,model.position_type,model.unit_Type,
                    model.first_target_tvalue,model.hero_Tag,model.life_add,model.attack_add,model.spell_add,model.armor_add,
                    model.magic_resistance_add,model.attack_crit_lvl_add,model.attack_crit_damage_addition_lvl_add,model.avoid_lvl_add,model.hit_lvl_add,
                    model.suck_blood_lvl_add,model.initiative_skill_energy_less_lvl_add,model.passive_skill_energy_less_lvl_add,
                    model.skill_cure_lvl_add,model.life_Restore_add,model.energy_Restore_add,model.hero_Id]);
            console.log("heroId:"+model.hero_Id);
            sqlClient.update(sqlComm, function(error, result){
                if(error)
                {
                    console.log("error update2:"+error);
                    callback(code.DB.UPDATE_DATA_ERROR, code.DB.UPDATE_DATA_ERROR);
                }
                else{
                    apple.getRecharge(model.recharge_id,function(error,results){
                        callback(null, results);
                    })

                }
            });

        }
    });
};

hero.getAll = function (callback) {
    var sql = new sqlCommand('SELECT * FROM edit_hero ORDER BY recharge_id');
    sqlClient.query(sql, function(error, results){
        if(error)
            callback(code.DB.INSERT_DATA_ERROR, code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, results);
        }
    });
};

hero.getAllUnit = function (callback) {
    var sql = new sqlCommand('SELECT distinct recharge_id,name,unit_Type,create_date FROM edit_hero group by hero_Id order by quality');
    sqlClient.query(sql, function(error, results){
        if(error)
            callback(code.DB.INSERT_DATA_ERROR, code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, results);
        }
    });
};


hero.getAllMonsters = function (callback) {
    var sql = new sqlCommand('SELECT * FROM edit_hero order by name,quality' );//WHERE unit_Type = 2');
    sqlClient.query(sql, function(error, results){
        if(error)
            callback(code.DB.INSERT_DATA_ERROR, code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, results);
        }
    });
};



hero.getRecharge = function (recharge_id, callback) {
    var sql = new sqlCommand('SELECT *, -1 as orders FROM edit_hero WHERE recharge_id=? ' +
        'UNION ALL SELECT *,quality as orders FROM edit_hero WHERE hero_Id = (SELECT hero_Id FROM edit_hero WHERE recharge_id=?) order by orders', [recharge_id,recharge_id]);
    sqlClient.query(sql, function(error, results){
        if(error)
            callback(code.DB.INSERT_DATA_ERROR, code.DB.INSERT_DATA_ERROR);
        else{

            console.log(results);
            if(results.length > 0)
                callback(null, results);
            else
                callback(null, null);
        }
    });
};


hero.getHeroById = function (recharge_id, callback) {
    var sql = new sqlCommand('SELECT * FROM edit_hero WHERE recharge_id=? ', [recharge_id]);
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