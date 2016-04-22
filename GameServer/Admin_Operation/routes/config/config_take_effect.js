/**
 * Created with JetBrains WebStorm.
 * User: Andy.Chen
 * Date: 14-5-23
 * Time: 下午3:30
 * To change this template use File | Settings | File Templates.
 */
var fs = require('fs');
var heroEditProvider = require('../../data_provider/dao_provider/edit/hero');
var monsterEditProvider = require('../../data_provider/dao_provider/edit/monster');
var skillEditProvider = require('../../data_provider/dao_provider/edit/skill');
var dungeonEditProvider = require('../../data_provider/dao_provider/edit/DP_Dungeon');
var avatarEditProvider = require('../../data_provider/dao_provider/edit/avatar');
var itemEditProvider = require('../../data_provider/dao_provider/edit/item');
var lotteryEditProvider = require('../../data_provider/dao_provider/edit/lottery');
var dataProvider = require('../../data_provider/dao_provider/system/config');
var taskProvider =  require('../../data_provider/dao_provider/edit/task');
var storeProvider =  require('../../data_provider/dao_provider/edit/store');
var activityProvider =  require('../../data_provider/dao_provider/edit/activity');
var resourceProvider =  require('../../data_provider/dao_provider/manage_Tools/resource');
var versionProvider =  require('../../data_provider/dao_provider/manage_Tools/version');
var VIPProvider =  require('../../data_provider/dao_provider/edit/VIP');
var globalKey = "global";
var heroKey = 'hero';
var monsterKey = 'monster';
var skillKey = 'skill';
var avatarKey = 'avatar';
var dungeonKey = 'dungeon';
var itemKey = 'item';
var lotteryKey = 'lottery';
var taskKey = 'task';
var storeKey = 'store';
var resourceKey = 'resource';
var versionKey = 'version';
var activityKey = 'activity';
var VIPKey = 'VIP';
var body = {
    title : '配置表生成',
    result : null,
    message : null
};

var route = 'config/config_take_effect';

exports.index = function(req, res){
    var method = req.method;

    if(method === 'POST') {
        effect_config(res, avatarEditProvider, avatarKey, function () {
            effect_config(res, dungeonEditProvider, dungeonKey, function () {
                effect_config(res, heroEditProvider, heroKey, function () {
                    effect_config(res, monsterEditProvider, monsterKey, function () {
                        effect_config(res, skillEditProvider, skillKey, function () {
                            effect_config(res,itemEditProvider,itemKey,function(){
                                effect_config(res,taskProvider,taskKey,function(){
                                    effect_config(res,lotteryEditProvider,lotteryKey,function(){
                                        effect_config(res,storeProvider,storeKey,function(){
                                            effect_config(res,resourceProvider,resourceKey,function() {
                                                effect_config(res,versionProvider,versionKey,function() {
                                                    effect_config(res, activityProvider, activityKey, function () {
                                                        effect_config(res, VIPProvider, VIPKey, function () {
                                                            //all config
                                                            dataProvider.getAll(function (error, results) {
                                                                if (error) {
                                                                    console.log(error);
                                                                    return render(res, route, '配置文件生成失败.');
                                                                }
                                                                var result = {};
                                                                result.keys = [];
                                                                results.forEach(function (item) {
                                                                    switch (item.key_id) {
                                                                        case globalKey:
                                                                            result.keys.push({
                                                                                id: globalKey,
                                                                                config_num: item.config_num
                                                                            });
                                                                            result.global = {};
                                                                            result.global.info = JSON.parse(item.config).data;
                                                                            break;
                                                                        case heroKey :
                                                                            result.keys.push({
                                                                                id: heroKey,
                                                                                config_num: item.config_num
                                                                            });
                                                                            result.hero = {};
                                                                            result.hero.info = JSON.parse(item.config).data;
                                                                            break;
                                                                        case monsterKey:
                                                                            result.keys.push({
                                                                                id: monsterKey,
                                                                                config_num: item.config_num
                                                                            });
                                                                            result.monster = {};
                                                                            result.monster.info = JSON.parse(item.config).data;
                                                                            break;
                                                                        case dungeonKey:
                                                                            var DungeonObject = JSON.parse(item.config).data;

                                                                            for (var i = 0; i < DungeonObject.length; i++) {
                                                                                if (DungeonObject[i].Dungeon_Stages == "" || DungeonObject[i].Dungeon_Stages == null) {
                                                                                    DungeonObject[i].Dungeon_Stages = [];
                                                                                }
                                                                                else {
                                                                                    DungeonObject[i].Dungeon_Stages = JSON.parse(DungeonObject[i].Dungeon_Stages);
                                                                                }

                                                                            }
                                                                            result.keys.push({
                                                                                id: dungeonKey,
                                                                                config_num: item.config_num
                                                                            });
                                                                            result.dungeon = {};
                                                                            result.dungeon.info = DungeonObject;
                                                                            break;
                                                                        case skillKey:
                                                                            result.keys.push({
                                                                                id: skillKey,
                                                                                config_num: item.config_num
                                                                            });
                                                                            result.skill = {};
                                                                            result.skill.info = JSON.parse(item.config).data;
                                                                            break;
                                                                        case avatarKey:
                                                                            result.keys.push({
                                                                                id: avatarKey,
                                                                                config_num: item.config_num
                                                                            });
                                                                            result.avatar = {};
                                                                            result.avatar.info = JSON.parse(item.config).data;
                                                                            break;
                                                                        case itemKey:
                                                                            result.keys.push({
                                                                                id: itemKey,
                                                                                config_num: item.config_num
                                                                            });
                                                                            result.item = {};
                                                                            result.item.info = JSON.parse(item.config).data;
                                                                            break;
                                                                        case taskKey:
                                                                            result.keys.push({
                                                                                id: taskKey,
                                                                                config_num: item.config_num
                                                                            });
                                                                            result.task = {};
                                                                            result.task.info = JSON.parse(item.config).data;
                                                                            break;
                                                                        case storeKey:
                                                                            result.keys.push({
                                                                                id: storeKey,
                                                                                config_num: item.config_num
                                                                            });
                                                                            result.store = {};
                                                                            result.store.info = JSON.parse(item.config).data;
                                                                            break;
                                                                        case resourceKey:
                                                                            result.keys.push({
                                                                                id: resourceKey,
                                                                                config_num: item.config_num
                                                                            });
                                                                            result.resource = {};
                                                                            result.resource.info = JSON.parse(item.config).data;
                                                                            break;
                                                                        case lotteryKey:
                                                                            result.keys.push({
                                                                                id: lotteryKey,
                                                                                config_num: item.config_num
                                                                            });
                                                                            result.lottery = {};
                                                                            result.lottery.info = JSON.parse(item.config).data;
                                                                            //console.log(result.lottery.info.LotteryPool);
                                                                            break;
                                                                        case versionKey:
                                                                            result.keys.push({
                                                                                id: versionKey,
                                                                                config_num: item.config_num
                                                                            });
                                                                            result.version = {};
                                                                            result.version.info = JSON.parse(item.config).data;
                                                                            //console.log('version.info:',result.version.info);
                                                                            break;
                                                                        case activityKey:
                                                                            result.keys.push({
                                                                                id: activityKey,
                                                                                config_num: item.config_num
                                                                            });
                                                                            result.activity = {};
                                                                            result.activity.info = JSON.parse(item.config).data;
                                                                            //console.log('version.info:',result.version.info);
                                                                            break;
                                                                        case VIPKey:
                                                                            result.keys.push({
                                                                                id: VIPKey,
                                                                                config_num: item.config_num
                                                                            });
                                                                            result.VIP = {};
                                                                            result.VIP.info = JSON.parse(item.config).data;
                                                                            //console.log('version.info:',result.version.info);
                                                                            break;
                                                                        default :
                                                                            break;
                                                                    }
                                                                });
                                                                var data = {
                                                                    key_id: 'config',
                                                                    config: JSON.stringify(result)
                                                                };
                                                                //console.log("configresult");
                                                                //console.log(result.global);
                                                                dataProvider.editConfig(data, function (error, result) {
                                                                    if (error)
                                                                        return render(res, route, '配置文件写入失败.');
                                                                    body.message = '生效配置表成功.';
                                                                    res.render(route, body);
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        })
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    else
    {
        body.message = '';
        res.render(route, body);
    }
};


function effect_config(res,provider,key,callback)
{

    provider.getAll(function(error, results){
        console.log(error);
        if(error)
        {
            return render(res, route, '配置文件生成失败.');
        }
        else
        {
            if(!results)
            {
                return render(res, route, '无配置表数据.');
            }
            var configData = {
                "data" : results
            };

            var data = {
                key_id : key,
                config : JSON.stringify(configData)
            };
            dataProvider.editConfig(data, function(error){
                if(error)
                {
                    return render(res, route, '配置文件写入失败.');
                }
                else
                {
                    callback();
                }
            });
        }
    });
}

function render(res, route, message){
    body.message = message;
    res.render(route, body);
}