/**
 * Created with JetBrains WebStorm.
 * User: andy.chen
 * Date: 14-5-20
 * Time: 下午3:57
 * To change this template use File | Settings | File Templates.
 */
var code = require('../../../config/code');
var sqlClient = require('../../dao/sqlClient').tinygame;
var sqlCommand = require('../../dao/sqlCommand');
var logger = require('log4js').getLogger("db");

var apple = module.exports;

apple.addRecharge = function (model, callback) {
    var sql = new sqlCommand('INSERT INTO store_item(' +
            'item_id,sort_num,name,pic_id,sex,pos,currency_type,price,lvl_limit,description,begin_date,end_date,is_valid,create_date) ' +
            'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [model.item_id,model.sort_num,model.name,model.pic_id,model.sex,model.pos,model.currency_type,model.price,model.lvl_limit,model.description,model.begin_date,model.end_date,model.is_valid,model.create_date]);
    sqlClient.insert(sql, function(error, result){
        if(error)
        {
            console.log(error);
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        }
        else{
            callback(null, model);
        }
    });
};

apple.editRecharge = function (model, callback) {
    var sql = new sqlCommand('UPDATE store_item SET name=?,sort_num =?,pic_id=?,sex=?,pos=?,currency_type=?,price=?,lvl_limit = ?,description=?,begin_date=?,end_date=?,is_valid=? WHERE item_id=?',
        [model.name,model.sort_num,model.pic_id,model.sex,model.pos,model.currency_type,model.price,model.lvl_limit,model.description,model.begin_date,model.end_date,model.is_valid,model.item_id]);
    sqlClient.update(sql, function(error, result){
        if(error)
            callback(new Error(code.DB.UPDATE_DATA_ERROR), code.DB.UPDATE_DATA_ERROR);
        else{
            callback(null, model);
        }
    });
};

apple.getAll = function (callback) {
    var sql = new sqlCommand('SELECT * FROM store_item');
    sqlClient.query(sql, function(error, results){
        if(error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, results);
        }
    });
};

apple.getRecharge = function (item_id, callback) {
    var sql = new sqlCommand('SELECT * FROM store_item WHERE item_id=?', [item_id]);
    sqlClient.query(sql, function(error, results){
        if(error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else{
            if(results.length > 0)
                callback(null, results[0]);
            else
                callback(null, null);
        }
    });
};