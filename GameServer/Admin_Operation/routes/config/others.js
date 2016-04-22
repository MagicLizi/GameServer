/**
 * Created with JetBrains WebStorm.
 * User: Andy.Chen
 * Date: 14-5-23
 * Time: 下午3:30
 * To change this template use File | Settings | File Templates.
 */
var fs = require('fs');

var body = {
    title : '其他设置',
    result : null,
    message : null
};

var route = 'config/others';
var path = './config/gameConfig/items/others.json';
var dataProvider = require('../../data_provider/dao_provider/system/config');
var key = 'others';

exports.index = function(req, res){
    var method = req.method;
    body.message = null;

    dataProvider.getConfig(key, function(error, data){
        if(error)
            return render(res, route, '配置文件读取失败.');

        if(!data) return;
        var result = JSON.parse(data.config);

        if(method === 'POST'){
            var diamond = req.body.diamond;
            var chips = req.body.chips;
            var rank_count = req.body.rank_count;
            var reset_time = req.body.reset_time;
            var change_count = req.body.change_count;
            var win_limit = req.body.win_limit;
            var lose_limit = req.body.lose_limit;
            var maintain_message = req.body.maintain_message;
            var regex1 = /^[0-9]{1,}$/;
            if(!regex1.test(rank_count))
                return render(res, route, '排行数量必需为数字.');

            if(!regex1.test(reset_time))
                return render(res, route, '重置时间必需为数字.');

            if(!regex1.test(diamond))
                return render(res, route, '初始化通宝卡必需为数字.');

            if(!regex1.test(chips))
                return render(res, route, '初始化金贝必需为数字.');

            if(!regex1.test(change_count))
                return render(res, route, '昵称修改金贝必需为数字.');

            if(!regex1.test(lose_limit))
                return render(res, route, '输取上限必需为数字.');

            if(!regex1.test(win_limit))
                return render(res, route, '赢取上限必需为数字.');

            rank_count = parseInt(rank_count);
            reset_time = parseInt(reset_time);
            diamond = parseInt(diamond);
            chips = parseInt(chips);
            change_count = parseInt(change_count);
            lose_limit = parseInt(lose_limit);
            win_limit = parseInt(win_limit);

            result.reset_time = reset_time;
            result.lose_limit = lose_limit;
            result.win_limit = win_limit;
            result.rank_count = rank_count;
            result.player.diamond = diamond;
            result.player.chips = chips;
            result.change_nickname[0].count = change_count;
            result.maintain_message = maintain_message;
            data.config = JSON.stringify(result);

            dataProvider.editConfig(data, function(error){
                if(error)
                    return render(res, route, '配置文件写入失败.');

                body.message = '设置成功.';
                body.result = result;
                res.render(route, body);
            });
        }
        else{
            body.result = result;
            res.render(route, body);
        }
    });
};

function render(res, route, message){
    body.message = message;
    res.render(route, body);
};