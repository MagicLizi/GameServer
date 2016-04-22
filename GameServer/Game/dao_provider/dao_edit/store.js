/**
 * Created by peihengyang on 15/3/9.
 */
var code = require('../../../Game/code');
var sqlClient = require('../../../Util/dao/sqlClient').Admin;
var sqlCommand = require('../../../Util/dao/sqlCommand');
var store = module.exports;


store.getAllGoods =  function(callback){
    var sql = new sqlCommand('SELECT eG.*,Store.Store_Name,Store.Currency_Name,eI_Goods.Item_Name AS Item_Name FROM edit_Goods AS eG JOIN ' +
    'edit_Items AS eI_Goods ON eG.Item_Id = eI_Goods.Item_Id JOIN (SELECT eS.Store_Id AS Store_Id,' +
    'eS.Store_Name AS Store_Name,eI_Store.Item_Name AS Currency_Name FROM edit_Store AS eS JOIN edit_Items AS eI_Store ' +
    'ON eS.Currency_Id = eI_Store.Item_Id) AS Store ON eG.Store_Id = Store.Store_Id ORDER BY eG.Enable DESC ,Store.Store_Id,eG.Goods_Order');
    sqlClient.query(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            callback(null,result);
        }
    });
}

store.getAll =  function(callback){
    store.getAllStore(function(error,resultsStore){
       if(error!=null){
           console.log(error);
           callback(error,null);
       }
        else
       {
           store.getAllGoods(function(error,resultsGoods){
               if(error!=null){
                   console.log(error);
                   callback(error,null);
               }
               else
               {
                   callback(null,{
                       Store:resultsStore,
                       Goods:resultsGoods
                   })
               }
           })
       }
    });
}

store.getAllGoodsByStoreId =  function(Store_Id,callback){
    var sql = new sqlCommand('SELECT eG.*,Store.Store_Name,Store.Currency_Name,Store.Currency_Id,eI_Goods.Item_Name AS Item_Name FROM edit_Goods AS eG JOIN ' +
    'edit_Items AS eI_Goods ON eG.Item_Id = eI_Goods.Item_Id JOIN (SELECT eS.Store_Id AS Store_Id,' +
    'eS.Store_Name AS Store_Name,eI_Store.Item_Name AS Currency_Name,eS.Currency_Id FROM edit_Store AS eS JOIN edit_Items AS eI_Store ' +
    'ON eS.Currency_Id = eI_Store.Item_Id) AS Store ON eG.Store_Id = Store.Store_Id WHERE eG.Store_Id = ? ORDER BY eG.Enable DESC ,eG.Goods_Order',Store_Id);
    sqlClient.query(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            callback(null,result);
        }
    });
}

store.getGoodsById =  function(Goods_Id,callback){
    var sql = new sqlCommand('SELECT eG.*,Store.Store_Name,Store.Currency_Name,eI_Goods.Item_Name AS Item_Name FROM edit_Goods AS eG JOIN ' +
    'edit_Items AS eI_Goods ON eG.Item_Id = eI_Goods.Item_Id JOIN (SELECT eS.Store_Id AS Store_Id,' +
    'eS.Store_Name AS Store_Name,eI_Store.Item_Name AS Currency_Name FROM edit_Store AS eS JOIN edit_Items AS eI_Store ' +
    'ON eS.Currency_Id = eI_Store.Item_Id) AS Store ON eG.Store_Id = Store.Store_Id WHERE eG.Goods_Id = ?' +
    ' ORDER BY Enable',[Goods_Id]);
    sqlClient.query(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            callback(null,result[0]);
        }
    });
}

store.getAllStore =  function(callback){
    var sql = new sqlCommand('SELECT eS.*,eT.Item_Name AS Currency_Name, "" AS Goods FROM edit_Store AS eS JOIN edit_Items AS eT ON eS.Currency_Id = eT.Item_Id;');
    sqlClient.query(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            callback(null,result);
        }
    });
}

store.getStoreById =  function(store_Id,callback){
    console.log('store_Id:',store_Id);
    var sql = new sqlCommand('SELECT * FROM edit_Store WHERE Store_Id = ?;',[store_Id]);
    sqlClient.query(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            console.log(result);
            callback(null,result[0]);
        }
    });
}

store.addStore =  function(model,callback){
    var sql = new sqlCommand('INSERT INTO edit_Store(Store_Name,Currency_Id,Enable,Description,Create_Date)VALUES(?,?,?,' +
    '?,?);',[model.Store_Name,model.Currency_Id,model.Enable,model.Description,model.Create_Date]);
    sqlClient.insert(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(code.DB.INSERT_DATA_ERROR,null);
        }
        else
        {
            callback(null,result);
        }
    });
};

store.updateStore =  function(model,callback){
    var sql = new sqlCommand('UPDATE edit_Store SET Store_Name = ?,Currency_Id = ?,Enable = ?,Description = ?,Pool_Id = ?' +
    ' WHERE Store_Id = ?;',[model.Store_Name,model.Currency_Id,model.Enable,model.Description,model.Pool_Id,
        model.Store_Id]);
    sqlClient.insert(sql,function(error,result){
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


store.addGoods =  function(model,callback){
    var sql = new sqlCommand('INSERT INTO edit_Goods (Item_Id,Item_Amount,Price,Store_Id,Create_Date,Enable,Goods_Order,' +
    'Icon_Url,Start_Date,End_Date)VALUES(?,?,?,?,?,?,?,?,?,?);',[model.Item_Id,model.Item_Amount,model.Price,
        model.Store_Id,model.Create_Date,model.Enable,model.Goods_Order,model.Icon_Url,model.Start_Date,model.End_Date]);
    sqlClient.insert(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(code.DB.INSERT_DATA_ERROR,null);
        }
        else
        {
            callback(null,result);
        }
    });
};

store.updateGoods =  function(model,callback){
    console.log(model);
    var sql = new sqlCommand('UPDATE edit_Goods SET Item_Id =?,Item_Amount=?,Price= ?,Store_Id=?,Create_Date=?,Enable=? ' +
    ', Goods_Order = ? , Icon_Url = ?,Start_Date = ?,End_Date = ? WHERE Goods_Id = ?;',[model.Item_Id,model.Item_Amount,
        model.Price,model.Store_Id,model.Create_Date,model.Enable,model.Goods_Order,model.Icon_Url,model.Start_Date,
        model.End_Date,model.Goods_Id]);
    sqlClient.update(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(code.DB.UPDATE_DATA_ERROR,null);
        }
        else
        {
            callback(null,result);
        }
    });
};