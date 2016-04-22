/**
 * Created by peihengyang on 14/12/21.
 */
var express = require('express');
var router = express.Router();
var expressExtend = require('../../Util/expressExtend');
var domainUserBag = require('../domain/domain_Game/userBag');
var domainGameStore = require('../domain/domain_Game/gameStore');
var code = require('../../ServerConfigs/code');
var domain = require('domain');
/* GET home page. */
router.get('/', function(req, res,next) {
    expressExtend.entendNext(200,{},"express",next,res);
});
/*
 使用道具
 body:{
 itemid:2//道具编号
 amount:1//道具数量
 }
 */
router.post('/AddItem',function(req,res,next){
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "AddItem UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    var userId = req.headers.userid;
    var item_Id = req.body.itemid;
    var item_Amount = req.body.amount;
    d.run(function(){
        domainUserBag.addItemToBag(userId,item_Id,item_Amount,function(error,result){
            var apicode = code.SUCCESS;
            var apiresult ={};
            var apimessage = "ItemUse Success";
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
 使用道具
 body:{
 itemid:2//道具编号
 amount:1//道具数量
 targetId:1//目标编号
 }
 */
router.post('/UseItem',function(req,res,next){
    var userId = req.headers.userid;
    var item_Id = req.body.itemid;
    var item_Amount = req.body.amount;
    var target_Id = req.body.targetid;
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "UseItem UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    d.run(function(){
        domainUserBag.useItemById(userId,item_Id,item_Amount,target_Id,function(error,result){
            var apicode = code.SUCCESS;
            var apiresult ={};
            var apimessage = "ItemUse Success";
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
 道具合成
 body:{
 itemid:2//道具编号
 }
 */
router.post('/MergeItem',function(req,res,next){
    var userId = req.headers.userid;
    var item_Id = req.body.itemid;
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "MergeItem UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    d.run(function(){
        domainUserBag.mergeItem(userId,item_Id,function(error,result){
            var apicode = code.SUCCESS;
            var apiresult ={};
            var apimessage = "ItemMerge Success";
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
 出售道具
 body:{
 itemid:2//道具编号
 amount:1//道具数量
 }
 */
router.post('/SellItem',function(req,res,next){
    var userId = req.headers.userid;
    var item_Id = req.body.itemid;
    var item_Amount = req.body.amount;
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "SellItem UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    d.run(function(){
        domainUserBag.sellItemById(userId,item_Id,item_Amount,function(error,result){
            var apicode = code.SUCCESS;
            var apiresult ={};
            var apimessage = "ItemSell Success";
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


module.exports = router;