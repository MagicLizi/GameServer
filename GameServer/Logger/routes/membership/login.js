/**
 * Created with JetBrains WebStorm.
 * User: andy.chen
 * Date: 14-5-20
 * Time: 下午4:01
 * To change this template use File | Settings | File Templates.
 */
var admimProvider = require('../../data_provider/dao_provider/membership/admin');

var body = {
    title : '后台登录',
    message : null
};

exports.index = function(request, response){
    body.message = null;
    response.render('login', body);
};

exports.login = function(req, res){
    var name = req.body.name;
    var pass = req.body.password;

    if(name && pass){
        admimProvider.getAdminByName(name, function(error, result){
            if(error){
                body.message = '登录失败.';
                return res.render('login',body);
            }

            if(!result || result.password !== pass){
                body.message = '帐号或密码错误.';
                return res.render('login',body);
            }

            req.session.user = result;

            res.redirect('/');
        });
    }
    else{
        body.message = '请输入帐号或密码.';
        return res.render('login',body);
    }
};

exports.logout = function(req, res){
    req.session.user = null;
    res.redirect('/login');
};