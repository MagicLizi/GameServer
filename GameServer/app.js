var express = require('express');
var compression = require('compression');
var zlib =  require('zlib');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routeManager = require('./Util/routeManager');
var netDataParase = require('./Util/netDataParase');
var serverCode = require('./ServerConfigs/code');
var serverPortConfig = require('./ServerConfigs/serverPortConfig.json');
var requestDao = require('./Game/dao_provider/dao_Game/request');
var DTLogger = require('./Game/domain/domain_Logger/Logger');
var accountController = require('./Login/domain/domain_account/accountController');
var expressExtend = require('./Util/expressExtend');
var app = express();

//中间间添加
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//自定义请求开始中间件
app.use(function (req, res, next)
{
    console.log("----------------");
    console.log("开始处理请求:"+req.originalUrl);
    console.log("请求参数:"+JSON.stringify(req.body),'  headers:',JSON.stringify(req.headers));
    console.log("请求标识:"+req.body.rId);
    //console.log(req);
    DTLogger.ResquestStart(req);
    //clientversion
    var resD = requestDao.isExist(req.body.rId);
    if(resD == null)
    {
        console.log("null");
        //var checkUser = new checkUserLogin();
        accountController.checkUserLogin(req,function(error,resultCheck){
            var model = {
                code:error,
                data:'',
                message:'checkLoginError'
            };
            var modelresult = '';
            if(error!=null){
                console.log('checkUserLogin:',error);
                model.code = error;
                modelresult = JSON.stringify(model)+"";
                zlib.gzip(modelresult, function(err, buffer) {
                    console.log('err:',err)
                    if (!err) {
                        modelresult = buffer.toString('base64');
                    }
                    else
                    {
                        modelresult = null;
                    }
                    res.send(modelresult);
                });
            }
            else
            {
                console.log("next");
                if(resultCheck){
                    next();
                }
                else
                {
                    model.code = error;
                    modelresult = JSON.stringify(model)+"";
                    zlib.gzip(modelresult, function(err, buffer) {
                        console.log('err:',err)
                        if (!err) {
                            modelresult = buffer.toString('base64');
                        }
                        else
                        {
                            modelresult = null;
                        }
                        res.send(modelresult);
                    });
                }
            }
        })

    }
    else
    {
        console.log("请求已经存在");
        res.send(resD);
    }
});

//routes加载 逻辑处理
app.set("appName",process.argv[2]);
app.set("serverType",process.argv[3]);
routeManager.InitRoutes(app);

//自定义请求结束中间件
app.use(function (req, res, next)
{
    //dtLogger.Logger({
    //    req:req,
    //    res:res
    //});
    if(!routeManager.HasRoute(req.originalUrl,app))
    {
        var error = new Error("Not found!");
        error.statusCode = serverCode.PageNotFound;
        next(error);
    }
    else
    {
        console.log("请求处理结束:"+req.originalUrl);
        console.log("请求标识:"+req.body.rId);
        //console.log("请求结果:"+res.toString);
        console.log("----------------");
        DTLogger.ResquestEnd(req,res);
        requestDao.storeRequest(req.body.rId,res.dealData);
        res.send(res.dealData);
    }
});

//所有错误回调中间件
app.use(function(err, req, res, next)
{
    res.statusCode = err.statusCode;
    console.log("请求错误："+req.originalUrl+" 错误编码:"+(err.statusCode||serverCode.UnKnowError) +" 错误内容:"+err.message);
    console.log("--------------");
    //requestDao.storeRequest(req.body.rId,netDataParase.netdata(err.statusCode||serverCode.UnKnowError,{},err.message));
    //res.dealData =
    zlib.gzip(netDataParase.netdata(err.statusCode||serverCode.UnKnowError,{},err.message), function(err, buffer) {
        //console.log('entendNexterr:',err,'|',dataStr);
        if (!err) {
            res.dealData = buffer.toString('base64');
        }
        else
        {
            res.dealData = null;
        }

    });
    //console.log('res.dealData:',res.dealData);
    res.send(res.dealData);
});

console.log("argv3:"+process.argv[3]);
//打开监听
var server =  app.listen(serverPortConfig[process.argv[3]][process.argv[2]], function()
{
    console.log(process.argv[2]+"服务器listen on :%d",server.address().port);
});
module.exports = app;
