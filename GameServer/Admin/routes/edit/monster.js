/**
 * Created by David_shen on 10/14/14.
 */

var date = require('../../util/date');
var monsterEditProvider = require('../../data_provider/dao_provider/edit/monster');
var body = {
    title : '怪物',
    message : null
};

exports.index = function(req, res){
    body.message = null;
    monsterEditProvider.getAll(function(error, results){
        body.results = results;
        res.render('edit/monster/index', body);
    });
};

exports.add = function(req, res){
    body.message = null;
    var method = req.method;
    var route = 'edit/monster/add';
    if(method === 'POST'){
        var model = createModel(req);
        model.create_date = new Date();
        monsterEditProvider.addRecharge(model, function(error, result){
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
    var route = 'edit/monster/edit';
    var recharge_id = req.query.id;

    monsterEditProvider.getRecharge(recharge_id, function(error, result){
        if(error){
            res.redirect('monster');
        }
        else{
            if(!result){
                res.redirect('monster');
                return;
            }
            if(method === 'POST'){
                var model = createModel(req);
                model.recharge_id = recharge_id;
                console.log(model);
                monsterEditProvider.editRecharge(model, function(error, result){
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
    var ai_type = req.body.ai_type;

    var speed = req.body.speed;
    var move_power = req.body.move_power;
    var attack_range = req.body.attack_range;
    var move_addition = req.body.move_addition;
    var initiative_skill_id = req.body.initiative_skill_id;
    var passive_skill_id = req.body.passive_skill_id;
    var description = req.body.description;

    var life = req.body.life ;
    var attack = req.body.attack;
    var spell = req.body.spell;
    var armor = req.body.armor;
    var magic_resistance = req.body.magic_resistance;
    var attack_crit_lvl = req.body.attack_crit_lvl;
    var attack_crit_damage_addition_lvl = req.body.attack_crit_damage_addition_lvl;
    var avoid_lvl = req.body.avoid_lvl;
    var hit_lvl = req.body.hit_lvl;
    var suck_blood_lvl = req.body.suck_blood_lvl;
    var initiative_skill_use_rate = req.body.initiative_skill_use_rate;
    var passive_skill_use_rate = req.body.passive_skill_use_rate;

    var model = {
        name : name,
        type :type,
        ai_type:ai_type,
        speed:speed,
        move_power:move_power,
        attack_range : attack_range,
        move_addition:move_addition,
        initiative_skill_id : initiative_skill_id,
        passive_skill_id : passive_skill_id,
        description : description,
        life:life,
        attack:attack,
        spell : spell,
        armor : armor,
        magic_resistance : magic_resistance,
        attack_crit_lvl : attack_crit_lvl,
        attack_crit_damage_addition_lvl:attack_crit_damage_addition_lvl,
        avoid_lvl:avoid_lvl,
        hit_lvl : hit_lvl,
        suck_blood_lvl:suck_blood_lvl,
        initiative_skill_use_rate:initiative_skill_use_rate,
        passive_skill_use_rate : passive_skill_use_rate
    };
    return model;
};

function render(res, route, message){
    body.message = message;
    res.render(route, body);
}