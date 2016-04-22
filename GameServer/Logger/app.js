/**
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var partials = require('express-partials');
var plugins = require('./config/plugin.json');
//var log4js = require('log4js');
//var log4Config = require('./config/log4js.json');

var adminHelper = require('./util/adminHelper');
var app = express();

var serverPortConfig = require('./config/serverPortConfig');
// all environments
app.set('port', process.env.PORT || 5000);
app.set('server_envi',process.argv[2]);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
    secret : 'microblogbyvoid'
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.locals({
    error : null,
    success : null
});

app.use(function(req, res, next){
    res.locals.session = req.session;
    next();
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//log4js.configure(log4Config);



var filter = function(req, res, next){
    var path = req.route.path;
    console.log(path);
    if(path !== '/login' && !req.session.user)
    {
        res.render('local', {title : ''});
    }

    else {
        adminHelper.check(req, res, next);
    }
    /*next();*/
};


var appender = function (module, method, elements) {
    elements.forEach(function (element) {
        method.call(app, element.route, filter, module[element.method]);
    });
};

plugins.forEach(function (plugin) {
    try {
        var module = require('./routes' + plugin.url);
        console.log('./routes' + plugin.url);
        if (plugin.get && plugin.get.length > 0){
            appender(module, app.get, plugin.get);
        }
        if (plugin.post && plugin.post.length > 0){
            appender(module, app.post, plugin.post);
        }
    }catch(e){
        console.log(e);
    }
});
console.log(serverPortConfig[process.argv[2]]);
app.set("appName",serverPortConfig[process.argv[2]]);
http.createServer(app).listen(serverPortConfig[process.argv[2]].Logger, function(){
    console.log("Web server has started.\nPlease log on http://127.0.0.1:"+serverPortConfig[process.argv[2]].Logger+"/");
});
