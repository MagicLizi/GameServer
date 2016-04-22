/**
 * Created by peihengyang on 15/7/20.
 */

var date = require('../../util/date');
var loggerBIProvidor = require('../../data_provider/dao_provider/BI/LoggerBI');
var body = {
    title : '数据统计',
    message : null
};
var loggerBI = module.exports;
loggerBI.index = function(req, res){
    body.message = null;
    var route = 'BI/index';
    loggerBIProvidor.getAll(function(error, resultsRank){
        if(error!=null){
            console.log(error);
            res.render(route, body);
        }
        else {
            body.results = resultsRank;
            console.log("results");
            console.log(resultsRank);
            res.render(route, body);
        }
    })
};



loggerBI.add = function(req, res){
    body.message = null;
    var route = 'BI/add';
    var method = req.method;
    var BIModel ;
    console.log(method);
    var results = {};
    if(method === 'POST'){
        BIModel = createBIModel(req.body);
        loggerBIProvidor.add(BIModel,function(error, resultsAddBI){
            if(error!=null){
                console.log(error);
                body.message = error;
                res.render(route,body);
            }
            else
            {
                results.BIModel = BIModel;
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
};


loggerBI.edit = function(req, res){
    body.message = null;
    var route = 'BI/edit';
    var method = req.method;
    var BI_Id = req.query.id;
    var BIModel ;
    var results = {};
    loggerBIProvidor.getBIById(BI_Id,function(error,resultsBIList){
        if(error!=null){
            console.log("getBIById:",error);
            callback(error,null);
        }
        else
        {
            if(method === 'POST'){
                BIModel = createBIModel(req.body);
                BIModel.BI_Id = BI_Id;
                loggerBIProvidor.UpdateBIList(BIModel,function(error, resultsBIList){
                    if(error!=null){
                        console.log(error);
                        body.message = error;
                        res.render(route,body);
                    }
                    else
                    {
                        results = BIModel;
                        body.results = results;
                        body.message = '更新成功';
                        //console.log("results");
                        //console.log(results);
                        res.render(route, body);
                    }
                });
            }
            else
            {
                body.results = createBIModel(resultsBIList[0]);
                //console.log("results");
                //console.log(results);
                res.render(route, body);
            }
        }
    })


};


loggerBI.run = function(req, res){
    body.message = null;
    var route = 'BI/run';
    var method = req.method;
    var BI_Id = req.query.id;
    if(BI_Id == null){
        BI_Id = req.body.BI_Id;
    }
    var BIModel ;
    var results = {};
    loggerBIProvidor.getBIById(BI_Id,function(error,resultsBIList){
        if(error!=null){
            console.log("getBIById:",error);
            callback(error,null);
        }
        else
        {
            BIModel = createBIModel(resultsBIList[0]);
            BIModel.BI_Id = BI_Id;
            if(method === 'POST'){
                var results = {};
                var bodyJson =  req.body;
                var paramList = [];
                console.log("post",bodyJson);
                for(var x in bodyJson){
                    paramList.push(eval('bodyJson.'+x));
                }
                var BIScript = {
                    BI_Script:req.body.BI_Script,
                    ParamList:paramList
                }
                loggerBIProvidor.RunBIScript(BIScript,function(error, resultsBI){
                    if(error!=null){
                        console.log(error);
                        body.message = error;
                        res.render(route,body);
                    }
                    else
                    {
                        var titles = [];
                        if(resultsBI[0] != undefined){
                            console.log('resultsBI[0]:',resultsBI[0]);
                            for(var x in resultsBI[0]){
                                titles.push(x);
                            }
                            titles.length = titles.length-2;
                        }
                        results.BItitles = titles;
                        results.BIData = resultsBI;
                        results.BIList = BIModel;
                        body.results = results;
                        body.message = '更新成功';

                        console.log("body.results POST",body.results);
                        res.render(route, body);
                    }
                });
            }
            else
            {

                body.results.BItitles = null;
                body.results.BIData = null;
                body.results.BIList = BIModel;
                console.log("body.results.BIList",body.results.BIList);
                res.render(route, body);
            }
        }
    })
};


loggerBI.subParam = function(req, res){
    body.message = null;
    var route = 'BI/BIResult';
    var BIModel ;
    var results = {};
    var bodyJson =  req.body;
    var paramList = [];
    for(var x in bodyJson){
        paramList.push(eval('bodyJson.'+x));
    }
    BIModel = {
        BI_Script:req.body.BI_Script,
        ParamList:paramList
    }
    loggerBIProvidor.RunBIScript(BIModel,function(error, resultsBI){
        if(error!=null){
            console.log(error);
            body.message = error;
            res.render(route,body);
        }
        else
        {
            var titles = [];
            for(var x in resultsBI[0]){
                titles.push(x);
            }
            results.titles = titles;
            results.BIData = resultsBI;
            body.results = results;
            body.message = '更新成功';
            res.render(route, body);
        }
    });
};

var createBIModel =  function(model){
    console.log(model);
    return {
        BI_Name:model.BI_Name,
        BI_Script:model.BI_Script,
        BI_ParamList:model.BI_ParamList,
        Enable:model.Enable,
        Create_Date:new Date()
    }
}