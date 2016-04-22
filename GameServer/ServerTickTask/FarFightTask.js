/**
 * Created by lizi on 15/9/9.
 */
var farFightPrivider = require("../Game/dao_provider/dao_Game/farFight");
var farFightTask = module.exports;
var async = require('async');
farFightTask.ExcuteTask = function()
{
    var tasks = [];
    var t1 = function(cb)
    {
        console.log("开始刷新远征次数！");
        //刷新远征挑战次数
        farFightPrivider.TaskRefreshFarFightCount(1,function(e,r)
        {
            if(!e)
            {
                console.log("刷新远征次数完成！");
            }
            else
            {
                console.log("刷新远征次数错误！"+e);
            }
            cb(e,r);
        });
    };

    var t2 = function(cb)
    {
        console.log("开始刷新战斗力记录！");
        //刷新战斗力记录
        farFightPrivider.TaskRefreshAllUserPvpDefendFightPower(function(e,r)
        {
            if(!e)
            {
                console.log("刷新战斗力记录完成！");
            }
            else
            {
                console.log("刷新战斗力记录错误！"+e);
            }
            cb(e,r);
        });
    };

    var t3 = function(cb)
    {
        console.log("开始刷新玩家远征防守军团数据！");
        //刷新玩家远征防守军团数据
        farFightPrivider.TaskRefreshAllUserFarFightHeros(function(e,r)
        {
            if(!e)
            {
                console.log("刷新玩家远征防守军团数据完成！");
            }
            else
            {
                console.log("刷新玩家远征防守军团数据失败！"+e);
            }
            cb(e,r);
        });
    };

    var t4 = function(cb)
    {
        console.log("开始清空玩家远征军团数据！");
        farFightPrivider.TaskClearAllFarFightHeros(function(e,r)
        {
            if(!e)
            {
                console.log("清空玩家远征军团数据完成！");
            }
            else
            {
                console.log("清空玩家远征军团数据失败！"+e);
            }
            cb(e,r);
        });
    };

    tasks.push(t1);
    tasks.push(t2);
    tasks.push(t3);
    //tasks.push(t4);
    async.series(tasks,function(error,result)
    {
        if(!error)
        {
            console.log("server tick task success");
        }
        else
        {
            console.log("server tick task error:"+error);
        }
    });
};

//farFightTask.ExcuteTask();