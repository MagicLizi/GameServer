/**
 * Created with JetBrains WebStorm.
 * User: Andy.Chen
 * Date: 14-5-23
 * Time: 下午3:30
 * To change this template use File | Settings | File Templates.
 */
var fs = require('fs');
var logger = require('log4js').getLogger('app');

var body = {
    title : '大区设置'
};

exports.index = function(req, res){
    res.render('config/regions/index', body);
};