/**
 * Created by lizi on 15/3/4.
 */


var express = require('express');
var router = express.Router();
var expressExtend = require('../../Util/expressExtend');
var domain = require('domain');
var code = require('../../ServerConfigs/code');
var mail = require("../domain/domain_Game/userMail");
var async = require('async');
var mailCode = require('../code');
var domainUserBag = require('../domain/domain_Game/userBag');
/* GET home page. */
router.post('/', function(req, res,next)
{
    expressExtend.entendNext(200, {}, "测试", next, res);
});

router.post('/GetUserEffectMail',function(req,res,next)
{
    var userId = req.headers.userid;
    console.log("userid:"+userId);
    mail.GetUserEffectMail(userId,function(error,result)
    {
        var apicode = code.SUCCESS;
        var apiresult ={};
        var apimessage = "GetUserEffectMail Success";
        if(error != null)
        {
            apicode = mailCode.UserMail.Get_UserMail_Error;
            apimessage = error;
            expressExtend.entendNext(apicode, apiresult, apimessage, next, res);
        }
        else
        {
            var tasks = [];
            var j = 0;
            for (var i = 0; i < result.length; i++) {
                var task = function (cb) {
                    var m = result[j];
                    var mId = m.Mail_Id;
                    var hasAnn = m.HasAnnex;
                    if(hasAnn)
                    {
                        mail.GetMailAnnex(mId, function (error, ann) {
                            var oneMail =
                            {
                                mail: m,
                                anns: ann
                            };
                            j++;
                            cb(error, oneMail);
                        });
                    }
                    else
                    {
                        var oneMail =
                        {
                            mail: m,
                            anns: []
                        };
                        j++;
                        cb(null, oneMail);
                    }
                };

                tasks.push(task);
            }

            async.series(tasks, function (error, results) {
                if(error != null)
                {
                    apicode = mailCode.UserMail.Get_UserMailAnn_Error;
                    apimessage = error;
                }
                else
                {
                    apiresult =
                    {
                        mails:results
                    };
                }
                expressExtend.entendNext(apicode, apiresult, apimessage, next, res);
            });
        }
    });
});

//mailId,userId,itemId,itemCount,callback
router.post('/GetMailAwards',function(req,res,next)
{
    var userId = req.headers.userid;
    //var userId = 100000456;
    var mailId = req.body.mailId;
    //var mailId = 81;
    var mailType = req.body.mailType;
    //var mailType = 1;

    mail.GetMailAnnex(mailId, function (error, ann) {
        var tasks = [];
        var j = 0;
        for(var i =0;i<ann.length;i++)
        {
            var task = function(cb)
            {
                var a = ann[j];
                if(a.Annex_State == mail.AnnexState.NotGet)
                {
                    mail.GetMailAwards(mailId,userId, a.Annex_ItemId, a.Annex_ItemCount,function(error,result)
                    {
                        j++;
                        cb(error,result);
                    });
                }
                else
                {
                    j++;
                    cb(null,null);
                }
            }
            tasks.push(task);
        }
       async.series(tasks,function(error,results)
       {
           var apicode = code.SUCCESS;
           var apiresult ={};
           var apimessage = "GetMailAwards Success";
            if(error)
            {
                apicode = mailCode.UserMail.Get_UserAnns_Error;
                apiresult = error;
                expressExtend.entendNext(apicode, apiresult, apimessage, next, res);
            }
            else
            {
                if(mailType == mail.MailType.GetAnnDestory)
                {
                    mail.SetMailState(mailId,mail.MailState.NoneEffect,function(error,result)
                    {
                        if(error)
                        {
                            apicode = mailCode.UserMail.Set_Mail_State_Error;
                            apiresult = error;
                            expressExtend.entendNext(apicode, apiresult, apimessage, next, res);
                        }
                        else
                        {
                            apiresult = {};
                            expressExtend.entendNext(apicode, apiresult, apimessage, next, res);
                        }
                    });
                }
                else
                {
                    apiresult = {};
                    expressExtend.entendNext(apicode, apiresult, apimessage, next, res);
                }
            }
       });
    });
});
module.exports = router;