/**
 * Created '../../../config/code'with JetBrains WebStorm.
 * User: David_shen
 * Date: 13-9-5
 * Time: 上午10:58
 * To change this template use File | Settings | File Templates.
 */

var accountHelper = require('./accountHelper');
//var pomelo = require('pomelo');
var code = require('../../code');
var userCertificateProviderData = require('../../dao_provider/dao_account/usercertificate');
var userCertificateProvider = new userCertificateProviderData();
//var logger2 = require('pomelo-logger').getLogger("exception");
function Certificate() {
    var self = this;
    /**
     * 检索该凭证是否存在 返回用户ID
     * @param userID
     * @param gameID
     * @param callback
     */
    this.checkCertificateExist = function (membership_id, gameID, callback) {
        self.getUserCertificate(membership_id, gameID, function (error, result) {
            if (error) {
                callback(error, result);
            }
            else {
                if (result) {
                    callback(null, true);
                }
                else {
                    callback(null, false);
                }
            }
        });
    };

    this.getUserCertificate = function (membership_id, gameID, callback) {
        userCertificateProvider.getUserCertificate(membership_id, gameID,function(error,result){
            if(error!=null){
                console.log('getUserCertificate:',error);
                callback(error,null);
            }
            else
            {
                callback(null,result);
            }
        })
    };

    /**
     * 更新用户凭证
     * @param userID
     * @param gameID
     * @param certificate
     * @param callback
     */
    this.updateCertificate = function (membership_id, gameID, certificate, callback) {
        //如果不存在 则新建
        var time = new Date();
        //logger2.info("12379812397812389");
        userCertificateProvider.createUserCertificate(membership_id, gameID, certificate, time, null, function (error, result) {
         //   logger2.info("111223123123");
            if (error) {
                callback(error, code.SYSTEM.DB_ERROR);
            }
            else {
                callback(null, true);
            }
        });
    };

    /**
     * 创建用户凭证
     * @param userID
     * @param gameID
     * @param callback
     */
    this.createCertificate = function (gameID, membership_id, account, callback) {
        var time = Date.now();
        var certificate = membership_id + "|" + time + "|" + gameID + "|" + account;
        var hashMsg = accountHelper.encryption(certificate);
        //更新数据库UserCertificate表
        //logger2.info("createCertificate");
        self.updateCertificate(membership_id, gameID, hashMsg, function (error, result) {
         //   logger2.info("createCertificate end");
            if (error) {
                callback(error, result);
            }
            else {
                callback(null, hashMsg);
            }
        });
    };

    /**
     * 删除用户凭证
     * @param userID
     * @param gameID
     * @param callback
     */
    this.deleteCertificate = function (userID, gameID, callback) {
        //删除数据库该玩家的凭证信息
        userCertificateProvider.deleteUserCertificate(userID, gameID, function (error, result) {
            if (error) {
                callback(error, code.SYSTEM.DB_ERROR);
            }
            else {
                callback(null, true);
            }
        });
    };
}

module.exports = Certificate;