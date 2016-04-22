/**
 * Created with JetBrains WebStorm.
 * User: Jay
 * Date: 14/10/30
 * Time: 下午2:54
 * To change this template use File | Settings | File Templates.
 */
var netDatParase = module.exports;
netDatParase.netdata = function(code,data,message)
{
    var model = {
        code:code,
        data:data,
        message:message
    };
    return JSON.stringify(model)+"";
};
//UrlEncode函数
netDatParase.UrlEncode = function(str){
    var ret="";
    var tt="";
    var strSpecial="!\"#$%&'()*+,/:;<=>?[]^`{|}~%";
    for(var i=0;i<str.length;i++){
        var chr = str.charAt(i);
        var c=str2asc(chr);
        tt += chr+":"+c+"n";
        if(parseInt("0x"+c) > 0x7f){
            ret+="%"+c.slice(0,2)+"%"+c.slice(-2);
        }else{
            if(chr==" ")
            ret+="+";
        else if(strSpecial.indexOf(chr)!=-1)
            ret+="%"+c.toString(16);
        else
            ret+=chr;
        }
    }
    return ret;
}
//UrlDecode函数：
netDatParase.UrlDecode = function (str){
    var ret="";
    for(var i=0;i<str.length;i++){
        var chr = str.charAt(i);
        if(chr == "+"){
            ret+="%2B";
        }else if(chr=="%"){
            var asc = str.substring(i+1,i+3);
            if(parseInt("0x"+asc)>0x7f){
                ret+=asc2str(parseInt("0x"+asc+str.substring(i+4,i+6)));
                i+=5;
            }else {
                ret += asc2str(parseInt("0x" + asc));
                i += 2;
            }
        }else{
            ret+= chr;
        }
    }
    return ret;
}
netDatParase.EncodeUtf8 = function(s1)
{
    var s = escape(s1);
    var sa = s.split("%");
    var retV ="";
    if(sa[0] != "")
    {
        retV = sa[0];
    }
    for(var i = 1; i < sa.length; i ++)
    {
        if(sa[i].substring(0,1) == "u")
        {
            retV += Hex2Utf8(Str2Hex(sa[i].substring(1,5)));

        }
        else retV += "%" + sa[i];
    }

    return retV;
}

function str2asc(strstr){
    return ("0"+strstr.charCodeAt(0).toString(16).toUpperCase()).slice(-2);
}
function asc2str(ascasc){
    return String.fromCharCode(ascasc);
}

function Str2Hex(s)
{
    var c = "";
    var n;
    var ss = "0123456789ABCDEF";
    var digS = "";
    for(var i = 0; i < s.length; i ++)
    {
        c = s.charAt(i);
        n = ss.indexOf(c);
        digS += Dec2Dig(eval(n));

    }
    //return value;
    return digS;
}
function Dec2Dig(n1)
{
    var s = "";
    var n2 = 0;
    for(var i = 0; i < 4; i++)
    {
        n2 = Math.pow(2,3 - i);
        if(n1 >= n2)
        {
            s += '1';
            n1 = n1 - n2;
        }
        else
            s += '0';

    }
    return s;

}
function Dig2Dec(s)
{
    var retV = 0;
    if(s.length == 4)
    {
        for(var i = 0; i < 4; i ++)
        {
            retV += eval(s.charAt(i)) * Math.pow(2, 3 - i);
        }
        return retV;
    }
    return -1;
}
function Hex2Utf8(s)
{
    var retS = "";
    var tempS = "";
    var ss = "";
    if(s.length == 16)
    {
        tempS = "1110" + s.substring(0, 4);
        tempS += "10" + s.substring(4, 10);
        tempS += "10" + s.substring(10,16);
        var sss = "0123456789ABCDEF";
        for(var i = 0; i < 3; i ++)
        {
            retS += "%";
            ss = tempS.substring(i * 8, (eval(i)+1)*8);



            retS += sss.charAt(Dig2Dec(ss.substring(0,4)));
            retS += sss.charAt(Dig2Dec(ss.substring(4,8)));
        }
        return retS;
    }
    return "";
}
