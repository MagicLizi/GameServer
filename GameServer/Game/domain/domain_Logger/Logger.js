/**
 * Created by peihengyang on 15/7/14.
 */
//var code = require('../../Game/code');
var gameEnum = require('../../../Game/enum');
var requestProvider = require('../../dao_provider/dao_Logger/Logger');
var domain =  require('domain');
var zlib =  require('zlib');
var Logger = module.exports;

Logger.ResquestStart =  function(req){
    var d = domain.create();
    //console.log("headers:",req.headers);
    d.on('error',function(err){
        console.log(err);

    });
    //d.run(function(){
        var RequestModel = CreateRequestModel(req,null);
        requestProvider.addRequest(RequestModel,function(error,resultAddReq){
            if(error!=null){
                console.log('addRequest:',error);
                //callback(error,null);
            }
            else
            {
                //console.log("createParamListStart");
                var params;
                if(req.body){
                    params = CreateParamList(JSON.stringify(req.body),resultAddReq.insertId,gameEnum.paramType.Request);
                }
                else
                {
                    params = CreateParamList(JSON.stringify(req.query),resultAddReq.insertId,gameEnum.paramType.Request);
                }

                var headerParams = CreateHearderList(req.headers,resultAddReq.insertId,gameEnum.paramType.ReqHeader);
                params = params.concat(headerParams);
                //console.log("params:",params);
                requestProvider.addParams(params,function(error,resultAddParam){
                    if(error!=null){
                        console.log("addParamsStart:",error);
                        //callback(error,null);
                    }
                    else
                    {
                        //callback(null,resultAddParam);
                    }
                })
            }
        })
    //});

}
Logger.ResquestEnd =  function(req,res){
    var d = domain.create();
    if(res.dealData){
        //console.log("headers:",req.headers);
        d.on('error',function(err){
            console.log(err);
        });
        d.run(function(){
            var newbuffer = new Buffer(res.dealData,'base64');
            zlib.gunzip(newbuffer,function(err,buffer){
                //console.log(err);
                if(!err){
                    res.dealData = buffer.toString();
                }
                else
                {
                    res.dealData = null;
                }
                //console.log('res.dealData:',res.dealData,'|');
                var RequestModel = CreateRequestModel(req,res);
                requestProvider.addRequest(RequestModel,function(error,resultAddReq){
                    if(error!=null){
                        console.log(error);
                        //callback(error,null);
                    }
                    else {
                        var params = CreateParamList(res.dealData,resultAddReq.insertId,gameEnum.paramType.Response);
                        //console.log('ddd',params);
                        requestProvider.addParams(params,function(error,resultAddParam){
                            if(error!=null){
                                console.log("addParamsEnd:",error);
                                //callback(error,null);
                            }
                            else
                            {
                                //callback(null,resultAddParam);
                            }
                        })
                    }
                })
            })

        })
    }

}

var CreateRequestModel = function(req,res){
    var Url = req.originalUrl.toString().split('/');
    var RequestModel = {
        Route:Url[1],
        Method:Url[2],
        Request:req,
        Response:res !=null ? JSON.stringify(res.dealData):'',
        Create_Date:new Date(),
        Response_Date:res != null ? new Date():'1970-01-01',
        Memo:'',
        Headers:req.headers
    }
    return RequestModel;
}

var CreateParamList =  function(reqBody,request_Id,request_Type){
    var bodyJsons = JSON.parse(reqBody);
    var paramList = [];
    for(var x in bodyJsons){

        //console.log('bbb:',x,":",JSON.stringify(eval('bodyJsons.'+x).toString().replace(/\"/g, "")));
        paramList.push({
            Parameter_Name:x,
            Parameter_Value:JSON.stringify(eval('bodyJsons.'+x).toString().replace(/\"/g, "")),
            Parameter_Type:request_Type,
            Request_Log_Id:request_Id,
            Create_Date:new Date()
        })
    }
    //console.log('ccc:',paramList);
    return paramList;
}

var CreateHearderList = function(reqHeader,request_Id,request_Type){
    var hearderList = [];
    hearderList.push({
        Parameter_Name:'cre',
        Parameter_Value:reqHeader.cre,
        Parameter_Type:request_Type,
        Request_Log_Id:request_Id,
        Create_Date:new Date()
    });
    hearderList.push({
        Parameter_Name:'userid',
        Parameter_Value:reqHeader.userid,
        Parameter_Type:request_Type,
        Request_Log_Id:request_Id,
        Create_Date:new Date()
    });
    return hearderList;
}
