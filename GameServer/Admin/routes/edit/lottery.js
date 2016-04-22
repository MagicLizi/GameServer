/**
 * Created by peihengyang on 15/1/4.
 */
var lotteryEditProvider =  require('../../data_provider/dao_provider/edit/lottery');
var itemEditProvider = require('../../data_provider/dao_provider/edit/item');
var goodsEditProvider = require('../../data_provider/dao_provider/edit/store');
var dataProvider = require('../../data_provider/dao_provider/system/config');
var enums = require('../../data_provider/dao_provider/edit/enums');
var body = {
    title : '抽奖',
    message : null
};

var lottery =  module.exports;

lottery.index = function(req, res){
    body.message = null;
    var route = 'edit/lottery/index';
    lotteryEditProvider.getAll(function(error, results){
        if(results.length ==0 ){
            body.results=[];
        }
        else
        {
            body.results = results.LotteryPool;
        }
        res.render(route, body);
    });
};

lottery.add = function(req,res){
    body.message =  null;
    var method = req.method;
    var route = 'edit/lottery/add';
    if(method === 'POST'){
        var lotteryModel = createLotteryModel(req);
        lotteryModel.Create_Date =  new Date();
        lotteryEditProvider.add(lotteryModel,function(error,result){
            if(error!=null){
                console.log(error);
                body.message = '添加奖池失败';
                res.render(route,body);
            }
            else
            {
                body.message = '添加奖池成功';
                res.render(route,body);
            }
        });
    }
    else
    {
            res.render(route, body);
    }
}


lottery.addPoolItem = function(req,res){
    body.message =  null;
    var method = req.method;
    var route = 'edit/lottery/pool_Item/add';
    var pool_Id =  req.query.id;
    var pool_Type =  req.query.Pool_Type;
    getPoolItem(pool_Type,function(error,results){
        console.log(results);
        body.results.items = results;
        //if(error!=null){
        //    console.log(error);
        //    body.message = "获取道具失败";
        //    body.results.items=[];
        //}
        //else
        //{
        //    body.message = "获取道具成功";
        //    body.results.items = results.Item;
        //}
        body.results.Pool_Type =  pool_Type;
        if(method === 'POST'){
            var poolItemModel = createPoolItemModel(req);
            poolItemModel.Create_Date =  new Date();
            poolItemModel.Pool_Id = pool_Id;
            poolItemModel.Pool_Type =  pool_Type;
            lotteryEditProvider.addPoolItem(poolItemModel,function(error,result){
                if(error!=null){
                    console.log(error);
                    body.message = '添加奖池道具失败';
                }
                else
                {
                    body.message = '添加奖池道具成功';

                }
                body.results.Pool_Id = pool_Id;

                res.render(route,body);
            });
        }
        else
        {
            res.render(route, body);

        }
    });

}

var getPoolItem =  function(pool_Type,callback){
    var resultItems;
    if(pool_Type == 1){
        itemEditProvider.getAll(function(error,results){
            if(error!=null){
                console.log(error);
                resultItems=[];
            }
            else
            {
                resultItems = results.Item;
            }
            callback(null,resultItems);
        })
    }
    else
    {
        goodsEditProvider.getAllGoods(function(error,results){
            if(error!=null){
                console.log(error);
                resultItems = [];

            }
            else
            {
                results.forEach(function(item,index){
                    results[index].Item_Id = item.Goods_Id;
                })
                resultItems = results;
                console.log(resultItems);

            }
            callback(null,results);
        })
    }
}

lottery.addLotteryMethod = function(req,res){
    body.message =  null;
    var method = req.method;
    var route = 'edit/lottery/lottery_Method/add';
    lotteryEditProvider.getAll(function(error,results){
        body.results.lotteryMethods = lotteryMethods;
        if(error!=null){
            console.log(error);
            body.message = "获取奖池失败";
            body.results.pools=[];
        }
        else
        {
            body.message = "获取奖池成功";
            body.results.pools = results.LotteryPool;
        }
        if(method === 'POST'){
            var lotteryMechodModel = createLotteryMethodModel(req);
            lotteryMechodModel.Create_Date =  new Date();
            lotteryEditProvider.addLotteryMethod(lotteryMechodModel,function(error,result){
                if(error!=null){
                    console.log(error);
                    body.message = '添加抽取方法失败';
                }
                else
                {
                    body.message = '添加抽取方法成功';

                }
                res.render(route,body);
            });
        }
        else
        {
            res.render(route, body);

        }
    });

}

lottery.edit = function(req,res){
    body.message = null;
    var method = req.method;
    var route = 'edit/lottery/edit';
    var poolId =  req.query.id;
    console.log(poolId);
    if(method === 'POST'){
        var lotteryModel =  createLotteryModel(req);
        lotteryModel.Pool_Id = poolId;
        lotteryEditProvider.updatePool(lotteryModel,function(error,results){
            if(error!=null){
                console.log(error);
                body.message = '修改奖池失败';
                //res.render(route,body);
            }
            else
            {
                body.message = '修改奖池成功';
                body.results = lotteryModel;
            }
            res.render(route,body);
        });
    }
    else
    {
        lotteryEditProvider.getPoolById(poolId,function(error,results){
            if(error!=null){
                console.log(error);
                body.message = '获取奖池失败';
            }
            else
            {
                body.message = '获取奖池成功';
                body.results = results[0];
            }
            res.render(route,body);
        });
    }
};

lottery.indexPoolItem = function(req,res){
    body.message = null;
    var route = 'edit/lottery/pool_Item/index';
    var pool_Id =  req.query.id;
    var pool_Type = req.query.Pool_Type;
    lotteryEditProvider.getPoolItemsByPoolId(pool_Id,pool_Type,function(error, results){
        if(results.length ==0 ){
            body.results=[];
        }
        else
        {
            body.results = results;
        }
        body.results.Pool_Id =  pool_Id;
        body.results.Pool_Type =  pool_Type;
        res.render(route, body);
    });
};

lottery.delPoolItem = function(req,res){
    body.message = null;
    var route = 'edit/lottery/pool_Item/index';
    var pool_Id =  req.query.Pool_Id;
    var pool_Type = req.query.Pool_Type;
    var pool_Item_Id = req.query.id;
    lotteryEditProvider.delPoolItem(pool_Item_Id,function(errordel,resultsDelPoolItem){
        lotteryEditProvider.getPoolItemsByPoolId(pool_Id,pool_Type,function(error, results){
            if(errordel!=null){
                console.log('delPoolItem:',errordel);
                //callback(error,null);
            }
            else
            {
                if(results.length ==0 ){
                    body.results=[];
                }
                else
                {
                    body.results = results;
                }
            }
            body.results.Pool_Id =  pool_Id;
            body.results.Pool_Type =  pool_Type;
            res.render(route, body);
        });
    })

};


lottery.indexLotteryMethod = function(req,res){
    body.message = null;
    var route = 'edit/lottery/lottery_Method/index';
    lotteryEditProvider.getLotteryMethod(function(error, results){
        if(results.length ==0 ){
            body.results=[];
        }
        else
        {
            body.results = results;
        }
        res.render(route, body);
    });
};

lottery.editPoolItem = function(req,res){
    body.message = null;
    var method = req.method;
    var route = 'edit/lottery/pool_Item/edit';
    var pool_Item_Id =  req.query.id;
    var pool_Type =  req.query.Pool_Type;
    getPoolItem(pool_Type,function(error,results){
        console.log(results);
        body.results.items = results;
        //if(error!=null){
        //    console.log(error);
        //    body.message = "获取道具失败";
        //    body.results.items=[];
        //}
        //else
        //{
        //    body.message = "获取道具成功";
        //    body.results.items = results.Item;
        //}
        body.results.Pool_Type =  pool_Type;
        if(method === 'POST'){
            var poolItemModel =  createPoolItemModel(req);
            poolItemModel.Pool_Item_Id = req.body.pool_Item_Id;
            lotteryEditProvider.updatePoolItem(poolItemModel,function(error,results){
                if(error!=null){
                    console.log(error);
                    body.message = '修改奖池道具失败';
                }
                else
                {
                    body.message = '修改奖池道具成功';
                    body.results.poolItems = poolItemModel;
                }
                res.render(route,body);
            });
        }
        else
        {
                lotteryEditProvider.getPoolItemById(pool_Item_Id,function(error,results){
                    console.log(results);
                    if(error!=null){
                        console.log(error);
                        body.message = '获取奖池失败';
                        body.results.poolItems =  null;
                    }
                    else
                    {
                        body.message = '获取奖池成功';
                        body.results.poolItems = results[0];
                    }
                    res.render(route,body);
                });
        }
    });

};



lottery.editLotteryMethod = function(req,res){
    body.message = null;
    var method = req.method;
    var route = 'edit/lottery/lottery_Method/edit';
    var lottery_Method_Id =  req.query.id;
    lotteryEditProvider.getAll(function(error,results) {
        body.results.lotteryMethods = lotteryMethods;
        if (error != null) {
            console.log(error);
            body.message = "获取奖池失败";
            body.results.pools = [];
        }
        else {
            body.message = "获取奖池成功";
            body.results.pools = results.LotteryPool;
        }
        if(method === 'POST'){
            var lotteryMethodModel =  createLotteryMethodModel(req);
            lotteryMethodModel.Lottery_Method_Id = lottery_Method_Id;
            lotteryEditProvider.updateLotteryMethod(lotteryMethodModel,function(error,results){
                if(error!=null){
                    console.log(error);
                    body.message = '修改抽取方法失败';
                }
                else
                {

                    body.message = '修改抽取方法成功';
                    body.results.lotteryMethod = lotteryMethodModel;
                }
                res.render(route,body);
            });
        }
        else
        {
            lotteryEditProvider.getLotteryMethodById(lottery_Method_Id,function(error,results){
                if(error!=null){
                    console.log(error);
                    body.message = '获取抽取方法失败';
                    body.results.lotteryMethod =  null;
                }
                else
                {
                    body.message = '获取抽取方法成功';
                    body.results.lotteryMethod = results[0];
                }
                res.render(route,body);
            });
        }
    });

};

lottery.indexLotterySystem =  function(req, res){
    body.message = null;
    var route = 'edit/lottery_System/index';
    lotteryEditProvider.getAll(function(error, results){
        if(results ==null || results.length ==0 ){
            body.results=[];
        }
        else
        {
            body.results = results.Lottery;
        }
        res.render(route, body);
    });
};

lottery.addLotterySystem = function(req, res){
    body.message =  null;
    var method = req.method;
    var route = 'edit/lottery_System/add';
    itemEditProvider.getItemByType(enums.Item_Type.Currency,function(error,resultCurrency){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            lotteryEditProvider.getLotteryMethod(function(error,resultLotteryMethod){
                if(error!=null){
                    console.log(error);
                    callback(error,null)
                }
                else
                {
                    var results = {
                        ResultCurrency:resultCurrency,
                        ResultLotteryMethod:resultLotteryMethod
                    };
                    if(method === 'POST'){
                        var lotterySystemModel = createLotterySystemModel(req);
                        lotterySystemModel.Create_Date =  new Date();
                        lotteryEditProvider.addLotterySystem(lotterySystemModel,function(error,result){
                            if(error!=null){
                                console.log(error);
                                body.message = '添加抽奖失败';
                                res.render(route,body);
                            }
                            else
                            {
                                dataProvider.getConfig('global',function(error,resultGlobal){
                                    if(error!=null){
                                        console.log(error);
                                        callback(error,null);
                                    }
                                    else
                                    {
                                        lotteryEditProvider.getLotterySystemGroup(function(error,resultsLotterySystems){
                                            if(error!=null){
                                                console.log(error);
                                                callback(error,null);
                                            }
                                            else
                                            {
                                                console.log(resultGlobal);
                                                var globalData = JSON.parse(resultGlobal.config);
                                                globalData.data.Lotterys = resultsLotterySystems;
                                                resultGlobal.config = JSON.stringify(globalData);
                                                dataProvider.editConfig(resultGlobal,function(error,result){
                                                    if(error!=null){
                                                        console.log(error);
                                                        callback(error,null);
                                                    }
                                                    else
                                                    {
                                                        body.message = '添加抽奖成功'
                                                        body.results = results;
                                                        res.render(route,body);
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
                        body.results = results;
                        res.render(route, body);
                    }
                }
            });
        }
    });

};

lottery.editLotterySystem =  function(req, res){
    body.message = null;
    var method = req.method;
    var route = 'edit/lottery_System/edit';
    var lottery_Id =  req.query.id;
    itemEditProvider.getItemByType(enums.Item_Type.Currency,function(error,resultCurrency){
        if(error!=null){
            console.log(error);
            callback(error,null);
        }
        else
        {
            lotteryEditProvider.getLotteryMethod(function(error,resultLotteryMethod){
                if(error!=null){
                    console.log(error);
                    callback(error,null)
                }
                else
                {
                    lotteryEditProvider.getLotterySystemById(lottery_Id,function(error,resultLotterySystem){
                        if(error!=null){
                            console.log(error);
                            callback(error,null);
                        }
                        else
                        {
                            var results = {
                                ResultCurrency:resultCurrency,
                                ResultLotteryMethod:resultLotteryMethod,
                                ResultLotterySystem:resultLotterySystem[0]
                            };
                            if(method === 'POST'){
                                var lotterySystemModel = createLotterySystemModel(req);
                                lotterySystemModel.Lottery_Id =  lottery_Id;
                                body.results =  results;
                                body.results.ResultLotterySystem = lotterySystemModel;
                                lotteryEditProvider.updateLotterySystem(lotterySystemModel,function(error,result){
                                    if(error!=null){
                                        console.log(error);
                                        body.message = '更新抽奖失败';
                                        res.render(route,body);
                                    }
                                    else
                                    {
                                        dataProvider.getConfig('global',function(error,resultGlobal){
                                            if(error!=null){
                                                console.log(error);
                                                callback(error,null);
                                            }
                                            else
                                            {
                                                lotteryEditProvider.getLotterySystemGroup(function(error,resultsLotterySystems){
                                                    if(error!=null){
                                                        console.log(error);
                                                        callback(error,null);
                                                    }
                                                    else
                                                    {
                                                        console.log(resultGlobal);
                                                        var globalData = JSON.parse(resultGlobal.config);
                                                        globalData.data.Lotterys = resultsLotterySystems;
                                                        resultGlobal.config = JSON.stringify(globalData);
                                                        dataProvider.editConfig(resultGlobal,function(error,result){
                                                            if(error!=null){
                                                                console.log(error);
                                                                callback(error,null);
                                                            }
                                                            else
                                                            {
                                                                body.message = '更新抽奖成功'
                                                                //body.results = results;
                                                                res.render(route,body);
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
                                body.results = results;
                                res.render(route, body);
                            }
                        }
                    })

                }
            });
        }
    });

};
var createLotteryModel =  function(req){
    var lotteryModel = {
        Pool_Id :0,
        Pool_Name:'',
        Create_Date:'',
        Is_Display:0,
        Pool_Type:1,
        Pool_Description:''
    }
    lotteryModel.Pool_Name =  req.body.pool_Name;
    lotteryModel.Pool_Description =  req.body.description;
    lotteryModel.Is_Display = req.body.is_Display;
    lotteryModel.Pool_Type = req.body.Pool_Type;
    return lotteryModel;
}

var createLotterySystemModel =  function(req){
    var lotterySystemModel = {
        Lottery_Id :0,
        Lottery_Name:'',
        Free_Times:0,
        Free_Interval:0,
        Is_First:0,
        Max_Level:0,
        Min_Level:0,
        Type_Of_Expense:0,
        Expense_Amount:0,
        Lottery_Method_Id:0,
        Method_Id:0,
        Lottery_Description:''
    };
    var methodArr =  req.body.Lottery_Method_Id.split(',');
    lotterySystemModel.Lottery_Name = req.body.Lottery_Name;
    lotterySystemModel.Free_Times = req.body.Free_Times;
    lotterySystemModel.Free_Interval = req.body.Free_Interval;
    lotterySystemModel.Is_First = req.body.Is_First;
    lotterySystemModel.Max_Level = req.body.Max_Level;
    lotterySystemModel.Min_Level = req.body.Min_Level;
    lotterySystemModel.Type_Of_Expense = req.body.Type_Of_Expense;
    lotterySystemModel.Expense_Amount = req.body.Expense_Amount;
    lotterySystemModel.Lottery_Method_Id = methodArr[0];
    lotterySystemModel.Method_Id = methodArr[1];
    lotterySystemModel.Lottery_Description = req.body.Lottery_Description;
    return lotterySystemModel;
}

var createPoolItemModel = function(req){
    var poolItemModel = {
        Pool_Item_Id:0,
        Pool_Quality:0,
        Item_Id:0,
        Item_Ids:"",
        Item_Amount:0,
        Pool_Id:0,
        Description:'',
        Create_Date:''
    };
    poolItemModel.Pool_Quality=req.body.pool_Quality;
    poolItemModel.Item_Id = req.body.item_Id;
    poolItemModel.Item_Ids =  req.body.item_Ids;
    poolItemModel.Item_Amount =  req.body.item_Amount;
    poolItemModel.Pool_Id =  req.body.pool_Id;
    poolItemModel.Description = req.body.description;
    return poolItemModel;
}

var createLotteryMethodModel = function(req){
    console.log(req.body);
    var lotteryMethod = {
        Lottery_Method_Id:0,
        Method_Name:'',
        Method_Tag:'',
        Method_Id:0,
        Pool_Id:0,
        Pool_Name:'',
        Lottery_Times:0,
        Quality1_Probability:0,
        Quality2_Probability:0,
        Quality3_Probability:0,
        Quality4_Probability:0,
        Quality5_Probability:0,
        Quality6_Probability:0,
        Quality7_Probability:0,
        Quality8_Probability:0,
        Quality9_Probability:0,
        Quality10_Probability:0,
        Create_Date:''
    };
    lotteryMethods.forEach(function(item){
        if(item.id == req.body.method_Id){
            lotteryMethod.Method_Name = item.name;
        }
    })
    lotteryMethod.Pool_Id = req.body.pool_Id;
    lotteryMethod.Pool_Name = req.body.pool_Name;
    lotteryMethod.Method_Id =  req.body.method_Id;
    lotteryMethod.Method_Tag = req.body.method_Tag;
    lotteryMethod.Lottery_Times = req.body.lottery_Times;
    lotteryMethod.Quality1_Probability = req.body.quality1_Probability;
    lotteryMethod.Quality2_Probability = req.body.quality2_Probability;
    lotteryMethod.Quality3_Probability = req.body.quality3_Probability;
    lotteryMethod.Quality4_Probability = req.body.quality4_Probability;
    lotteryMethod.Quality5_Probability = req.body.quality5_Probability;
    lotteryMethod.Quality6_Probability = req.body.quality6_Probability;
    lotteryMethod.Quality7_Probability = req.body.quality7_Probability;
    lotteryMethod.Quality8_Probability = req.body.quality8_Probability;
    lotteryMethod.Quality9_Probability = req.body.quality9_Probability;
    lotteryMethod.Quality10_Probability = req.body.quality10_Probability;

    return lotteryMethod;
}


var lotteryMethods = [
    {
        id:1,
        name:'PVE'
    },
    {
        id:2,
        name:'金币单抽'
    },
    {
        id:3,
        name:'金币十连抽'
    },
    {
        id:4,
        name:'钻石单抽'
    },
    {
        id:5,
        name:'钻石十连抽'
    }
]