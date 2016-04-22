/**
 * Created with JetBrains WebStorm.
 * User: 翔
 * Date: 13-8-14
 * Time: 下午2:25
 * To change this template use File | Settings | File Templates.
 */
module.exports = {
    OK: 200,
    FAIL: 500,
    SYSTEM: {
        DB_ERROR: 9901,
        REDIS_ERROR: 9902,
        DATA_NOT_EXIST: 9903,
        OUT_OF_LIMIT: 9904,
        DO_NOT_SUPPORT: 9905,
        MATH_ERROR: 9906,
        GET_CACHE_ERROR: 9907,
        CONNECTOR_NOT_EXISTS : 9908,
        CONFIG_NOT_EXISTS : 9909, //配置错误
        UNKNOW_ERROR: 9999
    },
    ACCOUNT: {
        CERTIFICATE_NOT_EXIST: 1701,
        ACCOUNT_NOT_EXIST: 1702,
        ACCOUNT_PASSWORD_ERROR: 1703,
        ACCOUNT_HAS_EXIST: 1704,
        ACCOUNT_NICKNAME_HAS_EXIST: 1705,
        THIRDCOUNT_HAS_EXIST: 1706,
        RESTORE_TIMES_LIMIT: 1707,
        ACCOUNT_CAN_NOT_NULL: 1708,
        ACCOUNT_PASSWORD_CAN_NOT_NULL: 1709,
        ACCOUNT_OR_PASSWORD_CAN_NOT_NULL: 1710,
        ACCOUNT_RESET_FAIL: 1711,
        ACCOUNT_EXPAND_NOT_EXIST: 1712,
        PLAYER_NOT_EXIST: 1713,
        ACCOUNT_FORMAT_ERROR : 1714,
        PASSWORD_FORMAT_ERROR : 1715,
        ACCOUNT_PASSWORD_SAME : 1716,
        ACCOUNT_MODIFYPWS_ERROR : 1717
    },
    DB: {
        GET_PROVIDER_ERROR : 9701,
        SELECT_DATA_ERROR : 9702,
        UPDATE_DATA_ERROR : 9703,
        DELETE_DATA_ERROR : 9704,
        INSERT_DATA_ERROR : 9705,
        EXEC_QUERY_ERROR : 9706,
        EXEC_TRANS_ERROR : 9707,
        EXEC_PROC_ERROR : 9708,
        SQL_QUERY_ISNULL : 9709,
        SQL_COMMANDS_ISNULL : 9710,
        GET_CONNECTION_ERROR : 9711,
        EXEC_ASYNC_ERROR : 9712,
        DB_CONNECTION_ERROR : 9713,
        GET_DATA_ERROR:9714
    }
};