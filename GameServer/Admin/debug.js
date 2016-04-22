/**
 * Created with JetBrains WebStorm.
 * User: Andy.Chen
 * Date: 14-6-5
 * Time: 下午6:38
 * To change this template use File | Settings | File Templates.
 */

var action = require('./data_provider/dao_provider/logs/action');

action.getList([1001], {start:0,page_size:100}, function(error, list){
   console.log(list);
});