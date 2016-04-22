/**
 * Created with JetBrains WebStorm.
 * User: David.shen
 * Date: 13-10-17
 * Time: 下午2:31
 * To change this template use File | Settings | File Templates.
 */
var accountHelper = module.exports;
var crypto = require("crypto");
var cryptKey = crypto.createHash('sha256').update('ichangyou2014').digest();
var iv = '1234567891234567';

/**
 * 加密算法
 * @param originMsg
 * @returns {*}
 */
accountHelper.encryption = function (originMsg) {
    return encode(cryptKey, iv, originMsg);
};

accountHelper.decryption = function (originMsg) {
    return decode(cryptKey, iv, originMsg);
};

var encode = function (cryptkey, iv, cleardata) {
    var encipher = crypto.createCipheriv('aes-256-cbc', cryptkey, iv);
    return encipher.update(cleardata, 'utf8', 'base64') + encipher.final('base64');
};

var decode = function (cryptkey, iv, secretdata) {
    var decipher = crypto.createDecipheriv('aes-256-cbc', cryptkey, iv)
    return decipher.update(secretdata, 'base64', 'utf8') + decipher.final('utf8');
};

accountHelper.SourceType = require('../../../Game/enum').SourceType;

accountHelper.gameEnum = require('../../../Game/enum');

accountHelper.GameID = {
    DT: 0
};