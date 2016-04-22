/**
 * Created by peihengyang on 14/10/27.
 */
var date = require('../../util/date');
var DunEditProvider = require('../../data_provider/dao_provider/edit/DP_Dungeon');
var MonsterEditProvider = require('../../data_provider/dao_provider/edit/hero');
var lotteryEditProvider = require('../../data_provider/dao_provider/edit/lottery');
var body = {
    title : '副本',
    message : null
};


exports.index = function(req, res) {
    body.message = null;
    var mothod = req.method;
    var route = "edit/Dungeon/index";
    if (mothod === 'POST') {
        var i = 1;
        console.log("req.body:"+eval("req.body.Dungeon_Id" + i));
        while (eval("req.body.Dungeon_Id" + i)) {
            var model ={
                Dungeon_Id:eval("req.body.Dungeon_Id" + i),
                Dungeon_Order : eval("req.body.Dungeon_Order" + i)
            }
            DunEditProvider.updateDungeonOrders(model, function (error, results) {
                if (error) {
                    body.message = '更新失败.';
                }
                else {
                    body.message = '更新成功.';
                }

            })
            i++;

        }
        DunEditProvider.getAllDungeon(function (error, results) {
            body.results = results;
            res.render(route, body);
        })
    }
else{
        DunEditProvider.getAllDungeon(function (error, results) {
            body.results = results;
            res.render(route, body);
        })
    }
};


exports.addDungeon = function(req, res){
    body.message = null;
    var method = req.method;
    var route = 'edit/Dungeon/addDungeon';
    var Dungeon_Id= req.query.id;
    if(method === 'POST'){
        var model = createModel(req);
        model.create_date = new Date();
        DunEditProvider.addDungeon(model, function(error, result){
            if(error!=null){
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

exports.addStage = function(req, res){
    body.message = null;
    var method = req.method;
    var route = 'edit/Dungeon/addStage';
    var Dungeon_Id= req.query.id;
    var Dungeon_Type = req.query.dungeontype;
    body.results = {
        Dungeon_Id:Dungeon_Id,
        Dungeon_Type:Dungeon_Type
    };
    lotteryEditProvider.getLotteryMethod(function(error,resultsLottery){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            body.results.lotteryPool = resultsLottery;
            if(method === 'POST'){
                var model = createStageModel(req);
                model.Create_date = new Date();
                model.Dungeon_Id = Dungeon_Id;
                model.Stage_Monsters = JSON.stringify({
                    "Monsters": []
                });
                model.Stage_Skills = JSON.stringify({"StageSkills":[]});
                DunEditProvider.addStage(model, function(error, result){
                    if(error!=null){
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
                res.render(route, body);
            }

        }
    })

};



exports.editStage = function(req, res){
    console.log("editStage");
    body.message = null;
    var Stage_Skills_Mol = [
        {
            Skill_Name:'召唤',
            Skill_Tag:'Summon'
        },{
            Skill_Name:'善恶有报',
            Skill_Tag:'Good or Evil'
        },{
            Skill_Name:'减少回合',
            Skill_Tag:'Reduce Round number'
        }
    ];
    var method = req.method;
    var route = 'edit/Dungeon/editStage';
    var Stage_Id = req.query.id;
    //console.log(Stage_Id);
    var Dungeon_Id = req.query.Dungeon_Id;
    DunEditProvider.getStage(Stage_Id, function(error, result){
        if(error!=null){
            res.redirect('Dungeon/edit?id='+Dungeon_Id);
        }
        else{
            if(!result){
                res.redirect('Dungeon/edit?id='+Dungeon_Id);
                return;
            }
            MonsterEditProvider.getAllMonsters(function(error,monsterresult){
                    if(error!=null){
                        console.log(error);
                        body.message=error;
                        res.redirect('Dungeon/edit?id='+Dungeon_Id);
                        return;
                    }else{
                        var resultarr = new Array();
                        resultarr[1] = monsterresult;
                        resultarr[3] = Stage_Skills_Mol;
                        lotteryEditProvider.getLotteryMethod(function(error,lotteryRestuls){
                            if(error!=null){
                                console.log(error);
                                callback(error,null);
                            }
                            else
                            {
                                resultarr[2]=lotteryRestuls;
                                if(method === 'POST'){
                                    var model = createStageModel(req);
                                    model.Stage_Id = Stage_Id;
                                    model.Dungeon_Id = Dungeon_Id;
                                    console.log("model11:");
                                    console.log(model);
                                    DunEditProvider.editStage(model, function(error, result){
                                        if(error!=null){
                                            body.message = '更新失败.';
                                            res.render(route, body);
                                        }
                                        else{
                                            body.message = '更新成功.';
                                            resultarr[0] = model;
                                            body.result = resultarr;
                                            res.render(route, body);
                                        }
                                    });
                                }
                                else{
                                    resultarr[0] = result[0];
                                    body.result = resultarr;
                                    console.log("result at:"+JSON.stringify(body.result));
                                    res.render(route, body);
                                }

                            }
                        })

                     }

            });
        }
    });
};



exports.editMonsters = function(req, res){
    console.log("editStage");
    body.message = null;
    var method = req.method;
    var route = 'edit/Dungeon/editMonsters';
    var Stage_Id = req.query.id;
    console.log(Stage_Id);
    var Dungeon_Id = req.query.Dungeon_Id;
    DunEditProvider.getMonstersByStageId(Stage_Id, function(error, result){
        console.log("result:"+result.length);
        if(error!=null){
            res.redirect('Dungeon/edit?id='+Dungeon_Id);
        }
        else{
            if(!result){
                res.redirect('Dungeon/edit?id='+Dungeon_Id);
                return;
            }
            if(method === 'POST'){
                var model = createStageModel(req);
                model.Stage_Id = Stage_Id;
                model.Dungeon_Id = Dungeon_Id;
                console.log("model:"+model);
                DunEditProvider.editStage(model, function(error, result){

                    if(error!=null){
                        body.message = '更新失败.';
                        res.render(route, body);
                    }
                    else{
                        body.message = '更新成功.';
                        var resultarr = new Array();
                        resultarr[0] = model;
                        body.result = resultarr;
                        res.render(route, body);
                    }
                });
            }
            else{

                body.result = result;
                console.log("result at:"+result.Dungeon_Id);
                res.render(route, body);
            }
        }
    });
};



exports.edit = function(req, res){
    console.log("edit");
    body.message = null;
    var method = req.method;
    var route = 'edit/Dungeon/edit';
    var Dungeon_Id = req.query.id;

    DunEditProvider.getDungeon(Dungeon_Id, function(error, result){
        console.log("result:"+result.length);
        if(error!=null){
            res.redirect('Dungeon');
        }
        else{
            if(!result){
                res.redirect('Dungeon');
                return;
            }
            if(method === 'POST'){
                var model = createModel(req);
                model.Dungeon_Id = Dungeon_Id;
                console.log("model:"+model);
                DunEditProvider.editDungeon(model, function(error, result){

                    if(error!=null){
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
                console.log("result at:"+result[0].Dungeon_Id);
                res.render(route, body);
            }
        }
    });
};


var createStageModel = function(req)
{
    //console.log(req.body.Stage_Type);
    var Stage_Name = req.body.Stage_Name;
    var Stage_Description = req.body.Stage_Description;
    var Stage_Order = req.body.Stage_Order;
    var Stage_Monsters = req.body.Stage_Monsters;
    var Pool_Id =req.body.Pool_Id;
    var Attack_Times_Limit = req.body.Attack_Times_Limit;
    var Stage_Icon_Url  = req.body.Stage_Icon_Url;
    var Stage_Icon_Position  = req.body.Stage_Icon_Position;
    var Stage_Type  = req.body.Stage_Type;
    var Stage_Main_Type = req.body.Stage_Main_Type;
    var Stage_Rounds_Limit  = req.body.Stage_Rounds_Limit;
    var Stamina_Expend  = req.body.Stamina_Expend;
    var Reduce_Life_Pre =  req.body.Reduce_Life_Pre;
    var Stage_Layers_Resources = req.body.Stage_Layers_Resources;
    var Heros_Experience = req.body.Heros_Experience;
    var Stage_Skills = req.body.Stage_Skills;
    var Stage_Lvl_Limit = req.body.Stage_Lvl_Limit;
    var Grid_Colour =  req.body.Grid_Colour;
    var Open_Day = req.body.Open_Day;


    var model = {
        Stage_Name:Stage_Name,
        Stage_Description :Stage_Description,
        Stage_Order : Stage_Order,
        Stage_Monsters:Stage_Monsters,
        Pool_Id:Pool_Id,
        Attack_Times_Limit:Attack_Times_Limit,
        Stage_Icon_Url:Stage_Icon_Url,
        Stage_Icon_Position:Stage_Icon_Position,
        Stage_Type:Stage_Type,
        Stage_Main_Type:Stage_Main_Type,
        Stage_Rounds_Limit:Stage_Rounds_Limit,
        Stamina_Expend:Stamina_Expend,
        Reduce_Life_Pre:Reduce_Life_Pre,
        Stage_Layers_Resources:Stage_Layers_Resources,
        Heros_Experience:Heros_Experience,
        Stage_Skills:Stage_Skills,
        Stage_Lvl_Limit:Stage_Lvl_Limit,
        Grid_Colour:Grid_Colour,
        Open_Day:Open_Day
    };
    return model;
};

var createModel = function(req)
{
    var Dungeon_Name = req.body.Dungeon_Name;
    var Dungeon_Lvl_Limit = req.body.Dungeon_Lvl_Limit;
    var Dungeon_Resource_Url = req.body.Dungeon_Resource_Url;
    var Dungeon_Order = req.body.Dungeon_Order;
    var Dungeon_Type = req.body.Dungeon_Type;
    var Dungeon_Description = req.body.Dungeon_Description;
    var Attack_Times_Limit = req.body.Attack_Times_Limit;
    var Open_Day = req.body.Open_Day;
    var model = {
        Dungeon_Name:Dungeon_Name,
        Dungeon_Lvl_Limit :Dungeon_Lvl_Limit,
        Dungeon_Resource_Url : Dungeon_Resource_Url,
        Dungeon_Order:Dungeon_Order,
        Dungeon_Type:Dungeon_Type,
        Dungeon_Description:Dungeon_Description,
        Attack_Times_Limit:Attack_Times_Limit,
        Open_Day:Open_Day
    };
    return model;
};



function render(res, route, message){
    body.message = message;
    res.render(route, body);
}