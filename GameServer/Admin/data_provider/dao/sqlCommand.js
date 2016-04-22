/**
 * Created with JetBrains WebStorm.
 * User: Andy.Chen
 * Date: 14-5-6
 * Time: 上午10:42
 * To change this template use File | Settings | File Templates.
 */
var code = require('../../config/code');

module.exports = sqlCommand;

function sqlCommand(){
    var length = arguments.length;

    if(length <= 0)
        return new Error(code.DB.SQL_QUERY_ISNULL);

    //Sql语句
    this.sql = arguments[0];

    //Sql参数
    if(length >= 2)
        this.params = arguments[1];

    //前置函数
    this.before = null;

    //后置函数
    this.after = null;

    //最终结束调用函数
    this.end = null;
}