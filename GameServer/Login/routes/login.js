var express = require('express');
var expressExtend = require('../../Util/expressExtend');
var router = express.Router();
var code = require('../code');
var accountController = require('../domain/domain_account/accountController');
var accountHelper = require('../domain/domain_account/accountHelper');
var domain = require('domain');
/**
 * 用户登陆接口
 */
router.post('/userSignUp',function(req,res,next){

});

/**
 * 用户注册接口
 * userNmae:账号名
 * pass：密码
 */
router.post('/userRegister',function(req,res,next){
    //参数获取
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "BuyCoin UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    d.run(function(){
        var account = req.body.account;
        var password = req.body.password;
        var source = req.body.source;

        //gameID, source, account, password, callback
        accountController.signUp(accountHelper.GameID.DT,source,account,password,function(error,result){
            var c = code.SUCCESS;
            var r ={};
            var m = "singn up Success";
            if(error)
            {
                c = result;
                m = result;
            }
            else
            {
                r =
                {
                    membership_id:result
                }
            }
            expressExtend.entendNext(c,r,m,next,res);
        });
    })

});


router.post('/userLogin',function(req,res,next){
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "BuyCoin UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    d.run(function(){
        var account = req.body.account;
        var password = req.body.password;
        var source = req.body.source;
        var params = {
            openid : req.body.openid,
            openkey : req.body.openkey,
            userip : req._remoteAddress,
            paytoken:req.body.paytoken,
            pf:req.body.pf,
            pfkey:req.body.pfkey
        }

        console.log('myreq:',params);
        //var self = this;
        //调用帐号模块的登录
        accountController.login(accountHelper.GameID.DT, source, account, password,params, function (error, result) {
            var c = code.SUCCESS;
            var r ={};
            var m = "login Success";
            if(error!=null)
            {
                c = error;
                m = result;
            }
            else
            {
                r = result;
                console.log('login result:',result);
            }
            expressExtend.entendNext(c,r,m,next,res);
        });
    });
});
module.exports = router;