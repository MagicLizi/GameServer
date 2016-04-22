/**
 * Created by peihengyang on 15/1/4.
 */
var code = require('../../../Game/code');
var sqlClient = require('../../../Util/dao/sqlClient').Admin;
var sqlCommand = require('../../../Util/dao/sqlCommand');
var lottery = module.exports;

lottery.getAll=function(callback){
    var sql =  new sqlCommand('SELECT * FROM edit_LotteryPool ORDER BY Pool_Id');
    sqlClient.query(sql,function(error,resultLotteryPool){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            var sql = new sqlCommand('SELECT * FROM lottery_Method ORDER BY Lottery_Method_Id');
            sqlClient.query(sql,function(error,resultLotteryMethod){
                if(error!=null){
                    console.log(error);
                    callback(code.DB.EXEC_QUERY_ERROR,null);
                }
                else
                {
                    var sql = new sqlCommand('SELECT * FROM Pool_Item Order BY Pool_Item_Id');
                    sqlClient.query(sql,function(error,resultPoolItem){
                        if(error!=null){
                            console.log(error);
                            callback(code.DB.EXEC_QUERY_ERROR,null);
                        }
                        else
                        {
                            var results = {
                                LotteryPool:resultLotteryPool,
                                LotteryMethod:resultLotteryMethod,
                                PoolItem:resultPoolItem
                            }
                            console.log(results);
                            callback(null,results);
                        }
                    })
                }
            })

        }
    })
};

lottery.getPoolItemsByPoolId=function(pool_Id,callback){
    var sql =  new sqlCommand('SELECT PI.*,EI.Item_Name AS Pool_Item_Name FROM Pool_Item AS PI,edit_Items EI WHERE PI.Pool_Id = ? ' +
        'AND PI.Item_Id = EI.Item_Id ORDER BY Pool_Item_Id',[pool_Id]);
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            console.log(results);
            callback(null,results);
        }
    })
};


lottery.getLotteryMethod=function(callback){
    var sql =  new sqlCommand('SELECT lE.*,eLP.Pool_Name AS Pool_Name FROM edit_LotteryPool AS eLP,lottery_Method lE WHERE ' +
        ' lE.Pool_Id = eLP.Pool_Id ORDER BY Lottery_Method_Id');
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            console.log(results);
            callback(null,results);
        }
    })
};



lottery.getLotteryMethodById=function(lottery_Method_Id,callback){
    var sql =  new sqlCommand('SELECT lE.*,eLP.Pool_Name AS Pool_Name FROM edit_LotteryPool AS eLP,lottery_Method lE WHERE ' +
        ' lE.Pool_Id = eLP.Pool_Id AND lE.Lottery_Method_Id = ? ORDER BY Lottery_Method_Id',[lottery_Method_Id]);
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            console.log(results);
            callback(null,results);
        }
    })
};

lottery.add =  function(model,callback){
    var sql =  new sqlCommand('INSERT INTO edit_LotteryPool(Pool_Name,Create_Date,Pool_Description,Is_Display)' +
        'VALUES(?,?,?,?);',[model.Pool_Name,model.Create_Date,model.Pool_Description,model.Is_Display]);
    sqlClient.insert(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.INSERT_DATA_ERROR,null);
        }
        else
        {
            callback(null,results);
        }
    })
};

lottery.addPoolItem =  function(model,callback){
    var sql =  new sqlCommand('INSERT INTO Pool_Item (Pool_Quality,Item_Id,Item_Amount,Create_Date,Pool_Id,Description) ' +
        'VALUES(?,?,?,?,?,?)',[model.Pool_Quality,model.Item_Id,model.Item_Amount,model.Create_Date,model.Pool_Id,model.Description]);
    sqlClient.insert(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.INSERT_DATA_ERROR,null);
        }
        else
        {
            callback(null,results);
        }
    })
};

lottery.addLotteryMethod =  function(model,callback){
    var sql =  new sqlCommand('INSERT INTO lottery_Method (Method_Name,Pool_Id,Lottery_Times,Quality1_Probability,' +
        'Quality2_Probability,Quality3_Probability,Quality4_Probability,Quality5_Probability,Quality6_Probability,' +
        'Quality7_Probability,Quality8_Probability,Quality9_Probability,Quality10_Probability,Create_Date,Method_Id)' +
        'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[model.Method_Name,model.Pool_Id,model.Lottery_Times,
        model.Quality1_Probability,
    model.Quality2_Probability,model.Quality3_Probability,model.Quality4_Probability,model.Quality5_Probability,
    model.Quality6_Probability,model.Quality7_Probability,model.Quality8_Probability,model.Quality9_Probability,
    model.Quality10_Probability,model.Create_Date,model.Method_Id]);
    sqlClient.insert(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.INSERT_DATA_ERROR,null);
        }
        else
        {
            callback(null,results);
        }
    })
};


lottery.getPoolById = function(pool_Id,callback){
    var sql = new sqlCommand('SELECT * FROM edit_LotteryPool WHERE Pool_Id = ?',[pool_Id]);
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            callback(null,results);
        }
    });
};

lottery.getPoolItemById = function(pool_Item_Id,callback){
    var sql = new sqlCommand('SELECT * FROM Pool_Item WHERE Pool_Item_Id = ?',[pool_Item_Id]);
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            callback(null,results);
        }
    })
};

lottery.updatePool = function(model,callback){
    var sql = new sqlCommand('UPDATE edit_LotteryPool SET Pool_Name = ?,' +
        'Pool_Description = ?,Is_Display = ? WHERE Pool_Id = ?',[model.Pool_Name,model.Pool_Description,model.Is_Display,model.Pool_Id]);
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.UPDATE_DATA_ERROR,null);
        }
        else
        {
            callback(null,results);
        }
    })
}


lottery.updatePoolItem = function(model,callback){
    var sql = new sqlCommand('UPDATE Pool_Item SET Pool_Quality = ?,Item_Id = ?,Item_Amount = ?,' +
        'Pool_Id = ?,Description=? WHERE Pool_Item_Id = ?',[model.Pool_Quality,model.Item_Id,model.Item_Amount,
    model.Pool_Id,model.Description,model.Pool_Item_Id]);
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.UPDATE_DATA_ERROR,null);
        }
        else
        {
            callback(null,results);
        }
    })
}

lottery.updateLotteryMethod = function(model,callback){
    console.log(model);
    var sql = new sqlCommand('UPDATE lottery_Method SET Method_Name = ?,Pool_Id = ?,Lottery_Times = ?,' +
        'Quality1_Probability = ?,Quality2_Probability = ?,Quality3_Probability = ?,Quality4_Probability = ?,' +
        'Quality5_Probability = ?,Quality6_Probability = ?,Quality7_Probability = ?,Quality8_Probability = ?,' +
        'Quality9_Probability = ?,Quality10_Probability = ?,Method_Id = ? WHERE Lottery_Method_Id = ?',[model.Method_Name,
    model.Pool_Id,model.Lottery_Times,model.Quality1_Probability,model.Quality2_Probability,model.Quality3_Probability,
    model.Quality4_Probability,model.Quality5_Probability,model.Quality6_Probability,model.Quality7_Probability,
    model.Quality8_Probability,model.Quality9_Probability,model.Quality10_Probability,model.Method_Id,
        model.Lottery_Method_Id]);
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.UPDATE_DATA_ERROR,null);
        }
        else
        {
            callback(null,results);
        }
    })
}