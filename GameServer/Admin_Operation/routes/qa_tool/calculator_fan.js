/**
 * Created by David_shen on 9/4/14.
 */

var fs = require('fs');

var body = {
    title : '算番工具',
    result : {
        is_banker : "1",
        wind_type : "1",
        state_type : "1",
        round_count : "0",
        left_count : "0",
        is_baoTing: "1",
        last_card:"",
        hand_cards : "",
        ling_gang : "",
        dark_gang : "",
        keZi_cards : "",
        shunZi_cards : ""
    },
    message : null
};

var cardInfo = {
    player:{
        is_banker:false,
        handCard:null,
        besideCard:null,
        partLvl:null,
        specialAction:[],
        tingRound:0,
        huNeedCardNum:[],
        last_card:null
    },
    table:{
        round_count:null,
        leftCardCount:null,
        cur_round_wind:null
    }
};

var route = 'qa_tool/calculator_fan';
var Card = require("./multipleHelper/card");
var BesideCard = require("./multipleHelper/besideCard");
var CardHu = require("./multipleHelper/cardHuBalance");
var GameBalance = require("./multipleHelper/GameBalance");
var enums = require("./multipleHelper/enum");

exports.index = function(req, res){
    var method = req.method;
    body.message = null;

    if(method === 'POST'){
        var is_banker = req.body.is_banker;
        var wind_type = req.body.wind_type;
        var state_type = req.body.state_type;
        var round_count = req.body.round_count;
        var left_count = req.body.left_count;
        var ting_round = req.body.ting_round;
        var is_baoTing = req.body.is_baoTing;

        var last_card = req.body.last_card;
        var hand_cards = req.body.hand_cards;
        var ling_gang = req.body.ling_gang;
        var dark_gang = req.body.dark_gang;
        var keZi_cards = req.body.keZi_cards;
        var shunZi_cards = req.body.shunZi_cards;

        body.result = req.body;
//        console.log(req.body);
        var handCardAry = [];
        var besideCard = new BesideCard();

        var handAry = [];
        var lightGangAry = [];
        var darkGangAry = [];
        var keZiAry = [];
        var shunZiAry = [];

        handAry = hand_cards.split(";");
        lightGangAry = ling_gang.split(";");
        darkGangAry = dark_gang.split(";");
        keZiAry = keZi_cards.split(";");
        shunZiAry = shunZi_cards.split(";");

        var regex1 = /^[0-9]{1,}$/;

        if(last_card!= "" && !regex1.test(last_card))
        {
            return render(res, route, '必须为1-16之间的数字.1');
        }

        for(var i = 0;i<handAry.length ;i++)
        {
            var num = handAry[i];
            if(num == "") break;
            if(!regex1.test(num))
                return render(res, route, '必须为1-16之间的数字.1');

            if(num< 1 || num > 16)
                return render(res, route, '必须为1-16之间的数字.2');

            var tempCard = new Card();
            tempCard.number = parseInt(num);
            handCardAry.push(tempCard);
        }

        for(var i = 0;i<lightGangAry.length ;i++)
        {
            var num = lightGangAry[i];
            console.log(num);
            console.log(lightGangAry.length);
            if(num == "") break;
            if(!regex1.test(num))
                return render(res, route, '必须为1-16之间的数字.3');

            if(num< 1 || num > 16)
                return render(res, route, '必须为1-16之间的数字.4');

            for(var j= 0;j< 4;j++)
            {
                var tempCard = new Card();
                tempCard.number = parseInt(num);
                besideCard.lightBar.push(tempCard);
            }
        }

        for(var i = 0;i<darkGangAry.length ;i++)
        {
            var num = darkGangAry[i];
            if(num == "") break;
            if(!regex1.test(num))
                return render(res, route, '必须为1-16之间的数字.');

            if(num< 1 || num > 16)
                return render(res, route, '必须为1-16之间的数字.');

            for(var j= 0;j< 4;j++)
            {
                var tempCard = new Card();
                tempCard.number = parseInt(num);
                besideCard.darkBar.push(tempCard);
            }
        }

        for(var i = 0;i<keZiAry.length ;i++)
        {
            var num = keZiAry[i];
            if(num == "") break;
            if(!regex1.test(num))
                return render(res, route, '必须为1-16之间的数字.');

            if(num< 1 || num > 16)
                return render(res, route, '必须为1-16之间的数字.');

            for(var j= 0;j< 3;j++)
            {
                var tempCard = new Card();
                tempCard.number = parseInt(num);
                besideCard.lightKeZi.push(tempCard);
            }
        }

        for(var i = 0;i<shunZiAry.length ;i++)
        {
            var singleAry = [];
            var numAry = shunZiAry[i];
            singleAry = numAry.split(",");
            for(var k = 0;k < singleAry.length;k++)
            {
                var num = singleAry[k];
                if(num == "") break;
                if(!regex1.test(num))
                    return render(res, route, '必须为1-16之间的数字.');

                if(num< 1 || num > 16)
                    return render(res, route, '必须为1-16之间的数字.');

                var tempCard = new Card();
                tempCard.number = parseInt(num);
                besideCard.shunZi.push(tempCard);
            }
        }

        //can hu
        var heCheck = new CardHu(handCardAry);
        var huRes =  heCheck.isHu(true);
        if(!huRes)
        {
            return render(res, route, '不能胡牌');
        }

        cardInfo.player.is_banker = is_banker == "1" ? true :false;
        cardInfo.player.handCard = handCardAry;
        cardInfo.player.besideCard = besideCard;
        cardInfo.player.partLvl = parseInt(state_type);
        cardInfo.player.last_card =  parseInt(last_card);
        cardInfo.table.round_count =  parseInt(round_count);
        cardInfo.table.leftCardCount = parseInt(left_count);
        cardInfo.table.cur_round_wind = parseInt(wind_type) + 9;

        if(parseInt(is_baoTing))
        {
            cardInfo.player.huNeedCardNum.push(1);
        }
        else
        {
            cardInfo.player.huNeedCardNum = [];
        }

        var resultFan =  GameBalance.calculatorMultiple(cardInfo.player,cardInfo.table);

        var message = "";
        for(var m = 0;m<resultFan.length;m++)
        {
            var id = resultFan[m];
            message = message + getName(id) + ",";
        }

        console.log(body);
        body.message = "番数结果:"  + message;
        res.render(route, body);
    }
    else{
        res.render(route, body);
    }
};


function getName(fanID)
{
    var resultName;
    switch(fanID)
    {
        case enums.Fan_type.DaSiXi:
            resultName = "大四喜";
            break;
        case enums.Fan_type.DaSanYuan:
            resultName = "大三元";
            break;
        case enums.Fan_type.JiuBaoLianDeng:
            resultName = "九宝莲灯";
            break;
        case enums.Fan_type.SiGang:
            resultName = "四杠";
            break;
        case enums.Fan_type.LianQiDui:
            resultName = "连七对";
            break;
        case enums.Fan_type.BaiWanShi:
            resultName = "百万石";
            break;
        case enums.Fan_type.TianHe:
            resultName = "天和";
            break;
        case enums.Fan_type.DiHe:
            resultName = "地和";
            break;
        case enums.Fan_type.RenHe:
            resultName = "人和";
            break;
        case enums.Fan_type.XiaoSiXi:
            resultName = "小四喜";
            break;
        case enums.Fan_type.XiaoSanYuan:
            resultName = "小三元";
            break;
        case enums.Fan_type.ZiYiSe:
            resultName = "字一色";
            break;
        case enums.Fan_type.SiAnKe:
            resultName = "四暗刻";
            break;
        case enums.Fan_type.YiSeShuangLonghui:
            resultName = "一色双龙会";
            break;
        case enums.Fan_type.YiSeSiTongShun:
            resultName = "一色四同顺";
            break;
        case enums.Fan_type.YiSeSiJieGao:
            resultName = "一色四节高";
            break;
        case enums.Fan_type.YiSeSiBuGao:
            resultName = "一色四步高";
            break;
        case enums.Fan_type.SanGang:
            resultName = "三杠";
            break;
        case enums.Fan_type.HunYaoJiu:
            resultName = "混幺九";
            break;
        case enums.Fan_type.QiDui:
            resultName = "七对";
            break;
        case enums.Fan_type.QinYiSe:
            resultName = "清一色";
            break;
        case enums.Fan_type.YiSeSanTongShun:
            resultName = "一色三同顺";
            break;
        case enums.Fan_type.YiSeSanJieGao:
            resultName = "一色三节高";
            break;
        case enums.Fan_type.QinLong:
            resultName = "清龙";
            break;
        case enums.Fan_type.YiSeSanBuGao:
            resultName = "一色三步高";
            break;
        case enums.Fan_type.SanAnKe:
            resultName = "三暗刻";
            break;
        case enums.Fan_type.TianTin:
            resultName = "天听";
            break;
        case enums.Fan_type.SanFengKe:
            resultName = "三风刻";
            break;
        case enums.Fan_type.DaYuWu:
            resultName = "大于5";
            break;
        case enums.Fan_type.XiaoYuWu:
            resultName = "小于5";
            break;
        case enums.Fan_type.MiaoShouHuiChun:
            resultName = "妙手回春";
            break;
        case enums.Fan_type.HaiDiLaoYue:
            resultName = "海底捞月";
            break;
        case enums.Fan_type.GangShangKaiHua:
            resultName = "杠上开花";
            break;
        case enums.Fan_type.QianGangHe:
            resultName = "抢杠和";
            break;
        case enums.Fan_type.PenPenHe:
            resultName = "碰碰和";
            break;
        case enums.Fan_type.HunYiSe:
            resultName = "混一色";
            break;
        case enums.Fan_type.ShuangAnGang:
            resultName = "双暗杠";
            break;
        case enums.Fan_type.ShuangJianKe:
            resultName = "双箭刻";
            break;
        case enums.Fan_type.QuanQiuRen:
            resultName = "全求人";
            break;
        case enums.Fan_type.BuQiuRen:
            resultName = "不求人";
            break;
        case enums.Fan_type.ShuangMingGang:
            resultName = "双明杠";
            break;
        case enums.Fan_type.HeJueZhang:
            resultName = "和绝张";
            break;
        case enums.Fan_type.JianKe:
            resultName = "箭刻";
            break;
        case enums.Fan_type.QuanFenKe:
            resultName = "圈风刻";
            break;
        case enums.Fan_type.MenQianQin:
            resultName = "门前清";
            break;
        case enums.Fan_type.PinHe:
            resultName = "平和";
            break;
        case enums.Fan_type.SiGuiYi:
            resultName = "四归一";
            break;
        case enums.Fan_type.ShuangAnKe:
            resultName = "双暗刻";
            break;
        case enums.Fan_type.AnGang:
            resultName = "暗杠";
            break;
        case enums.Fan_type.DuanYao:
            resultName = "断幺";
            break;
        case enums.Fan_type.YiBanGao:
            resultName = "一般高";
            break;
        case enums.Fan_type.LianLiu:
            resultName = "连六";
            break;
        case enums.Fan_type.LaoShaoFu:
            resultName = "老少副";
            break;
        case enums.Fan_type.YaoJiuKe:
            resultName = "幺九刻";
            break;
        case enums.Fan_type.MingGang:
            resultName = "明杠";
            break;
        case enums.Fan_type.QueYiMen:
            resultName = "缺一门";
            break;
        case enums.Fan_type.WuZi:
            resultName = "无字";
            break;
        case enums.Fan_type.BianZhang:
            resultName = "边张";
            break;
        case enums.Fan_type.KanZhang:
            resultName = "坎张";
            break;
        case enums.Fan_type.DanDiaoJiang:
            resultName = "单钓将";
            break;
        case enums.Fan_type.ZiMo:
            resultName = "自摸";
            break;
        case enums.Fan_type.BaoTing:
            resultName = "报听";
            break;
    }
    return resultName;
}

function render(res, route, message){
    body.message = message;
    res.render(route, body);
}