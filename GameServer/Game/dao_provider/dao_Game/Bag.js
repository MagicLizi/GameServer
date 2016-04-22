/**
 * Created by peihengyang on 14/12/20.
 */
var code = require('../../../ServerConfigs/code');
var sqlClient = require('../../../Util/dao/sqlClient').Game;
var sqlClientAdmin = require('../../../Util/dao/sqlClient').Admin;
var sqlCommand = require('../../../Util/dao/sqlCommand');
var bag = module.exports;

bag.getBagByUserId = function(userId,callback){
    var sql = new sqlCommand('SELECT * FROM User_Bag WHERE User_Id = ? AND Item_Amount>0 ORDER BY Create_Date',[userId]);
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


bag.useItemById =  function(userId,itemId,item_Amount,target_Id,callback){
    //var resultback;
    console.log(item_Amount);
    var sql = new sqlCommand('call useItemById(?,?,?,?,?)',['',userId,itemId,item_Amount,target_Id]);
    sqlClient.query(sql,function(error,result){
        console.log("cccccccc");
        console.log(result);
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            callback(null,result[0][0].result);
        }
    })
}

bag.insertItemToBag = function(model,callback){
    var sql = new sqlCommand('CALL insertItemToBag(?,?,?);',
        [model.User_Id,model.Item_Id,model.Item_Amount]);
    sqlClient.query(sql, function(error, result){
        if(error != null)
            callback(code.DB.INSERT_DATA_ERROR, error);
        else
        {
            callback(null,model);
        }

    });
}

bag.updateUserBag = function(model,callback){
    console.log(model);
    var sql = new sqlCommand('UPDATE User_Bag SET User_Id = ?,Item_Id = ?,Item_Amount = ?' +
        ' WHERE User_Bag_Id = ?;',[model.User_Id,model.Item_Id,model.Item_Amount,model.User_Bag_Id]);
    sqlClient.update(sql,function(error,result){
        console.log(error);
        if(error != null){
           callback(code.DB.UPDATE_DATA_ERROR,error);
        }
        else
        {
            callback(null,null);
        }
    });
};


bag.insertItemsToBag = function(model,item_List,callback){
    console.log("abc");
    //console.log(model);
    console.log(item_List);
    var sqls = [];
    item_List.forEach(function(item){
        console.log(item);
        var sql = new sqlCommand('CALL insertItemToBag(?,?,?);',
            [item.User_Id,item.Item_Id,item.Item_Amount]);
        sqls.push(sql);
    });
    if(sqls.length!=0){
        sqlClient.transaction(sqls, function(error, result){
            if(error != null)
            {

                console.log(error);
                callback(code.DB.INSERT_DATA_ERROR, error);
            }
            else
            {
                bag.getBagByUserId(item_List[0].User_Id,function(error,resultBag){
                    if(error!=null){
                        console.log(error);
                        callback(code.DB.EXEC_QUERY_ERROR,null)
                    }
                    else
                    {
                        callback(null,resultBag);
                    }
                });
            }


        });
    }
    else
    {
        callback(null,null);
    }
}


bag.getUserBagById = function(user_Id,item_Id,callback){
    var sql = new sqlCommand('SELECT * FROM edit_Items WHERE Item_Id = ?',[item_Id]);
    sqlClientAdmin.query(sql,function(error,resultItem){
        if(error != null){
            console.log(error);
        }
        else {
            console.log(resultItem.length);
            if (resultItem.length == 0)
            {
                console.log('000')
                callback(null,null);
            }
            else
            {
                console.log('222');
                var sql = new sqlCommand('SELECT *,? as Price ,? as Auto_Open FROM User_Bag WHERE User_Id = ? AND Item_Id = ?',
                    [resultItem[0].Price, resultItem[0].Auto_Open, user_Id, item_Id]);
                sqlClient.query(sql, function (error, result) {
                    if (error != null) {
                        callback(code.DB.EXEC_QUERY_ERROR, error);
                    }
                    else {
                        callback(null, result);
                    }
                });
            }
        }
    })

}


bag.getUserBagByIds = function(user_Id,item_Ids,callback){
    var item_Lists = '0';
    item_Ids.forEach(function(item_Id){
        item_Lists = ','+item_Lists;
    })
    var sql = new sqlCommand('SELECT * FROM edit_Items WHERE Item_Id in (?)',[item_Lists]);
    sqlClientAdmin.query(sql,function(error,resultItem){
        if(error != null){
            console.log(error);
        }
        else
        {
            var sql = new sqlCommand('SELECT *,? as Price,? as Auto_Open FROM User_Bag WHERE User_Id = ? AND Item_Id in (?)',
                [resultItem[0].Price,resultItem[0].Auto_Open,user_Id,item_Lists]);
            sqlClient.query(sql,function(error,result){
                if (error != null){
                    callback(code.DB.EXEC_QUERY_ERROR, error);
                }
                else
                {
                    callback(null,result);
                }
            });
        }
    })

}

bag.getMergerByItemId = function (ItemId,callback) {
    var sql = new sqlCommand('select s.Merger_Id,s.Source_Item_Name,t.Target_Item_Name,s.Merger_Id,SUM(s.Source_Item_Amount) AS Source_Item_Amount,' +
        's.Target_Item_Id,s.Source_Item_Id,s.Merger_Type,s.Create_Date from (SELECT i.Item_Name as Source_Item_Name,' +
        'm.* FROM Item_Merge as m,edit_Items as i where m.Source_Item_Id = i.Item_Id) as s,' +
        '(SELECT i.Item_Name as Target_Item_Name,m.* FROM Item_Merge as m,edit_Items as i ' +
        'where m.Target_Item_Id = i.Item_Id) as t where s.Merger_Id = t.Merger_Id AND s.Target_Item_Id = ? GROUP BY s.Source_Item_Id',[ItemId]);
    sqlClientAdmin.query(sql, function(error, results){
        if(error)
            callback(code.DB.INSERT_DATA_ERROR, code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, results);
        }
    });
};

bag.mergeItem = function(user_Id,model,callback){
    var sqls = [];
    model.forEach(function(item){
        var sql = new sqlCommand('UPDATE User_Bag SET Item_Amount = Item_Amount - ? WHERE User_Id = ? AND ' +
            'Item_Id = ? ',[item.Source_Item_Amount,user_Id,item.Source_Item_Id]);
        sqls.push(sql);
    });
    sqlClient.transaction(sqls,function(error,results){
        if(error != null){
            console.log(error);
            callback(code.DB.UPDATE_DATA_ERROR,null);
        }
        else
        {

            var sql = new sqlCommand('UPDATE User_Bag SET Item_Amount = Item_Amount + 1 WHERE User_Id =? AND ' +
                'Item_Id = ?',[user_Id,model[0].Target_Item_Id]);
            sqlClient.update(sql,function(error,result){
                if(error!= null){
                    console.log(error);
                }
                callback(null,null);

            })

        }

    })
}



bag.mergeItemOne = function(user_Id,model,callback){
    var itemModels = [];
    model.forEach(function(item){
        var itemModel = {
            User_Id:user_Id,
            Item_Id:item.Source_Item_Id,
            Item_Amount:0-item.Source_Item_Amount
        }
        itemModels.push(itemModel);
    });
    var itemTargetModel = {
        User_Id:user_Id,
        Item_Id:model[0].Target_Item_Id,
        Item_Amount:1
    }
    itemModels.push(itemTargetModel);
    bag.insertItemsToBag(model,itemModels,function(error,results){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            callback(null,null);
        }
    })
}

bag.getUserItemEffectsById = function(user_Id,item_Id,callback){
    var sql = new sqlCommand('SELECT * FROM User_Bag WHERE User_Id = ? AND Item_Id = ?',[user_Id,item_Id]);
    sqlClient.query(sql,function(error,result){
        if(error != null) {
            callback(code.DB.EXEC_QUERY_ERROR, error);
        }
        else
        {
            var sql =  new sqlCommand('SELECT *,? as Amount FROM edit_Items WHERE Item_Id = ?',[result[0].Item_Amount,
                result[0].Item_Id]);
            sqlClientAdmin.query(sql,function(error,result){
                if(error !=null){
                    callback(code.DB.EXEC_QUERY_ERROR,error);
                }
                else
                {
                    var sql = new sqlCommand('SELECT *,? as Item_Name,? as Amount FROM Item_Effect_Relation WHERE ' +
                        'Item_Id = ?',[result[0].Item_Name,result[0].Amount,result[0].Item_Id]);
                    sqlClientAdmin.query(sql,function(error,result){
                        if(error !=null){
                            callback(code.DB.EXEC_QUERY_ERROR,error);
                        }
                        else
                        {
                            callback(null,result);
                        }
                    });

                }
            });

        }
    });
};