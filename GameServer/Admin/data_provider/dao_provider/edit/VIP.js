/**
 * Created by peihengyang on 15/3/9.
 */
var code = require('../../../config/code');
var sqlClient = require('../../dao/sqlClient').admin;
var sqlCommand = require('../../dao/sqlCommand');
var logger = require('log4js').getLogger("db");
var store = module.exports;


store.getAll =  function(callback){
    var sql = new sqlCommand('SELECT * FROM edit_VIP');
    sqlClient.query(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            callback(null,result);
        }
    });
}

store.getVIPById =  function(VIP_Id,callback){
    var sql = new sqlCommand('SELECT * FROM edit_VIP WHERE VIP_Id = ?;',[VIP_Id]);
    sqlClient.query(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            callback(null,result[0]);
        }
    });
}

store.addVIP =  function(model,callback){
    var sql = new sqlCommand('INSERT INTO edit_VIP(VIP_Lvl,VIP_Name,Create_Date,Total_Recharge,BuyStaminaTimes,' +
        'BuyCoinTimes,BuyPVETimes,BuyPVPTimes,ResetFarFightTimes,FarFightRewardsAdd,TenRaid,SkillPointLimit,' +
        'ForeverGoblinStore,BuySkillPoint,Description)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',[model.VIP_Lvl,
        model.VIP_Name,model.Create_Date, model.Total_Recharge,model.BuyStaminaTimes,model.BuyCoinTimes,model.BuyPVETimes,
        model.BuyPVPTimes,model.ResetFarFightTimes, model.FarFightRewardsAdd,model.TenRaid,model.SkillPointLimit,
        model.ForeverGoblinStore,model.BuySkillPoint,model.Description]);
    sqlClient.insert(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(code.DB.INSERT_DATA_ERROR,null);
        }
        else
        {
            callback(null,result);
        }
    });
};

store.updateVIP =  function(model,callback){
    var sql = new sqlCommand('UPDATE edit_VIP SET VIP_Lvl = ?,VIP_Name = ?,Total_Recharge = ?,BuyStaminaTimes = ?,' +
        'BuyCoinTimes =?,BuyPVETimes = ?,BuyPVPTimes = ?,ResetFarFightTimes = ?,FarFightRewardsAdd = ?,TenRaid = ?,' +
        'SkillPointLimit = ?,ForeverGoblinStore = ?,BuySkillPoint = ?,Description = ? WHERE VIP_Id = ?;',[model.VIP_Lvl,model.VIP_Name,
        model.Total_Recharge,model.BuyStaminaTimes,model.BuyCoinTimes,model.BuyPVETimes,model.BuyPVPTimes,model.ResetFarFightTimes,
        model.FarFightRewardsAdd,model.TenRaid,model.SkillPointLimit,model.ForeverGoblinStore,model.BuySkillPoint,
        model.Description,model.VIP_Id]);
    sqlClient.insert(sql,function(error,result){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            callback(null,result);
        }
    });
};

