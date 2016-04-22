/**
 * Created with JetBrains WebStorm.
 * User: Jay
 * Date: 14/10/30
 * Time: 下午3:50
 * To change this template use File | Settings | File Templates.
 */
var netDataParase = require('./netDataParase');
var serverCode = require('../ServerConfigs/code');
var expressExtend = module.exports;
var zlib =  require('zlib');
expressExtend.entendNext = function(code,data,message,next,res)
{
    var dataStr = netDataParase.netdata(code,data, message);
    var error = null;
    //console.log("code:",code);
    if(code!=serverCode.SUCCESS && code < 10000)
    {
        error = new Error(message);
        if(typeof  code == "string")
        {
            code = serverCode.UnKnowError;
        }

        error.statusCode = code;
    }
    zlib.gzip(dataStr, function(err, buffer) {
        //console.log('entendNexterr:',err,'|',dataStr,res.dealData);
        if (!err ) {
            res.dealData = buffer.toString('base64');
        }
        else
        {
            res.dealData = null;
        }
        //console.log('entendNextdealData:',res.dealData);
        next(error);
    });
};

expressExtend.entendNextNogzip = function(code,data,message,next,res)
{
    var dataStr = netDataParase.netdata(code,data, message);
    var error = null;
    console.log("code:",dataStr);
    if(code!=serverCode.SUCCESS && code < 10000)
    {
        error = new Error(message);
        if(typeof  code == "string")
        {
            code = serverCode.UnKnowError;
        }

        error.statusCode = code;
    }
    res.dealData = dataStr;
    //zlib.gzip(dataStr, function(err, buffer) {
    //    //console.log('entendNexterr:',err,'|',dataStr,res.dealData);
    //    if (!err ) {
    //        res.dealData = buffer.toString('base64');
    //    }
    //    else
    //    {
    //        res.dealData = null;
    //    }
        //console.log('entendNextdealData:',res.dealData);
        next(error);
    //});
};