/**
 * Created by peihengyang on 15/1/4.
 */
var taskEditProvider =  require('../../data_provider/dao_provider/edit/task');
var itemEditProvider = require('../../data_provider/dao_provider/edit/item');
var stageEditProvider = require('../../data_provider/dao_provider/edit/DP_Dungeon');
var enums = require('../../data_provider/dao_provider/edit/enums');
var body = {
    title : '任务',
    message : null
};

var task =  module.exports;
task.index = function(req, res){
    body.message = null;
    var route = 'edit/task/index';
    taskEditProvider.getAll(function(error, results){
        if(results.length ==0 ){
            body.results=[];
        }
        else
        {
            body.results = results;
        }
        res.render(route, body);
    });
};

task.add = function(req,res){
    body.message =  null;
    var method = req.method;
    var route = 'edit/task/add';
    stageEditProvider.getAllStage(function(error,stagesRes)
    {
         if(error)
         {
             console.log(error);
             body.message = "获取关卡失败";
             body.stages=[];
         }
         else
         {
             body.stages = stagesRes;

             itemEditProvider.getAll(function(error,results){
                 if(error!=null){
                     console.log(error);
                     body.message = "获取道具失败";
                     body.items=[];
                 }
                 else
                 {
                     body.items = results.Item;
                     if(method === 'POST'){
                         var lotteryModel = createLotteryModel(req);
                         lotteryModel.Create_Date =  new Date();
                         console.log( body);
                         console.log( "=====================");
                         console.log( lotteryModel);
                         taskEditProvider.add(lotteryModel,function(error,result){
                             if(error!=null){
                                 console.log(error);
                                 body.message = '添加任务失败';
                                 res.render(route,body);
                             }
                             else
                             {
                                 body.message = '添加任务成功';
                                 res.render(route,body);
                             }
                         });
                     }
                     else
                     {
                         taskEditProvider.getAll(function(error, results){
                             if(results.length ==0 ){
                                 body.results=[];
                             }
                             else
                             {
                                 body.results = results;
                             }
                             console.log(body);
                             res.render(route, body);
                         });
                     }
                 }
             });
         }
    });
};


task.edit = function(req,res){
    body.message = null;
    var method = req.method;
    var route = 'edit/task/edit';
    var taskId =  req.query.id;
    console.log(taskId);

    stageEditProvider.getAllStage(function(error,stagesRes) {
        if (error) {
            console.log(error);
            body.message = "获取关卡失败";
            body.stages = [];
        }
        else {
            body.stages = stagesRes;
            itemEditProvider.getAll(function(error,results){
                if(error!=null){
                    console.log(error);
                    body.message = "获取道具失败";
                    body.results.items=[];
                }
                else
                {
                    body.items = results.Item;
                    if(method === 'POST'){
                        var lotteryModel =  createLotteryModel(req);
                        lotteryModel.Task_Id = taskId;
                        console.log(body.results);
                        console.log("===================");
                        console.log(lotteryModel);
                        taskEditProvider.update(lotteryModel,function(error,results){
                            if(error!=null){
                                console.log(error);
                                body.message = '修改任务失败';
                                //res.render(route,body);
                            }
                            else
                            {
                                body.message = '修改任务成功';
//                                body.results = lotteryModel;
                            }
                            res.render(route,body);
                        });
                    }
                    else
                    {
                        taskEditProvider.getTaskById(taskId,function(error,results){
                            if(error!=null){
                                console.log(error);
                                body.message = '获取任务失败';
                                res.render(route,body);
                            }
                            else
                            {
                                body.message = '获取任务成功';
                                body.results = results[0];
                                taskEditProvider.getAll(function(error, allResults){
                                    body.allResults = allResults;
                                    console.log("edit+++++");
                                    console.log( body.allResults);
                                    console.log("===================+++++");
                                    console.log( body.results);
                                    res.render(route, body);
                                });
                            }
                        });
                    }
                }
            });
        }
    });
};

var createLotteryModel =  function(req){
    console.log("=========");
    console.log(req.body);
    var myDate=new Date();
    myDate.setFullYear(1990,10,12);
    var lotteryModel = {
        Order_Id :req.body.Order_Id,
        Name:req.body.Name,
        Type:req.body.Type,
        Circul_Open_Time:req.body.Circul_Open_Time||myDate,
        Circul_Show_Time:req.body.Circul_Show_Time||myDate,
        Circul_Over_Time:req.body.Circul_Over_Time||myDate,
        Des:req.body.Des,
        Pre_Task_Id:req.body.Pre_Task_Id,
        Open_Lvl:req.body.Open_Lvl,
        Open_Time:req.body.Open_Time,
        Over_Time:req.body.Over_Time,
        State:req.body.State,
        Targets:req.body.Targets,
        Stage_Id:req.body.Stage_Id,
        Param_X:req.body.Param_X,
        Param_Y:req.body.Param_Y,
        Param_Z:req.body.Param_Z,
        Rewards:req.body.Rewards,
        Pictures:req.body.Pictures,
        Task_Go_Config:req.body.Task_Go_Config
    };
    return lotteryModel;
};
