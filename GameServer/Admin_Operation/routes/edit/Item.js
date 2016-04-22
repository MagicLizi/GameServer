/**
 * Created by peihengyang on 14/12/11.
 */
var enums = require('../../data_provider/dao_provider/edit/enums');
var date = require('../../util/date');
var itemEditProvider = require('../../data_provider/dao_provider/edit/item');
var heroEditProvider = require('../../data_provider/dao_provider/edit/hero');
var skillEditProvider = require('../../data_provider/dao_provider/edit/skill');
var body = {
    title : '物品',
    message : null
};


exports.index = function(req, res){
    body.message = null;
    itemEditProvider.getAll(function(error, results){
        //console.log(results);
        body.results = results.Item;
        res.render('edit/Item/index', body);
    });
};


exports.indexMerger = function(req, res){
    body.message = null;
    var method = req.method;
    var Item_Id = req.query.id;
    console.log("indexMerger",method);
    itemEditProvider.getMergerByItemId(Item_Id,function(error, results){
        body.results = {
            result:results,
            Item_Id : Item_Id
        };
        res.render('edit/Item/Merger/index', body);
    });
};


exports.addMerger =  function(req,res){
    body.message = null;
    var method = req.method;
    var route = 'edit/Item/Merger/add';
    var item_Id =  req.query.id;
    itemEditProvider.getAll(function(error,resultItem){
        if(method === 'POST') {
            var model =  createMergerModel(req);
            itemEditProvider.addMerger(model,function(error, results) {
                body.results = {
                    Item_Id:item_Id,
                    resultMarge:results,
                    resultItem:resultItem.Item
                };
                res.render(route, body);
            });
        }
        else{
            body.results = {
                Item_Id:item_Id,
                resultItem:resultItem.Item
            };
            res.render(route, body);
        }
    });
};

exports.add =  function(req,res){
    body.message = null;
    var method = req.method;
    var route = 'edit/Item/add';
    if(method === 'POST') {

        var model =  createItemModel(req);
        itemEditProvider.addItem(model,function(error, results) {
            body.results = results;
            res.render(route, body);
        });
    }
    else{
        res.render(route, body);
    }
};

exports.edit =  function(req,res){
    body.message = null;
    var method = req.method;
    var route = 'edit/Item/edit';
    var item_Id = req.query.id;
    itemEditProvider.getItemById(item_Id,function(error,result){
            console.log(result);
            if(error){
                res.redirect('Item');
            }
            else {
                if (!result) {
                    res.redirect('Item');
                    return;
                }
                if(method === 'POST') {
                    var model =  createItemModel(req);

                    model.Item_Id = item_Id;
                    console.log("model");
                    console.log(model);
                    itemEditProvider.editItem(model,function(error, results) {
                        body.result = {
                            Item:model
                        };
                        res.render(route, body);
                    });
                }
                else{
                    body.result = {
                        Item:result[0]
                    };
                    res.render(route, body);
                }
            }

    });

};


exports.editMerger =  function(req,res){
    body.message = null;
    var method = req.method;
    var route = 'edit/Item/Merger/edit';
    var merger_Id = req.query.id;
    itemEditProvider.getAll(function(error,resultItem){
        itemEditProvider.getItemMergeById(merger_Id,function(error,resultMerge){
            if(error){
                res.redirect('/Item/Merger/edit');
            }
            else {
                if (!resultMerge) {
                    res.redirect('/Item/Merger/edit');
                    return;
                }
                if(method === 'POST') {
                    var model =  createMergerModel(req);
                    model.Merger_Id = merger_Id;
                    itemEditProvider.editMerger(model,function(error, results) {
                        var Source_Item = "";
                        var Target_Item = "";
                        console.log(resultItem.results);
                        resultItem.Item.forEach(function(item){
                            if(item.Item_Id == model.Target_Item_Id){
                                Target_Item = item;
                            }
                            if(item.Item_Id == model.Source_Item_Id){
                                if(item.Item_Type == 3){
                                    Source_Item = item;
                                    Source_Item.Description = "可以合成"+Target_Item.Item_Name;
                                }
                                else if(item.Item_Type == 2){
                                    Source_Item = item;
                                    Source_Item.Description = "集齐"+model.Source_Item_Amount+"个碎片，即可合成"+Target_Item.Item_Name;
                                }
                            }
                        });
                        itemEditProvider.editItem(Source_Item,function(error,resultUpdateItem){
                            console.log(Source_Item);
                            if(error!=null){
                                console.log(error);
                                callback(error,null);
                            }
                            else
                            {
                                console.log(model);
                                body.results = {
                                    Item:model,
                                    resultItem:resultItem.Item
                                };
                                res.render(route, body);
                            }
                        });
                    });
                }
                else{
                    body.results = {
                        Item:resultMerge[0],
                        resultItem:resultItem.Item
                    };
                    res.render(route, body);
                }
            }

        });

    })

};


exports.delMerger =  function(req,res){
    body.message = null;
    var method = req.method;
    var route = 'edit/Item/Merger/del';
    var merger_Id = req.query.id;
    var item_Id = req.query.itemid;
    console.log('merger_Id',merger_Id,'////',item_Id);
    if(method === 'GET') {
        itemEditProvider.delItemMergeById(merger_Id,function(error, resultsItemMerge) {
            if(error!=null){
                console.log('delItemMergeById:',error);
                callback(error,null);
            }
            else
            {
                itemEditProvider.getMergerByItemId(item_Id,function(error, results){
                    if(error!=null){
                        console.log('getMergerByItemId:',error);
                        callback(error,null);
                    }
                    else
                    {
                        body.results = {
                            result:results,
                            Item_Id : item_Id
                        };
                        res.render('edit/Item/Merger/index', body);
                    }
                });
            }
        });
    }
    else{
        body.results = {
            result:[],
            Item_Id : item_Id
        };
        res.render('edit/Item/Merger/index', body);
    }


};



exports.indexEffect = function(req, res){
    body.message = null;
    var Item_Id = req.query.id;
    itemEditProvider.getEffectByItemId(Item_Id,function(error, results){
        console.log(results);
        body.results = {
            result:results,
            Item_Id : Item_Id,
            Effects : Effects
        };
        res.render('edit/Item/Effect/index', body);
    });
};


exports.addEffect =  function(req,res){
    body.message = null;
    var method = req.method;
    var route = 'edit/Item/Effect/add';
    var item_Id =  req.query.id;
    console.log("effect:",Effects);
    itemEditProvider.getItemById(item_Id,function(error,resultItem){
        if(method === 'POST') {
            var model =  createEffectModel(req);
            itemEditProvider.addEffect(model,function(error, results) {
                body.results = {
                    Item_Id:item_Id,
                    resultEffect:results,
                    resultItem:resultItem,
                    Effects : Effects
                };
                res.render(route, body);
            });
        }
        else{
            body.results = {
                Item_Id:item_Id,
                resultItem:resultItem,
                Effects : Effects
            };
            res.render(route, body);
        }
    });
};


exports.editEffect =  function(req,res){
    body.message = null;
    var method = req.method;
    var route = 'edit/Item/Effect/edit';
    var Relation_Id = req.query.id;
    heroEditProvider.getAll(function(error,resultHero){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            itemEditProvider.getAll(function(error,resultItem){
                itemEditProvider.getItemEffectById(Relation_Id,function(error,result){
                    if(error){
                        res.redirect('/Item/Effect/edit');
                    }
                    else {
                        if (!result) {
                            res.redirect('/Item/Effect/edit');
                            return;
                        }
                        if(method === 'POST') {
                            var model =  createEffectModel(req);
                            console.log(model);
                            model.Relation_Id = Relation_Id;
                            itemEditProvider.editEffect(model,function(error, results) {
                                console.log(model);
                                body.results = {
                                    Item:model,
                                    resultItem:resultItem.Item,
                                    resultHero:resultHero,
                                    Effects:Effects
                                };
                                res.render(route, body);
                            });
                        }
                        else{
                            console.log(result);
                            body.results = {
                                Item:result[0],
                                resultItem:resultItem.Item,
                                resultHero:resultHero,
                                Effects:Effects
                            };
                            res.render(route, body);
                        }
                    }
                });
            })
        }
    })

};



exports.delEffect =  function(req,res){
    body.message = null;
    var method = req.method;
    var route = 'edit/Item/Effect/del';
    var effect_Id = req.query.id;
    var item_Id = req.query.itemid;
    console.log('merger_Id',effect_Id,'////',item_Id);
    if(method === 'GET') {
        itemEditProvider.delItemEffectById(effect_Id,function(error, resultsItemMerge) {
            if(error!=null){
                console.log('delItemEffectById:',error);
                callback(error,null);
            }
            else
            {
                itemEditProvider.getEffectByItemId(item_Id,function(error, results){
                    if(error!=null){
                        console.log('delItemEffectById:',error);
                        callback(error,null);
                    }
                    else
                    {
                        body.results = {
                            result:results,
                            Item_Id : item_Id,
                            Effects : Effects
                        };
                        console.log(body.results);
                        res.render('edit/Item/Effect/index', body);
                    }
                });
            }
        });
    }
    else{
        body.results = {
            result:[],
            Item_Id : item_Id
        };
        res.render('edit/Item/Merger/index', body);
    }


};


function createItemModel(req){
    var itemModel = {
        Item_Id : 0,
        Item_Name:'',
        Item_Order:0,
        Item_Type :0,
        Amount_Limit:999,
        Description:'',
        Item_Quality:0,
        Price:0,
        Icon_Url:'',
        Equip_Level:0,
        Create_Date:'',
        Auto_Open:0,
        Yellow_Description:''
    };
    itemModel.Item_Name = req.body.Item_Name;
    itemModel.Item_Order =  req.body.Item_Order;
    itemModel.Item_Type = req.body.Item_Type;
    itemModel.Amount_Limit =  req.body.Amount_Limit;
    itemModel.Description = req.body.Description;
    itemModel.Item_Quality = req.body.Item_Quality;
    itemModel.Price = req.body.Price;
    itemModel.Icon_Url =  req.body.Icon_Url;
    itemModel.Equip_Level = req.body.Equip_Level;
    itemModel.Create_Date =  new Date();
    itemModel.Auto_Open =  req.body.Auto_Open;
    itemModel.Yellow_Description =  req.body.Yellow_Description;
    return itemModel;
}


function createMergerModel(req){
    var mergerModel = {
        Target_Item_Id : 0,
        Source_Item_Id:0,
        Source_Item_Amount:0,
        Merger_Type :0,
        Create_Date:''
    };
    mergerModel.Target_Item_Id = req.body.Target_Item_Id;
    mergerModel.Source_Item_Id =  req.body.Source_Item_Id;
    mergerModel.Source_Item_Amount = req.body.Source_Item_Amount;
    mergerModel.Merger_Type = req.body.Merger_Type;
    mergerModel.Create_Date =  new Date();
    return mergerModel;
}


function createEffectModel(req){
    var effectModel = {
        Relation_Id : 0,
        Item_Id:0,
        Effect_Type:0,
        Effect_Name :'',
        Effect_Value:0,
        Effect_Description:'',
        Create_Date:''
    };
    effectModel.Item_Id = req.body.Item_Id;
    effectModel.Effect_Type =  req.body.Effect_Type;
    Effects.forEach(function(item){
        if(item.value == effectModel.Effect_Type){
            effectModel.Effect_Name = item.name;
        }
    });
    effectModel.Effect_Value =  req.body.Effect_Value;
    effectModel.Effect_Description = req.body.Effect_Description;
    effectModel.Create_Date =  new Date();
    return effectModel;
}

var Effects = [
    {
        name:"无",
        value:enums.Item_Effect_Type.none
    },
    {
        name:"获取金币",
        value:enums.Item_Effect_Type.Coin
    },
    {
        name:"获取钻石",
        value:enums.Item_Effect_Type.Diamond
    },
    {
        name:"英雄经验",
        value:enums.Item_Effect_Type.HeroExperience
    },
    {
        name:"附魔魔能",
        value:enums.Item_Effect_Type.MagicEnergy
    },
    {
        name:"战队体力",
        value:enums.Item_Effect_Type.Stamina
    },
    {
        name:"扫荡券",
        value:enums.Item_Effect_Type.Raid
    },
    {
        name:"获取英雄",
        value:enums.Item_Effect_Type.Hero
    },
    {
        name:"增加战队经验",
        value:enums.Item_Effect_Type.TroopExperience
    },
    {
        name:"增加副本攻打次数",
        value:enums.Item_Effect_Type.Attack_Times
    },
    {
        name:"增加技能点数",
        value:enums.Item_Effect_Type.Skill_Point
    },
    {
        name:"恢复英雄血量",
        value:enums.Item_Effect_Type.HeroLife
    },
    {
        name:"增加攻击力",
        value:enums.Item_Effect_Type.Attack
    },
    {
        name:"增加法术强度",
        value:enums.Item_Effect_Type.Spell
    },
    {
        name:"增加护甲",
        value:enums.Item_Effect_Type.Armor
    },
    {
        name:"增加魔法抗性",
        value:enums.Item_Effect_Type.MagicResistance
    },
    {
        name:"增加物理暴击",
        value:enums.Item_Effect_Type.PhysicalCrit
    },
    {
        name:"增加物理暴击伤害",
        value:enums.Item_Effect_Type.PhysicalCritDamage
    },
    {
        name:"增加闪避等级",
        value:enums.Item_Effect_Type.AvoidLvl
    },    {
        name:"增加吸血等级",
        value:enums.Item_Effect_Type.SuckBlood
    },
    {
        name:"增加命中等级",
        value:enums.Item_Effect_Type.HitLevel
    },
    {
        name:"治疗技能效果",
        value:enums.Item_Effect_Type.CureSkillUp
    },
    {
        name:"主动技能能量减少",
        value:enums.Item_Effect_Type.InitiativeSkillEnergyLess
    },
    {
        name:"生命回复",
        value:enums.Item_Effect_Type.LifeRestore
    },
    {
        name:"能量回复",
        value:enums.Item_Effect_Type.EnergyRestore
    }

]