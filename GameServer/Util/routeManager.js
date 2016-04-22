/**
 * Created with JetBrains WebStorm.
 * User: lizi
 * Date: 14-9-16
 * Time: 下午5:08
 * To change this template use File | Settings | File Templates.
 */
var routeManager = module.exports;
routeManager.InitRoutes = function(app)
{
    var appName = app.get("appName");
    var routeConfigData = require('../ServerConfigs/routeConfig.json');
    var appRouteConfigData =routeConfigData[appName];
    var count = appRouteConfigData.length;
    for(var i = 0;i<count;i++)
    {
        var configData =appRouteConfigData[i];
        var routeName = configData["routeName"];
        var routePath = "../"+appName+"/routes"+routeName;
        if(routeName == "/")
        {
            routePath = routePath+"index";
        }
        //console.log('routePath:',routePath);
        app.use(routeName, require(routePath));
    }
};

routeManager.HasRoute = function(routeName,app)
{
    if(routeName!='/')
    {
        var names = routeName.split('/');
        routeName = '/'+names[1];
    }
    var appName = app.get("appName");
    var routeConfigData = require('../ServerConfigs/routeConfig.json');
    var appRouteConfigData =routeConfigData[appName];
    var count = appRouteConfigData.length;
    for(var i = 0;i<count;i++)
    {
        var configData =appRouteConfigData[i];
        var rn = configData["routeName"];
        if(rn == routeName)
        {
            return true;
        }
    }
    return false;
};