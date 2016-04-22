/**
 * Created by peihengyang on 15/8/26.
 */
var enums = require('../../data_provider/dao_provider/edit/enums');
var date = require('../../util/date');
var editVersionProvider = require('../../data_provider/dao_provider/manage_Tools/version');
var async = require('async');
var body = {
    title : '版本管理',
    message : null
};

exports.index = function(req, res){
    body.message = null;
    editVersionProvider.getAll(function(error, results){
        //console.log(results);
        body.results = results;
        res.render('manage_Tools/version/index', body);
    });
};


exports.add =  function(req,res){
    body.message = null;
    var method = req.method;
    var route = 'manage_Tools/version/add';
    if(method === 'POST') {
        var model = createVersionModel(req);
        model.Enable = 1;
        editVersionProvider.add(model,function(error,resultAddVersion){
            if(error!=null){
                console.log('addVersion:',error);
                res.render(route);
            }
            else
            {
                body.results = model;
                res.render(route,body);
            }
        })
    }
    else{
        res.render(route, body);
    }
};


exports.edit =  function(req,res){
    body.message = null;
    var method = req.method;
    var version_Id = req.query.id;
    var route = 'manage_Tools/version/edit';
    var model;
    editVersionProvider.getVersionById(version_Id,function(error,resultVersion){
        if(error!=null){
            console.log('getVersion:',error);
            callback(error,null);
        }
        else
        {
            if(method === 'POST') {
                model = createVersionModel(req);
                model.Enable = req.body.Enable;
                model.Version_Id = version_Id;
                editVersionProvider.updateVersion(model,function(error,resultUpdateVersion){
                    if(error!=null){
                        console.log('updateVersion:',error);
                        callback(error,null);
                    }
                    else
                    {
                        body.results = model;
                        res.render(route,body);
                    }
                })
            }
            else{
                body.results = resultVersion[0];
                res.render(route, body);
            }
        }
    })
};



exports.del =  function(req,res){
    body.message = null;
    var method = req.method;
    var version_Id = req.query.id;
    var route = 'manage_Tools/version/del';
    editVersionProvider.getVersionById(version_Id,function(error,results){
        if(error!=null){
            console.log(error);
            body.message = '获取版本错误';
        }
        else
        {
            //results[0].Enable = 0;
            editVersionProvider.deleteVersion(version_Id,function(error,resultsUpdate){
                if(error!=null){
                    console.log(error);
                    body.message = '删除版本错误';
                }
                else
                {
                    body.message = '删除版本成功';
                }
                res.render(route,body);
            })
        }
    })
};



function createVersionModel(req){
    var versionModel = {
        Version_Id : 0,
        Version_Name:'',
        Is_Force_Update:0,
        Update_Url :'',
        Version_Order:'',
        Create_Date:0,
        Enable:0
    };
    versionModel.Version_Name = req.body.Version_Name;
    versionModel.Is_Force_Update = req.body.Is_Force_Update;
    versionModel.Update_Url = req.body.Update_Url;
    versionModel.Version_Order =  req.body.Version_Order;
    versionModel.Create_Date  = new Date();
    return versionModel;
}
