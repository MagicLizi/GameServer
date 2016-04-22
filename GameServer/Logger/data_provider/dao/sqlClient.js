/**
 * Created with JetBrains WebStorm.
 * User: Andy.Chen
 * Date: 14-5-6
 * Time: 上午10:44
 * To change this template use File | Settings | File Templates.
 */
//var slqClient = pomelo.app.get('dbClient');
var sqlClient1 = require('./sqlExecute').init('tinygame');
var sqlClient2 = require('./sqlExecute').init('admin');
var sqlClient3 = require('./sqlExecute').init('tinylogs');
var sqlClient4 = require('./sqlExecute').init('membership');
var sqlClient5 = require('./sqlExecute').init('logger');

module.exports = {
    tinygame : {
        insert : sqlClient1.insert,

        update : sqlClient1.update,

        delete : sqlClient1.delete,

        query: sqlClient1.query,

        transaction : sqlClient1.transaction
    },
    admin : {
        insert : sqlClient2.insert,

        update : sqlClient2.update,

        delete : sqlClient2.delete,

        query: sqlClient2.query,

        transaction : sqlClient2.transaction
    },
    tinylogs : {
        insert : sqlClient3.insert,

        update : sqlClient3.update,

        delete : sqlClient3.delete,

        query: sqlClient3.query,

        transaction : sqlClient3.transaction
    },
    membership : {
        insert : sqlClient4.insert,

        update : sqlClient4.update,

        delete : sqlClient4.delete,

        query: sqlClient4.query,

        transaction : sqlClient4.transaction
    },
    logger : {
        insert : sqlClient5.insert,

        update : sqlClient5.update,

        delete : sqlClient5.delete,

        query: sqlClient5.query,

        transaction : sqlClient5.transaction
    }
};