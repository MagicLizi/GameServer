/**
 * Created by steve on 15/12/1.
 */
var code = require('../../Game/code');
var gameEnum = require('../../Game/enum');
var order_Provider = require('../dao_provider/order');
var gameStoreDomain = require('../../Game/domain/domain_Game/gameStore');
var userProviderData = require('../../Login/dao_provider/dao_account/user');
var userProvider = new userProviderData();
var order = module.exports;

order.addOrder = function(reqbody,source,callback){
    var orderModel = reqbody;
    orderModel.deliver_Status = 1;
    orderModel.Create_Date = new Date();
    if(source == gameEnum.SourceType.XiaoMi){
        if(orderModel.orderStatus == 'TRADE_SUCCESS'){
            order_Provider.getXiaoMiOrderByOrderId(orderModel.orderId,function(error,resultXiaoMiOrder){
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    if(resultXiaoMiOrder.length == 0){
                        order_Provider.addXiaoMiOrder(orderModel,function(error,resultAddOrder){
                            if(error!=null){
                                console.log(error);
                                callback(error,null);
                            }
                            else
                            {
                                userProvider.getTxUserInfoByOpenKey(orderModel.uid,function(error,resultThirdUser){
                                    if(error!=null){
                                        console.log(error);
                                        callback(error,null);
                                    }
                                    else
                                    {
                                        gameStoreDomain.buyDiamond(resultThirdUser[0].Membership_Id,resultThirdUser[0].Source,
                                            orderModel.cpUserInfo,function(error,resultBuyDiamond){
                                                if(error!=null){
                                                    console.log(error);
                                                    callback(error,null);
                                                }
                                                else
                                                {
                                                    order_Provider.updateXiaoMiOrderStatus(resultAddOrder[0].Log_Id,2,function(error,resultUpdateOrder){
                                                        if(error!=null){
                                                            console.log(error);
                                                            callback(error,null);
                                                        }
                                                        else
                                                        {
                                                            callback(null,resultUpdateOrder);
                                                        }
                                                    })
                                                }
                                            })
                                    }
                                })
                            }
                        })
                    }
                    else if (resultXiaoMiOrder[0].deliver_Status ==  1){
                        userProvider.getTxUserInfoByOpenKey(orderModel.uid,function(error,resultThirdUser){
                            if(error!=null){
                                console.log(error);
                                callback(error,null);
                            }
                            else
                            {
                                gameStoreDomain.buyDiamond(resultThirdUser[0].Membership_Id,resultThirdUser[0].Source,
                                    orderModel.cpUserInfo,function(error,resultBuyDiamond){
                                        if(error!=null){
                                            console.log(error);
                                            callback(error,null);
                                        }
                                        else
                                        {
                                            order_Provider.updateXiaoMiOrderStatus(resultAddOrder[0].Log_Id,2,function(error,resultUpdateOrder){
                                                if(error!=null){
                                                    console.log(error);
                                                    callback(error,null);
                                                }
                                                else
                                                {
                                                    callback(null,resultUpdateOrder);
                                                }
                                            })
                                        }
                                    })
                            }
                        })
                    }
                    else
                    {
                        callback(code.ThirdPart.Order_Is_Delivered_XiaoMi,null);
                    }
                }
            })
        }
        else
        {
            callback(code.ThirdPart.XiaoMi_Trade_Error)
        }

    }
    else if(source == gameEnum.SourceType.SanLiuLing){
        order_Provider.get360OrderByOrderId(orderModel.order_id,function(error,result360Order){
            if(error!=null){
                console.log(error);
                callback(error,null);
            }
            else
            {
                if(result360Order.length == 0){
                    console.log('360',orderModel);
                    order_Provider.add360Order(orderModel,function(error,resultAddOrder){
                        if(error!=null){
                            console.log(error);
                            callback(error,null);
                        }
                        else
                        {
                            userProvider.getTxUserInfoByOpenKey(orderModel.user_id,function(error,resultThirdUser){
                                if(error!=null){
                                    console.log(error);
                                    callback(error,null);
                                }
                                else
                                {
                                    gameStoreDomain.buyDiamond(resultThirdUser[0].Membership_Id,resultThirdUser[0].Source,
                                        orderModel.product_id,function(error,resultBuyDiamond){
                                            if(error!=null){
                                                console.log(error);
                                                callback(error,null);
                                            }
                                            else
                                            {
                                                order_Provider.update360OrderStatus(resultAddOrder[0].Log_Id,2,function(error,resultUpdateOrder){
                                                    if(error!=null){
                                                        console.log(error);
                                                        callback(error,null);
                                                    }
                                                    else
                                                    {
                                                        callback(null,resultUpdateOrder);
                                                    }
                                                })
                                            }
                                        })
                                }
                            })
                        }
                    })
                }
                else if(result360Order[0].deliver_Status == 1){
                    userProvider.getTxUserInfoByOpenKey(orderModel.user_id,function(error,resultThirdUser){
                        if(error!=null){
                            console.log(error);
                            callback(error,null);
                        }
                        else
                        {
                            gameStoreDomain.buyDiamond(resultThirdUser[0].Membership_Id,resultThirdUser[0].Source,
                                orderModel.productCount,function(error,resultBuyDiamond){
                                    if(error!=null){
                                        console.log(error);
                                        callback(error,null);
                                    }
                                    else
                                    {
                                        order_Provider.update360OrderStatus(resultAddOrder[0].Log_Id,2,function(error,resultUpdateOrder){
                                            if(error!=null){
                                                console.log(error);
                                                callback(error,null);
                                            }
                                            else
                                            {
                                                callback(null,resultUpdateOrder);
                                            }
                                        })
                                    }
                                })
                        }
                    })
                }
                else
                {
                    callback(code.ThirdPart.Order_Is_Delivered_360,null);
                }
            }
        })

    }
    else if(source == gameEnum.SourceType.HuaWei){
        if(orderModel.orderId != null){
            order_Provider.getHuaWeiOrderByOrderId(orderModel.orderId,function(error,resultHuaWeiOrder){
                if(error!=null){
                    console.log(error);
                    callback(error,null);
                }
                else
                {
                    var extArray = orderModel.extReserved.split(',');
                    if(resultHuaWeiOrder.length == 0){
                        console.log('HuaWei',orderModel);
                        order_Provider.addHuaWeiOrder(orderModel,function(error,resultAddOrder){
                            if(error!=null){
                                console.log(error);
                                callback(error,null);
                            }
                            else
                            {
                                //userProvider.getTxUserInfoByOpenKey(orderModel.userName,function(error,resultThirdUser){
                                //    if(error!=null){
                                //        console.log(error);
                                //        callback(error,null);
                                //    }
                                //    else
                                //    {
                                        gameStoreDomain.buyDiamond(extArray[0],source,extArray[1],
                                            function(error,resultBuyDiamond){
                                                if(error!=null){
                                                    console.log(error);
                                                    callback(error,null);
                                                }
                                                else
                                                {
                                                    order_Provider.updateHuaWeiOrderStatus(resultAddOrder[0].Log_Id,2,function(error,resultUpdateOrder){
                                                        if(error!=null){
                                                            console.log(error);
                                                            callback(error,null);
                                                        }
                                                        else
                                                        {
                                                            callback(null,resultUpdateOrder);
                                                        }
                                                    })
                                                }
                                            })
                                //    }
                                //})
                            }
                        })
                    }
                    else if(resultHuaWeiOrder[0].deliver_Status == 1){
                        //userProvider.getTxUserInfoByOpenKey(orderModel.userName,function(error,resultThirdUser){
                        //    if(error!=null){
                        //        console.log(error);
                        //        callback(error,null);
                        //    }
                        //    else
                        //    {
                                gameStoreDomain.buyDiamond(extArray[0],source,extArray[1],
                                    function(error,resultBuyDiamond){
                                        if(error!=null){
                                            console.log(error);
                                            callback(error,null);
                                        }
                                        else
                                        {
                                            order_Provider.updateHuaWeiOrderStatus(resultHuaWeiOrder[0].Log_Id,2,function(error,resultUpdateOrder){
                                                if(error!=null){
                                                    console.log(error);
                                                    callback(error,null);
                                                }
                                                else
                                                {
                                                    callback(null,resultUpdateOrder);
                                                }
                                            })
                                        }
                                    })
                        //    }
                        //})
                    }
                    else
                    {
                        callback(code.ThirdPart.Order_Is_Delivered_360,null);
                    }
                }
            })
        }
        else{
            callback(code.ThirdPart.HuaWei_Trade_Error,null);
        }
    }
}