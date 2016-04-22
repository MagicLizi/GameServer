/**
 * Created by lizi on 15/6/10.
 */
var request = module.exports;

request.AllResuest = [];

request.storeRequest = function(rId,result)
{
    request.remove(rId);
    var req =
    {
        rId:rId,
        res:result
    }
    request.AllResuest.push(req);
    //console.log("当前缓存请求内容:");
    //console.log(request.AllResuest);
};

request.isExist = function(rId)
{
    var length = request.AllResuest.length;
    for(var i = 0;i<length;i++)
    {
        var r = request.AllResuest[i];
        if(r.rId == rId)
        {
            return r.res;
        }
    }
    return null;
};

request.remove = function(rId)
{
    var udid = rId.split('$')[0];
    var stap = rId.split('$')[1];


    var length = request.AllResuest.length;

    for(var i = length - 1;i>=0;i--)
    {
        var r = request.AllResuest[i];
        var trId = r.rId;
        var tudid = trId.split('$')[0];
        var tstap = trId.split('$')[1];
        if(tudid == udid)
        {
            console.log("移除",trId);
            request.AllResuest.splice(i,1);
        }
    }
};