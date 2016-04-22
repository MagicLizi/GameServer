/**
 * Created by David_shen on 2/10/15.
 */
var express = require('express');
var domain = require('domain');
var router = express.Router();
var expressExtend = require('../../Util/expressExtend');
var domainUserTask = require('../domain/domain_Game/userTask');
var code = require('../../ServerConfigs/code');
module.exports = router;
/* GET home page. */
router.get('/', function(req, res,next) {
    expressExtend.entendNext(200,{},"express",next,res);
});

/**
 * 获取任务信息
 *  body:{
 }
 */
router.post('/GetTaskInfo',function(req,res,next){
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "GetTaskInfo UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    var userId = req.headers.userid;

    d.run(function(){
        domainUserTask.getTaskInfo(userId,function(error,result){
            var apicode = code.SUCCESS;
            var apiresult ={};
            var apimessage = "GetTaskInfo Success";
            if(error != null)
            {
                apicode = error;
                apimessage = error;
            }
            else
            {
                apiresult = result;
            }
            expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
        });
    })

});

/**
 * 获取任务奖励
 *  body:{
 taskId:1//任务Id
 }
 */
router.post('/GetTaskRewards',function(req,res,next){
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "GetTaskRewards UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    var userId = req.headers.userid;
    var taskId = req.body.taskId;
    d.run(function(){
        domainUserTask.getTaskReward(userId,taskId,function(error,result){
            var apicode = code.SUCCESS;
            var apiresult ={};
            var apimessage = "GetTaskRewards Success";
            if(error != null)
            {
                apicode = error;
                apimessage = error;
            }
            else
            {
                apiresult = result;
            }
            console.log(error);
            console.log(result);
            expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
        });
    })
});