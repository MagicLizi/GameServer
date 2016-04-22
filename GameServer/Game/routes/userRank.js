 /**
 * Created by peihengyang on 15/3/10.
 */
var express = require('express');
var router = express.Router();
var expressExtend = require('../../Util/expressExtend');
var domainUserRank = require('../domain/domain_Game/userRank');
var domainGameUser = require('../domain/domain_Game/gameUser');
var code = require('../../ServerConfigs/code');
var domain = require('domain');
module.exports = router;
/* GET home page. */
router.get('/', function(req, res,next) {
    expressExtend.entendNext(200,{},"express",next,res);
});

/*
 PVP匹配
 body:{
 }
 */
router.post('/PVPMatch',function(req,res,next){
    console.log('/PVPMatch');
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "PVPMatch UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    var userId = req.headers.userid;
    d.run(function(){
        domainUserRank.PVPMatch(userId,function(error,result){

            var apicode = code.SUCCESS;
            var apiresult ={};
            var apimessage = "PVPMatch Success";
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
/*
 PVP排名检查
 body:{
 competitorid:10010,//对手userid
 competitorrank:1,//对手排名
 }
 */
router.post('/checkUserRank',function(req,res,next){
    console.log('/checkUserRank');
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "checkUserRank UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    var competitor_Rank = req.body.competitorrank;
    var competitor_Id = req.body.competitorid;
    var userId = req.headers.userid;
    d.run(function(){
        domainUserRank.checkPVPRank(competitor_Id,competitor_Rank,function(error,result){

            var apicode = code.SUCCESS;
            var apiresult ={};
            var apimessage = "checkPVPRank Success";
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

/*
 获取PVP信息
 body:{

 }
 */
router.post('/getPVPInfo',function(req,res,next){
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "getPVPRecord UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    var userId = req.headers.userid;
    d.run(function(){
        domainGameUser.getPVPInfo(userId,function(error,result){
            var apicode = code.SUCCESS;
            var apiresult ={};
            var apimessage = "getPVPRecord Success";
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


/*
 获取排行榜
 body:{

 }
 */
router.post('/getRank',function(req,res,next){
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "getRank UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    var userId = req.headers.userid;
    d.run(function(){
        domainGameUser.getRank(userId,function(error,result){
            var apicode = code.SUCCESS;
            var apiresult ={};
            var apimessage = "getRank Success";
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


/*
 刷新商店
 body:{

 }
 */
router.post('/refreshStore',function(req,res,next){
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "refreshStore UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    var userId = req.headers.userid;
    var storeId = req.body.storeid;
    d.run(function(){
        domainUserRank.RefreshStore(userId,storeId,function(error,result){
            var apicode = code.SUCCESS;
            var apiresult ={};
            var apimessage = "refreshStore Success";
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



/*
 商店购买
 body:{

 }
 */
router.post('/buyGoods',function(req,res,next){
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "buyGoods UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    var userId = req.headers.userid;
    var userStoreId = req.body.userstoreid;
    var storeId = req.body.storeId;
    d.run(function(){
        domainUserRank.buyGoods(userId,userStoreId,storeId,function(error,result){
            var apicode = code.SUCCESS;
            var apiresult ={};
            var apimessage = "buyGoods Success";
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


/*
 购买竞技场次数
 body:{

 }
 */
router.post('/buyPVPTimes',function(req,res,next){
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "buyPVPTimes UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    var userId = req.headers.userid;
    d.run(function(){
    domainUserRank.buyPVPTimes(userId,function(error,result){
        var apicode = code.SUCCESS;
        var apiresult ={};
        var apimessage = "buyPVPTimes Success";
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


/*
 重置攻打时间
 body:{

 }
 */
router.post('/resetPVPInterval',function(req,res,next){
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "resetPVPInterval UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    var userId = req.headers.userid;
    d.run(function(){
    domainUserRank.resetPVPInterval(userId,function(error,result){
        var apicode = code.SUCCESS;
        var apiresult ={};
        var apimessage = "resetPVPInterval Success";
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