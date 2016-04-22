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
    var sql = new sqlCommand('INSERT INTO store_apple(' +
        'recharge_id,type,name,pic_id,price,chips,diamond,description,sort,status,begin_date,end_date,is_valid,create_date) ' +
        'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [model.recharge_id,model.type,model.name,model.pic_id,model.price,model.chips,model.diamond,model.description,model.sort,model.status,model.begin_date,model.end_date,model.is_valid,model.create_date]);
    sqlClient.insert(sql, function(error, result){
        if(error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, model);
        }
    });
};

apple.editRecharge = function (model, callback) {
    var sql = new sqlCommand('UPDATE store_apple SET name=?,pic_id=?,type=?,price=?,chips=?,diamond=?,description=?,sort=?,status=?,begin_date=?,end_date=?,is_valid=? WHERE recharge_id=?',
        [model.name,model.pic_id,model.type,model.price,model.chips,model.diamond,model.description,model.sort,model.status,model.begin_date,model.end_date,model.is_valid,model.recharge_id]);
    sqlClient.update(sql, function(error, result){
        if(error)
            callback(new Error(code.DB.UPDATE_DATA_ERROR), code.DB.UPDATE_DATA_ERROR);
        else{
            callback(null, model);
        }
    });
};

apple.getAll = function (callback) {
    var sql = new sqlCommand('SELECT * FROM store_apple');
    sqlClient.query(sql, function(error, results){
        if(error)
            callback(new Error(code.DB.INSERT_DATA_ERROR), code.DB.INSERT_DATA_ERROR);
        else{
            callback(null, results);
        }
    });
};

apple.getRecharge = function (recharge_id, callback) {
    var sql = new sqlCommand('SELECT * FROM store_apple WHERE recharge_id=?', [recharge_id]);
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