/**
 * Created by peihengyang on 15/10/15.
 */

var httpPost = require("./dtHttp");
var httpsPost = require("./dtHttps");
//var logWrite = require('../../logger/logWrite');
var crypto = require("crypto");
var dataParase =  require('./netDataParase');
var gameEmun = require('../Game/enum');
var userProviderData = require('../Login/dao_provider/dao_account/user');
var userProvider = new userProviderData();
var dtLog = require('../Game/dao_provider/dao_Logger/TxSDK')
var hosturl = 'msdk.qq.com';
var appleHostUrl = 'sandbox.itunes.apple.com';
//var QQAppId = 1104901872;
//var WXAppId = 'wx11e7ef7218ed2822';
//var QQAppKey = 'ZHwzMOiZ79hkdxp0';
//var WXAppKey = 'dd72b2c99d027556b44c8c042391a9df';
//内部测试
//var QQAppId = 1104900062;
//var WXAppId = 'wx1f54903702a30247';
//var QQAppKey = 'uD7jYv8ZnCSMhmZd';
//var WXAppKey = 'ea3ed53c86501633619bb309f8ec43f0';
//正式
var QQAppId = 1104908024;
var WXAppId = 'wxf3c111056d9cc544';
var QQPayAppKey = 'EaQInsSSI12zKYSphOLUNT6YYxb95soc';//现网
var QQAppKey = '9YSrtUkYdAJJVDXH';//沙箱
var WXAppKey = '5c79684e1c3cb6d55ac7155f7fef269d';
var XiaoMiAppId = '2882303761517414765';
var XiaoMiAppKey = '5881741494765';
var XiaoMiAppSecret = 'jiuwhpwPLJ7tYjddGuhwDA==';
var txUtil = module.exports;
txUtil.verifyLogin =  function(openid,openkey,userip,source,callback){
    var timeStamp = Math.ceil(new Date().getTime()/1000);
    var sig = '';
    var postpath = '';
    var mothod = '';
    console.log('scource:',source);
    switch (Number(source)){
        case gameEmun.SourceType.Oauth:
            sig = QQAppKey + timeStamp.toString();
            postpath = '/auth/verify_login/';
            console.log('sig:',sig);
            sig = crypto.createHash('md5').update(sig).digest('hex');
            console.log('sig:',sig);
            var uri = '?timestamp='+timeStamp + '&appid='+QQAppId+'&sig='+sig+'&openid='+openid+'&encode=1&msdkExtInfo=ichangyou';
            console.log(uri);
            var params = {
                "appid":QQAppId,
                "openid":openid,
                "openkey":openkey,
                "userip":userip
            }
            //console.log(httpPost.post(uri,params,hosturl,postpath));
            mothod = 'post';
            break;
        case gameEmun.SourceType.WXOauth:
            sig = WXAppKey + timeStamp.toString();
            postpath = '/auth/check_token/';
            console.log('sig:',sig);
            sig = crypto.createHash('md5').update(sig).digest('hex');
            console.log('sig:',sig);
            var uri = '?timestamp='+timeStamp + '&appid='+WXAppId+'&sig='+sig+'&openid='+openid+'&encode=1&msdkExtInfo=ichangyou';
            var params = {
                "appid":WXAppId,
                "openid":openid,
                "accessToken":openkey
            }
            mothod = 'post';
            break;
        case gameEmun.SourceType.WXIOS:
            return callback(null,{verifyStats:0});
            break;
        case gameEmun.SourceType.XiaoMi:
            hosturl = 'mis.migc.xiaomi.com';
            postpath = '/api/biz/service/verifySession.do';
            var uri = 'appId='+XiaoMiAppId+'&session='+openid+'&uid='+openkey;
            sig = crypto.createHmac('sha1', XiaoMiAppSecret).update(uri).digest().toString('Hex');
            uri = uri +'&signature='+sig;
            params = uri;
            mothod = 'get';
            break;
        case gameEmun.SourceType.SanLiuLing:
            hosturl = 'openapi.360.cn';
            postpath = '/user/me';
            var uri = 'access_token='+openid;
            //sig = crypto.createHmac('sha1', XiaoMiAppSecret).update(uri).digest().toString('Hex');
            //uri = uri +'?sig='+sig;
            params = uri;
            mothod = 'get';
            break;
        case gameEmun.SourceType.HuaWei:
            hosturl = 'api.vmall.com';
            postpath = '/rest.php';
            openid = dataParase.UrlEncode(openid);
            var uri = 'nsp_svc=OpenUP.User.getInfo&nsp_ts='+new Date().getTime()+'&access_token='+openid;
            //sig = crypto.createHmac('sha1', XiaoMiAppSecret).update(uri).digest().toString('Hex');
            //uri = uri +'?sig='+sig;
            params = uri;
            mothod = 'get';
            break;
        default :callback(null,null);
    }
    if(mothod == 'post'){
        httpPost.post(uri,params,hosturl,postpath,'',function(error,result){
            if(error!=null){
                console.log(error);
                callback(error,null);
            }
            else
            {
                var results = JSON.parse(result);
                if(results.ret == 0 && (source == gameEmun.SourceType.Oauth
                    || source == gameEmun.SourceType.WXOauth) ) {
                    callback(null,{verifyStats:0});
                }
                else
                {
                    console.log(results);
                    callback(results.ret,results);
                }
            }
        });
    }
    else if(mothod == 'get'){
        httpsPost.get(uri,params,hosturl,postpath,'',function(error,result){
            if(error!=null){
                console.log(error);
                callback(error,null);
            }
            else
            {
                var results = JSON.parse(result);
                var returnData = {verifyStats:-1,result:results};
                console.log('results:',results.errcode);
                if(results.ret == 0 && (source == gameEmun.SourceType.Oauth
                    || source == gameEmun.SourceType.WXOauth)) {
                    returnData.verifyStats = 0;
                }
                else if(results.id && source == gameEmun.SourceType.SanLiuLing) {
                    returnData.verifyStats = 0;
                }
                else if(source == gameEmun.SourceType.XiaoMi){
                    if(results.errcode == 200){
                        returnData.verifyStats = 0;
                    }
                }
                else if(source == gameEmun.SourceType.HuaWei){
                    if(results.error == null){
                        returnData.verifyStats = 0;
                    }
                }
                //else
                //{
                //    console.log(results);
                //    callback(results,null);
                //}
                callback(null,returnData);
            }
        });
    }
    else if(mothod == 'get' && source != gameEmun.SourceType.SanLiuLing){
        httpPost.get(uri,params,hosturl,postpath,'',function(error,result){
            if(error!=null){
                console.log(error);
                callback(error,null);
            }
            else
            {
                //console.log('result:',result);
                var results = JSON.parse(result);
                if(results.ret == 0) {
                    callback(null,{verifyStats:0});
                }
                else
                {
                    console.log(results);
                    callback(results.ret,results);
                }
            }
        });
    }
}

txUtil.getBalance = function(userId,source,callback){
    var timeStamp = Math.ceil(new Date().getTime()/1000);
    var sig = '';
    var cookies = '';
    var postpath,params,paramsuri,Tx_Type;
    console.log('getBalance');
            if(source == gameEmun.SourceType.Oauth || source == gameEmun.SourceType.WXOauth){
                userProvider.getTxUserInfo(userId,function(error,resultsTxUserInfo){
                    if(error!=null){
                        console.log(error);
                        callback(error,null);
                    }
                    else
                    {
                        var inputparam = resultsTxUserInfo[0];
                        console.log('inputparam:',inputparam);
                        switch (Number(source)){
                            case gameEmun.SourceType.Oauth:
                            {
                                Tx_Type = 'Tx_QQ';
                                postpath = '/mpay/get_balance_m';
                                cookies = 'session_id=openid;session_type=kp_actoken;org_loc='+dataParase.UrlEncode('/mpay/get_balance_m')+'';
                                paramsuri = 'appid='+QQAppId+'&openid='+inputparam.Open_Id+'&openkey='+inputparam.Open_Key
                                +'&pay_token='+inputparam.Pay_Token+'&pf='+inputparam.Pf+'&pfkey='+inputparam.Pf_Key
                                +'&ts='+timeStamp+'&zoneid=1';
                                console.log('paramsuri:',paramsuri);
                                sig = createSig(QQPayAppKey,'GET',postpath,paramsuri);
                                console.log('sig:',sig);
                                params = paramsuri+'&sig='+ dataParase.UrlEncode(sig);
                                //console.log(httpPost.post(uri,params,hosturl,postpath));
                            }
                                break;
                            case gameEmun.SourceType.WXOauth:
                                Tx_Type = 'Tx_WX';
                                console.log('/mpay/get_balance_m_WX');
                                postpath = '/mpay/get_balance_m';
                                cookies = 'session_id=hy_gameid;session_type=wc_actoken;org_loc='+dataParase.UrlEncode('/mpay/get_balance_m')+'';
                                paramsuri = 'appid='+QQAppId+'&openid='+inputparam.Open_Id+'&openkey='+inputparam.Open_Key
                                +'&pay_token=""&pf='+inputparam.Pf+'&pfkey='+inputparam.Pf_Key
                                +'&ts='+timeStamp+'&zoneid=1';
                                console.log('paramsuri:',paramsuri);
                                sig = createSig(QQPayAppKey,'GET',postpath,paramsuri);
                                console.log('sig:',sig);
                                params = paramsuri+'&sig='+ dataParase.UrlEncode(sig);
                                console.log('URL:',params);
                                break;
                            default :callback(null,null);
                        }
                        httpPost.get(paramsuri,params,hosturl,postpath,cookies,function(error,result){
                            var paym_Log_Model = {
                                User_Id:userId,
                                Host_Name:hosturl,
                                Url_Path:postpath,
                                Params:params,
                                Part_Source:Tx_Type,
                                Res_String:result,
                                Uri:paramsuri,
                                Create_Date:new Date()
                            }
                            dtLog.addThirdPartHistory(paym_Log_Model,function(error,resultLog){
                            });
                            if(error!=null){
                                console.log(error);
                                callback(error,null);
                            }
                            else
                            {
                                var results = JSON.parse(result);
                                if(results.ret == 0) {
                                    callback(null,{diamond:results.balance});
                                }
                                else
                                {
                                    callback(results.ret,results);
                                }
                            }
                        });
                    }
                })
            }
    else
            {
                callback(null,null);
            }
}


txUtil.paym = function(userId,amount,callback){
    var timeStamp = Math.ceil(new Date().getTime()/1000);
    var sig = '';
    var cookies = '';
    var postpath,params,paramsuri,Tx_Type;
    postpath = '/mpay/pay_m';
    userProvider.getUserById(userId,function(error,resultUser){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            var source = resultUser.source_type;
            if(source == gameEmun.SourceType.Oauth || source == gameEmun.SourceType.WXOauth){
                userProvider.getTxUserInfo(userId,function(error,resultsTxUserInfo){
                    if(error!=null){
                        console.log(error);
                        callback(error,null);
                    }
                    else
                    {
                        var inputparam = resultsTxUserInfo[0];
                        console.log('inputparam:',inputparam);
                        switch (Number(source)){
                            case gameEmun.SourceType.Oauth:
                            {
                                Tx_Type = 'Tx_QQ';
                                cookies = 'session_id=openid;session_type=kp_actoken;org_loc='+dataParase.UrlEncode(postpath)+'';
                                paramsuri = 'amt='+amount+'&appid='+QQAppId+'&openid='+inputparam.Open_Id+'&openkey='+inputparam.Open_Key
                                +'&pay_token='+inputparam.Pay_Token+'&pf='+inputparam.Pf+'&pfkey='+inputparam.Pf_Key
                                +'&ts='+timeStamp+'&zoneid=1';
                                console.log('paramsuri:',paramsuri);
                                sig = createSig(QQPayAppKey,'GET',postpath,paramsuri);
                                console.log('sig:',sig);
                                params = paramsuri+'&sig='+ dataParase.UrlEncode(sig);
                                //console.log(httpPost.post(uri,params,hosturl,postpath));
                            }
                                break;
                            case gameEmun.SourceType.WXOauth:
                                Tx_Type:'Tx_WX';
                                cookies = 'session_id=hy_gameid;session_type=wc_actoken;org_loc='+dataParase.UrlEncode(postpath)+'';
                                paramsuri = 'amt='+amount+'&appid='+QQAppId+'&openid='+inputparam.Open_Id+'&openkey='+inputparam.Open_Key
                                +'&pay_token=""&pf='+inputparam.Pf+'&pfkey='+inputparam.Pf_Key
                                +'&ts='+timeStamp+'&zoneid=1';
                                console.log('paramsuri:',paramsuri);
                                sig = createSig(QQPayAppKey,'GET',postpath,paramsuri);
                                console.log('sig:',sig);
                                params = paramsuri+'&sig='+ dataParase.UrlEncode(sig);
                                break;
                            default :callback(null,null);
                        }
                        httpPost.get(paramsuri,params,hosturl,postpath,cookies,function(error,result){
                            console.log('full params:',params);
                            var paym_Log_Model = {
                                User_Id:userId,
                                Host_Name:hosturl,
                                Url_Path:postpath,
                                Params:params,
                                Part_Source:Tx_Type,
                                Res_String:result,
                                Uri:paramsuri,
                                Create_Date:new Date()
                            }
                            dtLog.addThirdPartHistory(paym_Log_Model,function(error,resultLog){
                            });
                            if(error!=null){
                                console.log(error);
                                callback(error,null);
                            }
                            else
                            {
                                var results = JSON.parse(result);
                                if(results.ret == 0) {
                                    callback(null,null);
                                }
                                else
                                {
                                    callback(results.ret,results);
                                }
                            }
                        });
                    }
                })
            }
        }
    })
}

txUtil.verifyReceipt = function(receipt_Data,callback){
    var uri = '';
    var path = '/verifyReceipt/';
    var params = {
        'receipt-data': receipt_Data.toString('base64')
    };
    httpsPost.post(uri,params,appleHostUrl,path,'',function(error,results){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            console.log(results);
            callback(null,results);
        }
    })
}

var createSig = function(AppKey,HttpMothod,Uri,Params){
    var sourceString = HttpMothod + '&' + dataParase.UrlEncode(Uri) + '&' + dataParase.UrlEncode(Params);
    var sha1key = AppKey + '&';
    console.log('sourceString:',sourceString,'sha1key:',sha1key);
    var sig = crypto.createHmac('sha1',sha1key).update(sourceString).digest().toString('base64');
    //var b = new Buffer(sig);
    //var s = b.toString('base64');
    console.log('FinalString:',sig);
    return sig;
}


