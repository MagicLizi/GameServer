var express = require('express');
var router = express.Router();
var expressExtend = require('../../Util/expressExtend');
/* GET home page. */
router.get('/', function(req, res,next) {
    expressExtend.entendNext(200,{},"express",next,res);
});

module.exports = router;
