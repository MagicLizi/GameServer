/**
 * Created by lizi on 15/3/4.
 */
var userMail = module.exports;
var userMailProviter = require('../../dao_provider/dao_Game/mail');
//邮件状态枚举
userMail.MailState =
{
    UnRead : 1,
    Read  : 2,
    NoneEffect:3
};

userMail.AnnexState =
{
    NotGet : 1,
    HasGet : 2
}

userMail.MailType =
{
    GetAnnDestory : 1
}

//创建JJC奖励邮件
userMail.CreatePvpRankAwardMail = function(userId,awards,curRank,upRank,callback)
{
    var mailTitle = "竞技场最高排名奖励";
    var mailFrom = "竞技场大师";
    var mailContent = "您又一次彰显了自己的实力！您最新的排名是[E9D862]"+curRank+"[-]名，比之前提升了[E9D862]"+upRank+"[-]名，竞技" +
        "场大师决定颁发您以下奖励：";


    var model =
    {
        User_Id:userId,
        Mail_State:this.MailState.UnRead,
        Mail_Title:mailTitle,
        Mail_Content:mailContent,
        MailFromName:mailFrom,
        HasAnnex:true,
        Awards:awards,
        MailType:this.MailType.GetAnnDestory
    };


    userMailProviter.CreateUserMail(model,function(err,result)
    {
        callback(err,result);
    });

};

userMail.CreatePvpEveryWeekAwardMail = function(userId,curRank,awards,callback)
{
    var mailTitle = "竞技场排名奖励";
    var mailFrom = "竞技场大师";
    var mailContent = "恭喜，您当前的名次为[E9D862]"+curRank+"[-]，继续保持该名次，能获得奖励：";


    var model =
    {
        User_Id:userId,
        Mail_State:this.MailState.UnRead,
        Mail_Title:mailTitle,
        Mail_Content:mailContent,
        MailFromName:mailFrom,
        HasAnnex:true,
        Awards:awards,
        MailType:this.MailType.GetAnnDestory
    };


    userMailProviter.CreateUserMail(model,function(err,result)
    {
        callback(err,result);
    });
};

//获取用户有效邮件
userMail.GetUserEffectMail = function(userId,callback)
{
    userMailProviter.GetUserEffectMail(userId,callback);
};

//获取邮件福建
userMail.GetMailAnnex = function(mailId,callback)
{
    userMailProviter.GetMailAnnex(mailId,callback);
};

//获取附件奖励
userMail.GetMailAwards = function(mailId,userId,itemId,itemCount,callback)
{
    userMailProviter.GetMailAwards(mailId,userId,itemId,itemCount,callback);
};

userMail.SetMailState = function(mailId,mailState,callback)
{
    userMailProviter.SetMailState(mailId,mailState,callback);
};

userMail.CheckUnReadMail = function(userId,callback)
{
    userMailProviter.CheckUnReadMail(userId,function(err,result)
    {
        var hasUnRead = false;
        if(result.length>0)
        {
            hasUnRead = true;
        }
        callback(err,hasUnRead);
    });
};