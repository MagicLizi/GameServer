/**
 * Created by David_shen on 10/14/14.
 */

var date = require('../../util/date');
var skillEditProvider = require('../../data_provider/dao_provider/edit/skill');
var body = {
    title : '技能',
    message : null
};




exports.index = function(req, res){
    body.message = null;
    skillEditProvider.getAll(function(error, results){
        body.results = results;
        console.log("results");
        console.log(results);
        res.render('edit/skill/index', body);
    });
};

exports.indexRange = function(req, res){
    body.message = null;
    var Skill_Id = req.query.id;
    skillEditProvider.getAllRanges(function(error, results){
        body.results = results;
        body.Skill_Id = Skill_Id;
        console.log("results");
        console.log(results);
        res.render('edit/skill/indexRange', body);
    });
};

exports.add = function(req, res){
    body.message = null;
    var method = req.method;
    var route = 'edit/skill/add';
    skillEditProvider.getAllRanges(function(error,result){
        var resultarr= new Array();
        resultarr[1] = result;
    if(method === 'POST'){
        var model = createModel(req);
        model.Create_Date = new Date();
        model.Skill_Effect = JSON.stringify({
            "Skill_Effect_Arr": []
        });
        skillEditProvider.addSkill(model, function(error, result){
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

            body.result = resultarr;
            res.render(route, body);


    }
    })
};


exports.addRange = function(req, res){
    body.message = null;
    body.Range_Json = JSON.stringify({Range:[{}]});
    var method = req.method;
    var route = 'edit/skill/addRange';
    if(method === 'POST'){

        console.log("body.Range_Json:"+req.body.Range_Json_in);
        var model = createRangeModel(req);
        model.Create_Date = new Date().format('yyyy-MM-dd hh:mm:ss');
        skillEditProvider.addRange(model, function(error, result){
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
    var route = 'edit/skill/edit';
    var Skill_Id = req.query.id;

    skillEditProvider.getSkillById(Skill_Id, function(error, result){
        if(error){
            res.redirect('skill');
        }
        else{
            if(!result){
                res.redirect('skill');
                return;
            }
            if(method === 'POST'){

                var model = createModel(req);
                model.Skill_Id = Skill_Id;
                skillEditProvider.editSkill(model, function(error, result){
                    if(error){
                        body.message = '更新失败.';
                        res.render(route, body);
                    }
                    else{
                        body.message = '更新成功.';
                        var resultarr = new Array();
                        resultarr[0] =model;
                        skillEditProvider.getAllRanges(function(error,resultRanges){
                            resultarr[1] = resultRanges;
                            resultarr[2] = JSON.stringify(Skill_Effect_Config);
                            body.result = resultarr;
                            res.render(route, body);
                        })
                    }
                });
            }
            else{
                var resultarr = new Array();
                resultarr[0] =result;
                skillEditProvider.getAllRanges(function(error,resultRanges){
                    resultarr[1] = resultRanges;
                    resultarr[2] = JSON.stringify(Skill_Effect_Config);
                    body.result = resultarr;
                    res.render(route, body);
                })

            }
        }
    });
};




exports.editRange = function(req, res){
    body.message = null;
    var method = req.method;
    var route = 'edit/skill/editRange';
    var Range_Id = req.query.id;

    skillEditProvider.getRangeById(Range_Id, function(error, result){
        if(error){
            res.redirect('skill/indexRange');
        }
        else{
            if(!result){
                res.redirect('skill/indexRange');
                return;
            }
            if(method === 'POST'){

                var model = createRangeModel(req);
                model.Range_Id = Range_Id;
                skillEditProvider.editRange(model, function(error, resultedit){
                    if(error){
                        body.message = '更新失败.';
                        res.render(route, body);
                    }
                    else{
                        body.message = '更新成功.';
                        var resultarr = new Array();
                        resultarr[0] = model;
                        body.result = resultarr;
                        res.render(route,body);
                    }
                });
            }
            else{
                result.Range_Json = JSON.stringify(result.Range_Json);
                body.result = result;
                console.log(body.result[0] .Range_Json);
                res.render(route,body);
            }
        }
    });
};

var createModel = function(req)
{
    var Skill_Name = req.body.Skill_Name;
    var Skill_Type = req.body.Skill_Type;
    var Need_Target = req.body.Need_Target;
    var Skill_Use_Range = JSON.parse(req.body.Skill_Use_Range);
    var Skill_Effect_Range = JSON.parse(req.body.Skill_Effect_Range);
    var Energy_Expends = req.body.Energy_Expends;
    var Target_Num = req.body.Target_Num;
    var Skill_Description = req.body.Skill_Description;
    var Duration_Rounds = req.body.Duration_Rounds;
    var Skill_Icon_Url = req.body.Skill_Icon_Url;
    var Skill_Particle_Url = req.body.Skill_Particle_Url;
    var Skill_Tag = req.body.Skill_Tag;
    var Skill_Order = req.body.Skill_Order;
    var Skill_Effect = req.body.Skill_Effect;
    var Skill_Target_Type = req.body.Skill_Target_Type;
    var model = {
        Skill_Name : Skill_Name,
        Skill_Type:Skill_Type,
        Need_Target :Need_Target,
        Skill_Use_Range : Skill_Use_Range,
        Skill_Effect_Range : Skill_Effect_Range,
        Energy_Expends:Energy_Expends,
        Target_Num:Target_Num,
        Skill_Description:Skill_Description,
        Duration_Rounds:Duration_Rounds,
        Skill_Icon_Url : Skill_Icon_Url,
        Skill_Particle_Url : Skill_Particle_Url,
        Skill_Tag : Skill_Tag,
        Skill_Order : Skill_Order,
        Skill_Effect : Skill_Effect,
        Skill_Target_Type:Skill_Target_Type
    };
    return model;
};



var createRangeModel = function(req)
{
    var Range_Name = req.body.Range_Name;
    var Range_Description = req.body.Range_Description;
    var Range_Json = req.body.Range_Json_in;

    var model = {
        Range_Name : Range_Name,
        Range_Description:Range_Description,
        Range_Json :Range_Json
    };
    return model;
};


function render(res, route, message){
    body.message = message;
    res.render(route, body);
}


var Skill_Effect_Config = {
    "Skill_Effect_Arr": [
        {
            "id": "physical_Damage",
            "name": "造成物理伤害",
            "description": "造成物理伤害",
            "param": [
                {
                    "id": "x",
                    "name": "伤害参数x",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "伤害参数y",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "伤害参数z",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "伤害参数x成长值ux",
                    "value": 0
                },
                {
                    "id": "n",
                    "name": "伤害参数y成长值uy",
                    "value": 0
                },
                {
                    "id": "o",
                    "name": "伤害参数z成长值uz",
                    "value": 0
                },
                {
                    "id": "p",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "q",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "r",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "s",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "magic_Damage",
            "name": "造成法术伤害",
            "description": "造成法术伤害",
            "param": [
                {
                    "id": "x",
                    "name": "伤害参数x",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "伤害参数y",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "伤害参数z",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "伤害参数x成长值ux",
                    "value": 0
                },
                {
                    "id": "n",
                    "name": "伤害参数y成长值uy",
                    "value": 0
                },
                {
                    "id": "o",
                    "name": "伤害参数z成长值uz",
                    "value": 0
                },
                {
                    "id": "p",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "q",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "r",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "s",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "Reapers_Scythe",
            "name": "死神镰刀效果",
            "description": "根据目标损失血量，造成不同的伤害",
            "param": [
                {
                    "id": "x",
                    "name": "伤害参数x",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "法伤收益率y",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "最大伤害值z",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "伤害参数x成长值ux",
                    "value": 0
                },
                {
                    "id": "n",
                    "name": "伤害参数y成长值uy",
                    "value": 0
                },
                {
                    "id": "o",
                    "name": "伤害参数z成长值uz",
                    "value": 0
                },
                {
                    "id": "p",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "q",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "r",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "s",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "charge_property",
            "name": "增减属性效果",
            "description": "增减单位硬数值属性效果",
            "param": [
                {
                    "id": "x",
                    "name": "增减数值参数x",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "增减数值参数x成长值ux",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "n",
                    "name": "增减益属性类型（枚举）",
                    "value": 0
                },
                {
                    "id": "o",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "Heal_HP",
            "name": "治疗效果",
            "description": "治疗效果",
            "param": [
                {
                    "id": "x",
                    "name": "治疗参数x",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "治疗参数y",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "治疗参数z",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "治疗参数x成长值ux",
                    "value": 0
                },
                {
                    "id": "n",
                    "name": "治疗参数y成长值uy",
                    "value": 0
                },
                {
                    "id": "o",
                    "name": "治疗参数z成长值uz",
                    "value": 0
                },
                {
                    "id": "p",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "q",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "r",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "s",
                    "name": "作用时间点",
                    "value": 0
                },
                {
                    "id": "u",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "physical_Damage_Deduction",
            "name": "物理伤害减免效果",
            "description": "减免受到的物理伤害",
            "param": [
                {
                    "id": "x",
                    "name": "伤害减免参数x",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "伤害减免参数x成长值ux",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "n",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "o",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "magic_Damage_Deduction",
            "name": "法术伤害减免效果",
            "description": "减免受到的法术伤害",
            "param": [
                {
                    "id": "x",
                    "name": "伤害减免参数x",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "伤害减免参数x成长值ux",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "n",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "o",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "physical_Damage_Increase",
            "name": "物理伤害加深效果",
            "description": "增加最终造成的物理伤害",
            "param": [
                {
                    "id": "x",
                    "name": "伤害增加参数x",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "伤害增加参数x成长值ux",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "n",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "o",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                }
            ]
        },
        {
            "id": "magic_Damage_Increase",
            "name": "法术伤害加深效果",
            "description": "减免受到的法术伤害",
            "param": [
                {
                    "id": "x",
                    "name": "伤害增加参数x",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "伤害增加参数x成长值ux",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "n",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "o",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "Absorb_Shield",
            "name": "吸收护盾效果",
            "description": "通过增加护盾吸收一切伤害的效果",
            "param": [
                {
                    "id": "x",
                    "name": "护盾值参数x",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "护盾值参数x成长值ux",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "n",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "o",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "Move",
            "name": "位移效果",
            "description": "将战斗单位从某一个位置强制移动到另一个位置的效果",
            "param": [
                {
                    "id": "x",
                    "name": "位移值参数x",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "位移值增加参数x成长值ux",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "Be_Harm_to_Health",
            "name": "被伤害回血效果",
            "description": "造成伤害时按一定比例回复生命",
            "param": [
                {
                    "id": "x",
                    "name": "低生命自动触发参数x(生命低于百分之x时自动触发)",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "伤害转化比参数y",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "伤害转化比参数y成长值uy",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "n",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "o",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "p",
                    "name": "每场战斗触发次数参数z",
                    "value": 0
                },
                {
                    "id": "q",
                    "name": "每场战斗触发次数参数z成长值uz",
                    "value": 0
                },
                {
                    "id": "r",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "Harm_To_Health",
            "name": "伤害回血效果",
            "description": "造成伤害时按一定比例回复生命",
            "param": [
                {
                    "id": "x",
                    "name": "伤害回血转化比参数x",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "伤害转化比参数x成长值ux",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "n",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "o",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "Silence_Effect",
            "name": "沉默效果",
            "description": "受到沉默的单位在效果时间内无法释放技能",
            "param": [
                {
                    "id": "x",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "Skill_FightBack",
            "name": "技能反击效果",
            "description": "受到技能伤害时对技能来源者进行反击",
            "param": [
                {
                    "id": "x",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "PhysicalDamage_FightBack",
            "name": "物理反击效果",
            "description": "受到物理伤害时对物理来源者进行反击",
            "param": [
                {
                    "id": "x",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "Sneer_Effect",
            "name": "嘲讽效果",
            "description": "强制单位攻击自己",
            "param": [
                {
                    "id": "x",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "Ignore_PhysicalDamage_Immune",
            "name": "无视物免效果",
            "description": "物理攻击时无视对方任何物理免疫效果",
            "param": [
                {
                    "id": "x",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "Ignore_MagicDamage_Immune",
            "name": "无视魔免效果",
            "description": "免疫单位受到的一切魔法伤害",
            "param": [
                {
                    "id": "x",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "Remove_Energy",
            "name": "消除能量效果",
            "description": "消除目标单位一定数值的当前能量",
            "param": [
                {
                    "id": "x",
                    "name": "消除能量参数x",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "消除能量参数成长值ux",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "n",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "o",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "Dizzy_Effect",
            "name": "眩晕效果",
            "description": "眩晕目标单位",
            "param": [
                {
                    "id": "x",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "Beat_Back",
            "name": "击退效果",
            "description": "击退目标单位",
            "param": [
                {
                    "id": "x",
                    "name": "击退格数参数x",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "击退格数参数x成长值ux",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "作用时间点",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "Extra_Skill",
            "name": "多重施法效果",
            "description": "有概率释放同一法术多次的效果",
            "param": [
                {
                    "id": "x",
                    "name": "多释放1次概率x",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "多释放1次概率x成长值ux",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "多释放2次概率y",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "多释放2次概率x成长值uy",
                    "value": 0
                },
                {
                    "id": "n",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "o",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "p",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "q",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "Extra_Attack",
            "name": "多重攻击效果",
            "description": "某次攻击转化为多次攻击",
            "param": [
                {
                    "id": "x",
                    "name": "转化攻击次数参数x",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "转化攻击次数参数x成长值ux",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "多重攻击伤害增益参数y",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "多重攻击伤害增益参数y成长值uy",
                    "value": 0
                },
                {
                    "id": "n",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "o",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "p",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "q",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "LastKill",
            "name": "斩杀效果",
            "description": "某个百分比生命下直接秒杀单位的效果",
            "param": [
                {
                    "id": "x",
                    "name": "伤害参数x",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "伤害参数y",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "伤害参数z",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "伤害参数x成长值ux",
                    "value": 0
                },
                {
                    "id": "n",
                    "name": "伤害参数y成长值uy",
                    "value": 0
                },
                {
                    "id": "o",
                    "name": "伤害参数z成长值uz",
                    "value": 0
                },
                {
                    "id": "p",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "q",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "r",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "s",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "PhysicalDamage_Immune",
            "name": "物理免疫效果",
            "description": "免疫单位受到的一切物理伤害",
            "param": [
                {
                    "id": "x",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "MagicDamage_Immune",
            "name": "魔法免疫效果",
            "description": "免疫单位受到的一切魔法伤害",
            "param": [
                {
                    "id": "x",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "Weak_Effect",
            "name": "虚弱效果",
            "description": "降低目标普通攻击所造成伤害的百分之多少",
            "param": [
                {
                    "id": "x",
                    "name": "百分比参数x",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "百分比参数x成长值ux",
                    "value": 0
                },
                {
                    "id": "n",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "o",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "p",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "Firing_Effect",
            "name": "灼烧效果",
            "description": "对目标造成一个持续多个回合的DEBUFF，每个回合结束时造成伤害；",
            "param": [
                {
                    "id": "x",
                    "name": "伤害参数x",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "伤害参数y",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "伤害参数z",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "伤害参数x成长值ux",
                    "value": 0
                },
                {
                    "id": "n",
                    "name": "伤害参数y成长值uy",
                    "value": 0
                },
                {
                    "id": "o",
                    "name": "伤害参数z成长值uz",
                    "value": 0
                },
                {
                    "id": "p",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "q",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "r",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "s",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "Boost_Effect",
            "name": "推进加成效果",
            "description": "根据技能目标与自己的距离对伤害有个收益率的效果；",
            "param": [
                {
                    "id": "x",
                    "name": "伤害参数x",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "伤害参数y",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "伤害参数z",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "伤害参数x成长值ux",
                    "value": 0
                },
                {
                    "id": "n",
                    "name": "伤害参数y成长值uy",
                    "value": 0
                },
                {
                    "id": "o",
                    "name": "伤害参数z成长值uz",
                    "value": 0
                },
                {
                    "id": "p",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "q",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "r",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "s",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "Fear_Effect",
            "name": "竭心光环",
            "description": "对特定范围内的所有敌人释放一层诅咒，该诅咒将对目标造成其最大生命值X%的伤害；",
            "param": [
                {
                    "id": "x",
                    "name": "伤害参数x",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "伤害参数y",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "伤害参数z",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "伤害参数x成长值ux",
                    "value": 0
                },
                {
                    "id": "n",
                    "name": "伤害参数y成长值uy",
                    "value": 0
                },
                {
                    "id": "o",
                    "name": "伤害参数z成长值uz",
                    "value": 0
                },
                {
                    "id": "p",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "q",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "r",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "s",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "Electric_Field_Effect",
            "name": "静电场效果",
            "description": "每次释放技能时，都会对释放范围内的所有敌方单位造成当前生命值X%的伤害；",
            "param": [
                {
                    "id": "x",
                    "name": "伤害参数x",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "伤害参数y",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "伤害参数z",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "伤害参数x成长值ux",
                    "value": 0
                },
                {
                    "id": "n",
                    "name": "伤害参数y成长值uy",
                    "value": 0
                },
                {
                    "id": "o",
                    "name": "伤害参数z成长值uz",
                    "value": 0
                },
                {
                    "id": "p",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "q",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "r",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "s",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "Plasma_Effect",
            "name": "等离子场效果",
            "description": "在当前格子释放一道威力随扩张成都提升的等离子能量场，收缩时也会对经过的敌人造成伤害，等离子场范围7*7，造成的伤害=X*相差距离；",
            "param": [
                {
                    "id": "x",
                    "name": "伤害参数x",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "伤害参数y",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "伤害参数z",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "伤害参数x成长值ux",
                    "value": 0
                },
                {
                    "id": "n",
                    "name": "伤害参数y成长值uy",
                    "value": 0
                },
                {
                    "id": "o",
                    "name": "伤害参数z成长值uz",
                    "value": 0
                },
                {
                    "id": "p",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "q",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "r",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "s",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "Mana_Void_Effect",
            "name": "法力虚空效果",
            "description": "对5*5范围内的一个敌方目标以及其3*3范围内的敌方单位造成伤害，伤害=X+能量损耗百分比*Y+能量损耗量*Z；",
            "param": [
                {
                    "id": "x",
                    "name": "伤害参数x",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "伤害参数y",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "伤害参数z",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "伤害参数x成长值ux",
                    "value": 0
                },
                {
                    "id": "n",
                    "name": "伤害参数y成长值uy",
                    "value": 0
                },
                {
                    "id": "o",
                    "name": "伤害参数z成长值uz",
                    "value": 0
                },
                {
                    "id": "p",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "q",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "r",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "s",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "Mana_Burn_Effect",
            "name": "法力燃烧效果",
            "description": "对5*5范围内的一个敌方目标，造成X点伤害，并消除目标Y点能量；",
            "param": [
                {
                    "id": "x",
                    "name": "伤害参数x",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "伤害参数y",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "伤害参数z",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "伤害参数x成长值ux",
                    "value": 0
                },
                {
                    "id": "n",
                    "name": "伤害参数y成长值uy",
                    "value": 0
                },
                {
                    "id": "o",
                    "name": "伤害参数z成长值uz",
                    "value": 0
                },
                {
                    "id": "p",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "q",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "r",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "s",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "Mana_Break_Effect",
            "name": "法力损毁效果",
            "description": "物理攻击将消除目标X点能量，并且增加X*Y点伤害；",
            "param": [
                {
                    "id": "x",
                    "name": "伤害参数x",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "伤害参数y",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "伤害参数z",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "伤害参数x成长值ux",
                    "value": 0
                },
                {
                    "id": "n",
                    "name": "伤害参数y成长值uy",
                    "value": 0
                },
                {
                    "id": "o",
                    "name": "伤害参数z成长值uz",
                    "value": 0
                },
                {
                    "id": "p",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "q",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "r",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "s",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "Bloodthirsty_Effect",
            "name": "嗜血效果",
            "description": "增加目标普通攻击伤害万分之X与路径加成系数Y点；",
            "param": [
                {
                    "id": "x",
                    "name": "伤害参数x",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "伤害参数y",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "伤害参数z",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "伤害参数x成长值ux",
                    "value": 0
                },
                {
                    "id": "n",
                    "name": "伤害参数y成长值uy",
                    "value": 0
                },
                {
                    "id": "o",
                    "name": "伤害参数z成长值uz",
                    "value": 0
                },
                {
                    "id": "p",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "q",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "r",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "s",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        }, {
            "id": "CounterScrew_Effect",
            "name": "反击螺旋效果",
            "description": "受到伤害时有概率触发反击螺旋，对周围敌人造成伤害；",
            "param": [
                {
                    "id": "x",
                    "name": "伤害参数x",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "伤害参数y",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "伤害参数z",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "伤害参数x成长值ux",
                    "value": 0
                },
                {
                    "id": "n",
                    "name": "伤害参数y成长值uy",
                    "value": 0
                },
                {
                    "id": "o",
                    "name": "伤害参数z成长值uz",
                    "value": 0
                },
                {
                    "id": "p",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "q",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "r",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "s",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "Imprisonment_Effect",
            "name": "禁锢效果",
            "description": "使目标在T个回合内无法移动与攻击，但可以使用技能；",
            "param": [
                {
                    "id": "x",
                    "name": "伤害参数x",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "伤害参数y",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "伤害参数z",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "伤害参数x成长值ux",
                    "value": 0
                },
                {
                    "id": "n",
                    "name": "伤害参数y成长值uy",
                    "value": 0
                },
                {
                    "id": "o",
                    "name": "伤害参数z成长值uz",
                    "value": 0
                },
                {
                    "id": "p",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "q",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "r",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "s",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "charge_property2",
            "name": "增减属性效果2",
            "description": "增减单位硬数值属性效果2",
            "param": [
                {
                    "id": "x",
                    "name": "增减数值参数x",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "增减数值参数x成长值ux",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "n",
                    "name": "增减益属性类型（枚举）",
                    "value": 0
                },
                {
                    "id": "o",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "charge_property3",
            "name": "增减属性效果3",
            "description": "增减单位硬数值属性效果3",
            "param": [
                {
                    "id": "x",
                    "name": "增减数值参数x",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "增减数值参数x成长值ux",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "n",
                    "name": "增减益属性类型（枚举）",
                    "value": 0
                },
                {
                    "id": "o",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "Searing Arrows",
            "name": "灼热之箭效果",
            "description": "按普通伤害百分比，增加灼热的魔法效果；",
            "param": [
                {
                    "id": "x",
                    "name": "伤害参数x",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "伤害参数y",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "伤害参数z",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "伤害参数x成长值ux",
                    "value": 0
                },
                {
                    "id": "n",
                    "name": "伤害参数y成长值uy",
                    "value": 0
                },
                {
                    "id": "o",
                    "name": "伤害参数z成长值uz",
                    "value": 0
                },
                {
                    "id": "p",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "q",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "r",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "s",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        },
        {
            "id": "Curse_Effect",
            "name": "诅咒效果",
            "description": "使目标造成在其行动前受到伤害的万分之X；",
            "param": [
                {
                    "id": "x",
                    "name": "伤害参数x",
                    "value": 0
                },
                {
                    "id": "y",
                    "name": "伤害参数y",
                    "value": 0
                },
                {
                    "id": "z",
                    "name": "伤害参数z",
                    "value": 0
                },
                {
                    "id": "m",
                    "name": "伤害参数x成长值ux",
                    "value": 0
                },
                {
                    "id": "n",
                    "name": "伤害参数y成长值uy",
                    "value": 0
                },
                {
                    "id": "o",
                    "name": "伤害参数z成长值uz",
                    "value": 0
                },
                {
                    "id": "p",
                    "name": "时效类型（单次，持续，光环）",
                    "value": 0
                },
                {
                    "id": "q",
                    "name": "持续时间参数t",
                    "value": 0
                },
                {
                    "id": "r",
                    "name": "持续时间参数t成长值ut",
                    "value": 0
                },
                {
                    "id": "s",
                    "name": "作用时间点(生效时间点，刷新时间点，结束时间点)",
                    "value": 0
                },
                {
                    "id": "t",
                    "name": "描述",
                    "value": 0
                },
                {
                    "id": "h",
                    "name": "预留字段1",
                    "value": 0
                },
                {
                    "id": "i",
                    "name": "预留字段2",
                    "value": 0
                }
            ]
        }
    ]
};
