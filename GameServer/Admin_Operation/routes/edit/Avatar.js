/**
 * Created by peihengyang on 14/12/3.
 */

var date = require('../../util/date');
var avatarEditProvider = require('../../data_provider/dao_provider/edit/avatar');
var body = {
    title : '英雄',
    message : null
};




exports.index = function(req, res){
    body.message = null;
    avatarEditProvider.getAll(function(error, results){
        body.results = results;
        console.log("results");
        console.log(results);
        res.render('edit/Avatar/index', body);
    });
};

exports.add = function(req, res){
    body.message = null;
    var method = req.method;
    var route = 'edit/Avatar/AddAvatar';
    if(method === 'POST'){
        var model = createModel(req);
        model.Create_Date = new Date();
        avatarEditProvider.addAvatar(model, function(error, result){
            if(error){
                body.message = '添加失败.';
                res.render(route, body);
            }
            else{
                body.message = '添加成功.';
                res.render(route, body);
            }
        });
    }
    else
    {
        res.render(route, body);

    }

};

exports.edit = function(req, res){
    body.message = null;
    var method = req.method;
    var route = 'edit/Avatar/EditAvatar';
    var Avatar_Id = req.query.id;

    avatarEditProvider.getAvatarById(Avatar_Id, function(error, result){
        if(error){
            res.redirect('Avatar');
        }
        else{
            if(!result){
                res.redirect('Avatar');
                return;
            }
            if(method === 'POST'){

                var model = createModel(req);
                model.Avatar_Id = Avatar_Id;
                avatarEditProvider.editAvatar(model, function(error, result){
                    if(error){
                        body.message = '更新失败.';
                        res.render(route, body);
                    }
                    else{
                        body.message = '更新成功.';
                            body.result = model;
                            res.render(route, body);

                    }
                });
            }
            else{
                    body.result = result[0];
                    res.render(route, body);


            }
        }
    });
};





var createModel = function(req)
{
    var Avatar_Name = req.body.Avatar_Name;
    var Avatar_Type = req.body.Avatar_Type;
    var Avatar_Icon_Url = req.body.Avatar_Icon_Url;
    var Avatar_Description = req.body.Avatar_Description;
    var Avatar_Order = req.body.Avatar_Order;
    var Avatar_Grade = req.body.Avatar_Grade;
    var model = {
        Avatar_Name : Avatar_Name,
        Avatar_Type:Avatar_Type,
        Avatar_Icon_Url :Avatar_Icon_Url,
        Avatar_Description : Avatar_Description,
        Avatar_Order:Avatar_Order,
        Avatar_Grade:Avatar_Grade
    };
    return model;
};



function render(res, route, message){
    body.message = message;
    res.render(route, body);
}
