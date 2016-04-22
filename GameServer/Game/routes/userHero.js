/**
 * Created by peihengyang on 14/12/6.
 */

var express = require('express');
var domain = require('domain');
var router = express.Router();
var expressExtend = require('../../Util/expressExtend');
var domainUserHero = require('../domain/domain_Game/gameUser');
var code = require('../../ServerConfigs/code');
/* GET home page. */
router.get('/', function(req, res,next) {
    expressExtend.entendNext(200,{},"express",next,res);
});
/*
英雄进化,升星
body:{
    Hero_Id:2//英雄编号
}
 */
router.post('/HeroEvolution',function(req,res,next){
    var userId = req.headers.userid;
    var hero_Id = req.body.hero_id;
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "HeroEvolution UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    d.run(function(){
        domainUserHero.heroEvolution(userId,hero_Id,function(error,result){
            var apicode = code.SUCCESS;
            var apiresult ={};
            var apimessage = "HeroEvolution Success";
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
 英雄升阶
 body:{
 Hero_Id:2//英雄编号
 }
 */
router.post('/HeroAdvanced',function(req,res,next){
    var userId = req.headers.userid;
    var hero_Id = req.body.hero_id;
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "HeroAdvanced UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    d.run(function(){
        domainUserHero.heroAdvanced(userId,hero_Id,function(error,result){
            var apicode = code.SUCCESS;
            var apiresult ={};
            var apimessage = "HeroAdvanced Success";
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
 英雄技能升级
 body:{
 Hero_Id:2，//英雄编号
 Skill_Type:1//技能类型，1：主动技能，2：被动技能，3特性技能
 }
 */
router.post('/HeroSkillLvlUp',function(req,res,next){
    var userId = req.headers.userid;
    var hero_Id = req.body.hero_id;
    var skill_Type =  req.body.skill_type;
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "HeroSkillLvlUp UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    d.run(function(){
        domainUserHero.heroSkillLvlUp(userId,hero_Id,skill_Type,function(error,result){
            var apicode = code.SUCCESS;
            var apiresult ={};
            var apimessage = "HeroSkillLvlUp Success";
            if(error != null)
            {
                apicode = error;
                apimessage = error;
            }
            else
            {
                apiresult = result;
            }
            //console.log('apiresult:',apiresult,'/r apicode:',apicode,'/r apimessage:',apimessage);
            expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
        })
    })

})

/*
 英雄装备
 body:{
 heroid:2，//英雄编号
 equipment:[{
 itemid:1,//装备物品编号
 position:1//装备部位
 }]
 }
 */
router.post('/HeroEquip',function(req,res,next){
    var userId = req.headers.userid;
    var hero_Id = req.body.heroid;
    //var item_Id = req.body.itemid;
    //var postion =  req.body.position;
    var equipment = JSON.parse(req.body.equipment);
    var d = domain.create();
    d.on('error',function(err){
        console.log(err);
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "HeroEquip UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    d.run(function(){
        domainUserHero.heroEquipAll(userId,hero_Id,equipment,function(error,result){
            var apicode = code.SUCCESS;
            var apiresult ={};
            var apimessage = "HeroEquip Success";
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
