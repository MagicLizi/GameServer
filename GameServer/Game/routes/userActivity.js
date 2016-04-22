/**
 * Created by peihengyang on 15/10/29.
 */

var express = require('express');
var router = express.Router();
var expressExtend = require('../../Util/expressExtend');
var domainUserActivity = require('../domain/domain_Game/userActivity');
var domainUserRank = require('../domain/domain_Game/userRank');
var domainGameUser = require('../domain/domain_Game/gameUser');
var code = require('../../ServerConfigs/code');
var domain = require('domain');
module.exports = router;
/* GET home page. */
router.get('/', function(req, res,next) {
    expressExtend.entendNext(200,{},"express",next,res);
});

//domainUserActivity.getUserNotReceivingActivity(100002542,function(error,results){
//    console.log(results);
//});

/*
 获取当前有效奖励列表
 body:{
 }
 */
router.post('/GetActivityReward',function(req,res,next){
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "GetActivityReward UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    var userId = req.headers.userid;
    d.run(function(){
        domainUserActivity.getUserNotReceivingActivity(userId,function(error,result){

            var apicode = code.SUCCESS;
            var apiresult ={};
            var apimessage = "GetActivityReward Success";
            if(error != null)
            {
                apicode = error;
                apimessage = error;
            }
            else
            {
                apiresult = {userActivity:result};
            }
            expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
        });
    })

});


/*
 领取奖励
 body:{
    activitytype:1
 }
 */
router.post('/DeliverActivityReward',function(req,res,next){
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "DeliverActivityReward UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    var userId = req.headers.userid;
    var activityType =  req.body.activitytype;
    d.run(function(){
        domainUserActivity.deliverActivityReward(userId,activityType,function(error,result){

            var apicode = code.SUCCESS;
            var apiresult ={};
            var apimessage = "GetActivityReward Success";
            if(error != null)
            {
                apicode = error;
                apimessage = error;
                console.log(error);
            }
            else
            {
                console.log('results:',result);
                apiresult = result;
            }
            expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
        });
    })

});