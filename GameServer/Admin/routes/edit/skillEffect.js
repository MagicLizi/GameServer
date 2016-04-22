/**
 * Created by David_shen on 10/14/14.
 */

var date = require('../../util/date');
var heroEditProvider = require('../../data_provider/dao_provider/edit/hero');
var body = {
    title : '英雄',
    message : null
};

exports.index = function(req, res){
    body.message = null;
    heroEditProvider.getAll(function(error, results){
        body.results = results;
        res.render('edit/hero/index', body);
    });
};

exports.add = function(req, res){
    body.message = null;
    var method = req.method;
    var route = 'edit/hero/add';
    if(method === 'POST'){
        var model = createModel(req);
        model.create_date = new Date();
        heroEditProvider.addRecharge(model, function(error, result){
            if(error){
                body.message = '添加失败.';
                res.render(route, body);
            }
            else{
                body.message = '添加成功.';
                res.render(route, body);
            }
        });
    }
    else
        res.render(route, body);
};

exports.edit = function(req, res){
    body.message = null;
    var method = req.method;
    var route = 'edit/hero/edit';
    var recharge_id = req.query.id;

    heroEditProvider.getRecharge(recharge_id, function(error, result){
        if(error){
            res.redirect('hero');
        }
        else{
            if(!result){
                res.redirect('hero');
                return;
            }
            if(method === 'POST'){
                var model = createModel(req);
                model.recharge_id = recharge_id;
                console.log(model);
                heroEditProvider.editRecharge(model, function(error, result){
                    if(error){
                        body.message = '更新失败.';
                        res.render(route, body);
                    }
                    else{
                        body.message = '更新成功.';
                        body.result = result;
                        res.render(route, body);
                    }
                });
            }
            else{
                body.result = result;
                res.render(route, body);
            }
        }
    });
};

var createModel = function(req)
{
    var name = req.body.name;
    var type = req.body.type;
    var star_lvl = req.body.star_lvl;
    var quality = req.body.quality;
    var element_type = req.body.element_type;
    var speed = req.body.speed;
    var move_power = req.body.move_power;
    var attack_range = req.body.attack_range;
    var move_addition = req.body.move_addition;
    var initiative_skill_id = req.body.initiative_skill_id;
    var passive_skill_id = req.body.passive_skill_id;
    var description = req.body.description;

    var life = req.body.life ;
    var life_add = req.body.life_add;
    var attack = req.body.attack;
    var attack_add = req.body.attack_add;
    var spell = req.body.spell;
    var spell_add = req.body.spell_add;
    var armor = req.body.armor;
    var armor_add = req.body.armor_add;
    var magic_resistance = req.body.magic_resistance;
    var magic_resistance_add = req.body.magic_resistance_add;
    var attack_crit_lvl = req.body.attack_crit_lvl;
    var attack_crit_lvl_add = req.body.attack_crit_lvl_add;
    var attack_crit_damage_addition_lvl = req.body.attack_crit_damage_addition_lvl;
    var attack_crit_damage_addition_lvl_add = req.body.attack_crit_damage_addition_lvl_add;
    var avoid_lvl = req.body.avoid_lvl;
    var avoid_lvl_add = req.body.avoid_lvl_add;
    var hit_lvl = req.body.hit_lvl;
    var hit_lvl_add = req.body.hit_lvl_add;
    var suck_blood_lvl = req.body.suck_blood_lvl;
    var suck_blood_lvl_add = req.body.suck_blood_lvl_add;
    var initiative_skill_energy_less_lvl = req.body.initiative_skill_energy_less_lvl;
    var initiative_skill_energy_less_lvl_add = req.body.initiative_skill_energy_less_lvl_add;
    var passive_skill_energy_less_lvl = req.body.passive_skill_energy_less_lvl;
    var passive_skill_energy_less_lvl_add = req.body.passive_skill_energy_less_lvl_add;
    var skill_cure_lvl = req.body.skill_cure_lvl;
    var skill_cure_lvl_add = req.body.skill_cure_lvl_add;

    var model = {
        name : name,
        type :type,
        star_lvl : star_lvl,
        quality:quality,
        element_type:element_type,
        speed:speed,
        move_power:move_power,
        attack_range : attack_range,
        move_addition:move_addition,
        initiative_skill_id : initiative_skill_id,
        passive_skill_id : passive_skill_id,
        description : description,
        life:life,
        life_add:life_add,
        attack:attack,
        attack_add:attack_add,
        spell : spell,
        spell_add:spell_add,
        armor : armor,
        armor_add : armor_add,
        magic_resistance : magic_resistance,
        magic_resistance_add :magic_resistance_add,
        attack_crit_lvl : attack_crit_lvl,
        attack_crit_lvl_add:attack_crit_lvl_add,
        attack_crit_damage_addition_lvl:attack_crit_damage_addition_lvl,
        attack_crit_damage_addition_lvl_add:attack_crit_damage_addition_lvl_add,
        avoid_lvl:avoid_lvl,
        avoid_lvl_add : avoid_lvl_add,
        hit_lvl : hit_lvl,
        hit_lvl_add : hit_lvl_add,
        suck_blood_lvl:suck_blood_lvl,
        suck_blood_lvl_add:suck_blood_lvl_add,
        initiative_skill_energy_less_lvl:initiative_skill_energy_less_lvl,
        initiative_skill_energy_less_lvl_add:initiative_skill_energy_less_lvl_add,
        passive_skill_energy_less_lvl : passive_skill_energy_less_lvl,
        passive_skill_energy_less_lvl_add:passive_skill_energy_less_lvl_add,
        skill_cure_lvl : skill_cure_lvl,
        skill_cure_lvl_add : skill_cure_lvl_add
    };
    return model;
};

function render(res, route, message){
    body.message = message;
    res.render(route, body);
}