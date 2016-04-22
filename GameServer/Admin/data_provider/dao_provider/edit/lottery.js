/**
 * Created by peihengyang on 15/1/4.
 */
var code = require('../../../config/code');
var sqlClient = require('../../dao/sqlClient').admin;
var sqlCommand = require('../../dao/sqlCommand');
var logger = require('log4js').getLogger("db");
var lottery = module.exports;

lottery.getAll=function(callback){
    var sql = new sqlCommand('SELECT * FROM edit_Lottery ORDER BY Lottery_Id');
    sqlClient.query(sql,function(error,resultLottery){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
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
                                        PoolItem:resultPoolItem,
                                        Lottery:resultLottery
                                    }
                                    //console.log(results);
                                    callback(null,results);
                                }
                            })
                        }
                    })

                }
            })
        }
    })

};

lottery.getPoolItemsByPoolId=function(pool_Id,pool_Type,callback){
    if(pool_Type == 1){
        var sql =  new sqlCommand('SELECT PI.*,EI.Item_Name AS Pool_Item_Name FROM Pool_Item AS PI LEFT JOIN edit_Items EI ' +
        'ON PI.Item_Id = EI.Item_Id  WHERE PI.Pool_Id = ? AND PI.Pool_Type = ? ORDER BY Pool_Item_Id',[pool_Id,pool_Type]);
    }
    else
    {
        var sql =  new sqlCommand('SELECT PI.*,CONCAT(EI.Item_Name,"*",eG.Item_Amount) AS Pool_Item_Name FROM Pool_Item AS PI LEFT JOIN edit_Goods AS eG' +
        ' ON PI.Item_Id = eG.Goods_Id LEFT JOIN edit_Items EI ON eG.Item_Id = EI.Item_Id  WHERE PI.Pool_Id = ?  ' +
        'AND PI.Pool_Type = ? ORDER BY Pool_Item_Id',[pool_Id,pool_Type]);
    }

    sqlClient.query(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            //console.log(results);
            callback(null,results);
        }
    })
};

lottery.delPoolItem=function(pool_Item_Id,callback){
    console.log(pool_Item_Id);
    var sql =  new sqlCommand('DELETE FROM Pool_Item WHERE Pool_Item_Id = ?;',pool_Item_Id);
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            console.log('delPoolItem:',error);
            callback(code.DB.DELETE_DATA_ERROR,null);
        }
        else
        {
            //console.log(results);
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
            //console.log(results);
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
            //console.log(results);
            callback(null,results);
        }
    })
};

lottery.add =  function(model,callback){
    var sql =  new sqlCommand('INSERT INTO edit_LotteryPool(Pool_Name,Create_Date,Pool_Description,Is_Display,Pool_Type)' +
        'VALUES(?,?,?,?,?);',[model.Pool_Name,model.Create_Date,model.Pool_Description,model.Is_Display,model.Pool_Type]);
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

lottery.addLotterySystem =  function(model,callback){
    var sql =  new sqlCommand('INSERT INTO edit_Lottery(Lottery_Name,Lottery_Description,Free_Times,Free_Interval,Is_First,' +
    'Max_Level,Min_Level,Type_Of_Expense,Expense_Amount,Lottery_Method_Id,Create_Date,Method_Id)' +
    'VALUES(?,?,?,?,?,?,?,?,?,?,?,?);',[model.Lottery_Name,model.Lottery_Description,model.Free_Times,model.Free_Interval,
    model.Is_First,model.Max_Level,model.Min_Level,model.Type_Of_Expense,model.Expense_Amount,model.Lottery_Method_Id,
        model.Create_Date,model.Method_Id]);
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

lottery.updateLotterySystem = function(model,callback){

    var sql = new sqlCommand('UPDATE edit_Lottery SET Lottery_Name = ?,Lottery_Description = ?,Free_Times = ?,' +
    'Free_Interval = ?, Is_First = ?,Max_Level = ?,Min_Level = ?,Type_Of_Expense = ?,Expense_Amount = ?,' +
    'Lottery_Method_Id = ?,Method_Id = ? WHERE Lottery_Id = ?',[model.Lottery_Name,model.Lottery_Description,model.Free_Times,
        model.Free_Interval,model.Is_First,model.Max_Level,model.Min_Level,model.Type_Of_Expense,model.Expense_Amount,
    model.Lottery_Method_Id,model.Method_Id,model.Lottery_Id]);
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


lottery.getLotterySystemGroup=function(callback){
    var sql =  new sqlCommand('SELECT Method_Id,Free_Times,Free_Interval,Lottery_Name,Expense_Amount FROM ' +
    'edit_Lottery WHERE Is_First = 0 GROUP BY Method_Id,Free_Times');
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            //console.log(results);
            callback(null,results);
        }
    })
};

lottery.getLotterySystemById=function(lottery_Id,callback){
    var sql =  new sqlCommand('SELECT * FROM edit_Lottery WHERE Lottery_Id = ? ORDER BY Lottery_Id',[lottery_Id]);
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            //console.log(results);
            callback(null,results);
        }
    })
};

lottery.addPoolItem =  function(model,callback){
    var sqls = [];
    if(model.Item_Id != ""){
        var sql =  new sqlCommand('INSERT INTO Pool_Item (Pool_Quality,Item_Id,Item_Amount,Create_Date,Pool_Id,Description,' +
        'Pool_Type) VALUES(?,?,?,?,?,?,?)',[model.Pool_Quality,model.Item_Id,model.Item_Amount,model.Create_Date,
            model.Pool_Id,model.Description,model.Pool_Type]);
        sqls.push(sql);
    }
    else
    {
        var M_Item_Ids = model.Item_Ids.split("-");
        //console.log("M_Item_Ids");
        //console.log(M_Item_Ids)
        if(M_Item_Ids.length >= 2){
            for(var i = Number(M_Item_Ids[0]);i<=Number(M_Item_Ids[1]);i++){
                var sql =  new sqlCommand('INSERT INTO Pool_Item (Pool_Quality,Item_Id,Item_Amount,Create_Date,Pool_Id,Description,' +
                'Pool_Type) SELECT ?,(SELECT Item_Id FROM edit_Items WHERE Item_Order = ? LIMIT 1),?,?,?,?,? FROM DUAL ' +
                    'WHERE EXISTS (SELECT Item_Id FROM edit_Items WHERE Item_Order = ?)',
                    [model.Pool_Quality,i,model.Item_Amount,model.Create_Date, model.Pool_Id,model.Description,model.Pool_Type,i]);
                sqls.push(sql);
            }
        }
        else
        {
            M_Item_Ids = model.Item_Ids.split(",");
            M_Item_Ids.forEach(function(item){
                var sql =  new sqlCommand('INSERT INTO Pool_Item (Pool_Quality,Item_Id,Item_Amount,Create_Date,Pool_Id,Description,' +
                'Pool_Type) SELECT ?,(SELECT Item_Id FROM edit_Items WHERE Item_Order = ? LIMIT 1),?,?,?,?,? FROM DUAL ' +
                    'WHERE EXISTS (SELECT Item_Id FROM edit_Items WHERE Item_Order = ?)',
                    [model.Pool_Quality,Number(item),model.Item_Amount,model.Create_Date, model.Pool_Id,
                        model.Description,model.Pool_Type,Number(item)]);
                sqls.push(sql);
            })
        }
    }

    sqlClient.transaction(sqls,function(error,results){
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
        'Quality7_Probability,Quality8_Probability,Quality9_Probability,Quality10_Probability,Create_Date,Method_Id,Method_Tag)' +
        'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[model.Method_Name,model.Pool_Id,model.Lottery_Times,
        model.Quality1_Probability,
    model.Quality2_Probability,model.Quality3_Probability,model.Quality4_Probability,model.Quality5_Probability,
    model.Quality6_Probability,model.Quality7_Probability,model.Quality8_Probability,model.Quality9_Probability,
    model.Quality10_Probability,model.Create_Date,model.Method_Id,model.Method_Tag]);
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
    //console.log(model);
    var sql = new sqlCommand('UPDATE edit_LotteryPool SET Pool_Name = ?,Pool_Description = ?,Is_Display = ?,' +
    'Pool_Type = ? WHERE Pool_Id = ?',[model.Pool_Name,model.Pool_Description,model.Is_Display,model.Pool_Type,
        model.Pool_Id]);
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
    //console.log(model);
    var sql = new sqlCommand('UPDATE lottery_Method SET Method_Name = ?,Pool_Id = ?,Lottery_Times = ?,' +
        'Quality1_Probability = ?,Quality2_Probability = ?,Quality3_Probability = ?,Quality4_Probability = ?,' +
        'Quality5_Probability = ?,Quality6_Probability = ?,Quality7_Probability = ?,Quality8_Probability = ?,' +
        'Quality9_Probability = ?,Quality10_Probability = ?,Method_Id = ?,Method_Tag = ? WHERE Lottery_Method_Id = ?',
        [model.Method_Name, model.Pool_Id,model.Lottery_Times,model.Quality1_Probability,model.Quality2_Probability,
            model.Quality3_Probability, model.Quality4_Probability,model.Quality5_Probability,
            model.Quality6_Probability,model.Quality7_Probability, model.Quality8_Probability,
            model.Quality9_Probability,model.Quality10_Probability,model.Method_Id, model.Method_Tag,
            model.Lottery_Method_Id]);
    sqlClient.query(sql,function(error,results){
        if(error!=null){
            console.log(error);
            callback(code.DB.UPDATE_DATA_ERROR,null);
        }
        else
        {
            var sqlUpdateEditLottery = new sqlCommand('UPDATE edit_Lottery SET Method_Id = ? WHERE Lottery_Method_Id = ?',
            [model.Method_Id,model.Lottery_Method_Id]);
            sqlClient.update(sqlUpdateEditLottery,function(error,resultsUpdate){
                if(error!=null){
                    console.log(error);
                    callback(code.DB.UPDATE_DATA_ERROR,null);
                }
                else
                {
                    callback(null,resultsUpdate);
                }
            })
        }
    })
}