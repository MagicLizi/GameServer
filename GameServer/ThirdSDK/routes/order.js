var express = require('express');
var expressExtend = require('../../Util/expressExtend');
var router = express.Router();
var code = require('../code');
var xiaomi_Domain = require('../domain/order');
var gameEnum = require('../../Game/enum');
var domain = require('domain');

/**
订单通知
 */
router.get('/orderNotice',function(req,res,next){
    //参数获取
    //var account = req.body.account;
    //var password = req.body.password;
    //var source = req.body.source;
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "BuyCoin UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    d.run(function(){

        console.log('req.body:',req.query);

        //gameID, source, account, password, callback
        xiaomi_Domain.addOrder(req.query,gameEnum.SourceType.XiaoMi,function(error,result){
            var c = code.SUCCESS;
            var r ={};
            var m = "singn up Success";
            {} if(error)
            {
                c = result;
                m = result;
            }
            else
            {
                r =
                {
                    errocode:200
                }
            }
            res.send(r);
            //expressExtend.entendNextNogzip(c,r,m,next,res);
        });
    })
});


/**
 订单通知360
 */
router.get('/orderNotice1124',function(req,res,next){
    //参数获取
    //var account = req.body.account;
    //var password = req.body.password;
    //var source = req.body.source;
    //gameID, source, account, password, callback
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "BuyCoin UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    d.run(function(){
        console.log('req.body:',req.query);
        xiaomi_Domain.addOrder(req.query,gameEnum.SourceType.SanLiuLing,function(error,result){
            var c = code.SUCCESS;
            var r ={};
            var m = "singn up Success";
            console.log('error:',error);
            {} if(error && error != 29001)
            {
                c = result;
                m = result;
            }
            else
            {
                r = 'ok';
            }
            res.send(r);
            //expressExtend.entendNextNogzip(c,r,m,next,res);
        });
    })

});



/**
 订单通知huawei
 */
router.get('/orderNotice1207',function(req,res,next){
    //参数获取
    //var account = req.body.account;
    //var password = req.body.password;
    //var source = req.body.source;
    //gameID, source, account, password, callback
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "BuyCoin UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    d.run(function(){
        console.log('req.body:',req.body);
        xiaomi_Domain.addOrder(req.body,gameEnum.SourceType.HuaWei,function(error,result){
            var c = code.SUCCESS;
            var r ={};
            var m = "singn up Success";
            console.log('error:',error);
            if(error && error != 29001)
            {
                c = result;
                m = result;
                r = {result:1};
            }
            else
            {
                r = {result:0};
            }
            res.send(r);
            //expressExtend.entendNextNogzip(c,r,m,next,res);
        });
    })

});

/**
 订单通知huawei
 */
router.post('/orderNotice1207',function(req,res,next){
    //参数获取
    //var account = req.body.account;
    //var password = req.body.password;
    //var source = req.body.source;
    //gameID, source, account, password, callback
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "BuyCoin UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    d.run(function(){
        console.log('req.body:',req.body);
        xiaomi_Domain.addOrder(req.body,gameEnum.SourceType.HuaWei,function(error,result){
            var c = code.SUCCESS;
            var r ={};
            var m = "singn up Success";
            console.log('error:',error);
            if(error && error != 29001)
            {
                c = result;
                m = result;
                r = {result:1};
            }
            else
            {
                r = {result:0};
            }
            res.send(r);
            //expressExtend.entendNextNogzip(c,r,m,next,res);
        });
    })

});

module.exports = router;