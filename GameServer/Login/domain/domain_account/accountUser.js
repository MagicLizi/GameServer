/**
 * Created with JetBrains WebStorm.
 * User: David_shen
 * Date: 13-9-5
 * Time: 下午2:56
 * To change this template use File | Settings | File Templates.
 */
//var pomelo = require('pomelo');
var code = require('../../code');
var userProviderData = require('../../dao_provider/dao_account/user');
var userProvider = new userProviderData();
var gameEmun = require('../../../Game/enum');
var txUtil = require('../../../Util/txUtil');
var Relationship = require('./relationship');
relationshipManager = new Relationship();

var accountHelper = require('./accountHelper');
var accountController = require('./accountController');
function User() {
    var _this = this;
    /**
     * 查看用户是否存在
     * @param source
     * @param account
     * @param callback
     */
    this.isUserExist = function (source, account, callback) {
        userProvider.getUser(account, function (error, result) {
            if (error) {
                callback(error, result);
            }
            else {
                if (result) {
                    callback(null, result);
                }
                else {
                    callback(null, false);
                }
            }
        })
    };

    /**
     * 重设用户帐号和密码
     * @param userID
     * @param newAccount
     * @param newPassword
     * @param callback
     */
    this.resetAccountByUserID = function (player_id, newAccount, newPassword, unique_id, callback) {
        userProvider.getUser(newAccount, function (error, user) {
            if (error)
                return callback(error);

            //新绑定账号已存在，修改从属关系；
            if (user)
                return callback(code.ACCOUNT.ACCOUNT_HAS_EXIST, code.ACCOUNT.ACCOUNT_HAS_EXIST);

            //新绑定账号不存则直接重设
            userProvider.resetAccountByUserID(player_id, newAccount, newPassword, unique_id, callback);
        });
    };

    /**
     * 获取用户信息（user & player 表中信息）
     * @param account
     * @param password
     * @param callback
     */
    this.getUserInfoByLogin = function (account, password,source, callback) {
            userProvider.getUserInfoByLogin(account, password,source, callback);
    };

    /**
     * 获取用户信息（user & player 表中信息）
     * @param account
     * @param password
     * @param callback
     */
    this.getUserInfoByLoginFirst = function (account, password,source, callback) {
        if(source == gameEmun.SourceType.SanLiuLing || source == gameEmun.SourceType.HuaWei){//360用户登陆,先验证用户,然后用uid作为account进行用户验证
                txUtil.verifyLogin(account,'','',source,function(error,resultVerify){
                    if(error!=null){
                        console.log(error);
                        callback(error,null);
                    }
                    else
                    {
                        if(resultVerify.verifyStats == 0) {
                            switch (Number(source)) {
                                case gameEmun.SourceType.SanLiuLing:
                                    account = resultVerify.result.id;
                                    break;
                                case  gameEmun.SourceType.HuaWei:
                                    account =  resultVerify.result.userID;
                                    break;
                        }
                            userProvider.getUserInfoByLogin(account, password,source, callback);
                        }
                        else
                        {
                            callback(code.ACCOUNT.ACCOUNT_NOT_EXIST,null);
                        }
                    }
                })
        }
        else
        {
            userProvider.getUserInfoByLogin(account, password,source, callback);
        }

    };
    this.createUser = function (source, account, password, callback) {
        //if (source == accountHelper.SourceType.Normal || source == accountHelper.SourceType.Anonymous
        //    || source == accountHelper.SourceType.Oauth) {
            var time = new Date();

            userProvider.createUser(account, password, source, time, function (error, result) {
                if (error)
                {
                    callback(error, result);
                }
                else
                {
                    userProvider.getUser(account, function (error, result)
                    {
                        callback(error, result);
                    });
                }
            });
        //}
        //else
        //{
        //    callback(code.ACCOUNT.LOGIN_TYPE_ERROR,null);
        //}
    };
}
module.exports = User;