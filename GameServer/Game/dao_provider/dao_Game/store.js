/**
 * Created by peihengyang on 15/7/6.
 */
var code = require('../../../ServerConfigs/code');
var sqlClient = require('../../../Util/dao/sqlClient').Game;
var sqlClientAdmin = require('../../../Util/dao/sqlClient').Admin;
var sqlCommand = require('../../../Util/dao/sqlCommand');
var store = module.exports;

store.getTodayStore = function(userId,storeId,callback){
    var sql = new sqlCommand('SELECT * FROM Today_Store_History WHERE User_Id = ? AND Store_Id = ?',[userId,storeId]);
    sqlClient.query(sql,function(error,result){
        console.log(result);
        if(error != null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR, error);
        }

        else
        {
            callback(null, result);
        }

    });
}


store.addStoreHistory = function(userId,model,callback){
    console.log(model);
    var sql = new sqlCommand('INSERT INTO Today_Store_History (User_Id,Store_Id,Goods_Id,Create_Date,Status,Amount) ' +
        'VALUES (?,?,?,NOW(),?,?)',[userId,model.Store_Id,model.Goods_Id,1,model.Item_Amount]);
    sqlClient.query(sql,function(error,result){
        console.log(result);
        if(error != null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR, error);
        }

        else
        {
            callback(null, result);
        }

    });
}

store.getBuyTimesOfGoodId = function(userId,goodsId,callback){
    var sql = new sqlCommand('SELECT SUM(BuyTimes) AS BuyTimes FROM (SELECT COUNT(1) AS BuyTimes FROM All_Store_History WHERE User_Id = ? AND Goods_Id = ? ' +
        'UNION SELECT COUNT(1) AS BuyTimes FROM Today_Store_History WHERE User_Id = ? AND Goods_Id = ?) AS GoodsBuyTimes',
        [userId,goodsId,userId,goodsId]);
    sqlClient.query(sql,function(error,result){
        console.log(result);
        if(error != null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR, error);
        }
        else
        {
            callback(null, result);
        }

    });
}

store.getFirstBuyOfStoreId =  function(userId,storeId,callback){
    var sql = new sqlCommand('SELECT  DISTINCT Goods_Id FROM (SELECT History_Id,User_Id,Store_Id,Goods_Id,' +
        'Create_Date,Status,Amount FROM Game_'+process.argv[3]+'.All_Store_History where User_Id = ? AND Store_Id = ? AND Status = 1 ' +
        'UNION SELECT * FROM Game_'+process.argv[3]+'.Today_Store_History where User_Id = ? AND Store_Id = ? AND Status = 1) ' +
        'AS ALL_Store',[userId,storeId,userId,storeId]);
    sqlClient.query(sql,function(error,resultFirstBuy){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else{
            callback(null,resultFirstBuy);
        }
    })
}


store.addUserStore = function(models,Refresh_Times,Refresh_Date,Create_Date,Store_Id,addFlag,callback){
    console.log("models[0]",models);
    console.log(models[0]);
    if(addFlag == 1){
        var sql = new sqlCommand('DELETE FROM User_Store WHERE User_Id = ? AND Store_Id = ?',[models[0].User_Id,Store_Id]);
        sqlClient.delete(sql,function(error,result){
            if(error!=null){
                console.log(error);
                callback(code.DB.DELETE_DATA_ERROR,null);
            }
            else
            {
                var sqls = [];
                models.forEach(function(model){
                    var sql = new sqlCommand('INSERT INTO User_Store (User_Id,Store_Id,Goods_Id,Refresh_Times,' +
                        'Refresh_Date,Goods_Amount,Create_Date) VALUE (?,?,?,?,?,?,?)',[model.User_Id,Store_Id,
                        model.Item_Id,Refresh_Times,Refresh_Date,model.Item_Amount,Create_Date]);
                    sqls.push(sql);
                })
                sqlClient.transaction(sqls,function(error,result){
                    console.log('/re:',sqls);
                    if(error!=null){
                        console.log(error);
                        callback(code.DB.INSERT_DATA_ERROR,null);
                    }
                    else
                    {
                        console.log(result);
                        callback(null,result);
                    }
                })
            }
        })
    }
    else
    {
        callback(null,null);
    }


}

store.getStoreByUserId = function(userId,callback){
    //console.log(dataserver);
    var sql = new sqlCommand('SELECT US.*,eG.Goods_Order AS Goods_Order FROM User_Store AS US JOIN admin_' +
        process.argv[3]+'.edit_Goods AS eG ON US.Goods_Id = eG.Goods_Id WHERE User_Id = ? ORDER BY Goods_Order;',userId);
    sqlClient.query(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            //console.log(result);
            callback(null,result);

        }
    })
}


store.getStoreByUserIdStoreId = function(userId,storeId,callback){
    //console.log(dataserver);
    var sql = new sqlCommand('SELECT US.*,eG.Goods_Order AS Goods_Order FROM User_Store AS US JOIN admin_' +
        process.argv[3]+'.edit_Goods AS eG ON US.Goods_Id = eG.Goods_Id WHERE US.User_Id = ? AND US.Store_Id = ? ' +
        'ORDER BY Goods_Order;',[userId,storeId]);
    console.log('StoreSQL:',sql);
    sqlClient.query(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            //console.log(result);
            callback(null,result);

        }
    })
}

store.getNormalStoreByUserId = function(userId,golbal,callback){
    //console.log(dataserver);
    var sql = new sqlCommand('SELECT US.*,eG.Goods_Order AS Goods_Order FROM User_Store AS US JOIN admin_' +
        process.argv[3]+'.edit_Goods AS eG ON US.Goods_Id = eG.Goods_Id WHERE US.User_Id = ? AND US.Store_Id IN (?,?) ' +
        'ORDER BY Goods_Order;',[userId,golbal.NormalCoinStore,golbal.NormalDiamondStore]);
    console.log('StoreSQL:',sql);
    sqlClient.query(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            //console.log(result);
            callback(null,result);

        }
    })
}

store.addStoreInitLog = function(userId,callback){
    var sql = new sqlCommand('INSERT INTO sotre_Init_Log (User_Id,Create_Date) VALUES (?,?)',[userId,new Date()]);
    sqlClient.query(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            callback(null,result[0]);
        }
    })
}

store.getUserGoodsByID = function(userId,userStoreId,callback){
    var sql = new sqlCommand('SELECT * FROM User_Store WHERE User_Store_Id = ?',[userStoreId]);
    sqlClient.query(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            callback(null,result[0]);
        }
    })
}

store.updateUserGoods = function(model,callback){
    console.log(model);
    var sql = new sqlCommand('UPDATE User_Store SET User_Id = ?,Store_Id = ?,Goods_Id = ?,Refresh_Times = ?' +
        ',Refresh_Date = ?,Goods_Amount = ? WHERE User_Store_Id = ? ',[model.User_Id,model.Store_Id,model.Goods_Id,
        model.Refresh_Times,model.Refresh_Date,model.Goods_Amount,model.User_Store_ID]);
    sqlClient.query(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(code.DB.EXEC_QUERY_ERROR,null);
        }
        else
        {
            callback(null,result[0]);
        }
    })
}
