/**
 * Created by peihengyang on 14/12/12.
 */
var code = require('../../../config/code');
var sqlClient = require('../../dao/sqlClient').Admin;
var sqlCommand = require('../../dao/sqlCommand');
var logger = require('log4js').getLogger("db");
var item = module.exports;


item.getAll = function (callback) {
    var sql = new sqlCommand('SELECT * FROM edit_Items ORDER BY Item_Type,Item_Order');
    sqlClient.query(sql, function(error, results){

        if(error)
            callback(code.DB.INSERT_DATA_ERROR, code.DB.INSERT_DATA_ERROR);
        else{
            var sql =  new sqlCommand('SELECT * FROM Item_Merge ORDER BY Merger_Id ');
            sqlClient.query(sql,function(error,resultsMerge){
                if (error != null){
                    console.log(error);
                }
                else
                {
                    var sql = new sqlCommand('SELECT * FROM Item_Effect_Relation ORDER BY Relation_Id ');
                    sqlClient.query(sql,function(error,resultEffect){
                        if(error!= null){
                            console.log(error);
                        }
                        else
                        {
                            callback(null, {
                                Item:results,
                                ItemMerge:resultsMerge,
                                ItemEffect:resultEffect
                            });
                        }
                    })
                }
            })

        }
    });
};

item.getAllEquipment = function (callback) {
    var sql = new sqlCommand('SELECT * FROM edit_Items WHERE Item_Type = 6 ORDER BY Item_Order');
    sqlClient.query(sql, function(error, results){

        if(error)
            callback(code.DB.INSERT_DATA_ERROR, code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, results);
        }
    });
};

item.getAllMerger = function (callback) {
    var sql = new sqlCommand('select s.Source_Item_Name,t.Target_Item_Name,s.Merger_Id,s.Source_Item_Amount,' +
        's.Target_Item_Id,s.Source_Item_Id,s.Marger_Type,s.Create_Date from (SELECT i.Item_Name as Source_Item_Name,' +
        'm.* FROM Item_Merge as m,edit_Items as i where m.Source_Item_Id = i.Item_Id) as s,' +
        '(SELECT i.Item_Name as Target_Item_Name,m.* FROM Item_Merge as m,edit_Items as i ' +
        'where m.Target_Item_Id = i.Item_Id) as t where s.Merger_Id = t.Merger_Id',[]);
    sqlClient.query(sql, function(error, results){
        if(error)
            callback(code.DB.INSERT_DATA_ERROR, code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, results);
        }
    });
};


item.getMergerByItemId = function (ItemId,callback) {
    var sql = new sqlCommand('select s.Merger_Id,s.Source_Item_Name,t.Target_Item_Name,s.Merger_Id,s.Source_Item_Amount,' +
        's.Target_Item_Id,s.Source_Item_Id,s.Merger_Type,s.Create_Date from (SELECT i.Item_Name as Source_Item_Name,' +
        'm.* FROM Item_Merge as m,edit_Items as i where m.Source_Item_Id = i.Item_Id) as s,' +
        '(SELECT i.Item_Name as Target_Item_Name,m.* FROM Item_Merge as m,edit_Items as i ' +
        'where m.Target_Item_Id = i.Item_Id) as t where s.Merger_Id = t.Merger_Id AND s.Target_Item_Id = ?',[ItemId]);
    sqlClient.query(sql, function(error, results){
        if(error)
            callback(code.DB.INSERT_DATA_ERROR, code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, results);
        }
    });
};



item.getEffectByItemId = function (ItemId,callback) {
    var sql = new sqlCommand('SELECT * FROM Item_Effect_Relation WHERE Item_Id = ?',[ItemId]);
    console.log(ItemId);
    sqlClient.query(sql, function(error, results){
        console.log(error);
        if(error)
            callback(code.DB.INSERT_DATA_ERROR, code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, results);
        }
    });
};


item.getItemById = function (item_Id,callback) {
    var sql = new sqlCommand('SELECT * FROM edit_Items WHERE Item_Id = ? ORDER BY Item_Order',[item_Id]);
    sqlClient.query(sql, function(error, results){

        if(error)
            callback(code.DB.INSERT_DATA_ERROR, code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, results);
        }
    });
};

item.getItemMergeById = function (merger_Id,callback) {
    var sql = new sqlCommand('SELECT * FROM Item_Merge WHERE Merger_Id = ? ',[merger_Id]);
    sqlClient.query(sql, function(error, results){
        if(error)
            callback(code.DB.INSERT_DATA_ERROR, code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, results);
        }
    });
};



item.getItemEffectById = function (relation_Id,callback) {
    var sql = new sqlCommand('SELECT * FROM Item_Effect_Relation WHERE Relation_Id = ? ',[relation_Id]);
    sqlClient.query(sql, function(error, results){
        if(error)
            callback(code.DB.INSERT_DATA_ERROR, code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, results);
        }
    });
};


item.addItem = function (model, callback) {
    var sql = new sqlCommand('INSERT INTO edit_Items(Item_Name,Item_Order,Item_Type,Amount_Limit,Description,' +
        'Item_Quality,Price,Icon_Url,Create_Date,Equip_Level)VALUES(?,?,?,?,?,?,?,?,?,?);',
        [model.Item_Name,model.Item_Order,model.Item_Type,model.Amount_Limit,model.Description,
        model.Item_Quality,model.Price,model.Icon_Url,model.Create_Date,model.Equip_Level]);
    sqlClient.insert(sql, function(error, result){
        if(error)
        {
            console.log(error);
            callback(code.DB.INSERT_DATA_ERROR, code.DB.INSERT_DATA_ERROR);
        }
        else{
            callback(null, model);
        }
    });
};


item.addMerger = function (model, callback) {
    console.log(model);
    var sql = new sqlCommand('INSERT INTO Item_Merge (Target_Item_Id,Source_Item_Id,Source_Item_Amount,Merger_Type,' +
        'Create_Date)VALUES (?,?,?,?,?)',
        [model.Target_Item_Id,model.Source_Item_Id,model.Source_Item_Amount,model.Merger_Type,model.Create_Date]);
    sqlClient.insert(sql, function(error, result){
        console.log(error);
        if(error)
        {
            console.log(error);
            callback(code.DB.INSERT_DATA_ERROR, code.DB.INSERT_DATA_ERROR);
        }
        else{
            callback(null, model);
        }
    });
};

item.addEffect = function (model, callback) {
    console.log(model);
    var sql = new sqlCommand('INSERT INTO Item_Effect_Relation (Item_Id,Effect_Type,Create_Date,Effect_Description,' +
        'Effect_Value,Effect_Name)VALUES(?,?,?,?,?,?)',
        [model.Item_Id,model.Effect_Type,model.Create_Date,model.Effect_Description,model.Effect_Value,model.Effect_Name]);
    sqlClient.insert(sql, function(error, result){
        console.log(error);
        if(error)
        {
            console.log(error);
            callback(code.DB.INSERT_DATA_ERROR, code.DB.INSERT_DATA_ERROR);
        }
        else{
            callback(null, model);
        }
    });
};


item.editItem = function (model, callback) {
    console.log(model)
    var sql = new sqlCommand('UPDATE edit_Items SET Item_Name = ?,Item_Order = ?,Item_Type = ?,Amount_Limit = ?,' +
        'Description = ?,Item_Quality = ?,Price = ?,Icon_Url = ?,Equip_Level = ? WHERE Item_Id = ?',
        [model.Item_Name,model.Item_Order,model.Item_Type,model.Amount_Limit,
        model.Description,model.Item_Quality,model.Price,model.Icon_Url,
        model.Equip_Level,model.Item_Id]);
    sqlClient.update(sql, function(error, result){
        if(error)
        {
            console.log(error);
            callback(code.DB.UPDATE_DATA_ERROR, code.DB.UPDATE_DATA_ERROR);
        }
        else{
            callback(null, model);
        }
    });
};

item.editMerger = function (model, callback) {
    var sql = new sqlCommand('UPDATE Item_Merge SET Target_Item_Id = ?,Source_Item_Id = ?,Source_Item_Amount = ?,' +
            'Merger_Type = ? WHERE Merger_Id = ?',[model.Target_Item_Id,model.Source_Item_Id,model.Source_Item_Amount,
    model.Merger_Type,model.Merger_Id]);
    sqlClient.update(sql, function(error, result){
        if(error)
        {
            console.log(error);
            callback(code.DB.UPDATE_DATA_ERROR, code.DB.UPDATE_DATA_ERROR);
        }
        else{
            callback(null, model);
        }
    });
};



item.editEffect = function (model, callback) {
    var sql = new sqlCommand('UPDATE Item_Effect_Relation SET Item_Id = ?,Effect_Type = ?,' +
        'Effect_Description = ?,Effect_Value = ?,Effect_Name = ?  WHERE Relation_Id = ?',[model.Item_Id,
    model.Effect_Type,model.Effect_Description,model.Effect_Value,model.Effect_Name,model.Relation_Id]);
    sqlClient.update(sql, function(error, result){
        console.log(error);
        if(error)
        {
            console.log(error);
            callback(code.DB.UPDATE_DATA_ERROR, code.DB.UPDATE_DATA_ERROR);
        }
        else{
            callback(null, model);
        }
    });
};