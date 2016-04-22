/**
 * Created by peihengyang on 15/3/9.
 */
var date = require('../../util/date');
var storeEditProvider = require('../../data_provider/dao_provider/edit/store');
var itemEditProvider = require('../../data_provider/dao_provider/edit/item');
var lotteryEditProvider = require('../../data_provider/dao_provider/edit/lottery');
var editEnum =  require('../../data_provider/dao_provider/edit/enums');
var body = {
    title : '商店',
    message : null
};


exports.indexGoods = function(req, res){
    body.message = null;
    storeEditProvider.getAllGoods(function(error, results){
        body.results = results;
        console.log("results");
        console.log(results);
        res.render('edit/Store/Goods/index', body);
    });
};

exports.indexStore = function(req, res){
    body.message = null;
    storeEditProvider.getAllStore(function(error, results){
        body.results = results;
        console.log("results");
        console.log(results);
        res.render('edit/Store/index', body);
    });
};

exports.addStore = function(req, res){
    body.message = null;
    var method = req.method;
    console.log(method);
    var route = 'edit/Store/add';
    var results = {};
    itemEditProvider.getItemByType(editEnum.Item_Type.Currency,function(error,resultsCurrency){
        if(error!=null){
            console.log(error);
            body.message = error;
            res.render(route,body);
        }
        else
        {
            results.resultsCurrency = resultsCurrency;
            if(method === 'POST'){

                var storeModel = createStoreModel(req);
                storeModel.Create_Date = new Date();
                storeEditProvider.addStore(storeModel,function(error, resultsAddStore){
                    if(error!=null){
                        console.log(error);
                        body.message = error;
                        res.render(route,body);
                    }
                    else
                    {
                        body.results = results;
                        //console.log("results");
                        //console.log(results);
                        res.render(route, body);
                    }
                });
            }
            else
            {
                body.results = results;
                //console.log("results");
                //console.log(results);
                res.render(route, body);
            }
        }
    })


};


exports.editStore =  function(req,res){
    body.message = null;
    var method = req.method;
    var route = 'edit/Store/edit';
    var Store_Id = req.query.id;
    var results = {};
    itemEditProvider.getItemByType(editEnum.Item_Type.Currency,function(error,resultsCurrency){
        if(error){
            res.redirect('Store');
        }
        else {
            storeEditProvider.getStoreById(Store_Id,function(error,resultsStore){
                if(error!=null){
                    body.Message = 'getStore Error';
                    res.redirect('Store');
                }
                else
                {
                    lotteryEditProvider.getLotteryMethod(function(error,lotteryRestuls) {
                        if (error != null) {
                            console.log(error);
                            callback(error, null);
                        }
                        else {
                            results.resultsCurrency = resultsCurrency;
                            results.lotteryMethods = lotteryRestuls;

                            if (method === 'POST') {
                                var model = createStoreModel(req);
                                model.Store_Id = Store_Id;
                                storeEditProvider.updateStore(model, function (error, resultUpdateStore) {
                                    results.resultsStore = model;
                                    body.result = results;
                                    res.render(route, body);
                                });
                            }
                            else {
                                results.resultsStore = resultsStore;
                                body.result = results;
                                res.render(route, body);
                            }
                        }
                    });
                }
            })

        }

    });

};




exports.addGoods = function(req, res){
    body.message = null;
    var method = req.method;
    var route = 'edit/Store/Goods/add';
    storeEditProvider.getAllStore(function(error, resultsStore){
        if(error!=null){
            console.log(error);
            body.message = error;
            res.render(route,body);
        }
        else
        {
            itemEditProvider.getAll(function(error,resultsItems){
                if(error!=null){
                    console.log(error);
                    body.message = error;
                    res.render(route,body);
                }
                else
                {
                    body.results = {
                        resultsStore:resultsStore,
                        resultsItems:resultsItems
                    };
                    if(method === 'POST'){
                        var model = createGoodsModel(req);
                        model.Create_Date = new Date();
                        storeEditProvider.addGoods(model,function(error,resultAddGoods){
                            if(error!=null){
                                console.log(error);
                                body.message = error;
                                res.render(route,body);
                            }
                            else
                            {
                                res.render(route, body);
                            }
                        })
                    }
                    else
                    {
                        res.render(route, body);
                    }

                }
            });
        }
    });
};


exports.editGoods =  function(req,res){
    body.message = null;
    var method = req.method;
    var route = 'edit/Store/Goods/edit';
    var Goods_Id = req.query.id;
    var results = {};
    storeEditProvider.getAllStore(function(error, resultsStore){
        if(error!=null){
            console.log(error);
            body.message = error;
            res.render(route,body);
        }
        else
        {
            itemEditProvider.getAll(function(error,resultsItems){
                if(error!=null){
                    console.log(error);
                    body.message = error;
                    res.render(route,body);
                }
                else
                {
                    body.results = {
                        resultsStore:resultsStore,
                        resultsItems:resultsItems
                    };
                    storeEditProvider.getGoodsById(Goods_Id,function(error,resultGoods){
                        if(error!=null) {
                            console.log(error);
                            body.message = error;
                            res.render(route, body);
                        }
                        else
                        {
                            body.results.resultsGoods = resultGoods;
                            if(method === 'POST'){
                                var model = createGoodsModel(req);
                                model.Goods_Id = Goods_Id;
                                model.Create_Date = new Date();
                                body.results.resultsGoods = model;
                                storeEditProvider.updateGoods(model,function(error,resultUpdateGoods){
                                    if(error!=null){
                                        console.log(error);
                                        body.message = error;
                                        res.render(route,body);
                                    }
                                    else
                                    {
                                        console.log('body.results:',body.results.resultsGoods.End_Date);
                                        res.render(route, body);
                                    }
                                })
                            }
                            else
                            {
                                console.log('body.results:',body.results.resultsGoods.End_Date);
                                res.render(route, body);
                            }
                        }
                    })
                }
            });
        }
    });
};



var createStoreModel = function (req){
    var StoreModel = {
        Store_Id:0,
        Store_Name:req.body.Store_Name,
        Currency_Id:req.body.Currency_Id,
        Enable:req.body.Enable,
        Description:req.body.Description,
        Pool_Id:req.body.Pool_Id,
        Create_Date:'',
        Refresh_Time:req.body.Refresh_Time,
        Refresh_Expend:req.body.Refresh_Expend,
        Appear_Pre:req.body.Appear_Pre
    };
    return StoreModel;
};

var createGoodsModel =  function(req){
    var GoodsModel = {
        Goods_Id:0,
        Item_Id:req.body.Item_Id,
        Item_Amount:req.body.Item_Amount,
        Price : req.body.Price,
        Store_Id:req.body.Store_Id,
        Create_Date:'1970-01-01 00:00:00',
        Enable:req.body.Enable,
        Goods_Order:req.body.Goods_Order,
        Icon_Url:req.body.Icon_Url,
        Start_Date:new Date(req.body.Start_Date),
        End_Date:new Date(req.body.End_Date),
        First_Bonus:req.body.First_Bonus,
        Task_Order:req.body.Task_Order
    }
    return GoodsModel;
}