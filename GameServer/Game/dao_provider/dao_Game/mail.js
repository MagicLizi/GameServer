/**
 * Created by lizi on 15/3/4.
 */
var code = require('../../../ServerConfigs/code');
var sqlClient = require('../../../Util/dao/sqlClient').Game;
var sqlCommand = require('../../../Util/dao/sqlCommand');
var mail_domain = require('../../domain/domain_Game/userMail');
var mail = module.exports;

mail.GetUserEffectMail = function(userId,callback)
{
    var sql2 = new sqlCommand('UPDATE User_Mail SET Mail_State = 3 WHERE User_Id = ? AND Mail_State <> 3 AND Mail_Id < (SELECT Mail_Id FROM (SELECT * FROM User_Mail WHERE User_Id = ? and mail_state!=3 ORDER BY CreateDate DESC LIMIT 30) AS Mail_List ORDER BY Mail_List.Mail_Id LIMIT 1)',[userId,userId]);

    var sql1 = new sqlCommand('select * from User_Mail where mail_state!=3 and user_id = ? order by CreateDate desc LIMIT 30',[userId]);



    var commands = new Array();
    commands.push(sql2);
    commands.push(sql1);

    sqlClient.transaction(commands, function(error, result)
    {
        if(error)
        {
            callback(code.DB.EXEC_QUERY_ERROR, code.DB.EXEC_QUERY_ERROR);
        }
        else
        {
            callback(null, result[1]);
        }
    });

    //sqlClient.query(sql1,function(err,result)
    //{
    //    callback(err,result);
    //});
};

mail.GetMailAnnex = function(AnnexId,callback)
{
    var sql1 = new sqlCommand('select * from Mail_Annex where Mail_Id = ?',[AnnexId]);
    sqlClient.query(sql1,function(err,result)
    {
        callback(err,result);
    });
};

mail.SetMailState = function(mailId,mailState,callback)
{
    var sql1 = new sqlCommand('UPDATE User_Mail SET Mail_State =? where mail_id = ?',[mailState,mailId]);
    sqlClient.query(sql1,function(err,result)
    {
        callback(err,result);
    });
}

mail.CheckUnReadMail = function(userId,callback)
{
    var sql1 = new sqlCommand('SELECT * FROM User_Mail where mail_state = 1 and user_id = ?',[userId]);
    sqlClient.query(sql1,function(err,result)
    {
        callback(err,result);
    });
};

//mailId,userId,itemId,itemCount,callback
mail.GetMailAwards = function(mailId,userId,itemId,itemCount,callback)
{
    var sql = new sqlCommand('CALL insertItemToBag(?,?,?);',
        [userId,itemId,itemCount]);

    var sql1 =  new sqlCommand('UPDATE Mail_Annex SET Annex_Get_Date =?,Annex_State=? where mail_id = ?',
        [new Date(),mail_domain.AnnexState.HasGet,mailId]);

    var commands = new Array();
    commands.push(sql);
    commands.push(sql1);

    sqlClient.transaction(commands, function(error, result)
    {
        if(error)
        {
            callback(code.DB.EXEC_QUERY_ERROR, code.DB.EXEC_QUERY_ERROR);
        }
        else
        {
            callback(null, result);
        }
    });
};

mail.CreateUserMail = function(model,callback)
{
    var sql1 = new sqlCommand('INSERT INTO User_Mail(User_Id,Mail_State,CreateDate,Mail_Title,Mail_Content,MailFromName,HasAnnex,MailType)' +
        'VALUES(?,?,?,?,?,?,?,?);',
        [model.User_Id,model.Mail_State,new Date(),model.Mail_Title,model.Mail_Content,model.MailFromName,model.HasAnnex,model.MailType]);

    var mailId ;
    sql1.after = function(r,s)
    {
        sql1.cache_keys.push(r.insertId);
    };

    var commands = new Array();
    commands.push(sql1);

    for(var i = 0;i<model.Awards.length;i++)
    {
        var award = model.Awards[i];
        var sql = new sqlCommand('INSERT INTO Mail_Annex(Mail_Id,Annex_ItemId,Annex_State,Annex_Get_Date,Annex_Cre' +
            'ate_Date,Annex_ItemCount)' +
            'VALUES(?,?,?,?,?,?);',
            [sql1.cache_keys[0],award.Id,mail_domain.AnnexState.NotGet,null,new Date(),award.Count]);
        commands.push(sql);
        sql.before = function(r,s)
        {
            this.params[0] = sql1.cache_keys[0];
        }
    }
    console.log("commands:",commands);
    sqlClient.transaction(commands, function(error, result)
    {
        if(error)
        {
            console.log('CreateUserMail:',error);
            callback(code.DB.EXEC_QUERY_ERROR, code.DB.EXEC_QUERY_ERROR);
        }
        else
        {
            callback(null, result);
        }
    });
};