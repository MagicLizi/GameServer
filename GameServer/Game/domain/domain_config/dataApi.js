/**
 * Created with JetBrains WebStorm.
 * User: Andy.Chen
 * Date: 14-5-9
 * Time: 上午10:46
 * To change this template use File | Settings | File Templates.
 */
var crypto = require('crypto');
var serverType = process.argv[3];
var config = require('../../configData/'+serverType+'config');
var md5 = crypto.createHash('md5');
md5.update(config.game.local_address);
var version = md5.digest('hex');

var data =  {
    game : require(config.game.local_address)
};

module.exports = {
    game: data.game,
    version: version
};