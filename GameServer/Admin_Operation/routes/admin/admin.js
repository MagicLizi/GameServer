/**
 * Created with JetBrains WebStorm.
 * User: apple
 * Date: 14-8-14
 * Time: 上午10:30
 * To change this template use File | Settings | File Templates.
 */
var date = require('../../util/date');
var adminProvider = require('../../data_provider/dao_provider/admin/adminProvider');
//var adminHelper = require('../../util/adminHelper');
var body = {
    title: '账号管理',
    message: null
};
var show = function (request, response, body) {
    adminProvider.getAdmins(function (error, admins) {
        if (error) {
            body.message = "发生错误！"
            response.render('admin/index', body);
        }
        else {
            body.results = admins;
            response.render('admin/index', body);
        }
    })
}

exports.index = function (request, response) {
    body.message = null;
    body.results = [];
    body.pages = [];
    if (request.method == "POST") {
        var account = request.body.account;
        var password = request.body.password;
        var level = request.body.level;
        console.log(request.body);
        adminProvider.accountExsit(account, function (error, exsit) {
            if (error ) {
                body.message = "发生错误！"
                show(request, response, body);
            }
            else if (exsit) {
                body.message = "账号已经存在"
                show(request, response, body);
            }
            else {
                adminProvider.addAdmin(account, password, level, function (error) {
                    if (error) {
                        body.message = "发生错误！"
                        response.render('admin/index', body);
                    }
                    else {
                        show(request, response, body);
                    }
                });
            }
        })
    }
    else {
        show(request, response, body);
    }

};

exports.edit = function (request, response) {
    body.message = null;
    body.results = [];
    body.pages = [];
    var account = request.query.account;
    var password = request.query.password;
    var level = request.query.level;
    adminProvider.updateAdmin(account, password, level, function (error) {
        if (error) {
            body.message = "发生错误！"
            response.render('admin/index', body);
        }
        else {
            show(request, response, body);
        }
    });
};


exports.delete = function (request, response) {
    body.message = null;
    body.results = [];
    body.pages = [];
    var account = request.query.account;
    adminProvider.deleteAdmin(account, function (error) {
        if (error) {
            body.message = "发生错误！"
            response.render('admin/index', body);
        }
        else {
            show(request, response, body);
        }
    });
};

