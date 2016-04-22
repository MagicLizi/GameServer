/**
 * Created by peihengyang on 14/12/11.
 */
var enums = require('../../data_provider/dao_provider/edit/enums');
var date = require('../../util/date');
var editResourceProvider = require('../../data_provider/dao_provider/manage_Tools/resource');
var path = require('path');
var fs = require('fs');
var async = require('async');
var body = {
    title : '资源管理',
    message : null
};

exports.index = function(req, res){
    body.message = null;
    editResourceProvider.getAll(function(error, results){
        //console.log(results);
        body.results = results;
        res.render('manage_Tools/resource/index', body);
    });
};


exports.add =  function(req,res){
    body.message = null;
    var method = req.method;
    var files =  req.files;
    console.log('files:',files);
    var route = 'manage_Tools/resource/add';
    if(method === 'POST') {
        var addFun = [];
        if(files.length >= 1){
            files.Resource_File.forEach(function(File){
                //get filename
                var filename = req.body.Resource_Type +'_'+ (File.name || path.basename(File.path));
                //copy file to a public directory
                var targetPath = path.resolve(path.dirname(__filename) , '../../public/resourceFile/')  + '/'+ filename;
                //copy file
                fs.createReadStream(File.path).pipe(fs.createWriteStream(targetPath));
                var resourceModel  = createResourceModel(req,File);
                addFun.push(function(addCallback){
                    editResourceProvider.add(resourceModel,function(error,results){
                        if(error!=null){
                            console.log(error);
                            addCallback(error,null);
                        }
                        else
                        {
                            addCallback(null,results);
                        }
                    })
                })
            });
        }
        else
        {
            var File = files.Resource_File;
            //get filename
            var filename = req.body.Resource_Type +'_'+ (File.name || path.basename(File.path));
            //copy file to a public directory
            var targetPath = path.resolve(path.dirname(__filename) , '../../public/resourceFile/')  + '/'+ filename;
            //copy file
            fs.createReadStream(File.path).pipe(fs.createWriteStream(targetPath));
            var resourceModel  = createResourceModel(req,File);
            addFun.push(function(addCallback){
                editResourceProvider.add(resourceModel,function(error,results){
                    if(error!=null){
                        console.log(error);
                        addCallback(error,null);
                    }
                    else
                    {
                        addCallback(null,results);
                    }
                })
            })
        }
        async.series(addFun,function(error,resultserise){
            if(error!=null){
                console.log(error);
                body.message = error;
            }
            else
            {
                body.result = resultserise;
            }
        })
        res.render(route,body);
    }
    else{
        res.render(route, body);
    }
};



exports.del =  function(req,res){
    body.message = null;
    var method = req.method;
    var resourceId = req.query.id;
    var route = 'manage_Tools/resource/del';
    console.log(route);
    console.log(resourceId);
    //if(method === 'POST') {
        editResourceProvider.getResourceById(resourceId,function(error,results){
            if(error!=null){
                console.log(error);
                body.message = '获取资源错误';
            }
            else
            {
                results[0].Enable = 0;
                editResourceProvider.deleteResource(results[0].Resource_Tag,function(error,resultsUpdate){
                    if(error!=null){
                        console.log(error);
                        body.message = '删除资源表错误';
                    }
                    else
                    {
                        body.message = '删除资源表成功';
                    }
                })
            }
            res.render(route,body);
        })
    //}
    //else{
    //    res.render(route, body);
    //}
};



function createResourceModel(req,file){
    var resourceModel = {
        Resource_Id : 0,
        Resource_Version:0,
        Resource_Tag:'',
        Resource_Url :'',
        Create_Date:0,
        Enable:0
    };
    resourceModel.Resource_Tag = req.body.Resource_Type +'_'+ file.name;
    resourceModel.Resource_Url = '/resourceFile/'+ resourceModel.Resource_Tag;
    resourceModel.Create_Date  = new Date();
    resourceModel.Enable = 1;
    return resourceModel;
}
