/**
 * Created with JetBrains WebStorm.
 * User: Andy.Chen
 * Date: 14-6-5
 * Time: 下午8:21
 * To change this template use File | Settings | File Templates.
 */
var requireHelper = module.exports;

requireHelper.clear = function(key){
    //var key = require.resolve('../../config/gameConfig/items/alms.json');
    if(!!require.cache[key]){
        var id = require.cache[key].id;
        delete require.cache[id];
    }
};