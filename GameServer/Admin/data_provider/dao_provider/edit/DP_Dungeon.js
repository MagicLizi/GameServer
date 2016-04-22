/**
 * Created by peihengyang on 14/10/27.
 */

var code = require('../../../config/code');
var sqlClient = require('../../dao/sqlClient').admin;
var sqlCommand = require('../../dao/sqlCommand');
var editLotteryProvider = require('./lottery')
var logger = require('log4js').getLogger("db");
var apple = module.exports;

apple.addDungeon = function (model, callback) {
    //获取Dungeon序数的最大值，默认添加的章节在所有章节的最后
    var max_Dungeon_idsql = new sqlCommand('SELECT MAX(Dungeon_Order) as max_Dungeon_Order FROM edit_Dungeon');
    var max_Dungeon_Order = null;
    sqlClient.query(max_Dungeon_idsql, function (error, result) {
        if (error) {
            console.log(error);
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        }
        else {
            max_Dungeon_Order = result[0].max_Dungeon_Order;
            max_Dungeon_Order++;//将序数最大值加一
//            console.log(max_Dungeon_Order);
            model.Dungeon_Order = max_Dungeon_Order;
            //将新的章节插入数据库
            var sql = new sqlCommand('INSERT INTO edit_Dungeon(' +
                    'Dungeon_Order,Dungeon_Name,Dungeon_Lvl_Limit,Dungeon_Resource_Url,Dungeon_Stages,Create_Date,' +
                'Dungeon_Type,Attack_Times_Limit,Dungeon_Description,Open_Day) VALUES(?,?,?,?,?,?,?,?,?,?)',
                [model.Dungeon_Order, model.Dungeon_Name, model.Dungeon_Lvl_Limit, model.Dungeon_Resource_Url,'',
                    model.create_date,model.Dungeon_Type,model.Attack_Times_Limit,model.Dungeon_Description,model.Open_Day]);

            sqlClient.insert(sql, function (error, result) {
                if (error) {
                    console.log(error);
                    callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
                }
                else {
                    callback(null, model);
                }
            });
        }
    });
};


apple.updateDungeonOrders = function (model, callback) {
//    console.log("model:"+JSON.stringify(model));
//    专门用于更新章节顺序
    var sql = new sqlCommand('UPDATE edit_Dungeon set Dungeon_Order = ? WHERE Dungeon_Id = ? AND Dungeon_Order <> ?',
        [model.Dungeon_Order, model.Dungeon_Id,model.Dungeon_Order]);
    sqlClient.update(sql, function (error, result) {
        if (error) {
            console.log("error:" + error);
            callback(new Error(code.DB.UPDATE_DATA_ERROR), code.DB.UPDATE_DATA_ERROR);
        }
        else {
//          更新完毕后重新获取章节，更新到前端页面
            apple.getDungeon(model.recharge_id, function (error, results) {
                        callback(null, results);
                    })

                }
            });

    };


apple.updateStageOrders = function (model, callback) {
//    console.log("model:"+JSON.stringify(model));
//    专门用于更新章节顺序
    var sql = new sqlCommand('UPDATE edit_Stage set Stage_Order = ? WHERE Stage_Id = ? AND Stage_Order <> ?',
        [model.Stage_Order, model.Stage_Id,model.Stage_Order]);
    sqlClient.update(sql, function (error, result) {
        if (error) {
            console.log("error:" + error);
            callback(new Error(code.DB.UPDATE_DATA_ERROR), code.DB.UPDATE_DATA_ERROR);
        }
        else {
//          更新完毕后重新获取章节，更新到前端页面
            apple.getDungeon(model.recharge_id, function (error, results) {
                callback(null, results);
            })
        }
    });
};

    apple.editDungeon = function (model, callback) {
        var sql = new sqlCommand('UPDATE edit_Dungeon SET ' +
            'Dungeon_Order = ?,' +
            'Dungeon_Name = ?,' +
            'Dungeon_Lvl_Limit = ?,' +
            'Dungeon_Resource_Url = ?,' +
            'Dungeon_Type = ?,' +
            'Attack_Times_Limit = ?,' +
            'Dungeon_Description = ?,' +
            'Open_Day = ? ' +
                ' WHERE Dungeon_Id = ?',
            [model.Dungeon_Order,model.Dungeon_Name,model.Dungeon_Lvl_Limit,model.Dungeon_Resource_Url,model.Dungeon_Type
                ,model.Attack_Times_Limit,model.Dungeon_Description,model.Open_Day,model.Dungeon_Id]);
        sqlClient.update(sql, function (error, result) {
            if (error) {
                console.log("error:" + error);
                callback(new Error(code.DB.UPDATE_DATA_ERROR), code.DB.UPDATE_DATA_ERROR);
            }
            else {
                        apple.getDungeon(model.Dungeon_Id, function (error, results) {
                            callback(null, results);
                        })

                };

            });
        };


apple.editStage = function (model, callback) {
    console.log('editStage:',model);
    var sql = new sqlCommand('UPDATE edit_Stage SET ' +
        'Stamina_Expend = ?,' +
        'Stage_Name = ?,' +
        'Stage_Description = ?,' +
        'Stage_Order = ?,' +
        'Dungeon_Id = ?,' +
        'Stage_Monsters = ?,' +
        'Pool_Id = ?,' +
        'Attack_Times_Limit = ?,' +
        'Stage_Icon_Url = ?,' +
        'Stage_Icon_Position = ?,' +
        'Stage_Type = ?,' +
        'Stage_Main_Type = ?,' +
        'Stage_Rounds_Limit = ?,' +
        'Reduce_Life_Pre = ?,' +
        'Stage_Layers_Resources = ?,' +
        'Heros_Experience=?,' +
        'Open_Day =?,' +
        'Stage_Lvl_Limit = ?,' +
        'Grid_Colour = ?, ' +
        'Stage_Skills = ?' +
        ' WHERE Stage_Id = ?',
        [model.Stamina_Expend,model.Stage_Name,model.Stage_Description,model.Stage_Order,model.Dungeon_Id,
    model.Stage_Monsters,model.Pool_Id,model.Attack_Times_Limit,model.Stage_Icon_Url,model.Stage_Icon_Position,model.Stage_Type,
    model.Stage_Main_Type,model.Stage_Rounds_Limit,model.Reduce_Life_Pre,model.Stage_Layers_Resources,
            model.Heros_Experience,model.Open_Day,model.Stage_Lvl_Limit,model.Grid_Colour,model.Stage_Skills,model.Stage_Id]);
    sqlClient.update(sql, function (error, result) {
        if (error!=null) {
            console.log( error);
            console.log(result);
            callback(new Error(code.DB.UPDATE_DATA_ERROR), null);
        }
        else {//更新关卡后，还要进一步更新章节表中的关卡字段
//            获取所有与当前更新关卡同章节的其他关卡
            var sql = new sqlCommand('select * from edit_Stage where Dungeon_Id = ?',
            [model.Dungeon_Id]);
            sqlClient.query(sql,function(error,result){
                if (error!=null){
                    callback(new Error(code.DB.EXEC_QUERY_ERROR),code.DB.EXEC_QUERY_ERROR);
                }else{
//                    更新章节表中的关卡字段
                    var stageresult = {
                        "Stages":result
                    };
                    for(var i = 0 ;i<stageresult.Stages.length;i++){
                        stageresult.Stages[i].Stage_Monsters = JSON.parse(stageresult.Stages[i].Stage_Monsters);
                    }
                    var sql = new sqlCommand('update edit_Dungeon set Dungeon_Stages = ? where Dungeon_Id = ?',
                    [JSON.stringify(stageresult),model.Dungeon_Id]);
                    sqlClient.update(sql,function(error,result){
                        console.log("error:"+error);
                        if(error!=null){
                            callback(new Error(code.DB.UPDATE_DATA_ERROR), code.DB.UPDATE_DATA_ERROR);
                        }else
                        {
                            //更新道具掉落
                            var pool_Type = 1;
                            editLotteryProvider.getPoolItemsByPoolId(model.Pool_Id,pool_Type,function(error,resultPoolItem){
                                if(error!=null){
                                    console.log(error);
                                    callback(error,null);
                                }
                                else
                                {

                                }
                            })
                            results = model;
                            callback(null, results);
                        }
                    })
                }
            })

            //})

        };

    });
};

apple.getAll = function(callback){
    var sql = new sqlCommand('SELECT * FROM edit_Dungeon order by Dungeon_Order');
    sqlClient.query(sql, function (error, results) {
        if (error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else {
            callback(null, results);
        }
    });
};

apple.getStagesByDungeonId = function (DungeonId, callback) {
    var sql = new sqlCommand('SELECT * FROM edit_Stage WHERE Dungeon_Id=? order by Stage_Order', DungeonId);
    sqlClient.query(sql, function (error, results) {
        if (error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else {
            callback(null, results);
        }
    });
};


apple.getAllDungeon = function (callback) {
        var sql = new sqlCommand('SELECT * FROM edit_Dungeon order by Dungeon_Order');
        sqlClient.query(sql, function (error, results) {
            if (error)
                callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
            else {
                callback(null, results);
            }
        });
    };

//    apple.getStagesByDungeonId = function (DungeonId, callback) {
//        var sql = new sqlCommand('SELECT * FROM edit_Stage WHERE Dungeon_Id=? order by Stage_Order', DungeonId);
//        sqlClient.query(sql, function (error, results) {
//            if (error)
//                callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
//            else {
//                callback(null, results);
//            }
//        });
//    };

//获取副本内容，包括关卡。更新后关卡细节已经加入副本中，应该不用再次读取
    apple.getDungeon = function (Dungeon_Id, callback) {
        var sql = new sqlCommand('SELECT * FROM edit_Dungeon WHERE Dungeon_Id=? ', [Dungeon_Id]);
        sqlClient.query(sql, function (error, results) {
            if (error)
                callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
            else {
                var resultArr = new Array();

                resultArr[0]=results;
                var stagesql = new sqlCommand('SELECT * FROM edit_Stage WHERE Dungeon_Id=? Order By Stage_Type,Stage_Order', [Dungeon_Id]);
                sqlClient.query(stagesql, function (error, result_stage) {
                    if (error)
                        callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
                    else {
                        if (result_stage.length > 0)
                        {
                            resultArr[1]=result_stage;
                            callback(null, resultArr);
                        }

                        else
                        {
                            resultArr[1]="none";
                            callback(null, resultArr);
                        }

                    }
                });
            }
        });
    };

apple.getAllStage = function(callback)
{
    var sql = new sqlCommand('SELECT * FROM edit_Stage');
    sqlClient.query(sql, function (error, results) {
        if (error)
            callback(new Error(code.DB.SELECT_DATA_ERROR), code.DB.SELECT_DATA_ERROR);
        else {
            if (results.length > 0)
            {
                callback(null, results);
            }
            else
            {
                callback(null, results);
            }
        }
    });
};


apple.getStage = function (Stage_Id, callback) {
    var sql = new sqlCommand('SELECT * FROM edit_Stage WHERE Stage_Id=? Order by Stage_Type,Stage_Order', [Stage_Id]);
    sqlClient.query(sql, function (error, results) {
        if (error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else {

                    if (results.length > 0)
                    {
                        //resultArr[1]=result_stage;
                        callback(null, results);
                    }

                    else
                    {
                        //resultArr[1]="none";
                        callback(null, results);
                    }

                }
            });

    };



apple.addStage = function (model, callback) {
//    删除不需要的章节最大序号
    var max_Stage_idsql = new sqlCommand('SELECT MAX(Stage_Order) as max_Stage_Order FROM edit_Stage');
    var max_Stage_Order = null;
    sqlClient.query(max_Stage_idsql, function (error, result) {
        if (error) {
            console.log(error);
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        }
        else {
            max_Stage_Order = result[0].max_Stage_Order;
            max_Stage_Order++;
            console.log(max_Stage_Order);
            if(model.Stage_Order!=0){
                model.Stage_Order = max_Stage_Order;
            }
            var sql = new sqlCommand('INSERT INTO edit_Stage(' +
                    'Stamina_Expend,' +
                'Stage_Name,' +
                'Stage_Description,' +
                'Stage_Order,' +
                'Dungeon_Id,' +
                'Stage_Monsters,' +
                'Pool_Id,' +
                'Attack_Times_Limit,' +
                'Stage_Icon_Url,' +
                'Stage_Icon_Position,' +
                'Stage_Type,' +
                'Stage_Main_Type,' +
                'Stage_Rounds_Limit,' +
                'Reduce_Life_Pre,' +
                'Stage_Layers_Resources,' +
                'Create_Date,' +
                'Heros_Experience,' +
                'Open_Day,' +
                'Stage_Lvl_Limit,' +
                'Grid_Colour,' +
                'Stage_Skills)' +
                'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                [model.Stamina_Expend, model.Stage_Name, model.Stage_Description, model.Stage_Order, model.Dungeon_Id,
                model.Stage_Monsters,model.Pool_Id,model.Attack_Times_Limit,model.Stage_Icon_Url,
                    model.Stage_Icon_Position,model.Stage_Type,model.Stage_Main_Type,model.Stage_Rounds_Limit,
                    model.Reduce_Life_Pre,model.Stage_Layers_Resources,model.Create_date,model.Heros_Experience,
                    model.Open_Day,model.Stage_Lvl_Limit,model.Grid_Colour,model.Stage_Skills]);

            sqlClient.insert(sql, function (error, result) {
                if (error) {
                    console.log(error);
                    callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
                }
                else {
                    callback(null, model);
                }
            });
        }
    });
};


