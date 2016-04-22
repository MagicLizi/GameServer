/**
 * Created by steve on 15/11/19.
 */
var code = require('../../code');
var gameEnum = require('../../enum');
var VIPProviter = require('../../dao_provider/dao_Game/VIP');
var editProvider = require('../domain_config/config');
var userTaskDomain = require('./userTask');
var util = require('../../../Util/txUtil');
var async = require('async');
var userVIP = module.exports;

var editVIPData = editProvider.getConfig('VIP').info;
userVIP.checkVIPLvl = function(userId,recharge_Amount,callback){
    VIPProviter.getUserVIPByUserId(userId,function(error,resultUserVIP){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            var user_VIP = resultUserVIP;
            var org_VIP_Lvl = user_VIP.VIP_Lvl;
            user_VIP.Total_Recharge += recharge_Amount;
            editVIPData.forEach(function(VIPData){
                if(user_VIP.Total_Recharge >= VIPData.Total_Recharge && user_VIP.VIP_Lvl < VIPData.VIP_Lvl){
                    user_VIP.VIP_Lvl = VIPData.VIP_Lvl;
                }
            });
            //if(user_VIP.VIP_Lvl > org_VIP_Lvl){
                VIPProviter.updateUserVIP(user_VIP,function(error,resultUpdateVIP){
                    if(error!=null){
                        console.log(error);
                        callback(error,null);
                    }
                    else
                    {
                        var actionInfo = {playTimes:user_VIP.VIP_Lvl};
                        userTaskDomain.checkTask(userId,gameEnum.Action_Type.VipLevelUp,actionInfo,function(error,resultCheckTask){
                            if(error!=null){
                                console.log(error);
                                callback(error,null);
                            }
                            else
                            {
                                callback(null,user_VIP);
                            }
                        })
                    }
                })
            //}
            //else
            //{
            //    callback(null,user_VIP);
            //}

        }
    })
}


userVIP.checkVIP = function(userId,authority,callback){
    VIPProviter.getUserVIPByUserId(userId,function(error,resultUserVIP){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            var user_VIP = resultUserVIP;
            //console.log('VIPData:',editVIPData);
            //console.log('user_VIP:',user_VIP);
            editVIPData.forEach(function(VIPData){
                if(user_VIP.VIP_Lvl == VIPData.VIP_Lvl){
                    switch (authority){
                        case gameEnum.VIP_Authority.BuySkillPoint:
                        if(VIPData.BuySkillPoint == 1){
                            return callback(null,true);
                        }
                            else
                        {
                            return callback(null,false);
                        }
                            break;
                        case gameEnum.VIP_Authority.ForeverGoblinStore:
                            if(VIPData.ForeverGoblinStore == 1){
                                return callback(null,true);
                            }
                            else
                            {
                                return callback(null,false);
                            }
                            break;
                        case gameEnum.VIP_Authority.TenRaid:
                            if(VIPData.TenRaid == 1){
                                return callback(null,true);
                            }
                            else
                            {
                                return callback(null,false);
                            }
                            break;
                        case 0:
                                return callback(null,true);
                            break;
                        default :
                            return callback(null,false);
                    }
                }

            });

        }
    })
}


userVIP.checkVIPNormal = function(user_VIP,authority){
    var checkResult =  false;
            editVIPData.forEach(function(VIPData){
                if(user_VIP.VIP_Lvl == VIPData.VIP_Lvl){
                    switch (authority){
                        case gameEnum.VIP_Authority.BuySkillPoint:
                            if(VIPData.BuySkillPoint == 1){
                                checkResult = true;
                            }
                            else
                            {
                                checkResult = false;
                            }
                            break;
                        case gameEnum.VIP_Authority.ForeverGoblinStore:
                            if(VIPData.ForeverGoblinStore == 1){
                                checkResult = true;
                            }
                            else
                            {
                                checkResult = false;
                            }
                            break;
                        case gameEnum.VIP_Authority.TenRaid:
                            if(VIPData.TenRaid == 1){
                                checkResult = true;
                            }
                            else
                            {
                                checkResult = false;
                            }
                            break;
                        case 0:
                            checkResult = true;
                            break;
                        default :
                            checkResult = false;
                    }
                }

            });
    return checkResult;

}

userVIP.checkVIPOfTimes = function(userId,VIPAction,times,callback){
    VIPProviter.getUserVIPByUserId(userId,function(error,resultUserVIP){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            var user_VIP = resultUserVIP;
            console.log(user_VIP);
            console.log(editVIPData);
            editVIPData.forEach(function(VIPData){
                if(user_VIP.VIP_Lvl == VIPData.VIP_Lvl){
                    switch (VIPAction){
                        case gameEnum.VIPAction.BuyCoinTimes:
                            if(VIPData.BuyCoinTimes > times){
                                return callback(null,true);
                            }
                            else
                            {
                                return callback(null,false);
                            }
                            break;
                        case gameEnum.VIPAction.BuyPVETimes:
                            if(VIPData.BuyPVETimes > times){
                                return callback(null,true);
                            }
                            else
                            {
                                return callback(null,false);
                            }
                            break;
                        case gameEnum.VIPAction.BuyPVPTimes:
                            if(VIPData.BuyPVPTimes > times){
                                return callback(null,true);
                            }
                            else
                            {
                                return callback(null,false);
                            }
                            break;
                        case gameEnum.VIPAction.BuyStaminaTimes:
                            if(VIPData.BuyStaminaTimes > times){
                                return callback(null,true);
                            }
                            else
                            {
                                return callback(null,false);
                            }
                            break;
                        case gameEnum.VIPAction.ResetFarFightTimes:
                            if(VIPData.ResetFarFightTimes > times){
                                return callback(null,true);
                            }
                            else
                            {
                                return callback(null,false);
                            }
                            break;
                        case 0:
                            return callback(null,true);
                            break;
                        default :
                            return callback(null,true);
                    }
                }

            });

        }
    })
}


userVIP.getVIPData = function(userId,VIPType,callback){
    VIPProviter.getUserVIPByUserId(userId,function(error,resultUserVIP){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            if(resultUserVIP.length != 0){
                var user_VIP = resultUserVIP;
            }
            else
            {
                var user_VIP = {VIP_Lvl:0};
            }

            editVIPData.forEach(function(VIPData){
                if(user_VIP.VIP_Lvl == VIPData.VIP_Lvl){
                    switch (VIPType){
                        case gameEnum.VIPType.FarFightRewardsAdd:
                            return callback(null,VIPData.FarFightRewardsAdd);
                            break;
                        case gameEnum.VIPType.SkillPointLimit:
                                return callback(null,VIPData.SkillPointLimit);
                            break;
                        default :
                            return callback(null,false);
                    }
                }

            });

        }
    })
}
