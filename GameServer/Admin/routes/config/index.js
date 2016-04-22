/**
 * Created with JetBrains WebStorm.
 * User: Andy.Chen
 * Date: 14-5-23
 * Time: 下午3:25
 * To change this template use File | Settings | File Templates.
 */

exports.index = function(req, res){
    res.render('config/index', {title:'配置表设置'});
};