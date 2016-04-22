var express = require('express');
var expressExtend = require('../../Util/expressExtend');
var router = express.Router();
var sqlCommand = require('../../Util/dao/sqlCommand');
var sqlClient = require('../../Util/dao/sqlClient').Login;
var serverCode = require('../../ServerConfigs/code');
/* GET home page. */
router.get('/', function(req, res,next)
{
    //查询
    var sql = new sqlCommand('SELECT * FROM membership_users');
    sqlClient.query(sql,function(error, result){
        var message = "";
        var code = serverCode.SUCCESS;
        if(error)
        {
            message = error.message;
            code = error.code;
        }
        //框架返回方法
        expressExtend.entendNext(code,result,message,next,res);
    });
});

module.exports = router;
