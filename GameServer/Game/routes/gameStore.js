/**
 * Created by peihengyang on 15/7/6.
 */
var express = require('express');
var router = express.Router();
var expressExtend = require('../../Util/expressExtend');
var domainGameStore = require('../domain/domain_Game/gameStore');
var domainUserRank = require('../domain/domain_Game/userRank');
var domain = require('domain');
var code = require('../../ServerConfigs/code');


module.exports = router;
/* GET home page. */
router.get('/', function(req, res,next) {
    expressExtend.entendNext(200,{},"express",next,res);
});
/*
 购买金币
 body:{
 }
 */
router.post('/BuyCoin',function(req,res,next){
    var userId = req.headers.userid;
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "BuyCoin UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    d.run(function(){
        domainGameStore.buyCoin(userId,function(error,result){
            var apicode = code.SUCCESS;
            var apiresult ={};
            var apimessage = "BuyCoin Success";
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
 购买四叶草
 body:{
 }
 */
router.post('/BuyFourLeaf',function(req,res,next){
    var userId = req.headers.userid;
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "BuyCoin UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    d.run(function(){
        domainGameStore.buyFourLeaf(userId,function(error,result){
            var apicode = code.SUCCESS;
            var apiresult ={};
            var apimessage = "BuyCoin Success";
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
 购买体力
 body:{

 }
 */
router.post('/BuyStamina',function(req,res,next){
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "BuyStamina UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    var userId = req.headers.userid;
    console.log(userId);
    d.run(function(){
        domainGameStore.buyStamina(userId,function(error,result){
            var apicode = code.SUCCESS;
            var apiresult ={};
            var apimessage = "BuyStamina Success";
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
 购买PVE次数
 body:{
 stageid:0
 }
 */

router.post('/BuyPVETimes',function(req,res,next){
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "BuyPVETimes UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    var userId = req.headers.userid;
    var stageId =  req.body.stageid;
    console.log(userId);
    d.run(function(){
        domainGameStore.buyPVETimes(userId,stageId,function(error,result){
            var apicode = code.SUCCESS;
            var apiresult ={};
            var apimessage = "BuyPVETimes Success";
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
 购买技能点数
 body:{

 }
 */

router.post('/BuySkillPoint',function(req,res,next){
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "BuySkillPoint UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    var userId = req.headers.userid;
    console.log(userId);
    d.run(function(){
        domainGameStore.buySkillPoint(userId,function(error,result){
            var apicode = code.SUCCESS;
            var apiresult ={};
            var apimessage = "BuySkillPoint Success";
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
 购买钻石
 body:{
 source:0,
 amount:10
 }
 */

router.post('/BuyDiamond',function(req,res,next){
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "BuyDiamond UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    var userId = req.headers.userid;
    var source =  req.body.source;
    var amount = req.body.amount;
    console.log(userId);
    d.run(function(){
        domainGameStore.buyDiamond(userId,source,amount,function(error,result){
            var apicode = code.SUCCESS;
            var apiresult ={};
            var apimessage = "BuyDiamond Success";
            if(error != null)
            {
                apicode = error;
                apimessage = error;
                console.log(result);
            }
            else
            {
                console.log(result);
                apiresult = {};
            }
            expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
        })
    });
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
        domainGameStore.RefreshStore(userId,storeId,function(error,result){
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
 刷新商店
 body:{

 }
 */
router.post('/getStore',function(req,res,next){
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "refreshStore UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    var userId = req.headers.userid;
     d.run(function(){
    domainGameStore.InitStore(userId,function(error,result){
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
    var storeId = req.body.storeid;
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
