//var pomelo = require('pomelo');
//var logger = require('pomelo-logger').getLogger("app");
//var logger2 = require('pomelo-logger').getLogger("exception");
var code = require('../../code');
var accountHelper = require('./accountHelper');

var AccountCertificate = require('./accountCertificate');
loginCertificate = new AccountCertificate();

var AccountUser = require('./accountUser');
accountUser = new AccountUser();

var Relationship = require('./relationship');
relationship = new Relationship();
var userProviderData = require('../../dao_provider/dao_account/user');
var userProvider = new userProviderData();
var gameServerProvider = require('../../dao_provider/dao_account/gameServer');

var userGameStore = require('../../../Game/domain/domain_Game/gameStore');
var txUtil = require('../../../Util/txUtil');
var account = module.exports;
account.relateDevice = function (account, identifier, callback) {
    userProvider.relateDevice(account, identifier, callback);
};

account.getRelatedAccount = function (identifier, callback) {
    userProvider.getRelatedAccount(identifier, callback);
};

/**
 * 使用普通帐号登陆
 * @param gameID
 * @param source
 * @param account
 * @param password
 * @param callback
 */
account.login = function (gameID, source, account, password,inputParams, callback) {
    var _this = this;
    var membership_id;
    var server_Type = 1;
    //logger2.info("login in");
    if (!account && source != accountHelper.SourceType.SanLiuLing && source != accountHelper.SourceType.HuaWei) {
        return callback(code.ACCOUNT.ACCOUNT_CAN_NOT_NULL, code.ACCOUNT.ACCOUNT_CAN_NOT_NULL);
    }
    ////logger2.info("login in2");
    if (source == accountHelper.SourceType.Anonymous) {
        password = "CHANG_YOU_DT_Anonymous";
        server_Type = accountHelper.gameEnum.Server_Type.Normal;
    }
    else if(source == accountHelper.SourceType.Oauth || source == accountHelper.SourceType.WXOauth){
        password = "CHANG_YOU_DT_Oauth";
        server_Type = accountHelper.gameEnum.Server_Type.txGame;
    }
    else if(source == accountHelper.SourceType.WXIOS){
        password = "CHANG_YOU_DT_WXIOS";
        server_Type =  accountHelper.gameEnum.Server_Type.Other;
    }
    else if(source == accountHelper.SourceType.XiaoMi){
        password = "CHANG_YOU_DT_XiaoMi";
        server_Type =  accountHelper.gameEnum.Server_Type.Other;
    }
    else if(source == accountHelper.SourceType.SanLiuLing){
        console.log('360');
        password = "CHANG_YOU_DT_360";
        server_Type =  accountHelper.gameEnum.Server_Type.Other;
    }
    else if(source == accountHelper.SourceType.HuaWei){
        console.log('HuaWei');
        account = inputParams.openid;
        password = "CHANG_YOU_DT_HuaWei";
        server_Type =  accountHelper.gameEnum.Server_Type.Other;
    }
    else {
        if (!password) {
            return callback(code.ACCOUNT.ACCOUNT_PASSWORD_CAN_NOT_NULL, code.ACCOUNT.ACCOUNT_PASSWORD_CAN_NOT_NULL);
        }
    }
    //logger2.info("login in3");
    var oriPassword = password;
    password = accountHelper.encryption(password);
    console.log('serverType:',server_Type);
    //select account && password on db
    gameServerProvider.getGameServerByType(server_Type,function(error,resultsGameServer){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            if(resultsGameServer == null){
                resultsGameServer = [];
            }
            accountUser.getUserInfoByLoginFirst(account, password,source, function (error, result) {
                //logger2.info("get login info");
                if (error) {
                    return callback(error, code.ACCOUNT.ACCOUNT_NOT_EXIST);
                }
                //if (result) {
                //    console.log(result);
                //}
                console.log('getUserLogin:',result);
                if (result.length != 0) {
                    //   logger2.info("login in");
                    console.log('login');
                    membership_id = result[0].membership_id;

//            var args = {
//                method : 'player.account',
//                param : {action_id : logWrite.Action.Player.Login, account : account, account_type : source, player_id:membership_id}
//            };
                    //logWrite.save(args);

                    if (result[0].IsValid == 0) {
                        return callback(code.ACCOUNT.ACCOUNT_NOT_VALID,code.ACCOUNT.ACCOUNT_NOT_VALID);
                    }
                    var mobile_phone = result[0].mobile_phone;
                    //   logger2.info("createCertificate");
                    console.log(source);
                    if(source != accountHelper.SourceType.Normal){
                        console.log('Oauth');
                        txUtil.verifyLogin(inputParams.openid,inputParams.openkey,inputParams.userip,source,function(error,resultVerify){
                            console.log('resultVerify:',resultVerify);
                            //var verifyResult = JSON.parse(result);
                            if (resultVerify.verifyStats == 0){
                                loginCertificate.createCertificate(gameID, membership_id, account,function (error, result) {
                                    //      logger2.info("createCertificate end");
                                    if (!error) {
                                        if(source == accountHelper.SourceType.Oauth || source == accountHelper.SourceType.WXOauth
                                        || source ==  accountHelper.SourceType.SanLiuLing || source ==  accountHelper.SourceType.XiaoMi
                                            || source ==  accountHelper.SourceType.HuaWei){
                                            if(source == accountHelper.SourceType.SanLiuLing){
                                                inputParams.openkey = resultVerify.result.id;
                                                inputParams.pf = resultVerify.result.name;
                                                account = resultVerify.result.id;
                                            }
                                            else if(source == accountHelper.SourceType.HuaWei){
                                                inputParams.openkey = resultVerify.result.userID;
                                                inputParams.pf = resultVerify.result.userName;
                                                account = resultVerify.result.userID;
                                            }
                                            console.log('update account');
                                            console.log(inputParams);
                                            userProvider.updateTxUserInfo(membership_id,source,inputParams.openid,
                                                inputParams.openkey,inputParams.paytoken,inputParams.pf,inputParams.pfkey,
                                                function(error,resultsUpdateTxUserInfo){
                                                    if(error!=null){
                                                        console.log(error);
                                                        callback(error,null);
                                                    }
                                                    else
                                                    {
                                                        //if(source == accountHelper.SourceType.Oauth){
                                                        //njcc不使用这种购买方式1127注释
                                                        //userGameStore.buyDiamond(membership_id,source,1,function(error,resultBuyDiamond){
                                                        //    if(error!=null){
                                                        //        console.log(error);
                                                        //        callback(error,null);
                                                        //    }
                                                        //    else
                                                        //    {
                                                                return callback(null, {cre: result, membership_id: membership_id, account: account,
                                                                    accountType: source, mobile_phone : mobile_phone,isNew:0,
                                                                    gameServerList:resultsGameServer,third_uid:resultVerify.result.id});
                                                        //    }
                                                        //})
                                                        //}
                                                        //else
                                                        //{
                                                        //    return callback(null, {cre: result, membership_id: membership_id, account: account,
                                                        //        accountType: source, mobile_phone : mobile_phone,isNew:0});

                                                        //}
                                                    }
                                                })
                                        }
                                        else
                                        {
                                            return callback(null, {cre: result, membership_id: membership_id, account: account,
                                                accountType: source, mobile_phone : mobile_phone,IsNew:0,
                                                gameServerList:resultsGameServer,third_uid:membership_id});
                                        }
                                    }
                                    else
                                    {
                                        console.log(error);
                                        callback(error,null);
                                    }
                                });
                            }
                            else
                            {
                                console.log('ACCOUNT_OAUTH_ERROR');
                                return callback(code.ACCOUNT.ACCOUNT_OAUTH_ERROR,'');
                            }
                        });
                    }
                    else
                    {
                        loginCertificate.createCertificate(gameID, membership_id, account,function (error, result) {
                            //      logger2.info("createCertificate end");
                            if (error) {
                                return callback(error, result);
                            }
                            console.log('return:',{cre: result, membership_id: membership_id, account: account,
                                accountType: source, mobile_phone : mobile_phone,
                                gameServerList:resultsGameServer,third_uid:membership_id});
                            return callback(null, {cre: result, membership_id: membership_id, account: account,
                                accountType: source, mobile_phone : mobile_phone,
                                gameServerList:resultsGameServer,third_uid:membership_id});
                        });
                    }
                }
                else {
                    // logger2.info("register");
                    if (source != accountHelper.SourceType.Normal) {
                        //注册
                        txUtil.verifyLogin(inputParams.openid, inputParams.openkey, inputParams.userip, source, function (error, resultVerify) {
                            console.log('resultVerify:', resultVerify);
                            //var verifyResult = JSON.parse(result);
                            if(source == accountHelper.SourceType.SanLiuLing){
                                account = resultVerify.result.id;
                            }
                            else if(source ==  accountHelper.SourceType.HuaWei){
                                account = resultVerify.result.userID
                            }
                            console.log('account:',account);
                            if (resultVerify.verifyStats == 0) {
                                _this.signUp(gameID, source, account, oriPassword, function (error, result) {
                                    if (error) {
                                        return callback(error, result);
                                    }
                                    accountUser.getUserInfoByLogin(account, password, source, function (error, result) {
                                        if (error) {
                                            callback(error, code.ACCOUNT.ACCOUNT_NOT_EXIST);
                                        }
                                        else {
                                            if (result.length != 0) {
                                                membership_id = result[0].membership_id;
                                                // create certificate
                                                loginCertificate.createCertificate(gameID, membership_id, account, function (error, result) {
                                                    if (error) {
                                                        callback(error, result);
                                                    }
                                                    else {
                                                        //if(source == accountHelper.SourceType.Oauth || source == accountHelper.SourceType.WXOauth){
                                                        //    console.log("updateTx",membership_id,inputParams);
                                                        //    userProvider.updateTxUserInfo(membership_id,source,inputParams.openid,
                                                        //        inputParams.openkey,inputParams.paytoken,inputParams.pf,inputParams.pfkey,
                                                        //        function(error,resultsUpdateTxUserInfo){
                                                        //            if(error!=null){
                                                        //                console.log(error);
                                                        //                callback(error,null);
                                                        //            }
                                                        //            else
                                                        //            {
                                                        //                console.log('succ');
                                                        //                callback(null, {
                                                        //                    cre: result,
                                                        //                    membership_id: membership_id,
                                                        //                    account: account,
                                                        //                    accountType: source,
                                                        //                    IsNew:1,
                                                        //                    gameServerList:resultsGameServer
                                                        //                });
                                                        //            }
                                                        //        })
                                                        //}
                                                        //else
                                                        //{
                                                        //    callback(null,{
                                                        //        cre: result,
                                                        //        membership_id: membership_id,
                                                        //        account: account,
                                                        //        accountType: source,
                                                        //        isNew:1,
                                                        //        gameServerList:resultsGameServer
                                                        //    });
                                                        //}
                                                        if(source == accountHelper.SourceType.SanLiuLing){
                                                            inputParams.openkey = resultVerify.result.id;
                                                            inputParams.pf = resultVerify.result.name;
                                                        }
                                                        userProvider.updateTxUserInfo(membership_id,source,inputParams.openid,
                                                            inputParams.openkey,inputParams.paytoken,inputParams.pf,
                                                            inputParams.pfkey, function(error,resultsUpdateTxUserInfo){
                                                                if(error!=null){
                                                                    console.log(error);
                                                                    callback(error,null);
                                                                }
                                                                else
                                                                {
                                                                    console.log('succ');
                                                                    callback(null, {
                                                                        cre: result,
                                                                        membership_id: membership_id,
                                                                        account: account,
                                                                        accountType: source,
                                                                        IsNew:1,
                                                                        gameServerList:resultsGameServer,
                                                                        third_uid:resultVerify.result.id
                                                                    });
                                                                }
                                                            })
                                                    }
                                                });
                                            }
                                            else {
                                                callback(code.ACCOUNT.ACCOUNT_NOT_EXIST, code.ACCOUNT.ACCOUNT_NOT_EXIST);
                                            }
                                        }
                                    });
                                });
                            }
                            else {
                                console.log('ACCOUNT_OAUTH_ERROR');
                                return callback(code.ACCOUNT.ACCOUNT_OAUTH_ERROR, '');
                            }
                        });
                    }

                    else {
                        callback(code.ACCOUNT.ACCOUNT_NOT_EXIST, code.ACCOUNT.ACCOUNT_NOT_EXIST);
                    }
                }
            });
        }
    })
};

/**
 * 注册帐号
 * @param gameID
 * @param source
 * @param account
 * @param password
 * @param callback
 */
account.signUp = function (gameID, source, account, password, callback) {
    if (!account || !password) {
        return callback(code.ACCOUNT.ACCOUNT_OR_PASSWORD_CAN_NOT_NULL, code.ACCOUNT.ACCOUNT_OR_PASSWORD_CAN_NOT_NULL);
    }
    var regex1 = /^[0-9|a-z|A-Z|_]{5,16}$/ig;

    if(source == accountHelper.SourceType.Normal )
    {//匿名用户跳过验证
        if(!regex1.test(account))
            return callback(code.ACCOUNT.ACCOUNT_FORMAT_ERROR, code.ACCOUNT.ACCOUNT_FORMAT_ERROR);

        if(account == password)
            return callback(code.ACCOUNT.ACCOUNT_PASSWORD_SAME, code.ACCOUNT.ACCOUNT_PASSWORD_SAME);

        //var letter = /[0-9|a-z|A-Z|@!#\$%&'\*\+/=\?\^_`{\|}~\-\.]{5,16}/;
        var letter = /^[0-9|a-z|A-Z|~!#\$%\^&\*\(\)<>:\-=_\+\.,\/\?]{5,16}$/;
        if(!letter.test(password))
            return callback(code.ACCOUNT.PASSWORD_FORMAT_ERROR, code.ACCOUNT.PASSWORD_FORMAT_ERROR);
    }
     //验证account是否重复
    accountUser.isUserExist(source, account, function (error, result)
    {
        if (error)
        {
            return callback(error, result);
        }
        if (result)
        {
            return callback(code.ACCOUNT.ACCOUNT_HAS_EXIST,code.ACCOUNT.ACCOUNT_HAS_EXIST);
        }
        password = accountHelper.encryption(password);

        console.log('isUserExistqq');
            accountUser.createUser(source, account, password, function (error, result) {
                console.log('error:', error);
                if (error) {
                    return callback(error, result);
                }

//            //注册日志
//            var args = {
//                method : 'player.account',
//                param : {action_id : logWrite.Action.Player.Register, account : account, account_type : source, player_id:result.membership_id}
//            };
//            logWrite.save(args);

                console.log(result);
                return callback(null, result.membership_id);
            });
    });
};

/**
 * 检查cre是否合法
 * @param gameID
 * @param userID
 * @param certificate
 * @param nickname
 * @param callback
 */
account.checkCertificateLegal = function (userID, certificate, callback) {

    loginCertificate.getUserCertificate(userID, accountHelper.GameID.DT, function (error, result) {
        if (error) {
            callback(error, result);
        }
        else {
            if (certificate == result.Certificate) {
                callback(null, true);
            }
            else {
                callback(code.ACCOUNT.CERTIFICATE_NOT_EXIST, false);
            }
        }
    });
};

/**
 * 绑定帐号
 * @param gameID
 * @param player_id
 * @param certificate
 * @param newAccount
 * @param newPassword
 * @param callback
 */
account.bindAccount = function (gameID, player_id, newAccount, newPassword, unique_id, callback) {
    var regex1 = /^[0-9|a-z|A-Z|_]{5,16}$/ig;

    if(!regex1.test(newAccount))
        return callback(code.ACCOUNT.ACCOUNT_FORMAT_ERROR, code.ACCOUNT.ACCOUNT_FORMAT_ERROR);

    if(newAccount == newPassword)
        return callback(code.ACCOUNT.ACCOUNT_PASSWORD_SAME, code.ACCOUNT.ACCOUNT_PASSWORD_SAME);

    //var letter = /[0-9|a-z|A-Z|@!#\$%&'\*\+/=\?\^_`{\|}~\-\.]{5,16}/;
    var letter = /^[0-9|a-z|A-Z|~!#\$%\^&\*\(\)<>:\-=_\+\.,\/\?]{5,16}$/;
    if(!letter.test(newPassword))
        return callback(code.ACCOUNT.PASSWORD_FORMAT_ERROR, code.ACCOUNT.PASSWORD_FORMAT_ERROR);

    newPassword = accountHelper.encryption(newPassword);

    accountUser.resetAccountByUserID(player_id, newAccount, newPassword, unique_id, callback);
};

account.queryPlayer = function (credentials, server_id, callback) {
    var msg = accountHelper.decryption(credentials);
    var membership_id = msg.split("|")[0];
    relationship.getPlayerId(membership_id, server_id, function (error, player_id) {
        callback(error, player_id);
    });
};

account.changePassword = function(credential, membership_id, old_password, new_password, callback){
    var letter = /^[0-9|a-z|A-Z|~!#\$%\^&\*\(\)<>:\-=_\+\.,\/\?]{5,16}$/;
    if(!letter.test(new_password))
        return callback(code.ACCOUNT.PASSWORD_FORMAT_ERROR, code.ACCOUNT.PASSWORD_FORMAT_ERROR);

    var msg = accountHelper.decryption(credential);
    var id = msg.split("|")[0];

    if(id != membership_id)
        return callback(code.ACCOUNT.ACCOUNT_VERIFY_ERROR,code.ACCOUNT.ACCOUNT_VERIFY_ERROR);

    old_password = accountHelper.encryption(old_password);
    new_password = accountHelper.encryption(new_password);

    userProvider.getUserById(membership_id, function(error, userAccount){
        if(error)
            return callback(error, userAccount);

        if(!userAccount)
            return callback(code.ACCOUNT.ACCOUNT_NOT_EXIST,code.ACCOUNT.ACCOUNT_NOT_EXIST);


//        var args = {
//            method : 'player.account',
//            param : {action_id : logWrite.Action.Player.ChangePassword, player_id : membership_id, account : userAccount.Account}
//        };
//        logWrite.save(args);

        if(userAccount.Password != old_password)
            return callback(code.ACCOUNT.OLD_PASSWORD_ERROR,code.ACCOUNT.OLD_PASSWORD_ERROR);

        userProvider.resetPassword(membership_id, new_password, function(error, result){
            if(error)
                return callback(code.ACCOUNT.ACCOUNT_MODIFYPWS_ERROR,code.ACCOUNT.ACCOUNT_MODIFYPWS_ERROR);

            callback(null, null);
        });
    });
};

/**
 * 绑定手机
 * @param player_id
 * @param mobile_phone
 * @param callback
 * @returns {*}
 */
account.bindPhone = function (player_id, mobile_phone, callback) {
    if (!mobile_phone)
        return callback(code.ACCOUNT.PHONE_IS_NULL, code.ACCOUNT.PHONE_IS_NULL);

    var letter = /^1[3|4|5|8][0-9]\d{8}$/;
    if (!letter.test(mobile_phone))
        return callback(code.ACCOUNT.PHONE_NUMBER_ERROR, code.ACCOUNT.PHONE_NUMBER_ERROR);

    userProvider.getUserById(player_id, function (error, player) {
        if (error)
            return callback(error, player);

        if (!player)//用户不存在
            return callback(code.ACCOUNT.ACCOUNT_NOT_EXIST, code.ACCOUNT.ACCOUNT_NOT_EXIST);

        if(!!player.mobile_phone)//已经绑定了手机
            return callback(code.ACCOUNT.PLAYER_BIND_PHONE, code.ACCOUNT.PLAYER_BIND_PHONE);

        userProvider.getPlayerByMobile(mobile_phone, function (error, result) {//判定手机号码是否已经存在
            if (error)
                return callback(error, result);

            if (result)
                return callback(code.ACCOUNT.PHONE_IS_EXISTS, code.ACCOUNT.PHONE_IS_EXISTS);

            player.mobile_phone = mobile_phone;

            userProvider.bindPhone(player_id, mobile_phone, function (error, result) {
                if (error)
                    return callback(error, result);


//                var args = {
//                    method : 'bindAccount.bind',
//                    param : {action_id : logWrite.Action.Player.AccountBound, player_id : player_id, mobile_phone:mobile_phone,account:player.Account}
//                };
//                logWrite.save(args);

                callback(null, player);
            });
        });
    });

};


account.checkUserLogin = function(req,callback){
    console.log('checkUserLogin');
    if(req.originalUrl == '/login/userLogin' || req.originalUrl == '/login/userRegister'
        ||req.originalUrl == '/gameConfig/getConfig' ||req.originalUrl == '/gameConfig/updateConfig'
    ||req.originalUrl == '/order/orderNotice'||req.originalUrl == '/order/orderNotice1124'
        ||req.originalUrl == '/order/orderNotice1207'){
        callback(null,true);
    }
    else
    {
        this.checkCertificateLegal(req.headers.userid,req.headers.cre,function(error,resultCheck){
            if(error!=null){
                console.log('checkCertificateLegal:',error);
                callback(error,null);
            }
            else
            {
                callback(null,resultCheck);
            }
        })
    }
}
