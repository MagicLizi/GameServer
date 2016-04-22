/**
 * Created by David_shen on 10/14/14.
 */

var date = require('../../util/date');
var heroEditProvider = require('../../data_provider/dao_provider/edit/hero');
var skillEditProvider = require('../../data_provider/dao_provider/edit/skill');
var itemEditProvider = require('../../data_provider/dao_provider/edit/item');
var gameEmuns = require('../../data_provider/dao_provider/edit/enums');
var body = {
    title : '英雄',
    message : null
};

exports.index = function(req, res){
    body.message = null;
    heroEditProvider.getAllUnit(function(error, results){
        body.results = results;
        res.render('edit/hero/index', body);
    });
};

exports.add = function(req, res){
    body.message = null;
    var method = req.method;
    var route = 'edit/hero/add';
    itemEditProvider.getAllEquipment(function(error,resultItem){
        if(error){

        }else{
            var resultArr = new Array();
            resultArr[3]= resultItem;
            skillEditProvider.getAllRanges(function(error,rangesResult){
                if(error){

                }else
                {


                    resultArr[0] = rangesResult;
                    if(method === 'POST'){
                        var model = createModel(req);
                        model.create_date = new Date();
                        model.soul_Stone_Id = 0;
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
                    {
                        skillEditProvider.getAll(function(error,skillresult) {
                            if (error) {

                            } else {
                                resultArr[1] = skillresult;
                                body.result = resultArr;
                                console.log("JSON.stringify(body.result):");
                                console.log(resultArr[3]);
                                res.render(route, body);
                            }


                        });
                    }
                }
            });

        }

    })

};

exports.edit = function(req, res){
    body.message = null;
    var method = req.method;
    var route = 'edit/hero/edit';
    var recharge_id = req.query.id;

    heroEditProvider.getRecharge(recharge_id, function(error, result){
        console.log(error);
        if(error){
            res.redirect('hero');
        }
        else{
            if(!result){
                res.redirect('hero');
                return;
            }
            var resultarr = new Array();
            itemEditProvider.getAllEquipment(function(error,resultItem){
                if(error){

                }else{
                    resultarr[3] = resultItem;
                    skillEditProvider.getAllRanges(function(error,rangeresult){
                        if(error){

                        }else {
                            resultarr[2]=rangeresult;
                            skillEditProvider.getAll(function (error, skillresult) {
                                resultarr[1] = skillresult;
                                itemEditProvider.getItemByType(gameEmuns.Item_Type.SoulStone,function(error,resultSoulStone){
                                    if(error!=null){
                                        console.log(error);
                                    }
                                    else
                                    {
                                        resultarr[4] = resultSoulStone;
                                        if (method === 'POST') {
                                            var model = createModel(req);
                                            model.recharge_id = recharge_id;
                                            console.log(model);
                                            heroEditProvider.editRecharge(model, function (error, resultEdit) {
                                                if (error) {
                                                    body.message = '更新失败.';
                                                    res.render(route, body);
                                                }
                                                else {
                                                    var SoulItem = "";
                                                    resultSoulStone.forEach(function(item){
                                                        if(item.Item_Id == model.soul_Stone_Id){
                                                            SoulItem = item;
                                                            SoulItem.Description = "集齐"+model.name+"所需的"+
                                                            result[0].Summon_Expend+"个灵魂石，即可召唤英雄 ,同时也是"+model.name+"进化的材料"
                                                        }
                                                    });
                                                    itemEditProvider.editItem(SoulItem,function(error,resultUpdateItem){
                                                        if(error!=null){
                                                            console.log(error);
                                                            callback(error,null);
                                                        }
                                                        else
                                                        {
                                                            body.message = '更新成功.';
                                                            console.log(resultEdit);
                                                            resultarr[0] = resultEdit;
                                                            body.result = resultarr;
                                                            res.render(route, body);
                                                        }
                                                    })

                                                }
                                            });
                                        }
                                        else {

                                            resultarr[0] = result;
                                            //result = resultarr;
                                            body.result = resultarr;
                                            console.log("body:",body.result[0][0]);
                                            res.render(route, body);
                                        }
                                    }
                                })

                            });
                        }
                    });

                }

            });
         }
    });

};

var createModel = function(req)
{
    var hero_Tag_Id = req.body.hero_Tag_Id;
    var name = req.body.name;
    var hero_Tag = req.body.hero_Tag;
    var type = req.body.type;
    var star_lvl = req.body.star_lvl;
    var quality = req.body.quality;
    var element_type = req.body.element_type;
    var speed = req.body.speed;
    var move_power = req.body.move_power;
    var attack_range = JSON.parse(req.body.attack_range);
    var move_addition = req.body.move_addition;
    var initiative_skill_id = req.body.initiative_skill_id;
    var passive_skill_id = req.body.passive_skill_id;
    var description = req.body.description;
    var characteristic_skill_id = req.body.characteristic_skill_id;
    var t_value = req.body.t_value;
    var t_enable = req.body.t_enable;
    var unit_Type = req.body.unit_Type;
    var position_type =req.body.position_type;
    var first_target_tvalue = req.body.first_target_tvalue;
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
    var life_Restore = req.body.life_Restore;
    var life_Restore_add = req.body.life_Restore_add;
    var energy_Restore = req.body.energy_Restore;
    var energy_Restore_add = req.body.energy_Restore_add;
    var Hero_Equipment1 = req.body.Hero_Equipment1;
    var Hero_Equipment2 = req.body.Hero_Equipment2;
    var Hero_Equipment3 = req.body.Hero_Equipment3;
    var Hero_Equipment4 = req.body.Hero_Equipment4;
    var Hero_Equipment5 = req.body.Hero_Equipment5;
    var Hero_Equipment6 = req.body.Hero_Equipment6;
    var soul_Stone_Id =  req.body.soulStone;
    var model = {
        hero_Tag_Id:hero_Tag_Id,
        name : name,
        hero_Tag:hero_Tag,
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
        characteristic_skill_id : characteristic_skill_id,
        t_value : t_value,
        t_enable : t_enable,
        unit_Type:unit_Type,
        position_type:position_type,
        first_target_tvalue:first_target_tvalue,
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
        skill_cure_lvl_add : skill_cure_lvl_add,
        life_Restore :life_Restore,
        life_Restore_add :life_Restore_add,
        energy_Restore :energy_Restore,
        energy_Restore_add :energy_Restore_add,
        Hero_Equipment1 : Hero_Equipment1,
        Hero_Equipment2 : Hero_Equipment2,
        Hero_Equipment3 : Hero_Equipment3,
        Hero_Equipment4 : Hero_Equipment4,
        Hero_Equipment5 : Hero_Equipment5,
        Hero_Equipment6 : Hero_Equipment6,
        soul_Stone_Id:soul_Stone_Id

};
    return model;
};

function render(res, route, message){
    body.message = message;
    res.render(route, body);
}




