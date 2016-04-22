/**
 * Created with JetBrains WebStorm.
 * User: Jay
 * Date: 14/10/31
 * Time: 下午12:18
 * To change this template use File | Settings | File Templates.
 */
/**
 * Created by David_shen on 10/21/14.
 */

var fs = require('fs');
var setConfig = module.exports;
var dateExtend = require('../../../Util/date');
setConfig.set = function(config, callback){

    var date = new Date();
    var serverType = process.argv[3];
    var name = 'game_' + serverType + date.format('yyyyMMMddhhmmss');
    var basicPath = __dirname.replace('/domain/domain_config','');
    var config_path = basicPath+'/configData/version/' + name + '.json';
    var local_address = '../../configData/version/' + name + '.json';
    var set_path = basicPath+'/configData/'+serverType+'config.json';
    fs.writeFile(config_path, config, 'utf-8', function(error){
        if(error)
        {
            return callback(null, {
                result : false
            });
        }
        else{
            var content = {
                "game" : address(1,'', local_address)
            };
            fs.writeFile(set_path, JSON.stringify(content), 'utf-8', function(error){
                var result = true;
                if(error)
                {
                    console.log("error part 2");
                    result = false;
                }
                return callback(null, {
                    result : result
                });
            });
        }
    });
};

setConfig.get = function(callback){
    var config = require('../../../config/data/config.json');
    callback(null, config);
};

setConfig.getConfig = function(key){
    var configPath = '../../configData/' + process.argv[3] + 'config.json';
    var configAddress = require(configPath);
    var config = require(configAddress.game.local_address);
    return config[key];
}

function address(id, url, local_address){
    return {
        "id": id,
        "url": url,
        "upgrade_time": (new Date()).toString(),
        "local_address": local_address
    }
}