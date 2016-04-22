/**
 * Created by David_shen on 2/4/15.
 */

var code = require('../../code');
var taskProvider = require('../../dao_provider/dao_Game/task');
var gameUserProvider = require('../../dao_provider/dao_Game/gameUser');
var Dp_DungeonEditProvider = require('../../dao_provider/dao_edit/DP_Dungeon');
var heroEditProvider = require("../../dao_provider/dao_edit/hero");
var editItemProviter = require('../../dao_provider/dao_edit/item');
var userGameUserProviter = require('../../dao_provider/dao_Game/gameUser');
var userBag = require("./userBag");
var taskEditProvider = require('../../dao_provider/dao_edit/task');
var gameEnum = require('../../enum');
var userTask = module.exports;
var  self = this;

userTask.getTaskInfo = function(user_Id,callback)
{
    taskProvider.getUserTaskInfo(user_Id,function(error,result)
    {
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            callback(null,result);
        }
    });
};

var TaskModel = function(Date)
{
//    console.log(Date);
    var model = {
        User_Id:Date.User_Id,
        Task_Id:Date.Task_Id,
        State:Date.State,
        Task_Target_Type:Date.Task_Target_Type,
        CurCount:Date.CurCount,
        TargetCount:Date.TargetCount,
        Open_Time:Date.Open_Time,
        Over_Time:Date.Over_Time,
        Is_Circle:Date.Is_Circle,
        LastGetTime:Date.LastGetTime,
        Stage_Id:Date.Stage_Id
    };
    return model;
};

/**
 * 检查任务
 * @param user_Id
 * @param actionType
 * @param actionInfo
 * @param callback
 * 1、通关
 *  actionInfo  =
 *  {
 *    stageId:0, 关卡ID
 *    stageType:gameEnum.Stage_Type.Normal, 关卡类型
 *    playTimes: 1，通关次数（只计算胜利）
 *  }
 *  2、战队升级
 *   actionInfo  =
 *  {
 *    teamLvl:1, 当前战队等级
 *  }
 *  3、Pvp
 *   actionInfo  =
 *  {
 *    PvpResult: gameEnum.FightResult.Win, 战斗结果
 *    playTimes:1 Pvp次数
 *  }
 *  4、技能升级／点金／抽奖／装备附魔
 *   actionInfo  =
 *  {
 *    playTimes:1  操作次数
 *  }
 *  5、英雄数量产生变化
 *   actionInfo  =
 *  {
 *  }
 *  6、充值钻石
 *   actionInfo  =
 *  {
 *      playTimes:1  充值个数
 *      willGetTaskId:1  触发的任务排序ID
 *  }
 *  7、vip等级升级
 *   actionInfo  =
 *  {
 *      playTimes:1  当前Vip等级
 *  }
 */
userTask.checkTask = function(user_Id,actionType,actionInfo,callback)
{
    console.log("checkTask!!!!");
    console.log(actionType);
    console.log(actionInfo);

    if(actionType ==  gameEnum.Action_Type.VipLevelUp)
    {
        self.CheckVipTask(user_Id,actionInfo.playTimes,callback);
        return;
    }

    GetTaskInfoByIdIfTaskIsMonthCard(actionType,actionInfo,function(error,findResult)
    {
        if (error != null) {
            console.log(error);
            callback(error, null);
        }
        else {
            var monthTask = findResult;
            console.log("monthTask");
            console.log(monthTask);
            taskProvider.getTaskInfoByStateOrTaskType(user_Id,gameEnum.Task_State.NotDone,gameEnum.Task_Type.MonthCard,function(error,allTaskInfo)
            {
                console.log("checkTask======================1");
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    console.log("checkTask======================2");
                    console.log(allTaskInfo);
                    if(allTaskInfo.length >0)
                    {
                        var curTime = new Date();
                        var needUpdateTask = [];
                        var hasFinishTaskList = [];
                        if(actionType == gameEnum.Action_Type.OverStage)
                        {
                            Dp_DungeonEditProvider.getStage(actionInfo.stageId,function(error,result)
                            {
                                console.log("checkTask======================3");
                                console.log(result);
                                if(error!=null){
                                    console.log(error);
                                    callback(error,null);
                                }
                                else
                                {
                                    if(result.length == 0)
                                    {
                                        return  callback(null,null);
                                    }
                                    var stageType = result[0].Stage_Type;
                                    console.log("checkTask======================4");
                                    console.log(stageType);
                                    allTaskInfo.forEach(function(ts)
                                    {
                                        var TaskInfo = TaskModel(ts);
                                        if(curTime.getTime() <= TaskInfo.Over_Time.getTime())
                                        {
                                            var stageId = actionInfo.stageId;
                                            var playTimes =  actionInfo.playTimes;
                                            if((TaskInfo.Task_Target_Type == gameEnum.Task_Target_Type.OverAnyNormalStage && stageType == gameEnum.Stage_Type.Normal)
                                                || (TaskInfo.Task_Target_Type  == gameEnum.Task_Target_Type.OverAnySpecialStage && stageType == gameEnum.Stage_Type.Special)
                                                || (TaskInfo.Task_Target_Type  == gameEnum.Task_Target_Type.OverStageTime &&  stageId == TaskInfo.Stage_Id))
                                            {
                                                TaskInfo.CurCount += playTimes;
                                                if(TaskInfo.CurCount >= TaskInfo.TargetCount)
                                                {
                                                    TaskInfo.State = gameEnum.Task_State.FinishNoReward;
                                                    addIdIfNotExist(hasFinishTaskList,TaskInfo.Task_Id);
                                                }
                                                needUpdateTask.push(TaskInfo);
                                            }
                                        }
                                    });
                                    if(needUpdateTask.length >0)
                                    {
                                        taskProvider.updateTaskBatch(needUpdateTask,function(error,result)
                                        {
                                            if(error!=null){
                                                console.log(error);
                                                callback(error,null);
                                            }
                                            else
                                            {
                                                self.addNewTaskByPreIdBatch(user_Id,hasFinishTaskList,callback);
                                            }
                                        });
                                    }
                                    else
                                    {
                                        callback(null,null);
                                    }
                                }
                            });
                        }
                        else if(actionType == gameEnum.Action_Type.HeroChange)
                        {
                            var userHeroQuality = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                            heroEditProvider.getAll(function(error,allEditHero)
                            {
                                if(error!=null){
                                    console.log(error);
                                    callback(error,null);
                                }
                                else
                                {
                                    //all edit hero
                                    gameUserProvider.getUserById(user_Id,function(error,allUserHero)
                                    {
                                        if(error!=null){
                                            console.log(error);
                                            callback(error,null);
                                        }
                                        else
                                        {
                                            //all user hero
                                            allUserHero.forEach(function(hero)
                                            {
                                                for(var i=0;i< allEditHero.length;i++)
                                                {
                                                    var editHero = allEditHero[i];
                                                    if(hero.Hero_Id == editHero.recharge_id)
                                                    {
                                                        userHeroQuality[editHero.quality] ++;
                                                        break;
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            });

                            allTaskInfo.forEach(function(ts)
                            {
                                var TaskInfo = TaskModel(ts);
                                if(curTime.getTime() <= TaskInfo.Over_Time.getTime())
                                {
                                    if(TaskInfo.Task_Target_Type == gameEnum.Task_Target_Type.HaveHero && actionType == gameEnum.Action_Type.HeroChange)
                                    {
                                        var par_x = TaskInfo.CurCount;
                                        var par_y = TaskInfo.TargetCount;
                                        var totalCount = 0;
                                        for(var j = par_x ;j<userHeroQuality.length ;j++)
                                        {
                                            totalCount += userHeroQuality[par_x];
                                        }
                                        if(totalCount >= par_y)
                                        {
                                            TaskInfo.State = gameEnum.Task_State.FinishNoReward;
                                            addIdIfNotExist(hasFinishTaskList,TaskInfo.Task_Id);
                                            needUpdateTask.push(TaskInfo);
                                        }
                                    }
                                }
                            });
                            if(needUpdateTask.length >0)
                            {
                                taskProvider.updateTaskBatch(needUpdateTask,function(error,result)
                                {
                                    if(error!=null){
                                        console.log(error);
                                        callback(error,null);
                                    }
                                    else
                                    {
                                        self.addNewTaskByPreIdBatch(user_Id,hasFinishTaskList,callback);
                                    }
                                });
                            }
                            else
                            {
                                callback(null,null);
                            }
                        }
                        else
                        {
                            allTaskInfo.forEach(function(ts)
                            {
                                var TaskInfo = TaskModel(ts);
                                if(curTime.getTime() <= TaskInfo.Over_Time.getTime())
                                {
                                    if(TaskInfo.Task_Target_Type == gameEnum.Task_Target_Type.TeamLvl && actionType == gameEnum.Action_Type.UPTeamLvl)
                                    {
                                        TaskInfo.CurCount = actionInfo.teamLvl;
                                        var tarTeamLvl = TaskInfo.TargetCount;
                                        if( TaskInfo.CurCount >= tarTeamLvl)
                                        {
                                            TaskInfo.State = gameEnum.Task_State.FinishNoReward;
                                        }
                                        needUpdateTask.push(TaskInfo);
                                    }
                                    else if((TaskInfo.Task_Target_Type == gameEnum.Task_Target_Type.GetMoney && actionType == gameEnum.Action_Type.GetMoney)||
                                        (TaskInfo.Task_Target_Type == gameEnum.Task_Target_Type.GetRewards && actionType == gameEnum.Action_Type.GetRewards) ||
                                        (TaskInfo.Task_Target_Type == gameEnum.Task_Target_Type.PlayPvpTimes && actionType == gameEnum.Action_Type.PlayPvp)||
                                        ((TaskInfo.Task_Target_Type == gameEnum.Task_Target_Type.RechargeDiamond || TaskInfo.Is_Circle == gameEnum.Task_Type.MonthCard)&& actionType == gameEnum.Action_Type.RechargeDiamond) ||
                                        (TaskInfo.Task_Target_Type == gameEnum.Task_Target_Type.PlayLongWay && actionType == gameEnum.Action_Type.PlayLongWay)||
                                        (TaskInfo.Task_Target_Type == gameEnum.Task_Target_Type.OverTimeCageTimes && actionType == gameEnum.Action_Type.OverTimeCage)||
                                        (TaskInfo.Task_Target_Type == gameEnum.Task_Target_Type.WinPvpTimes && actionType == gameEnum.Action_Type.PlayPvp)||
                                        (TaskInfo.Task_Target_Type == gameEnum.Task_Target_Type.UpSkillLvlTimes && actionType == gameEnum.Action_Type.UpSkillLvlTimes)||
                                        (TaskInfo.Task_Target_Type == gameEnum.Task_Target_Type.EquipmentEnchantTimes && actionType == gameEnum.Action_Type.EquipmentEnchantTimes))
                                    {
                                        var  needAdd = false;
                                        if(actionType == gameEnum.Action_Type.PlayPvp)
                                        {
                                            if(actionInfo.PvpResult == gameEnum.FightResult.Win)
                                            {
                                                if(TaskInfo.Task_Target_Type == gameEnum.Task_Target_Type.WinPvpTimes )
                                                {
                                                    needAdd = true;
                                                }
                                            }
                                            else if(actionInfo.PvpResult == gameEnum.FightResult.UnKnown)
                                            {
                                                if(TaskInfo.Task_Target_Type == gameEnum.Task_Target_Type.PlayPvpTimes )
                                                {
                                                    needAdd = true;
                                                }
                                            }
                                            else if(actionInfo.PvpResult == gameEnum.FightResult.Lose)
                                            {

                                            }
                                        }
                                        else
                                        {
                                            needAdd = true;
                                        }

                                        if(needAdd)
                                        {
                                            if(TaskInfo.Is_Circle == gameEnum.Task_Type.MonthCard)
                                            {
                                                if(monthTask != null && TaskInfo.Task_Id == monthTask.Task_Id)
                                                {
                                                    console.log("TaskInfo.Is_Circle =================11");
                                                    if(TaskInfo.State == gameEnum.Task_State.NotDone &&
                                                        TaskInfo.CurCount == 0)
                                                    {
                                                        TaskInfo.CurCount ++;
                                                        TaskInfo.State = gameEnum.Task_State.FinishNoReward;
                                                    }
                                                    TaskInfo.TargetCount += Number(monthTask.Param_X);
                                                    needUpdateTask.push(TaskInfo);
                                                }
                                            }
                                            else
                                            {
                                                console.log("TaskInfo.Is_Circle =================222");
                                                TaskInfo.CurCount += actionInfo.playTimes;
                                                if(TaskInfo.CurCount >= TaskInfo.TargetCount)
                                                {
                                                    TaskInfo.State = gameEnum.Task_State.FinishNoReward;
                                                    addIdIfNotExist(hasFinishTaskList,TaskInfo.Task_Id);
                                                }
                                                needUpdateTask.push(TaskInfo);
                                            }
                                        }
                                    }
                                }
                            });

                            if(needUpdateTask.length >0)
                            {
                                console.log("needUpdateTask ======== ");
                                console.log(needUpdateTask);
                                taskProvider.updateTaskBatch(needUpdateTask,function(error,result)
                                {
                                    if(error!=null){
                                        console.log(error);
                                        callback(error,null);
                                    }
                                    else
                                    {
                                        if( actionType == gameEnum.Action_Type.UPTeamLvl)
                                        {
                                            self.addNewTaskByLvlBatch(user_Id,actionInfo.teamLvl,callback);
                                        }
                                        else
                                        {
                                            self.addNewTaskByPreIdBatch(user_Id,hasFinishTaskList,callback);
                                        }
                                    }
                                });
                            }
                            else
                            {
                                callback(null,null);
                            }
                        }
                    }
                    else
                    {
                        callback(null,null);
                    }
                }
            });
        }
    });

};

/**
 * 如果该次操作为购买月卡 则找出对应触发的月卡任务
 * @param actionType
 * @param actionInfo
 * @param callback
 * @constructor
 */
var GetTaskInfoByIdIfTaskIsMonthCard = function(actionType,actionInfo,callback)
{
    if(actionType == gameEnum.Action_Type.RechargeDiamond &&
        actionInfo.willGetTaskId != 0)
    {
        //购买了月卡
        var TaskOrderID =  actionInfo.willGetTaskId;
        taskEditProvider.getTaskInfoByTaskOrderId(TaskOrderID,function(error,result) {
            if (error != null) {
                console.log(error);
                callback(error,null);
            }
            else {
                if(result.length >0) {
                    callback(null,result[0]);
                }
                else
                {
                    callback(null,null);
                }
            }});
    }
    else
    {
        callback(null,null);
    }
};

/**
 *
 * @param user_id
 * @param willGetTaskId  触发的任务排序ID
 * @param callback
 * @constructor
 */
userTask.CanByDiamond = function(user_id,willGetTaskId,callback)
{
    if(willGetTaskId == 0)
    {
        callback(null,true);
    }
    else
    {
        taskEditProvider.getTaskInfoByTaskOrderId(willGetTaskId,function(error,result) {
            if (error != null) {
                console.log(error);
                callback(error,null);
            }
            else {
                if(result.length >0) {
                    var findTask = result[0];
                    var AddDays = findTask.Param_X;
                    taskProvider.getTaskByID(user_id,findTask.Task_Id,function(error,result)
                    {
                        if (error != null) {
                            console.log(error);
                            callback(error,null);
                        }
                        else {
                            console.log("CanByDiamond ");
                            console.log(result);
                            if(result.length >0) {
                                var hasGetTask = result[0];
                                var leftDays = hasGetTask.TargetCount - hasGetTask.CurCount;
                                if( leftDays <= AddDays)
                                {
                                    callback(null,true);
                                }
                                else
                                {
                                    console.log("CanNotByDiamond  111111 ");
                                    callback(null,false);
                                }
                            }
                            else
                            {
                                callback(null,true);
                            }
                        }
                    });
                }
                else
                {
                    console.log("CanNotByDiamond  22222222 ");
                    callback(null,false);
                }
            }});
    }
};

userTask.addNewTaskByLvlBatch = function(user_id,userLvl,callback)
{
    self.initUserTask(user_id,userLvl,callback);
};

userTask.addNewTaskByPreIdBatch = function(user_id,task_id_ary,callback)
{
    console.log('addNewTaskByPreIdBatch1111' + task_id_ary);
    taskEditProvider.getTaskInfoByPreTaskIDBatch(task_id_ary,function(error,result)
    {
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {  console.log('addNewTaskByPreIdBatch2');
            console.log(result);
            if(result.length >1)
            {
                var newAry = [];
                for(var i =0;i< result.length -1;i++)
                {
                    var itemAry = result[i];
                    for(var j=0;j< itemAry.length;j++)
                    {
                        newAry.push(itemAry[j]);
                    }
                }

                result = newAry;
                var taskList = [];
                result.forEach(function(Data)
                {
                    console.log("date");
                    console.log(Data);
                    if(taskCanAccept(taskList,Data))
                    {
                        var myDate=new Date();
                        myDate.setFullYear(1990,10,12);
                        var model = {
                            User_Id:user_id,
                            Task_Id:Data.Task_Id,
                            State:gameEnum.Task_State.NotDone,
                            Task_Target_Type:Data.Targets,
                            CurCount:0,
                            TargetCount:Data.Param_X,
                            Open_Time:Data.Open_Time,
                            Over_Time:Data.Over_Time,
                            Is_Circle:Data.Type,
                            LastGetTime:myDate,
                            Stage_Id:Data.Stage_Id
                        };
                        taskList.push(model);
                    }
                });
                console.log('taskList:',taskList);
                if(taskList.length >0)
                {
                    console.log("taskList");
                    taskProvider.addTaskBatch(taskList,function(error,result)
                    {
                        if(error!=null){
                            console.log(error);
                            callback(error,null);
                        }
                        else
                        {
                            callback(null,null);
                        }
                    });
                }
                else
                {
                    callback(null,null);
                }
            }
            else
            {
                callback(null,null);
            }
        }
    });
};

var addIdIfNotExist = function(ary,id)
{
    var hasFound = false;
    for(var i =0;i< ary.length;i++)
    {
        if(!hasFound && ary[i] == id)
        {
            hasFound = true;
        }
    }
    if(!hasFound)
    {
        ary.push(id);
    }
};

/**
 * 是否因为前置任务的完成而开启该后置任务
 * @param ary  玩家所有的任务信息
 * @param preTaskId  前置任务ID
 * @returns {boolean}
 */
var taskCanAcceptAndFinish = function(ary,preTaskId)
{
    var hasFound = false;
    for(var i =0;i< ary.length;i++)
    {
        if(!hasFound &&
            (ary[i].State == gameEnum.Task_State.FinishHasReward || ary[i].State == gameEnum.Task_State.FinishNoReward) &&
            ary[i].Task_Id == preTaskId)
        {
            hasFound = true;
        }
    }
    return  hasFound;
};

/**
 * 关闭所以已经接受的该系列任务
 * @param ary
 * @param listID
 * @returns {Array}
 */
var AddWillBeCloseTaskList = function(beCloseList,ary,task)
{
    //console.log("AddWillBeCloseTaskList " + listID);
    console.log(beCloseList);
    console.log(ary);
    console.log("AddWillBeCloseTaskList ========= ");
    for(var i =0;i< ary.length;i++)
    {
        if(ary[i].CurCount == task.Param_X && ary[i].Task_Id != task.Task_Id)
        {
            ary[i].State = gameEnum.Task_State.Close;
            beCloseList.push(ary[i]);
        }
    }
    console.log(beCloseList);
    console.log("AddWillBeCloseTaskList ========= End");
    return beCloseList;
};

/**
 * 筛选各系列中vip等级需求最高的任务
 * @param vipTaskList
 */
var delVipTaskList = function(vipTaskList)
{
    var needList = [];
    console.log("vipTaskList");
    console.log(vipTaskList);
    vipTaskList.forEach(function(task)
    {
        //console.log("========task info");
        //console.log(task1);
        //var task = new TaskModel(task1);
        //task.Open_Lvl = task1.Open_Lvl;
        //console.log("========task model info");
        //console.log(task);
        if(needList.length == 0)
        {
            needList.push(task);
        }
        else
        {
            var needReplace = -1;
            var hasSameTask = false;
            needList.forEach(function(task2,index)
            {
                if(task.CurCount == task2.CurCount )
                {
                    hasSameTask = true;
                    if(task.Open_Lvl > task2.Open_Lvl)
                    {
                        needReplace = index;
                    }
                }
            });
            if(needReplace != -1)
            {
                needList.splice(needReplace,1);
                needList.push(task);
            }
            else if(hasSameTask == false)
            {
                needList.push(task);
            }
        }
    });
    return needList;
};


/**
 * 是否能接受过该任务（不重复 && 在能结束的时间内 && 是有效任务）
 * @param ary  玩家所有的任务信息
 * @param taskInfo  单个任务
 * @returns {boolean}
 */
var taskCanAccept = function(ary,taskInfo)
{
    var canAccept = true;
    var curTime = new Date();
    if(curTime.getTime() <= taskInfo.Over_Time.getTime()
        && curTime.getTime() >= taskInfo.Open_Time.getTime()
        && taskInfo.State == 1)
    {
        for(var i =0;i< ary.length;i++)
        {
            if(canAccept && ary[i].Task_Id == taskInfo.Task_Id)
            {
                canAccept = false;
            }
        }
    }
    else
    {
        canAccept = false;
    }

    return  canAccept;
};

userTask.CheckVipTask = function(user_Id,vipLvl,callback)
{
    taskProvider.getTaskByTaskTypeAndNotState(user_Id,gameEnum.Task_Type.VipPower,gameEnum.Task_State.Close,function(error,result)
    {
        console.log(user_Id);
        console.log(vipLvl);
        console.log("CheckVipTask======================1");
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            console.log("CheckVipTask======================2");
            console.log(result);
            var taskAry = [];
            result.forEach(function(task)
            {
                taskAry.push(task);
            });
            var needAddTaskList = [];
            var needCloseTaskList = [];
            taskEditProvider.getVipTaskByLvl(vipLvl,gameEnum.Task_Type.VipPower,function(error,willAcceptTaskList)
            {
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    console.log("CheckVipTask======================3");
                    console.log(willAcceptTaskList);
                    if(willAcceptTaskList.length > 0)
                    {
                        var DealEndTaskList = [];
                        DealEndTaskList = delVipTaskList(willAcceptTaskList);
                        console.log("DealEndTaskList");
                        console.log(DealEndTaskList);
                        DealEndTaskList.forEach(function(task)
                        {
                            needCloseTaskList = AddWillBeCloseTaskList(needCloseTaskList,taskAry,task);
                            console.log("needCloseTaskList");
                            console.log(needCloseTaskList);
                            if(taskCanAccept(taskAry,task))
                            {
                                var myDate=new Date();
                                myDate.setFullYear(1990,10,12);

                                var model = {
                                    User_Id:user_Id,
                                    Task_Id:task.Task_Id,
                                    State:gameEnum.Task_State.FinishNoReward,
                                    Task_Target_Type:task.Targets,
                                    CurCount:task.Param_X,
                                    TargetCount:0,
                                    Open_Time:task.Open_Time,
                                    Over_Time:task.Over_Time,
                                    Is_Circle:task.Type,
                                    LastGetTime:myDate,
                                    Stage_Id:task.Stage_Id
                                };
                                needAddTaskList.push(model);
                            }
                        });

                        console.log("initUserTask======================4");
                        console.log(needAddTaskList);
                        taskProvider.addTaskBatch(needAddTaskList,function(error,result)
                        {
                            if(error!=null){
                                console.log(error);
                                callback(error,null);
                            }
                            else
                            {
                                taskProvider.updateTaskBatch(needCloseTaskList,function(error,result)
                                {
                                    if(error!=null){
                                        console.log(error);
                                        callback(error,null);
                                    }
                                    else
                                    {
                                        callback(null,null);
                                    }
                                });
                            }
                        });
                    }
                    else
                    {
                        console.log('task end2');
                        callback(null,null);
                    }
                }
            });
        }
    });
};


userTask.initUserTask = function(user_Id,userLvl,callback)
{
    taskProvider.getUserTaskInfo(user_Id,function(error,result)
    {
        console.log(user_Id);
        console.log(userLvl);
        console.log("initUserTask======================1");
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            console.log("initUserTask======================2");
            console.log(result);
            var taskAry = [];
            result.forEach(function(task)
            {
                taskAry.push(task);
            });
            var needAddTaskList = [];
            taskEditProvider.getAllTaskByLvl(userLvl,function(error,result)
            {
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    console.log("initUserTask======================3");
                    console.log(result);
                    if(result.length > 0)
                    {
                        result.forEach(function(task)
                        {
                            var  canAccept = false;
                            if(task.Type != gameEnum.Task_Type.VipPower)
                            {
                                if(task.Pre_Task_Id != 0)
                                {
                                    canAccept = taskCanAcceptAndFinish(taskAry,task.Pre_Task_Id);
                                }
                                else
                                {
                                    canAccept = true;
                                }
                            }
                            if(taskCanAccept(taskAry,task) && canAccept)
                            {
                                var myDate=new Date();
                                myDate.setFullYear(1990,10,12);

                                var taskState = gameEnum.Task_State.NotDone;
                                var targetCount = task.Param_X;
                                if(task.Type == gameEnum.Task_Type.MonthCard)
                                {
                                    targetCount = 0;
                                }
                                var model = {
                                    User_Id:user_Id,
                                    Task_Id:task.Task_Id,
                                    State:taskState,
                                    Task_Target_Type:task.Targets,
                                    CurCount:0,
                                    TargetCount:targetCount,
                                    Open_Time:task.Open_Time,
                                    Over_Time:task.Over_Time,
                                    Is_Circle:task.Type,
                                    LastGetTime:myDate,
                                    Stage_Id:task.Stage_Id
                                };

                                if(model.Task_Target_Type == gameEnum.Task_Target_Type.HaveHero)
                                {
                                    model.CurCount = task.Param_X;
                                    model.TargetCount = task.Param_Y;
                                }
                                needAddTaskList.push(model);
                            }
                        });

                        if(needAddTaskList.length > 0)
                        {
                            console.log("initUserTask======================4");
                            console.log(needAddTaskList);
                            taskProvider.addTaskBatch(needAddTaskList,function(error,result)
                            {
                                if(error!=null){
                                    console.log(error);
                                    callback(error,null);
                                }
                                else
                                {
                                    callback(null,null);
                                }
                            });
                        }
                        else
                        {
                            console.log('task end1');
                            callback(null,null);
                        }
                    }
                    else
                    {
                        console.log('task end2');
                        callback(null,null);
                    }
                }
            });
        }
    });
};

userTask.batchRefreshTaskStateForGuide = function(user_id,callback)
{
    console.log("batchRefreshTaskStateForGuide");
    var order_id_ary = "104,105,106,30001,10005";
    taskEditProvider.getTaskByOrderIDBatch(order_id_ary,function(error,result)
    {
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            console.log("guide result");
            console.log(result);
            if(result.length >0)
            {
                var taskList = [];
                result.forEach(function(Data)
                {
                    var endState = gameEnum.Task_State.FinishNoReward;

                    var model = {
                        User_Id:user_id,
                        Task_Id:Data.Task_Id,
                        State:endState
                    };
                    taskList.push(model);
                });
                if(taskList.length >0)
                {
                    taskProvider.updateTaskStateBatch(taskList,function(error,result)
                    {
                        if(error!=null){
                            console.log(error);
                            callback(error,null);
                        }
                        else
                        {
                            callback(null,null);
                        }
                    });
                }
                else
                {
                    callback(null,null);
                }
            }
            else
            {
                callback(null,null);
            }
        }
    });
};


userTask.getTaskReward = function(user_Id,taskId,callback)
{
    console.log("getTaskReward");
    console.log(user_Id);
    console.log(taskId);
    taskProvider.getTaskByID(user_Id,taskId,function(error,result)
    {
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            console.log("getTaskReward ======== ");
            console.log(result);
            console.log("result over ======== ");
            if(result.length == 0)
            {
                return  callback(code.UserTask.Task_Not_Found,null);
            }
            var TaskInfo = TaskModel(result[0]);
            var curTime = new Date();

            console.log("curTime pre");
            console.log(curTime);


            var taskTargetType = TaskInfo.Task_Target_Type;
            if(TaskInfo.State == gameEnum.Task_State.FinishHasReward)
            {
                return  callback(code.UserTask.Has_Get_Reward,null);
            }

            if(curTime.getTime() > TaskInfo.Over_Time.getTime())
            {
                return  callback(code.UserTask.Task_Has_Over_Time,null);
            }

            if(TaskInfo.Task_Type == gameEnum.Task_Type.MonthCard && TaskInfo.CurCount > TaskInfo.TargetCount)
            {
                return  callback(code.UserTask.Can_Not_Get_Reward,null);
            }

            if(TaskInfo.Is_Circle == gameEnum.Task_Type.Circle)
            {
                taskEditProvider.getTaskInfoByTaskID(TaskInfo.Task_Id,function(error,result) {
                    if (error != null) {
                        console.log(error);
                        callback(error, null);
                    }
                    else {
                          if(result.length >0)
                          {
                              var circleTask = result[0];
                              //循环任务
                              var openTimeA =  circleTask.Circul_Open_Time.getTime()%86400000;
                              var overTimeA =  circleTask.Circul_Over_Time.getTime()%86400000;
                              var curTimeA =  curTime.getTime()%86400000;

                              console.log("Circul_Open_Time pre");
                              console.log(openTimeA);
                              console.log("Circul_Over_Time after");
                              console.log(overTimeA);
                              console.log("curTimeA after");
                              console.log(curTimeA);

                              if(openTimeA < overTimeA)
                              {
                                  if(openTimeA <= curTimeA && curTimeA <= overTimeA)
                                  {
                                      //go on
                                      dealAllTypeTask(user_Id,TaskInfo,callback);
                                  }
                                  else
                                  {
                                      //not
                                      return  callback(code.UserTask.Circle_Time_Error,null);
                                  }
                              }
                              else
                              {
                                  if(openTimeA <= curTimeA && curTimeA <= overTimeA)
                                  {
                                      //not
                                      return  callback(code.UserTask.Circle_Time_Error,null);
                                  }
                                  else
                                  {
                                      //go on
                                      dealAllTypeTask(user_Id,TaskInfo,callback);
                                  }
                              }

                          }
                        else
                          {
                              return  callback(code.UserTask.Task_Not_Found,null);
                          }
                    }
                });
            }
            else
            {
                 dealAllTypeTask(user_Id,TaskInfo,callback);
            }
        }
    });
};

var dealAllTypeTask = function(user_Id,TaskInfo,callback)
{
    console.log("dealAllTypeTask ====================1");
    var taskTargetType = TaskInfo.Task_Target_Type;
    console.log(taskTargetType);
    if(TaskInfo.State == gameEnum.Task_State.FinishNoReward)
    {
        console.log("OverTaskAndGetRewards ====================1");
        OverTaskAndGetRewards(user_Id,TaskInfo,callback);
    }
    else
    {
        if(taskTargetType == gameEnum.Task_Target_Type.HaveHero)
        {
            var userHeroQuality = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            heroEditProvider.getAll(function(error,allEditHero)
            {
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    console.log(" heroEditProvider.getAll success ====================1");
                    //all edit hero
                    gameUserProvider.getUserById(user_Id,function(error,allUserHero)
                    {
                        if(error!=null){
                            console.log(error);
                            callback(error,null);
                        }
                        else
                        {
                            console.log(" getUserById success====================1");
                            console.log(allEditHero[0]);
                            //all user hero
                            allUserHero.forEach(function(hero)
                            {
                                for(var i=0;i< allEditHero.length;i++)
                                {
                                    var editHero = allEditHero[i];
                                    if(hero.Hero_Id == editHero.recharge_id)
                                    {
                                        console.log("add===========");
                                        userHeroQuality[editHero.quality] ++;
                                        break;
                                    }
                                }
                            });
                            var par_x = TaskInfo.CurCount;
                            var par_y = TaskInfo.TargetCount;
                            console.log("OverTaskAndGetRewards ==================== 1113333");
                            console.log(userHeroQuality);
                            console.log(allUserHero);
                            var totalCount = 0;
                            for(var j = par_x ;j<userHeroQuality.length ;j++)
                            {
                                totalCount += userHeroQuality[j];
                            }

                            if(totalCount >= par_y)
                            {
                                console.log("OverTaskAndGetRewards ====================2");
                                OverTaskAndGetRewards(user_Id,TaskInfo,callback);
                            }
                            else
                            {
                                console.log("OverTaskAndGetRewards ==================== !! ==" + totalCount +"par_Y=" + par_y );
                                return  callback(code.UserTask.Can_Not_Get_Reward,null);
                            }
                        }
                    });
                }
            });
        }
        else if(taskTargetType == gameEnum.Task_Target_Type.EquipmentEnchantTimes ||
            taskTargetType == gameEnum.Task_Target_Type.GetMoney ||
            taskTargetType == gameEnum.Task_Target_Type.GetRewards ||
            taskTargetType == gameEnum.Task_Target_Type.OverTestTimes ||
            taskTargetType == gameEnum.Task_Target_Type.OverAnyNormalStage ||
            taskTargetType == gameEnum.Task_Target_Type.OverAnySpecialStage ||
            taskTargetType == gameEnum.Task_Target_Type.OverStageTime ||
            taskTargetType == gameEnum.Task_Target_Type.RechargeDiamond ||
            taskTargetType == gameEnum.Task_Target_Type.OverTimeCageTimes ||
            taskTargetType == gameEnum.Task_Target_Type.PlayPvpTimes ||
            taskTargetType == gameEnum.Task_Target_Type.WinPvpTimes ||
            taskTargetType == gameEnum.Task_Target_Type.PlayLongWay ||
            taskTargetType == gameEnum.Task_Target_Type.UpSkillLvlTimes||
            taskTargetType == gameEnum.Task_Target_Type.TeamLvl)
        {
            var par_x = TaskInfo.CurCount;
            var par_y = TaskInfo.TargetCount;
            if(par_x >= par_y)
            {
                console.log("OverTaskAndGetRewards ====================3");
                OverTaskAndGetRewards(user_Id,TaskInfo,callback);
            }
            else
            {
                console.log("Can_Not_Get_Reward ==" + par_x +"yyyyy ==" + par_y);
                callback(code.UserTask.Can_Not_Get_Reward,null);
            }
        }
        else
        {
            console.log("dealAllTypeTask ====================  other type");
            OverTaskAndGetRewards(user_Id,TaskInfo,callback);
        }
    }
};


var OverTaskAndGetRewards = function(user_Id,TaskInfo,callback)
{
    TaskInfo.State = gameEnum.Task_State.FinishHasReward;
    TaskInfo.LastGetTime = new Date();
    //update state
    taskProvider.updateTaskByID(TaskInfo,gameEnum.Task_State.FinishHasReward,function(error,result){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            taskEditProvider.getTaskInfoByTaskID(TaskInfo.Task_Id,function(error,result)
            {
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    if(result.length >0)
                    {
                        result = result[0];
                        var itemList = [];
                        JSON.parse(result.Rewards).forEach(function(reward)
                        {
                            var itemModel =
                            {
                                User_Id:user_Id,
                                Item_Id:reward.split(',')[0],
                                Item_Amount:reward.split(',')[2]
                            };
                            itemList.push(itemModel)
                        });
                        //get reward
                        console.log("itemList");
                        console.log(itemList);
                        userBag.addItemsToBag(user_Id,itemList,function(error,result)
                        {
                            if(error!=null){
                                console.log(error);
                                callback(error,null);
                            }
                            else
                            {
                                editItemProviter.getItemEffectByType(gameEnum.Item_Effect_Type.Hero, function (error, resultHeroItem) {
                                    if (error != null) {
                                        console.log(error);
                                        callback(error, null);
                                    }
                                    else {
                                        var heros = '';
                                        resultHeroItem.forEach(function (HeroItem) {
                                            itemList.forEach(function (item) {
                                                if (item.Item_Id == HeroItem.Item_Id) {
                                                    heros += HeroItem.Effect_Value + ",";
                                                }
                                            })
                                        });

                                        userGameUserProviter.getUserHeroByHeroIdsL(user_Id, heros, function (error, resultUserHeros) {
                                            if (error != null) {
                                                console.log(error);
                                                callback(error, null);
                                            }
                                            else {
                                                gameUserProvider.getUserTroopByUserId(user_Id,function(error,UserInfo)
                                                {
                                                    if(error!=null){
                                                        console.log(error);
                                                        callback(error,null);
                                                    }
                                                    else
                                                    {
                                                        var TeamLvl = UserInfo[0].Troop_Lvl;
                                                        self.initUserTask(user_Id,TeamLvl,function(err,res)
                                                        {
                                                            if(error!=null){
                                                                console.log(err);
                                                                callback(err,null);
                                                            }
                                                            else
                                                            {
                                                                var RewardResult = {
                                                                    Items: itemList,
                                                                    User_Heros: resultUserHeros
                                                                };
                                                                console.log(RewardResult);
                                                                callback(null, RewardResult);
//                                                                    callback(null,null);
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        })
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    });
};