/**
 * Created with JetBrains WebStorm.
 * User: apple
 * Date: 14-8-13
 * Time: 下午1:50
 * To change this template use File | Settings | File Templates.
 */
/**
 * Created with JetBrains WebStorm.
 * User: apple
 * Date: 14-7-14
 * Time: 上午11:11
 * To change this template use File | Settings | File Templates.
 */
var date = require('../../util/date');
var adminProvider = require('../../data_provider/dao_provider/admin/adminProvider');
var adminHelper = require('../../util/adminHelper');
var body = {
    title: '权限管理',
    message: null
};

var config = {};
//config[adminHelper.page.edit.store] = "编辑器-商城";
//config[adminHelper.page.edit.notice] = "编辑器-公告";
//config[adminHelper.page.edit.message] = "编辑器-消息";
//
//config[adminHelper.page.tools.account] = "管理工具-账号";
//config[adminHelper.page.tools.role] = "管理工具-角色";
//config[adminHelper.page.tools.robot] = "管理工具-机器人";
//config[adminHelper.page.tools.log] = "管理工具-日志";
//config[adminHelper.page.tools.payment] = "管理工具-支付查询";
//config[adminHelper.page.tools.password] = "管理工具-密码修改";
//config[adminHelper.page.tools.item] = "管理工具-道具管理";
//config[adminHelper.page.tools.exchange] = "管理工具-兑奖信息管理";
//config[adminHelper.page.tools.redeem] = "管理工具-兑换码管理";
//config[adminHelper.page.tools.redeem_manage] = "管理工具-兑换码查询";
//
//config[adminHelper.page.config.mode] = "配置表-游戏模式";
//config[adminHelper.page.config.region] = "配置表-大区设置";
//config[adminHelper.page.config.store] = "配置表-商城";
//config[adminHelper.page.config.wait_time] = "配置表-等待时间";
//config[adminHelper.page.config.other] = "配置表-其他";
//config[adminHelper.page.config.config_effect] = "配置表-生效配置";
//config[adminHelper.page.config.item] = "配置表-道具";
//config[adminHelper.page.config.formula] = "配置表-合成公式";
//config[adminHelper.page.config.package] = "配置表-礼包";
//
//config[adminHelper.page.game.game_manage] = "游戏管理-游戏管理";
//config[adminHelper.page.game.game_log] = "游戏管理-游戏日志";
//
//config[adminHelper.page.qa_tool.edit_cards] = "QA工具-自定义牌面";
//config[adminHelper.page.qa_tool.calculator_fan] = "QA工具-算番工具";

/**
 * 判断某id是否在数组中
 * @param array
 * @param id
 * @returns {boolean}
 */
var contains = function (array, id) {
    var result = false;
    array.forEach(function (i) {
        if (i == id) {
            console.log("contains");
            result = true;
        }
    });
    return result;
};

/**
 * 从数组中移除某id
 * @param array
 * @param id
 */
var remove = function (array, id) {
    var result = false;
    array.forEach(function (i, index) {
        if (i == id) {
            array.splice(index, 1);
            return;
        }
    })
};

/**
 * 编辑权限
 * @param request
 * @param response
 */
exports.edit = function (request, response) {
    var page_id = request.query.page_id;
    var watch = request.query.watch == "true";
    var alter = request.query.alter == "true";
    var level = request.query.level ? request.query.level : 0;
    console.log(JSON.stringify(request.query));
    var pages = [];
    adminProvider.getAdminLevel(level, function (error, result) {
        if (error) {
            body.message = "发生错误！";
            body.level = level;
            body.results = [];
            body.pages = [];
            response.render('authority/index', body);
        }
        if (!result) {
            result = {level:level, watch_pages:'[]',alter_pages:'[]'}
        }
        if (result) {
            var watch_pages = JSON.parse(result.watch_pages);
            var alter_pages = JSON.parse(result.alter_pages);
            if (!watch){
                remove(watch_pages, page_id);
            }
            if (!alter){
                remove(alter_pages, page_id);
            }
            if (watch && !contains(watch_pages, page_id)){
                watch_pages.push(page_id);
            }
            if (alter && !contains(alter_pages, page_id)){
                alter_pages.push(page_id);
            }
            adminProvider.setAdminLevel(level,watch_pages,alter_pages, function (error) {
                adminProvider.getAdminLevel(level, function (error, result) {
                    for (var key in adminHelper.page) {
                        for (var code in adminHelper.page[key]) {
                            var id = adminHelper.page[key][code];
                            if (id < 1000) {
                                pages.push(
                                    {
                                        page_id: id,
                                        page_name: config[id],
                                        watch: contains(result ? JSON.parse(result.watch_pages) : [], id),
                                        alter: contains(result ? JSON.parse(result.alter_pages) : [], id)
                                    });
                            }
                        }
                    }
                    body.message = null;
                    body.level = level;
                    body.results = pages ? pages : [];
                    body.pages = pages ? pages : [];
                    response.render('authority/index', body);
                });
            });
        }
    });
}

/**
 * 首页
 * @param request
 * @param response
 */
exports.index = function (request, response) {
    var level = request.query.level ? request.query.level : 0;
    var pages = [];
    var method = request.method;
    console.log(request.body);
    adminProvider.getAdminLevel(level, function (error, result) {
        for (var key in adminHelper.page) {
            for (var code in adminHelper.page[key]) {
                var id = adminHelper.page[key][code];
                if (id < 1000) {
                    pages.push(
                        {
                            page_id: id,
                            page_name: config[id],
                            watch: contains(result ? JSON.parse(result.watch_pages) : [], id),
                            alter: contains(result ? JSON.parse(result.alter_pages) : [], id)
                        });
                }
            }
        }
        body.message = null;
        body.level = level;
        body.results = pages ? pages : [];
        body.pages = pages ? pages : [];
        response.render('authority/index', body);
    });
};
