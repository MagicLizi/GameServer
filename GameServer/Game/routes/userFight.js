/**
 * Created by peihengyang on 15/1/6.
 */

var express = require('express');
var domain = require('domain');
var router = express.Router();
var gameEnum = require('../enum');
var expressExtend = require('../../Util/expressExtend');
var domainUserHero = require('../domain/domain_Game/gameUser');
var domainUserDungeon = require('../domain/domain_Game/userFight');
var code = require('../../ServerConfigs/code');
var multipart = require('connect-multiparty');
var path = require('path');
var fs = require('fs');
module.exports = router;
/* GET home page. */
router.get('/', function(req, res,next) {
    expressExtend.entendNext(200,{},"express",next,res);
});
/*
 进入关卡
 body:{
 stageid:2//关卡编号
 herolist:[166,111,123,234,232]//战队列表

 }
 */
router.post('/StartPVEFight',function(req,res,next){
    var userId = req.headers.userid;
    var stage_Id = req.body.stageid;
    var hero_List =  req.body.herolist;
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "StartPVEFight UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    d.run(function(){
        domainUserDungeon.StartPVEFight(userId,stage_Id,hero_List,function(error1,result){
            var apicode = code.SUCCESS;
            var apiresult ={};
            var apimessage = "StartFight Success";
            if(error1 != null)
            {
                apicode = error1;
                apimessage = error1;
                console.log(error1);
            }
            else
            {
                apiresult = result;
            }
            expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
        })
    })

});

/*
 结束战斗
 body:{
 fightid:1//战斗编号
 finishtype:1//2：胜利，5：失败，3：错误，4：取消
 starcount:1//战斗星级
 }
 */
router.post('/FinishPVEFight',function(req,res,next){
    var userId = req.headers.userid;
    var fight_Id = Number(req.body.fightid);
    var finish_Type =  Number(req.body.finishtype);
    var clear_Star = Number(req.body.starcount);
    var boss_Life = Number(req.body.bosslife);
    var fourleaf_amount = Number(req.body.fourleafamount);
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "FinishPVEFight UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    d.run(function(){
        domainUserDungeon.FinishPVEFight(fight_Id,finish_Type,clear_Star,boss_Life,fourleaf_amount,function(error,result){
            var apicode = code.SUCCESS;
            var apiresult ={};
            var apimessage = "StartFight Success";
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
        })
    })
});


/*
 战斗扫荡
 body:{
 stageid:2//关卡编号
 herolist:[166,111,123,234,232]//战队列表
 times:2//扫荡次数
 }
 */
router.post('/PVERaid',function(req,res,next){
    var userId = req.headers.userid;
    var stage_Id = req.body.stageid;
    var raid_Times =  req.body.raidtimes;
    var raid_Type = req.body.raidtype;
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "PVERaid UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    d.run(function(){
        console.log(raid_Times);
        domainUserDungeon.PVERaid(userId,stage_Id,raid_Times,raid_Type,function(error1,result){
            var apicode = code.SUCCESS;
            var apiresult ={};
            var apimessage = "PVERaid Success";
            if(error1 != null)
            {
                apicode = error1;
                apimessage = error1;
                console.log(error1);
            }
            else
            {
                console.log('RaidResult:',result);
                apiresult = result;
            }
            expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
        })
    })
});


/*
 进入竞技场
 body:{
 competitorid:10010,//对手userid
 competitorrank:1,//对手排名
 herolist:[166,111,123,234,232]//战队列表

 }
 */
router.post('/StartPVPFight',function(req,res,next){
    var competitor_Id = req.body.competitorid;
    var competitor_Rank = req.body.competitorrank;
    var userId = req.headers.userid;
    var hero_List =  req.body.herolist;
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "StartPVPFight UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    //d.run(function(){
        domainUserDungeon.StartPVPFight(userId,competitor_Id,competitor_Rank,hero_List,function(error1,result){
            var apicode = code.SUCCESS;
            var apiresult ={};
            var apimessage = "StartFight Success";
            if(error1 != null)
            {
                apicode = error1;
                apimessage = error1;
                console.log(error1);
            }
            else
            {
                apiresult = result;
            }
            expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
        })
    //})

});



/*
 结束战斗
 body:{
 fightid:10010,//战斗编号
 fightresult:1,//2:胜利，5：失败

 }
 */
router.post('/FinishPVPFight',multipart(),function(req,res,next){
    var fight_Id = req.body.fightid;
    var fight_Result = req.body.fightresult;
    var userId = req.headers.userid;
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "FinishPVPFight UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    d.run(function(){
        ////get filename
        //var filename = fight_Id+'.rec';
        ////req.files.fightdata.originalFilename || path.basename(req.files.fightdata.path);
        ////copy file to a public directory
        //var targetPath = path.resolve(path.dirname(__filename) , '../../Admin/public/fightData/')  + '/'+ filename;
        ////copy file
        //console.log(targetPath);
        //fs.createReadStream(req.files.fightdata.path).pipe(fs.createWriteStream(targetPath));
        domainUserDungeon.FinishPVPFight(fight_Id,fight_Result,function(error,result){
            var apicode = code.SUCCESS;
            var apiresult ={};
            var apimessage = "FinishPVPFight Success";
            if(error != null)
            {
                apicode = error;
                apimessage = error;
                console.log(error);
            }
            else
            {
                apiresult = result;
            }
            expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
        })
    })

});


/*
 pvp防守阵型保存
 body:{
 herolist:166,111,123,234,232//战队列表
 }
 */
router.post('/SavePVPDefendTroop',function(req,res,next){
    var hero_List = req.body.herolist+',';
    var userId = req.headers.userid;
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "SavePVPDefendTroop UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    d.run(function(){
        domainUserDungeon.SavePVPDefendTroop(userId,hero_List,function(error,result){
            var apicode = code.SUCCESS;
            var apiresult ={};
            var apimessage = "SavePVPDefendTroop Success";
            if(error != null)
            {
                apicode = error;
                apimessage = error;
                console.log(error);
            }
            else
            {
                apiresult = result;
            }
            expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
        })
    })

});