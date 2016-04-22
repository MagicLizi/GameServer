/**
 * Created with JetBrains WebStorm.
 * User: Andy.Chen
 * Date: 14-5-26
 * Time: 下午6:06
 * To change this template use File | Settings | File Templates.
 */
var code = require('../../code');
var sqlClient = require('../../../Util/dao/sqlClient').Login;
var sqlCommand = require('../../../Util/dao/sqlCommand');
//删除pomelolog
//var logger = require('pomelo-logger').getLogger("db");
var accountHelper = require('../../domain/domain_account/accountHelper');

module.exports = User;

function User() {
    this.getUserById = function (membership_id, callback) {
        var sql = new sqlCommand('SELECT * FROM membership.membership_users WHERE membership_id=?',[membership_id]);
        sqlClient.query(sql, function(error, results){
            if(error)
                callback(code.DB.SELECT_DATA_ERROR, code.DB.SELECT_DATA_ERROR);
            else {
                if(results.length > 0)
                    callback(null, results[0]);
                else
                    callback(null, null);
            }
        });
    };

    this.getRelatedAccount = function (identifier, callback) {
        var sql = new sqlCommand('SELECT * from membership.membership_device_relationship where device_identifier=?',[identifier]);
        sqlClient.query(sql, function(error, result){
            if(error)
                callback(code.DB.SELECT_DATA_ERROR, code.DB.SELECT_DATA_ERROR);
            else
                callback(null, result);
        });
    }

    this.relateDevice = function (account, identifier, callback) {

        var date = new Date();
        console.log("relate device" + account + " " + identifier + " " + date);
        var sql = new sqlCommand('REPLACE INTO membership.membership_device_relationship (account,device_identifier,last_login_date) VALUES(?,?,?);',[account,identifier,date]);
        sqlClient.insert(sql, function(error, result){
            if(error)
                callback(code.DB.INSERT_DATA_ERROR, code.DB.INSERT_DATA_ERROR);
            else
                callback(null, result);
        });
    };

    this.getUser = function (account, callback){
        var sql = new sqlCommand('SELECT * FROM membership.membership_users WHERE Account=?',[account]);
        sqlClient.query(sql, function(error, results){
            if(error)
                callback(code.DB.SELECT_DATA_ERROR, code.DB.SELECT_DATA_ERROR);
            else {
                if(results.length > 0)
                    callback(null, results[0]);
                else
                    callback(null, null);
            }
        });
    };

    /**
     * 重设用户帐号和密码(用于匿名用户可以重设)
     * @param userID
     * @param newAccount
     * @param newPassword
     * @param callback
     */
    this.resetAccountByUserID = function (membership_id, newAccount, newPassword, unique_id, callback) {
        if (!newAccount || !newPassword)
            return callback(code.ACCOUNT.ACCOUNT_OR_PASSWORD_CAN_NOT_NULL, code.ACCOUNT.ACCOUNT_OR_PASSWORD_CAN_NOT_NULL);

        this.getUserById(membership_id, function(error, result){
            if (error)
                return callback(error, code.DB.SELECT_DATA_ERROR);

            if(!result)
                return callback(code.ACCOUNT.ACCOUNT_NOT_EXIST, code.ACCOUNT.ACCOUNT_NOT_EXIST);

            if (result.source_type != accountHelper.SourceType.Anonymous)
                return callback(code.ACCOUNT.ACCOUNT_RESET_FAIL, code.ACCOUNT.ACCOUNT_RESET_FAIL);

            var sql = new sqlCommand('UPDATE membership.membership_users SET Account=?,Password=?,source_type=? WHERE membership_id=?',[newAccount,newPassword,accountHelper.SourceType.Normal,membership_id]);
            sqlClient.update(sql, function(error, results){
                if(error)
                    callback(code.DB.UPDATE_DATA_ERROR, code.DB.UPDATE_DATA_ERROR);
                else{
                    callback(null, true);
                }
            });
        });
    };


    /**
     * 更新腾讯用户参数
     */
    this.updateTxUserInfo = function (membership_id,source, openid, openkey, paytoken,pf,pfkey, callback) {
        var nowDate = new Date();
        var insertsql = new sqlCommand("INSERT INTO membership.membership_Tx_User (Membership_Id,Open_Key,Open_Id,Pay_Token," +
        "Pf,Pf_Key,Update_Date,Source) SELECT ?,?,?,?,?,?,?,? FROM dual WHERE NOT EXISTS (SELECT Membership_Id FROM " +
        "membership.membership_Tx_User WHERE Membership_Id = ?)",[membership_id,openkey,openid,paytoken,pf,
            pfkey,nowDate,source,membership_id]);
        sqlClient.insert(insertsql,function(error,resultInsert){
            if(error!=null){
                console.log(error);
                callback(error,null);
            }
            else
            {
                console.log('resultInsert:',resultInsert);
                if(resultInsert.affectedRows==0){
                    console.log("affectedRows");
                    var sql = new sqlCommand('UPDATE membership.membership_Tx_User SET Open_Key=?,Open_Id=?,' +
                    'Pay_Token=?,Pf=?,Pf_Key=?,Update_Date=?,Source=? WHERE Membership_id=?',[openkey,openid,paytoken,pf,pfkey,
                        nowDate,source,membership_id]);
                    sqlClient.update(sql, function(error, results) {
                        console.log(results);
                        if (error)
                            callback(code.DB.UPDATE_DATA_ERROR, code.DB.UPDATE_DATA_ERROR);
                        else {
                            callback(null, results);
                        }
                    });
                }
                else
                {
                    callback(null, resultInsert);
                }
            }
        });


    };

    this.getTxUserInfo = function(userId,callback){
        console.log('UserId:',userId);
        var sql = new sqlCommand('SELECT * FROM membership.membership_Tx_User WHERE Membership_Id = ?',userId);
        sqlClient.query(sql,function(error,resultTxUserInfo){
            console.log('resultTxUserInfo:',resultTxUserInfo);
            if(error!=null){
                console.log(error);
                callback(error,null);
            }
            else
            {
                console.log(resultTxUserInfo);
                callback(null,resultTxUserInfo);
            }
        })
    }

    this.getTxUserInfoByOpenKey = function(openKey,callback){
        console.log('UserId:',openKey);
        var sql = new sqlCommand('SELECT * FROM membership.membership_Tx_User WHERE Open_Key = ?',openKey);
        sqlClient.query(sql,function(error,resultTxUserInfo){
            console.log('resultTxUserInfo:',resultTxUserInfo);
            if(error!=null){
                console.log(error);
                callback(error,null);
            }
            else
            {
                console.log(resultTxUserInfo);
                callback(null,resultTxUserInfo);
            }
        })
    }

    this.getUserInfoByLogin = function (account, password,source, callback) {
        var sql = new sqlCommand('SELECT * FROM membership.membership_users WHERE Account=? AND Password=? ' +
        'AND source_type = ?',[account, password,source]);
        sqlClient.query(sql, function(error, results){
            if(error!=null){
                console.log(error);
                callback(code.DB.SELECT_DATA_ERROR, code.DB.SELECT_DATA_ERROR);
            }
            else
                callback(null, results);
        });
    };

    /**
     * 创建用户
     * @param account
     * @param password
     * @param createDateUTC
     * @param callback
     */
    this.createUser = function (account, password, sourceType, createDateUTC, callback) {
        console.log('isUserExist');
        var model = {
            Account: account,
            Password: password,
            CreateDateUTC: createDateUTC,
            source_type: sourceType,
            Scope: 1,
            IsValid: 1
        };
        console.log('model:',model);
        var sql = new sqlCommand('INSERT INTO membership.membership_users(Account,Password,CreateDateUTC,source_type,Scope,IsValid) VALUES(?,?,?,?,?,?)',[account,password,createDateUTC,sourceType,1,1]);
        sql.after = function(result, share){
            model.membership_id = result.insertId;
        };

        sqlClient.insert(sql, function(error, result){
            if(error)
                callback(code.DB.INSERT_DATA_ERROR, code.DB.INSERT_DATA_ERROR);
            else
                callback(null, model);
        });
    };

    this.resetPassword = function (membership_id, newPassword, callback){
        var sql = new sqlCommand('UPDATE membership.membership_users SET Password=? WHERE membership_id=?',[newPassword,membership_id]);
        sqlClient.update(sql, function(error, result){
            if(error)
                callback(code.DB.UPDATE_DATA_ERROR, code.DB.UPDATE_DATA_ERROR);
            else
                callback(null, true);
        });
    };

    this.getPlayerByMobile = function (mobile_phone, callback) {
        var sql = new sqlCommand('SELECT mobile_phone FROM membership.membership_users WHERE mobile_phone=? LIMIT 1', [mobile_phone])
        sqlClient.query(sql, function(error, result){
            if(error)
                callback(code.DB.SELECT_DATA_ERROR, code.DB.SELECT_DATA_ERROR);
            else{
                if(result.length > 0)
                    callback(null, true);
                else
                    callback(null, false);
            }
        });
    };

    this.bindPhone = function (membership_id, mobile_phone, callback){
        var sql = new sqlCommand('UPDATE membership.membership_users SET mobile_phone=? WHERE membership_id=?',[mobile_phone, membership_id]);
        sqlClient.update(sql, function(error, result){
            if(error)
                callback(code.DB.UPDATE_DATA_ERROR, code.DB.UPDATE_DATA_ERROR);
            else
                callback(null, true);
        });
    };
}