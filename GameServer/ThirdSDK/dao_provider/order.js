/**
 * Created by steve on 15/12/1.
 */
var code = require('../../ServerConfigs/code');
var sqlClient = require('../../Util/dao/sqlClient').Logger;
var sqlCommand = require('../../Util/dao/sqlCommand');
var order = module.exports;

order.addXiaoMiOrder = function(model,callback){
    var sql = new sqlCommand('INSERT INTO xiaomi_Pay_Log(appId,cpOrderId,cpUserInfo,uid,orderId,orderStatus,' +
        'payFee,productCode,productName,productCount,payTime,orderConsumeType,partnerGiftConsume,signature,' +
        'Create_Date,deliver_Status)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',[model.appId,model.cpOrderId,model.cpUserInfo,
        model.uid,model.orderId,model.orderStatus,model.payFee,model.productCode,model.productName,model.productCount,
        model.payTime,model.orderConsumeType,model.partnerGiftConsume,model.signature,model.Create_Date,
        model.deliver_Status]);
    sqlClient.query(sql,function(error,result){
        console.log(result);
        if(error != null){
            console.log(error);
            callback(code.DB.INSERT_DATA_ERROR, error);
        }
        else
        {
            order.getXiaoMiOrderById(result.insertId,function(error,resultOrder){
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    callback(null, resultOrder);
                }
            })
        }

    });
}

order.getXiaoMiOrderById = function(logId,callback){
    var sql = new sqlCommand('SELECT * FROM xiaomi_Pay_Log WHERE Log_Id = ?;',[logId]);
    sqlClient.query(sql,function(error,result){
        console.log(result);
        if(error != null){
            console.log(error);
            callback(code.DB.INSERT_DATA_ERROR, error);
        }

        else
        {
            callback(null, result);
        }

    });
}

order.getXiaoMiOrderByOrderId = function(orderId,callback){
    var sql = new sqlCommand('SELECT * FROM xiaomi_Pay_Log WHERE orderId = ?;',[orderId]);
    sqlClient.query(sql,function(error,result){
        console.log(result);
        if(error != null){
            console.log(error);
            callback(code.DB.INSERT_DATA_ERROR, error);
        }
        else
        {
            callback(null, result);
        }

    });
}

order.updateXiaoMiOrderStatus = function(logId,Status,callback){
    var sql = new sqlCommand('UPDATE xiaomi_Pay_Log SET deliver_Status = ? WHERE Log_Id = ? ;',[Status,logId]);
    sqlClient.query(sql,function(error,result){
        console.log(result);
        if(error != null){
            console.log(error);
            callback(code.DB.INSERT_DATA_ERROR, error);
        }
        else
        {
            callback(null, result);
        }

    });
}



order.add360Order = function(model,callback){
    var sql = new sqlCommand('INSERT INTO 360_Pay_Log(app_key,product_id,amount,app_uid,app_ext1,app_ext2,' +
        'user_id,order_id,gateway_flag,sign_type,app_order_id,sign_return,sign,deliver_Status,Create_Date)' +
        'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',[model.app_key,model.product_id,model.amount,model.app_uid,
        model.app_ext1,model.app_ext2,model.user_id,model.order_id,model.gateway_flag,model.sign_type,
        model.app_order_id,model.sign_return,model.sign,model.deliver_Status,model.Create_Date]);
    sqlClient.query(sql,function(error,result){
        if(error != null){
            console.log(error);
            callback(code.DB.INSERT_DATA_ERROR, error);
        }
        else
        {
            order.get360OrderById(result.insertId,function(error,resultOrder){
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    console.log('resultOrder:',resultOrder);
                    callback(null, resultOrder);
                }
            })
        }

    });
}

order.get360OrderById = function(logId,callback){
    var sql = new sqlCommand('SELECT * FROM 360_Pay_Log WHERE Log_Id = ?;',[logId]);
    sqlClient.query(sql,function(error,result){
        console.log(result);
        if(error != null){
            console.log(error);
            callback(code.DB.INSERT_DATA_ERROR, error);
        }

        else
        {
            callback(null, result);
        }

    });
}
order.get360OrderByOrderId = function(orderId,callback){
    var sql = new sqlCommand('SELECT * FROM 360_Pay_Log WHERE order_id = ?;',[orderId]);
    sqlClient.query(sql,function(error,result){
        console.log(result);
        if(error != null){
            console.log(error);
            callback(code.DB.INSERT_DATA_ERROR, error);
        }

        else
        {
            callback(null, result);
        }

    });
}

order.updateHuaWeiOrderStatus = function(logId,Status,callback){
    var sql = new sqlCommand('UPDATE HuaWei_Pay_Log SET deliver_Status = ? WHERE Log_Id = ? ;',[Status,logId]);
    sqlClient.query(sql,function(error,result){
        console.log(result);
        if(error != null){
            console.log(error);
            callback(code.DB.INSERT_DATA_ERROR, error);
        }
        else
        {
            callback(null, result);
        }

    });
}

order.addHuaWeiOrder = function(model,callback){
    var sql = new sqlCommand('INSERT INTO HuaWei_Pay_Log(result,userName,productName,payType,amount,orderId,' +
        'notifyTime,requestId,bankId,orderTime,tradeTime,accessMode,spending,extReserved,sighType,sign,Create_Date,' +
        'deliver_Status)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',[model.result,model.userName,
        model.productName,model.payType,model.amount,model.orderId,model.notifyTime,model.requestId,model.bankId,
        model.orderTime,model.tradeTime,model.accessMode,model.spending,model.extReserved,model.sighType,model.sign,
        model.Create_Date,model.deliver_Status]);
    sqlClient.query(sql,function(error,result){
        if(error != null){
            console.log(error);
            callback(code.DB.INSERT_DATA_ERROR, error);
        }
        else
        {
            order.getHuaWeiOrderById(result.insertId,function(error,resultOrder){
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    console.log('resultOrder:',resultOrder);
                    callback(null, resultOrder);
                }
            })
        }

    });
}

order.getHuaWeiOrderById = function(logId,callback){
    var sql = new sqlCommand('SELECT * FROM HuaWei_Pay_Log WHERE Log_Id = ?;',[logId]);
    sqlClient.query(sql,function(error,result){
        console.log(result);
        if(error != null){
            console.log(error);
            callback(code.DB.INSERT_DATA_ERROR, error);
        }

        else
        {
            callback(null, result);
        }

    });
}
order.getHuaWeiOrderByOrderId = function(orderId,callback){
    var sql = new sqlCommand('SELECT * FROM HuaWei_Pay_Log WHERE orderId = ?;',[orderId]);
    sqlClient.query(sql,function(error,result){
        console.log(result);
        if(error != null){
            console.log(error);
            callback(code.DB.INSERT_DATA_ERROR, error);
        }

        else
        {
            callback(null, result);
        }

    });
}
