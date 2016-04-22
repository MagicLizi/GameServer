/**
 * Created by peihengyang on 15/1/6.
 */
var code = require('../../code');
var gameEnum = require('../../enum');
var userDungeonProviter = require('../../dao_provider/dao_Game/dungeon');
var userDungeon = module.exports;

userDungeon.EnterStage = function(user_Id,stage_Id,callback){
    userDungeonProviter.getUserDungeonByUserIdStageId(user_Id,stage_Id,function(error,results){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            if(results.length==0){
                callback(code.UserDungeon.User_Stage_Not_Found,null);
            }
            else if(results.length>1){
                callback(code.UserDungeon.User_Stage_Data_Fail,null);
            }
            else
            {
                userDungeonProviter.getUserTroopRecord(user_Id,gameEnum.FightType.PVE,function(error,results){
                    if(error!=null){
                        console.log(error);
                        callback(error,null);
                    }
                    else
                    {
                        callback(null,results);
                    }

                })
            }
        }
    })
}

userDungeon.getUnfinishedPVE =  function(userId,callback){
    userDungeonProviter.getUnfinishedPVE(userId,function(error,resultsUnfinishPVE){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            callback(null,resultsUnfinishPVE);
        }
    })
}

var createUserDungeonModel = function(result){
    var userDungeonModel = {
        User_dungeon_Id:0,
        User_Id:0,
        Dungeon_Id:0,
        Stage_Id:0,
        Clear_Star:0,
        Clear_Date:'',
        Create_Date:'',
        Dungeon_Order:0,
        Stage_Order:0
    }
    userDungeonModel.User_Id =  result.User_Id;
    userDungeonModel.Dungeon_Id = result.Dungeon_Id;
    userDungeonModel.Stage_Id =  result.Stage_Id;
    userDungeonModel.Clear_Star = result.Clear_Star;
    userDungeonModel.Clear_Date = result.Clear_Date;
    userDungeonModel.Dungeon_Order = result.Dungeon_Order;
    userDungeonModel.Stage_Order = result.Stage_Order;
    return userDungeonModel;
}