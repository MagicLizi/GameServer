/**
 * Created by peihengyang on 14/12/4.
 */
var express = require('express');
var router = express.Router();
var expressExtend = require('../../Util/expressExtend');
var domainGameUser = require('../domain/domain_Game/gameUser');
var domain = require('domain');
var code = require('../../ServerConfigs/code');
var multipart = require('connect-multiparty');
var path = require('path');
var fs = require('fs');
/* GET home page. */
router.get('/', function(req, res,next) {
    expressExtend.entendNext(200,{},"express",next,res);
});
/*
 用户初始化，如果用户不存在，创建一个用户
 body:{
    user_Id:100000
 }
 */

router.post('/UserInit',function(req,res,next){
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "initUser UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    var userId = req.headers.userid;
    console.log(userId);
    d.run(function(){
        domainGameUser.getUser(userId,function(error,result){
            var apicode = code.SUCCESS;
            var apiresult ={};
            var apimessage = "initUser Success";
            if(error != null)
            {
                apicode = error;
                apimessage = error;
                console.log(result);
            }
            else
            {
                console.log(result);
                apiresult = result;
            }
            expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
        })
   });
});

/*
 主城刷新
 body:{
 lastupdatetime:1234543
 }
 */

router.post('/UpdateMainTown',function(req,res,next){
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "EnterMainTown UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    var userId = req.headers.userid;
    var last_Update_Time = req.body.lastupdatetime;
    console.log(userId);
    d.run(function(){
        domainGameUser.updateMainTown(userId,last_Update_Time,function(error,result){
            var apicode = code.SUCCESS;
            var apiresult ={};
            var apimessage = "EnterMainTown Success";
            if(error != null)
            {
                apicode = error;
                apimessage = error;
                console.log(result);
            }
            else
            {
                console.log(result);
                apiresult = result;
            }
            expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
        })
    });
});


/*
 保存头像
 body:{
 avatarid:1234543,
 avatarframeid:2222
 }
 */

router.post('/UpdateAvatar',function(req,res,next){
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "UpdateAvatar UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    var userId = req.headers.userid;
    var avartar_Id = req.body.avatarid;
    var avartar_Frame_Id = req.body.avatarframeid;
    console.log(userId);
    d.run(function(){
        domainGameUser.UpdateAvatar(userId,avartar_Id,avartar_Frame_Id,function(error,result){
            var apicode = code.SUCCESS;
            var apiresult ={};
            var apimessage = "UpdateAvatar Success";
            if(error != null)
            {
                apicode = error;
                apimessage = error;
                console.log(result);
            }
            else
            {
                console.log(result);
                apiresult = result;
            }
            expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
        })
    });
});


/*
 获取昵称
 body:{
 }
 */

router.post('/GetNickname',function(req,res,next){
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "GetNickname UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    var userId = req.headers.userid;
    console.log(userId);
    d.run(function(){
        domainGameUser.getNickname(userId,function(error,result){
            var apicode = code.SUCCESS;
            var apiresult ={};
            var apimessage = "GetNickname Success";
            if(error != null)
            {
                apicode = error;
                apimessage = error;
                console.log(result);
            }
            else
            {
                console.log(result);
                apiresult = result;
            }
            expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
        })
    });
});


/*
 修改昵称
 body:{
 nickname:'abc'
 }
 */

router.post('/UpdateNickname',function(req,res,next){
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "UpdateNickname UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    var userId = req.headers.userid;
    var nickName = req.body.nickname;
    console.log(userId);
    d.run(function(){
    domainGameUser.updateNickname(userId,nickName,function(error,result){
        var apicode = code.SUCCESS;
        var apiresult ={};
        var apimessage = "UpdateNickname Success";
        if(error != null)
        {
            apicode = error;
            apimessage = error;
            console.log(result);
        }
        else
        {
            console.log(result);
            apiresult = result;
        }
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    })
    });
});



router.post('/test',function(req,res,next){
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "initUser UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    //var userId = req.headers.userid;
    //console.log('fightdata:',req.files,'===========',req.body);
    //console.log(req);
    d.run(function(){
        var apicode = code.SUCCESS;
        var apiresult ={};
        var apimessage = "UpdateNickname Success";
        console.log("steva");
        var edit = require('../domain/domain_Game/Hero');
        var userHeroProvider = require('../dao_provider/dao_Game/gameUser');
        userHeroProvider.getUserByUserIdHeroId(100001897,281,function(error,resultUserHero){
            var h = new edit.Hero(resultUserHero);
            console.log("test:", h.Fighting_Force);
            expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
        })

    });
});



module.exports = router;
