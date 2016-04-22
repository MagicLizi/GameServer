var express = require('express');
var router = express.Router();
var expressExtend = require('../../Util/expressExtend');
var gameUserProvider = require('../dao_provider/dao_Game/gameUser');
var farFightProvider = require('../dao_provider/dao_Game/farFight');
var code = require('../../ServerConfigs/code');
var farFightCode = require("../code");
var domain = require('domain');
var async = require('async');
var heroModel = require("../domain/domain_Game/Hero");
var macthUserModel = require("../domain/domain_Game/farFightMatchUser");
var userRankProviter = require('../dao_provider/dao_Game/rank');
var userRankDomain = require('../domain/domain_Game/userRank');
var editProvider = require('../domain/domain_config/config');
var editGlobal = editProvider.getConfig("global").info;
var userLotteryProviter = require('../dao_provider/dao_Game/lottery');
var userBagDomain = require('../domain/domain_Game/userBag');
var userBagProvider = require('../dao_provider/dao_Game/Bag')
var gameEnum = require('../enum');
var userTaskDomain = require('../domain/domain_Game/userTask');
var userVip = require('../domain/domain_Game/userVIP');
var userGameUserProviter = require('../dao_provider/dao_Game/gameUser');
var editItemProviter = require('../dao_provider/dao_edit/item');

/* GET home page. */
router.post('/', function(req, res,next) {
    expressExtend.entendNext(200,{"test":"tt"},"express",next,res);
});

router.MatchingState =
{
    Matching : 1,
    NoMatching:0
}

router.canAttack = function(userId,attackUserId,callback)
{
    console.log("begin:"+userId);
    gameUserProvider.getUserFarFight(userId, function (error, farFightResult)
    {
        if(error)
        {
            callback(error);
        }
        else
        {
            console.log(attackUserId);
            var UserCurFarFightInfo = JSON.parse(farFightResult[0].UserCurFarFightInfo);
            console.log(UserCurFarFightInfo);
            var attackMatchUser;
            var all = UserCurFarFightInfo.FarFightMatchUsers;
            var matchIndex = 0;
            for(var i = 0;i<all.length;i++)
            {
                var uc = all[i];
                if(uc.userId == attackUserId)
                {
                    matchIndex = i;
                    attackMatchUser = uc;break;
                }
            }
            console.log(attackMatchUser);
            if(attackMatchUser.state == 2)
            {
                var e1 = new Error("farFightCode.FarFight.MatchUserHasFighted");
                e1.statusCode = farFightCode.FarFight.MatchUserHasFighted;
                callback(e1);
            }
            else if(attackMatchUser.state == 0||attackMatchUser.state ==1)
            {
                //判断是否可以打
                //0 - 2 无限制
                if(matchIndex <=2)
                {
                    callback(null);
                }
                else if(matchIndex>=3&&matchIndex<=11)
                {
                    var needIndex = matchIndex
                        - 3;
                    var needFightEndMatch = all[needIndex];
                    console.log(needFightEndMatch);
                    if(needFightEndMatch.state == 2)
                    {
                        callback(null);
                    }
                    else
                    {
                        var e1 = new Error("farFightCode.FarFight.ThisMatchIsLimited");
                        e1.statusCode = farFightCode.FarFight.ThisMatchIsLimited;
                        callback(e1);
                    }
                }
                else if(matchIndex == 12||matchIndex == 13)
                {
                    var m1 = all[9];
                    var m2 = all[10];
                    var m3 = all[11];
                    if(m1.state ==2 ||m2.state ==2||m3.state ==2)
                    {
                        callback(null);
                    }
                    else
                    {
                        var e1 = new Error("farFightCode.FarFight.ThisMatchIsLimited");
                        e1.statusCode = farFightCode.FarFight.ThisMatchIsLimited;
                        callback(e1);
                    }
                }
                else if(matchIndex == 14)
                {
                    var m1 = all[12];
                    var m2 = all[13];
                    if(m1.state ==2 &&m2.state ==2)
                    {
                        callback(null);
                    }
                    else
                    {
                        var e1 = new Error("farFightCode.FarFight.ThisMatchIsLimited");
                        e1.statusCode = farFightCode.FarFight.ThisMatchIsLimited;
                        callback(e1);
                    }
                }
            }
        }
    });
    return true;
};

//开始战斗
router.post('/beginFarFight',function(req,res,next)
{
    //uid
    var userId = req.headers.userid;
    //我方携带攻击英雄
    var herolist =  JSON.parse(req.body.herolist);
    //被攻击的USERID
    var attackUserId = req.body.attackUserId;
    //var herolist = [{"hid":4039,"hp":8000,"IniSkillEnergy":0,"PassSkillEnergy":0},{"hid":4040,"hp":8000,"IniSkillEnergy":0,"PassSkillEnergy":0},{"hid":4041,"hp":8000,"IniSkillEnergy":0,"PassSkillEnergy":0}];
    //var attackUserId = 10009549;

    var d = domain.create();
    d.on('error',function(err)
    {
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "FarFightBegin UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    //d.run(function()
    //{
        router.canAttack(userId,attackUserId,function(aerr)
        {
            if(!aerr)
            {
                var tasks = [];
                //设置我方远征英雄数据
                console.log(herolist);
                var task1 = function(cb)
                {
                   // console.log("t1 run");
                    farFightProvider.SetUserFarFightHerosInfo(userId,herolist,cb);
                }
                tasks.push(task1);
                //设置状态为攻打中
                var task2 = function(cb)
                {
                    //console.log("t2 run");
                    farFightProvider.SetBeginFarFightDefendState(userId,attackUserId,cb);
                }
                tasks.push(task2);


                var task3 = function(cb)
                {
                    userBagProvider.getUserBagById(userId,editGlobal.FourLeaf,cb);
                }
                tasks.push(task3);

                async.series(tasks,function(error,result)
                {
                    if(error)
                    {
                        console.log(error);
                        var apicode = farFightCode.FarFight.BeginFarFightError;
                        var apiresult ={};
                        var apimessage = "error:" + error.statusCode;
                        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
                    }
                    else
                    {
                        var apicode = code.SUCCESS;
                        var apimessage = "match begin fight success";
                        var fourLeafCount = 0;
                        console.log(result[2]);
                        if(result[2].length != 0){
                            fourLeafCount = result[2][0].Item_Amount;
                        }
                        var apiresult =
                        {
                            "matchUser":result[1],
                            "leafCount":fourLeafCount
                        };
                        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
                    }
                });
            }
            else
            {
                var apicode = farFightCode.FarFight.BeginFarFightError;
                if(aerr.statusCode)
                {
                    apicode = aerr.statusCode;
                }
                var apiresult ={};
                var apimessage = "error:" + aerr.statusCode;
                expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
            }
        });
    //});

});

//结束战斗
router.post('/endFarFight',function(req,res,next)
{
    //uid
    var userId = req.headers.userid;
    //我方携带攻击英雄
    var herolist = JSON.parse(req.body.attackTeam);
    //被攻击的USERID
    var attackUserId = req.body.fightid;
    var fightresult =req.body.fightresult;
    var fourleafamount = req.body.fourleafamount;
    var d = domain.create();
    d.on('error',function(err)
    {
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "FarFightEnd UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    d.run(function()
    {
        var tasks = [];
        //刷新血量
        var task1 = function(cb)
        {
            console.log(herolist);
            farFightProvider.UpdateTroopHeroInfos(herolist,cb);
        };
        //刷新远征信息
        var task2 = function(cb)
        {
            farFightProvider.SetEndFarFightDefendState(userId,attackUserId,cb);
        };

        var task3 = function(cb)
        {
            var defendHeroList = JSON.parse(req.body.defendTeam);
            console.log(defendHeroList);
            farFightProvider.SetEndDefendHerosInfo(userId,defendHeroList,attackUserId,cb);
        };

        var task4 = function(cb)
        {
            var  actionInfo  =
            {
                playTimes:1
            };

            userTaskDomain.checkTask(userId,gameEnum.Action_Type.PlayLongWay,actionInfo,cb);
        };

        var task5 = function(cb)
        {
            userBagProvider.useItemById(userId,editGlobal.FourLeaf,fourleafamount,0,cb);
        }

        tasks.push(task1);
        console.log("t1");
        if(fightresult == 2)
        {
            console.log("t2");
            tasks.push(task2);
            tasks.push(task4);
        }
        console.log(fightresult)

        if(fightresult == 5)
        {
            console.log("t3");
            tasks.push(task3);
        }


        tasks.push(task5);
        async.series(tasks,function(e,r)
        {
            if(e)
            {
                console.log(e);
                var apicode = farFightCode.FarFight.EndFarFightError;
                if(e.statusCode)
                {
                    apicode = e.statusCode;
                }
                var apiresult ={};
                var apimessage = "error:" + e.statusCode;
                expressExtend.entendNext(apicode, apiresult,apimessage,next,res);
            }
            else
            {
                var apicode = code.SUCCESS;
                var apimessage = "end fight success";
                var apiresult = {};
                expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
            }
        });
    });
});

//匹配
router.post('/farFightMatching', function(req, res,next) {
    var userId = req.headers.userid;
    //var userLvl = req.body.userLvl;
    var d = domain.create();
    d.on('error',function(err)
    {
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "FarFightMatching UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    d.run(function()
    {
        var farfightAdd = 1;
        gameUserProvider.getTroopByUserId(userId,function(e1,r1)
        {
            if(e1)
            {
                var apicode = e1;
                var apiresult = {};
                var apimessage = e1;
                expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
            }
            else
            {
                console.log("开始匹配");
                //console.log(r1[0]);
                var userLvl = r1[0].Troop_Lvl;
                var userTotalPower = 0;
                //判断远征挑战权限是否足够
                gameUserProvider.getUserFarFight(userId, function (error, farFightResult)
                {
                    var apicode = code.SUCCESS;
                    var apiresult = {};
                    var apimessage = "FarFightMatching Success";
                    if (error)
                    {
                        apicode = error;
                        apimessage = error;
                        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
                    }
                    else
                    {
                        if(farFightResult.length == 0)
                        {
                            apicode = farFightCode.FarFight.NoUserFarFightBasicInfo;
                            apimessage = "No User FarFightBasicInfo";
                            expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
                        }
                        else
                        {
                            var curMatchingState = farFightResult[0].CurMatchState;
                            var curFarFightCount = farFightResult[0].FarFightCount;
                            //判断是否在匹配中
                            if(curMatchingState == router.MatchingState.Matching)
                            {
                                apicode = farFightCode.FarFight.UserIsMatching;
                                apimessage = " User IsMatching";
                                expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
                            }
                            else
                            {
                                if(curFarFightCount <= 0)
                                {
                                    apicode = farFightCode.FarFight.UserFarFightCountNotEnough;
                                    apimessage = " User FarFightCount NotEnough";
                                    expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
                                }
                                else
                                {

                                    //开始匹配
                                    var tasks = [];
                                    //计算玩家战斗力
                                    var t1 = function(cb)
                                    {
                                        console.log("t1");
                                        gameUserProvider.getUserHerosByUserId(userId,function(e,r)
                                        {
                                            if(e)
                                            {
                                                cb(e,r);
                                            }
                                            else
                                            {
                                                //计算单个英雄战斗力
                                                var herosPowers = [];
                                                for(var i = 0;i< r.length;i++)
                                                {
                                                    var h = r[i];
                                                    var hero = new heroModel.Hero(h);
                                                    //console.log(hero.Fighting_Force);
                                                    if((hero.Fighting_Force+"")!= "NaN")
                                                    {
                                                        herosPowers.push(parseInt(hero.Fighting_Force));
                                                    }

                                                }
                                                //herosPowers.sort();
                                                herosPowers.sort(function(a,b){return a>b?1:-1});
                                                //herosPowers.sort(function(a,b){return a<b?1:-1});
                                                //var userTotalPower = 0;
                                                if(herosPowers.length<=3)
                                                {
                                                    for(var i = 0;i<herosPowers.length;i++)
                                                    {
                                                        userTotalPower = userTotalPower+herosPowers[i];
                                                    }
                                                }
                                                else
                                                {
                                                    for(var i = herosPowers.length - 1;i>=herosPowers.length -3;i--)
                                                    {
                                                        userTotalPower = userTotalPower+herosPowers[i];
                                                    }
                                                }

                                                var jumpPersent = parseInt(editGlobal.FarFight_FightForce_Match_Coe);
                                                var downPersent = (10000 - jumpPersent*7)/10000;
                                                var upPersent = (10000 + jumpPersent*7)/10000;
                                                console.log(jumpPersent);
                                                var down = parseInt(userTotalPower *downPersent);
                                                var up = parseInt(userTotalPower *upPersent);
                                                console.log("heropowers:"+herosPowers);
                                                console.log("userTotal:"+userTotalPower);
                                                console.log("down:"+ down + "up:"+up);

                                                //down = 2257;
                                                //up = 2259;
                                                farFightProvider.MathchUserByArea(down,up,function(e3,r3)
                                                {
                                                    if(e3)
                                                    {
                                                        cb(e3,r3);
                                                    }
                                                    else
                                                    {
                                                        //console.log(r3);
                                                        var matchUsers = [];
                                                        var curInRangeMatchUser = [];
                                                        //排除自己
                                                        for(var j = 0;j<r3.length;j++)
                                                        {
                                                            var u = r3[j];
                                                            // console.log(u.UserId+","+userId);
                                                            if(u.UserId !=userId)
                                                            {
                                                                curInRangeMatchUser.push(u);
                                                            }
                                                        }
                                                        var count = curInRangeMatchUser.length;
                                                        console.log("totalcount:",count);
                                                        console.log("inrange:");
                                                        //console.log(curInRangeMatchUser);
                                                        if(count>=15)
                                                        {
                                                            var coutJump = count/15;
                                                            console.log("countjump:"+coutJump);
                                                            for(var c = 1;c<=15;c++)
                                                            {
                                                                var matchIndex =parseInt(coutJump * c);
                                                                //console.log("matchIndex:"+matchIndex);
                                                                var matchUser =curInRangeMatchUser[matchIndex - 1];
                                                                matchUsers.push(matchUser);
                                                            }
                                                            var data =
                                                            {
                                                                "matchUsers":matchUsers
                                                            };
                                                            cb(null,data);
                                                        }
                                                        else
                                                        {
                                                            console.log("少于15");
                                                            farFightProvider.MatchUserByAllArea(function(ee,rr)
                                                            {
                                                                if(ee)
                                                                {
                                                                    cb(ee,ee);
                                                                }
                                                                else
                                                                {
                                                                    var exist = true;
                                                                    var totalUsers = rr;

                                                                    //console.log(totalUsers);
                                                                    var fu;
                                                                    var lastu;
                                                                    if(curInRangeMatchUser.length == 1)
                                                                    {
                                                                        console.log("1个人");
                                                                        //排除自己
                                                                        for(var j = totalUsers.length - 1;j>=0;j--)
                                                                        {
                                                                            var u = totalUsers[j];
                                                                            if(u.UserId ==userId)
                                                                            {
                                                                                //删除
                                                                                totalUsers.splice(j,1);
                                                                            }
                                                                        }
                                                                        fu = curInRangeMatchUser[0];
                                                                        lastu = curInRangeMatchUser[0];
                                                                    }
                                                                    else if(curInRangeMatchUser.length == 0)
                                                                    {
                                                                        exist = false;
                                                                        console.log("0个人");
                                                                        for(var i = 0;i<totalUsers.length;i++)
                                                                        {
                                                                            var u = totalUsers[i];
                                                                            if(u.UserId ==userId)
                                                                            {
                                                                                fu = u;
                                                                                lastu = u;break;
                                                                            }
                                                                        }
                                                                    }
                                                                    else if(curInRangeMatchUser.length>1)
                                                                    {
                                                                        //排除自己
                                                                        for(var j = totalUsers.length - 1;j>=0;j--)
                                                                        {
                                                                            var u = totalUsers[j];
                                                                            if(u.UserId ==userId)
                                                                            {
                                                                                //删除
                                                                                totalUsers.splice(j,1);
                                                                            }
                                                                        }
                                                                        console.log("大于1个人");
                                                                        fu = curInRangeMatchUser[0];
                                                                        lastu = curInRangeMatchUser[curInRangeMatchUser.length - 1];
                                                                    }
                                                                    var addusers = router.findIndex(totalUsers,fu,lastu,exist);
                                                                    // console.log(addusers);
                                                                    var down = addusers[0];
                                                                    var up = addusers[1];
                                                                    for(var i = 0;i<down.length;i++)
                                                                    {
                                                                        matchUsers.push(down[i]);
                                                                    }
                                                                    for(var i = 0;i<curInRangeMatchUser.length;i++)
                                                                    {
                                                                        matchUsers.push(curInRangeMatchUser[i]);
                                                                    }
                                                                    for(var i = 0;i<up.length;i++)
                                                                    {
                                                                        matchUsers.push(up[i]);
                                                                    }
                                                                    var data =
                                                                    {
                                                                        "matchUsers":matchUsers
                                                                    };
                                                                    //console.log("312312321");
                                                                    //console.log(data);
                                                                    cb(null,data);
                                                                }
                                                            });


                                                        }
                                                    }
                                                });

                                            }
                                        });
                                    };

                                    tasks.push(t1);

                                    var t2 = function(cb)
                                    {
                                        console.log("t2");
                                        //更新匹配状态
                                        farFightProvider.RefreshFarFightMatchingState(userId,router.MatchingState.Matching,function(e1,r1)
                                        {
                                            if(e1)
                                            {
                                                cb(e1,r1);
                                            }
                                            else
                                            {
                                                //匹配结束扣除远征数并且更新匹配状态
                                                var curCount = curFarFightCount - 1;
                                                farFightProvider.MacthEndRefresh(userId,curCount,router.MatchingState.NoMatching,function(e2,r2)
                                                {
                                                    cb(e2,r2);
                                                });
                                            }
                                        });
                                    }
                                    tasks.push(t2);

                                    //清除用户远征英雄信息
                                    var t3 = function(cb)
                                    {
                                        console.log("t3");
                                        farFightProvider.ClearUserFarFightHeros(userId,cb);
                                    };
                                    tasks.push(t3);

                                    //计算层级掉落
                                    var t4 = function(cb)
                                    {
                                        console.log("t4");
                                        //console.log(userLvl);
                                        farFightProvider.GetLvlPoolIds(userLvl,[farFightProvider.loopType.L1,farFightProvider.loopType.L2,farFightProvider.loopType.L3,farFightProvider.loopType.L4,farFightProvider.loopType.L5],function(e,r)
                                        {
                                            if(e)
                                            {
                                                cb(e,e);
                                            }
                                            else
                                            {
                                                var loopIds = r.LvlPoolIds;
                                                //console.log(loopIds);
                                                var tasks = [];
                                                var j = 0;
                                                for(var i = 0;i<loopIds.length;i++)
                                                {
                                                    var task = function(cb)
                                                    {
                                                        var li = loopIds[j];
                                                        j++;
                                                        var type =li.type;
                                                        var ids = li.ids;
                                                        var tasks1 = [];
                                                        var n = 0;
                                                        for(var m = 0;m<ids.length;m++)
                                                        {
                                                            var task1 = function(cb1)
                                                            {
                                                                var iD = ids[n];
                                                                n++;
                                                                var userModel =
                                                                {
                                                                    "User_Id":userId,
                                                                    "Lottery_Method_Id":iD
                                                                }
                                                                userLotteryProviter.lootItem(userModel,function(e2,r2)
                                                                {
                                                                    //console.log(r2);
                                                                    for(var i = 0;i<r2.length;i++)
                                                                    {
                                                                        var r22 = r2[i];
                                                                        r22.Item_Amount = r22.Item_Amount * farfightAdd;
                                                                    }
                                                                    cb1(e2,r2);
                                                                });
                                                            }
                                                            tasks1.push(task1);
                                                        }
                                                        async.series(tasks1,function(e1,r1)
                                                        {
                                                            if(e1)
                                                            {
                                                                cb(e1,e1);
                                                            }
                                                            else
                                                            {
                                                                //console.log(r1);
                                                                var allLoop = [];
                                                                for(var k = 0;k<r1.length;k++)
                                                                {
                                                                    var onceR = r1[k];
                                                                    for(var o = 0;o <onceR.length;o++)
                                                                    {
                                                                        var onceItem = onceR[o];
                                                                        allLoop.push(onceItem);
                                                                    }
                                                                }
                                                                var result =
                                                                {
                                                                    "type":type - 2,
                                                                    "loops":allLoop,
                                                                    "hasGet":0
                                                                }
                                                                //console.log(result);
                                                                cb(e1,result);
                                                            }

                                                        });
                                                    };
                                                    tasks.push(task);
                                                }
                                                async.series(tasks,function(e1,r1)
                                                {
                                                    cb(e1,r1);
                                                });
                                            }
                                        });
                                    };
                                    tasks.push(t4);


                                    var t5 = function(cb)
                                    {
                                        console.log("t5");
                                        //console.log(userLvl);
                                        farFightProvider.GetLvlPoolIds(userLvl,[farFightProvider.loopType.Small],function(e,r)
                                        {
                                            if(e)
                                            {
                                                cb(e,e);
                                            }
                                            else
                                            {

                                                var loopIds = r.LvlPoolIds;
                                                //console.log("loopssss");
                                                // console.log(loopIds);
                                                var tasks = [];
                                                var j = 0;
                                                for(var i = 0;i<loopIds.length;i++)
                                                {
                                                    var task = function(cb)
                                                    {
                                                        var li = loopIds[j];
                                                        j++;
                                                        var type =li.type;
                                                        var ids = li.ids;
                                                        var tasks1 = [];
                                                        var n = 0;
                                                        for(var m = 0;m<ids.length;m++)
                                                        {
                                                            var task1 = function(cb1)
                                                            {
                                                                var iD = ids[n];
                                                                n++;
                                                                var userModel =
                                                                {
                                                                    "User_Id":userId,
                                                                    "Lottery_Method_Id":iD
                                                                }
                                                                //console.log(userModel);
                                                                userLotteryProviter.lootItem(userModel,function(e2,r2)
                                                                {
                                                                    //console.log("抽奖结果");
                                                                    //console.log(r2);
                                                                    for(var i = 0;i<r2.length;i++)
                                                                    {
                                                                        var r22 = r2[i];
                                                                        r22.Item_Amount = r22.Item_Amount * farfightAdd;
                                                                    }
                                                                    cb1(e2,r2);
                                                                });
                                                            }
                                                            tasks1.push(task1);
                                                        }
                                                        async.series(tasks1,function(e1,r1)
                                                        {
                                                            if(e1)
                                                            {
                                                                cb(e1,e1);
                                                            }
                                                            else
                                                            {
                                                                //console.log(r1);
                                                                var allLoop = [];
                                                                for(var k = 0;k<r1.length;k++)
                                                                {
                                                                    var onceR = r1[k];
                                                                    for(var o = 0;o <onceR.length;o++)
                                                                    {
                                                                        var onceItem = onceR[o];
                                                                        allLoop.push(onceItem);
                                                                    }
                                                                }
                                                                var result =
                                                                {
                                                                    "type":type - 2,
                                                                    "loops":allLoop,
                                                                    "hasGet":0
                                                                }
                                                                //console.log(result);
                                                                cb(e1,result);
                                                            }

                                                        });
                                                    };
                                                    tasks.push(task);
                                                }
                                                async.series(tasks,function(e1,r1)
                                                {
                                                    //console.log(r1);
                                                    cb(e1,r1);
                                                });
                                            }
                                        });
                                    };
                                    for(var i = 0;i<15;i++)
                                    {
                                        tasks.push(t5);
                                    }

                                    //计算金币
                                    var t6 = function(cb)
                                    {
                                        console.log("t6");
                                        //console.log(editGlobal);
                                        var goldBase = parseInt(editGlobal.FarFight_Base_Coin);
                                        var LvlBase = parseInt(editGlobal.FarFight_Lvl_Coe);
                                        var FightForce = parseInt(editGlobal.FarFight_FightForce_Coe);
                                        var jump = parseInt(editGlobal.FarFight_FightForce_Match_Coe);
                                        var gold = goldBase +userLvl*LvlBase+userTotalPower*FightForce;
                                        console.log("total:"+gold);
                                        var downPersent = (10000 - jump*7)/10000;
                                        var upPersent = (10000 + jump*7)/10000;
                                        console.log(downPersent);
                                        console.log(upPersent);
                                        var jumpGold = gold/15;
                                        var down = jumpGold *downPersent;
                                        var up = jumpGold *upPersent;
                                        console.log("downG:"+ down);
                                        console.log("upG:"+ up);


                                        console.log("jump:"+jumpGold);
                                        var allGold = [];
                                        for(var i = 0;i<15;i++)
                                        {
                                            var g =down+i*(jumpGold*(jump/10000));
                                            g = g*farfightAdd;
                                            allGold.push(parseInt(g));
                                        }
                                        console.log(allGold);
                                        cb(null,{"golds":allGold});
                                    };

                                    tasks.push(t6);

                                    async.series(tasks,function(error,result)
                                    {

                                        if(!error)
                                        {
                                            var matchUsers = result[0].matchUsers;
                                            var lvlLoops = result[3];
                                            var j = 0;
                                            for(var i = 4;i<result.length - 1;i++)
                                            {
                                                result[i][0].type = 5 +j;
                                                j++
                                                lvlLoops.push(result[i][0]);
                                            }
                                            console.log(lvlLoops);
                                            //添加金币掉落
                                            //console.log(editGlobal);
                                            var allGolds = result[19].golds;
                                            console.log(allGolds);
                                            var k = 0;
                                            for(var i = 0;i<lvlLoops.length;i++)
                                            {
                                                var loop = lvlLoops[i];
                                                var type = loop.type;
                                                if(type>=5)
                                                {
                                                    var loops = loop.loops;
                                                    var gold =
                                                    {
                                                        "Item_Id":parseInt(editGlobal.Gold),
                                                        "Item_Amount":allGolds[k],
                                                        "User_Id":userId
                                                    }
                                                    k++;
                                                    loops.push(gold);
                                                }
                                            }
                                            //组织匹配数据
                                            macthUserModel.InitMatchUsers(matchUsers,function(e,r)
                                            {
                                                if(e)
                                                {
                                                    apicode = e;
                                                    apimessage = r;
                                                    expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
                                                }
                                                else
                                                {
                                                    apiresult =
                                                    {
                                                        "FarFightMatchUsers":r,
                                                        "lvlLoops":lvlLoops
                                                    };
                                                    //刷新用户当前远征数据，太平点直接存JSON
                                                    farFightProvider.RefreshUserCurFarFightInfo(userId,apiresult,function(ee,rr)
                                                    {
                                                        if(ee)
                                                        {
                                                            apicode = ee;
                                                            apimessage = rr;
                                                            apiresult = {};
                                                            expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
                                                        }
                                                        else
                                                        {
                                                            expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                        else
                                        {
                                            apicode = error;
                                            apimessage = result;
                                            expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
                                        }
                                    });


                                }
                            }
                        }
                    }
                });
            }
        });

    });
});

router.findIndex = function(all,fu,lastu,exist)
{
    //console.log("find index");
    //console.log(all);
    var firstIndex;
    var lastIndex;
    for(var i = 0;i<all.length;i++)
    {
        var u = all[i];
        if(u.UserId == fu.UserId)
        {
            firstIndex = i;
        }
        if(u.UserId == lastu.UserId)
        {
            lastIndex = i;
        }
    }
    //console.log("allcount:"+all.length);
    //console.log("fIndex:"+firstIndex);
    //console.log("lastIndex:"+lastIndex);
    var existCount = lastIndex - firstIndex + 1;
    var needAddCount = 15 - existCount;

    var lastUpCount = all.length - lastIndex -1;
    var lastDownCount = firstIndex;

    if(!exist)
    {
        needAddCount = 15;
        //lastUpCount = all.length - lastIndex
    }
    console.log("lastUpCount:"+lastUpCount + ",lastDownCount:"+lastDownCount);
    var downNeed = parseInt(needAddCount/2) + needAddCount%2;
    var upNeed = parseInt(needAddCount/2);
    console.log("downNeed:"+downNeed + ",upNeed:"+upNeed);
    var downAddition = 0;
    var upAddition = 0;
    if(lastDownCount - downNeed < 0)
    {
        downAddition = -1*(lastDownCount - downNeed);
        downNeed = lastDownCount;
    }

    if(lastUpCount - upNeed< 0)
    {
        upAddition = -1*(lastUpCount - upNeed);
        upNeed = lastUpCount;
    }

    console.log("downAddition:"+downAddition+",upAddition:"+upAddition);
    downNeed = downNeed + upAddition;
    upNeed = upNeed + downAddition;
    //console.log(firstIndex + "," +lastIndex);
    console.log("lastDownNeed:"+downNeed + ",lastUpNeed:" +upNeed);
    var downBegin = firstIndex - downNeed;
    var downEnd = firstIndex - 1;

    var upBegin = lastIndex + 1;
    var upEnd = lastIndex + upNeed;
    console.log("downBegin:"+downBegin +",downEnd:"+downEnd);
    console.log("upBegin:"+upBegin +",upEnd:"+upEnd);
    var upUsers = [];
    var downUsers = [];
    for(var i = downBegin;i<=downEnd;i++)
    {
        downUsers.push(all[i]);
    }

    for(var i = upBegin;i<=upEnd;i++)
    {
        upUsers.push(all[i]);
    }
    //console.log(downUsers);
    //console.log(upUsers);
    return [downUsers,upUsers];
};

//获取挡墙商店
router.post('/FarFightStoreInit',function(req,res,next)
{
    var userId = req.headers.userid;
    var storeType = editGlobal.FarFightStore;
    var d = domain.create();
    d.on('error',function(err)
    {
        var apicode = code.UnKnowError;
        var apimessage = "InitFarFightStore UnKnowError";
        expressExtend.entendNext(apicode,{},apimessage,next,res);
    });
    d.run(function()
    {
        userRankProviter.getStoreByUserIdStoreId(userId,storeType,function(error,resultsUserStore)
        {
            var results =
            {
                "FarFightStoreGoods":[]
            };
            if(error!=null)
            {
                var apicode = error;
                var apimessage = error;
                expressExtend.entendNext(apicode,{},apimessage,next,res);
            }
            else
            {
                results.FarFightStoreGoods = resultsUserStore;
                if(resultsUserStore.length == 0)
                {
                    //如果用户商店为空，那么刷新商店
                    userRankDomain.RefreshStore(userId,storeType,function(error,resultsUserStoreNew)
                    {
                        if(error!=null)
                        {
                            var apicode = error;
                            var apimessage = error;
                            expressExtend.entendNext(apicode,{},apimessage,next,res);
                        }
                        else
                        {
                            results.FarFightStoreGoods = resultsUserStoreNew.UserStore;
                            var apicode = code.SUCCESS;
                            var apiresult =results;
                            var apimessage = "InitFarFightStore Success";
                            expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
                        }
                    });
                }
                else
                {
                    var apicode = code.SUCCESS;
                    var apiresult =results;
                    var apimessage = "InitFarFightStore Success";
                    expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
                }

            }
        })
    });


});

router.post("/GetLvlReward",function(req,res,next)
{
    var userId = req.headers.userid;
    var lvl = req.body.lvl;
    //var lvl = 5;
    var d = domain.create();
    d.on('error',function(err)
    {
        var apicode = code.UnKnowError;
        var apiresult ={};
        var apimessage = "GetLvlReward UnKnowError";
        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
    });
    d.run(function()
    {
        gameUserProvider.getUserFarFight(userId, function (error, farFightResult)
        {
            //(farFightResult);
            var UserCurFarFightInfo = JSON.parse(farFightResult[0].UserCurFarFightInfo);
            var lvlLoops = UserCurFarFightInfo.lvlLoops;
            //console.log(UserCurFarFightInfo);
            var curL;
            for(var i = 0;i<lvlLoops.length;i++)
            {
                var l = lvlLoops[i];
                if(l.type == lvl)
                {
                    curL = l;
                    break;
                }
            }
            console.log("判断");
            //需要判断是否可以领
            var canGet = true;
            if(lvl>=0&&lvl<=4)
            {
                canGet = router.CanGetLvlRewards(UserCurFarFightInfo,curL);
            }
            else if(lvl>=5)
            {
                canGet = router.CanGetCommonRewards(UserCurFarFightInfo,curL);
            }
            //添加
            if(canGet)
            {
                userVip.getVIPData(userId,gameEnum.VIPType.FarFightRewardsAdd,function(vipe,vipr)
                {
                    if(vipe)
                    {
                        var apicode = vipe;
                        var apiresult = {};
                        var apimessage = vipe;
                        expressExtend.entendNext(apicode,apiresult,apimessage,next,res);
                    }
                    else
                    {
                        var farfightAdd = 1;
                        if(vipr) 
                        {
                            farfightAdd = (vipr/10000 + 1);
                        }
                        for(var i = 0;i<curL.loops.length;i++)
                        {
                            var l = curL.loops[i];
                            l.Item_Amount = l.Item_Amount*farfightAdd;
                        }
                        userBagDomain.addItemsToBag(userId, curL.loops, function (error, resultAddItem) {
                            if (error != null) {
                                console.log(error);
                                callback(error, null);
                            }
                            else
                            {
                                editItemProviter.getItemEffectByType(gameEnum.Item_Effect_Type.Hero, function (error, resultHeroItem) {

                                    if (error != null) {
                                        callback(error, null);
                                    }
                                    else {
                                        var heros = '';
                                        resultHeroItem.forEach(function (HeroItem) {
                                            curL.loops.forEach(function (item) {
                                                if (item.Item_Id == HeroItem.Item_Id) {
                                                    heros += HeroItem.Effect_Value + ",";
                                                }
                                            })
                                        });

                                        console.log('getUserHeroByHeroIdsL');
                                        userGameUserProviter.getUserHeroByHeroIdsL(userId, heros, function (error, resultUserHeros) {
                                            if (error != null)
                                            {
                                                callback(error, null);
                                            }
                                            else
                                            {
                                                curL.hasGet = 1;
                                                //刷新INFO
                                                farFightProvider.RefreshUserCurFarFightInfo(userId,UserCurFarFightInfo,function(ee,rr)
                                                {
                                                    if(ee)
                                                    {
                                                        var apicode = ee;
                                                        var apimessage = rr;
                                                        expressExtend.entendNext(apicode,{},apimessage,next,res);
                                                    }
                                                    else
                                                    {
                                                        var apicode = code.SUCCESS;
                                                        var apimessage = "GetFarFightLvlRewardSuccess";
                                                        var data=
                                                        {
                                                            "Items":curL.loops,
                                                            "User_Heros":resultUserHeros
                                                        }
                                                        expressExtend.entendNext(apicode,data,apimessage,next,res);
                                                    }
                                                });
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                });

            }
            else
            {
                var apicode = farFightCode.FarFight.LvlRewardsCanNotGet;
                var apimessage = "LvlRewardsCanNotGet";
                expressExtend.entendNext(apicode,{},apimessage,next,res);
            }

        });
    });



});

router.CanGetCommonRewards = function(farFightInfo,curGet)
{
    var index = curGet.type -5;
    var attacked = farFightInfo.FarFightMatchUsers[index];
    if(attacked.state == 2)
    {
        return true;
    }
    console.log("关卡还没打");
    return false;
}


router.CanGetLvlRewards = function(farFightInfo,curGet)
{
    console.log(curGet);
    var curGetLvl = curGet.type;
    var configs = [
        {
            "lvl":0,
            "needs":[0,1,2]
        },
        {
            "lvl":1,
            "needs":[3,4,5]
        },
        {
            "lvl":2,
            "needs":[6,7,8]
        },
        {
            "lvl":3,
            "needs":[9,10,11]
        },
        {
            "lvl":4,
            "needs":[12,13,14]
        }
    ];
    var getNeeds;
    for(var i = 0;i<configs.length;i++)
    {
        var c = configs[i];
        if(c.lvl == curGetLvl)
        {
            getNeeds = c;break;
        }
    }
    var fightEnd = true;

    var matchUsers = farFightInfo.FarFightMatchUsers;

    console.log(getNeeds);
    for(var i = 0;i<getNeeds.needs.length;i++)
    {
        var index =  getNeeds.needs[i];
        var matchUser = matchUsers[index];
        if(matchUser.state!=2)
        {
            fightEnd = false;
        }
    }
    if(fightEnd == false)
    {
        console.log("有关卡没打通");
        return false;
    }

    if(curGet.hasGet == 1)
    {
        console.log("已经领取");
        return false;
    }

    return true;
}

router.post("/test",function(req,res,next)
{
    var userId = req.headers.userid;


});
module.exports = router;