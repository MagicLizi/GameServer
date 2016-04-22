/**
 * Created with JetBrains WebStorm.
 * User: Andy.Chen
 * Date: 14-3-27
 * Time: 下午12:17
 * To change this template use File | Settings | File Templates.
 */

var date = module.exports;

/**
 * 返回时区差
 * @returns {number}
 * @constructor
 */

date.Timezone = function(){
    var now = new Date();
    return now.getTimezoneOffset();
};
/**
 * 返回UTC时间
 * @param 只能传递日期字符串或Date类型，其他会出错
 * @returns {*}
 * @constructor
 */
date.UtcToLocal = function(utc_date){
    switch(typeof utc_date){
        case 'string':
            var d = new Date(utc_date);
            return new Date(Date.parse(d) + (60000 * -this.Timezone()));

        case 'object':
            return new Date(Date.parse(utc_date) + (60000 * -this.Timezone()));
    }
};

/**
 * 本地时间转换成UTC时间
 * @param 只能传递日期字符串或Date类型，其他会出错
 * @returns {Date}
 * @constructor
 */
date.LocalToUtc = function(local_date){
    switch(typeof local_date){
        case 'string':
            var d = new Date(local_date);
            return new Date(Date.parse(d) + (60000 * this.Timezone()));

        case 'object':
            return new Date(Date.parse(local_date) + (60000 * this.Timezone()));
    }
};

Date.prototype.format = function(fmt){
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
};
