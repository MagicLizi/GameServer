/**
 * Created by peihengyang on 15/1/7.
 */
var code = require('../../../ServerConfigs/code');
var gameEnum =  require('../../enum')
var sqlClient = require('../../../Util/dao/sqlClient').Game;
var sqlClientAdmin = require('../../../Util/dao/sqlClient').Admin;
var sqlCommand = require('../../../Util/dao/sqlCommand');
var lottery = module.exports;

lottery.lootItem =  function(model,callback){
    //console.log("lootItem_model:");
    //console.log(model);
    var sql = new sqlCommand('CALL user_Lottery(?,?)',[model.User_Id,model.Lottery_Method_Id]);
    //console.log(model);
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_PROC_ERROR,null);
        }
        else
        {
            console.log('lootResults:',results);
            callback(null,results[0]);
        }
    })
}

lottery.userLottery  =  function(model,callback){
    var resultCode;
    console.log('userLotteryModel:',model);
    var sql = new sqlCommand('CALL lottery(?,?,?,?,?)',[model.User_Id,model.Lottery_Type,model.Is_Free,
    model.Diamond_Id,model.P_Diamond_Id]);
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_PROC_ERROR,null);
        }
        else
        {
            console.log("lottery result");
            console.log(results);
            var result = {
                LootItem:results[0],
                Code:results[1][0].U_Lottery_Status,
                LotteryExpense:results[2][0]
            };
            console.log(result);
            callback(null,result);
        }
    })
}

lottery.getFreeLotteryByUserId = function(userId,callback){
    var sql = new sqlCommand('SELECT * FROM ( SELECT * FROM (SELECT * ' +
    'FROM All_Lottery_History WHERE Lottery_Status =1 ' +
    'AND (Is_Free = 1 OR Is_Free = -1) AND (DATE_ADD(Create_Date,interval 172800 SECOND) >= NOW()) AND User_Id = ? ' +
    'AND Method_Id = 4 UNION SELECT *  FROM Today_Lottery WHERE Lottery_Status =1 ' +
    'AND (Is_Free = 1 OR Is_Free = -1) AND User_Id = ?) AS All_Lottery ORDER BY Create_Date ) ' +//11月11日,修正重登后免费抽奖19001,去除DESC
    'AS User_Free_Lottery ',[userId,userId]);
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            console.log("FreeLottery:" , results);
            callback(null,results);
        }
    })
}
