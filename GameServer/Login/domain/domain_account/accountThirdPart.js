/**
 * Created with JetBrains WebStorm.
 * User: David_shen
 * Date: 13-9-5
 * Time: 下午3:50
 * To change this template use File | Settings | File Templates.
 */
//var pomelo = require('pomelo');
var code = require('../../code');
var userThirdPartProviderData =  require('../../dao_provider/dao_account/userThirdPart');
var userThirdPartProvide = new userThirdPartProviderData();

function ThirdPart()
{
    var _this = this;
//    /**
//     * 检查第三方账号是否存在
//     * @param userID
//     * @param callback
//     */
//   this.isThirdPartExist = function(userID,callback)
//   {
//       var sql = 'SELECT * FROM membership_thirdparts WHERE UserID = ? ';
//       var args = [userID];
//       pomelo.app.get('dbclient').select(sql,args,function(error,result)
//       {
//          if(error)
//          {
//              callback(error,code.SYSTEM.DB_ERROR);
//          }
//           else
//          {
//              if(result.rows.length > 0)
//              {
//                  callback(null,true);
//              }
//              else
//              {
//                  callback(null,false);
//              }
//          }
//       });
//   };

    this.getThirdPartByAccount = function(ThirdPartName,ThirdPartID,callback)
    {
       userThirdPartProvide.getThirdPartByAccount(ThirdPartName,ThirdPartID,callback);
    };

    /**
     * 创建第三方账号
     * @param userID
     * @param thirdPartID
     * @param thirdPartName
     * @param callback
     */
   this.createThirdPart = function(userID,thirdPartID,thirdPartName,callback)
   {
       userThirdPartProvide.getThirdPartByUserID(userID,function(error,result)
       {
          if(error)
          {
              callback(error,result);
          }
           else
          {
              if(result)
              {
                   callback(code.ACCOUNT.THIRDCOUNT_HAS_EXIST,code.ACCOUNT.THIRDCOUNT_HAS_EXIST);
              }
              else
              {
                  //insert new one
                  userThirdPartProvide.createThirdPart(userID,thirdPartID,thirdPartName,function(error,result)
                  {
                     if(error)
                     {
                           callback(error,result);
                     }
                      else
                     {
                         callback(null,true);
                     }
                  });
              }
          }
       });
   };
};

module.exports = ThirdPart;