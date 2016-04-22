/**
 * Created with JetBrains WebStorm.
 * User: apple
 * Date: 14-8-13
 * Time: 上午9:41
 * To change this template use File | Settings | File Templates.
 */
var adminHelper = module.exports;
var adminProvider = require('../data_provider/dao_provider/admin/adminProvider');

adminHelper.page = {
    edit: {
//        store: 101,
//        notice: 102,
//        message: 103,
//        item_store:104,
        hero:105,
        monster:106
    },
    tools: {
//        account: 201,
//        role: 202,
//        robot: 203,
//        log: 204,
//        payment: 205,
//        password: 206,
//        item: 207,
//        exchange: 208,
//        redeem: 209,
//        redeem_manage: 210
    },
    config: {
//        mode: 301,
//        region: 302,
//        store: 303,
//        wait_time: 304,
//        other: 305,
//        config_effect: 306,
//        item: 307,
//        formula: 308,
//        package: 309
    },
    game: {
//        game_manage: 401,
//        game_log: 402
    },
    qa_tool: {
//        edit_cards: 501,
//        calculator_fan: 502
    },
    membership: {
//        authority: 1001,
//        account: 1002
    }
};

var route_config = {
    "/hero": {
        type: 1,
        id: adminHelper.page.edit.hero
    },
    "/hero/add": {
        type: 2,
        id: adminHelper.page.edit.hero
    },
    "/hero/edit": {
        type: 2,
        id: adminHelper.page.edit.hero
    },
    "/monster": {
        type: 1,
        id: adminHelper.page.edit.monster
    },
    "/monster/add": {
        type: 2,
        id: adminHelper.page.edit.monster
    },
    "/monster/edit": {
        type: 2,
        id: adminHelper.page.edit.monster
    }
//    "/apple": {
//        type: 1,
//        id: adminHelper.page.edit.store
//    },
//    "/apple/add": {
//        type: 2,
//        id: adminHelper.page.edit.store
//    },
//    "/apple/edit": {
//        type: 2,
//        id: adminHelper.page.edit.store
//    },
//    "/item_store": {
//        type: 1,
//        id: adminHelper.page.edit.item_store
//    },
//    "/item_store/add": {
//        type: 2,
//        id: adminHelper.page.edit.item_store
//    },
//    "/item_store/edit": {
//        type: 2,
//        id: adminHelper.page.edit.item_store
//    },
//    "/notice": {
//        type: 1,
//        id: adminHelper.page.edit.notice
//    }
//    "/notice/add": {
//        type: 2,
//        id: adminHelper.page.edit.notice
//    },
//    "/notice/edit": {
//        type: 2,
//        id: adminHelper.page.edit.notice
//    },
//    "/message": {
//        type: 1,
//        id: adminHelper.page.edit.message
//    },
//    "/message/add": {
//        type: 2,
//        id: adminHelper.page.edit.message
//    },
//    "/message/edit": {
//        type: 2,
//        id: adminHelper.page.edit.message
//    },
//    "/account": {
//        type: 1,
//        id: adminHelper.page.tools.account
//    },
//    "/role": {
//        type: 1,
//        id: adminHelper.page.tools.role
//    },
//    "/role/sanction": {
//        type: 2,
//        id: adminHelper.page.tools.role
//    },
//    "/robot": {
//        type: 1,
//        id: adminHelper.page.tools.robot
//    },
//    "/robot_active": {
//        type: 2,
//        id: adminHelper.page.tools.robot
//    },
//    "/log/account": {
//        type: 1,
//        id: adminHelper.page.tools.log
//    },
//    "/log/role": {
//        type: 1,
//        id: adminHelper.page.tools.log
//    },
//    "/log/robot": {
//        type: 1,
//        id: adminHelper.page.tools.log
//    },
//    "/pay/apple": {
//        type: 1,
//        id: adminHelper.page.tools.payment
//    },
//    "/pay/alipay": {
//        type: 1,
//        id: adminHelper.page.tools.payment
//    },
//    "/modify": {
//        type: 1,
//        id: adminHelper.page.tools.password
//    },
//    "/item": {
//        type: 1,
//        id: adminHelper.page.tools.item
//    },
//    "/item/add": {
//        type: 2,
//        id: adminHelper.page.tools.item
//    },
//    "/itemUse": {
//        type: 1,
//        id: adminHelper.page.tools.exchange
//    },
//    "/redeemCode": {
//        type: 1,
//        id: adminHelper.page.tools.redeem
//    },
//    "/redeemCode/delete": {
//        type: 2,
//        id: adminHelper.page.tools.redeem
//    },
//    "/redeemCode/edit": {
//        type: 2,
//        id: adminHelper.page.tools.redeem
//    },
//    "/redeemCodeSearch/search": {
//        type: 1,
//        id: adminHelper.page.tools.redeem_manage
//    },
//    "/redeemCodeSearch/searchPackage": {
//        type: 1,
//        id: adminHelper.page.tools.redeem_manage
//    },
//    "/authority": {
//        type: 1,
//        id: adminHelper.page.membership.authority
//    },
//    "/config/modes": {
//        type: 3,
//        id: adminHelper.page.config.mode
//    },
//    "/config/regions/maker": {
//        type: 3,
//        id: adminHelper.page.config.region
//    },
//    "/config/regions/deposit": {
//        type: 3,
//        id: adminHelper.page.config.region
//    },
//    "/config/regions/match": {
//        type: 3,
//        id: adminHelper.page.config.region
//    },
//    "/config/store": {
//        type: 2,
//        id: adminHelper.page.config.store
//    },
//    "/config/wait": {
//        type: 3,
//        id: adminHelper.page.config.wait_time
//    },
//    "/config/others": {
//        type: 3,
//        id: adminHelper.page.config.other
//    },
//    "/config/configuration": {
//        type: 2,
//        id: adminHelper.page.config.config_effect
//    },
//    "/config/formulas": {
//        type: 3,
//        id: adminHelper.page.config.formula
//    },
//    "/config/packages": {
//        type: 3,
//        id: adminHelper.page.config.package
//    },
//    "/shut": {
//        type: 2,
//        id: adminHelper.page.game.game_manage
//    },
//    "/game_logs/search": {
//        type: 1,
//        id: adminHelper.page.game.game_log
//    },
//    "/admin": {
//        type: 1,
//        id: adminHelper.page.membership.account
//    },
//    "/qa_tool/calculator_fan": {
//        type: 3,
//        id: adminHelper.page.qa_tool.calculator_fan
//    }
};

adminHelper.checkWatch = function (page_id, level, func, req, res) {
    if (level == 0) {
        return func();
    }
    adminProvider.getUserWatchPages(level, function (error, pages) {
        console.log(level + "   " + pages,'page_id:',page_id);
        if (error) {
            var route = 'error/index';
            res.render(route, {message: page_id + " 404", result: {}, title: '道具', results: []});
        }
        else {
            var valid = false;
            pages.forEach(function (watch_page_id) {
                if (watch_page_id == page_id) {
                    valid = true;
                }
            });
            if (valid) {
                console.log('out');
                func();
            }
            else {
                var route = 'error/index';
                res.render(route, {message: page_id + " 404", result: {}, title: '道具', results: []});
            }
        }
    });
};

adminHelper.checkAlter = function (page_id, level, func, req, res) {
    if (level == 0) {
        return func();
    }
    adminProvider.getUserAlterPages(level, function (error, pages) {
        console.log(level + "   " + error);
        if (error) {
            var route = 'error/index';
            res.render(route, {message: page_id + " 404", result: {}, title: '道具', results: []});
        }
        else {
            var valid = false;
            pages.forEach(function (alter_page_id) {
                if (alter_page_id == page_id) {
                    valid = true;
                }
            });
            if (valid) {
                func();
            }
            else {
                var route = 'error/index';
                res.render(route, {message: page_id + " 404", result: {}, title: '道具', results: []});
            }
        }
    });
};

//adminHelper.checkUserValid = function (account, password, callback) {
//    var model = {account: account, password: password};
//    adminProvider.getUser(model, function (error, user) {
//        if (error) {
//            callback(error);
//        }
//        else if (user == null) {
//            callback(new Error());
//        }
//        else {
//            callback(null);
//        }
//    });
//};

adminHelper.check = function (req, res, next) {
    var path = req.route.path;
    if (!req.session.user) {
        next();
    }
    else {
        var level = req.session.user.level;
        var config = route_config[path];
        console.log("======================");
        console.log("path=" + path);
        console.log(config);
        if (config) {
            if (config.type == 1) {
                adminHelper.checkWatch(config.id, level, next, req, res);
            }
            else if (config.type == 2) {
                adminHelper.checkAlter(config.id, level, next, req, res);
            }
            else if (config.type == 3) {
                var method = req.method;
                if (method == "POST") {
                    adminHelper.checkAlter(config.id, level, next, req, res);
                }
                else {
                    adminHelper.checkWatch(config.id, level, next, req, res);
                }
            }
        }
        else {
            next();
        }
    }
};