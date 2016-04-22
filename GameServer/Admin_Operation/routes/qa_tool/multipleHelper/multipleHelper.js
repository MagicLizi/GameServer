/**
 * Created by David_shen on 7/4/14.
 */

var cardHelper = require("./CardHelper");
var enums = require("./enum");
var Card = require("./card");
var CardHu = require("./cardHuBalance");
var multipleHelper= module.exports;
var self = this;

multipleHelper.getAllKindCards = function(handCard,besideCard)
{
    var jiangCards = cardHelper.findCards(handCard,enums.card_sytle_type.Jiang).findCards;
    var keZiCards = cardHelper.findCards(handCard,enums.card_sytle_type.KeZi).findCards;
    var barCards = cardHelper.findCards(handCard,enums.card_sytle_type.Bar).findCards;
    var shunCards = cardHelper.findOrderCardsForMulti(handCard);
    var allCards = handCard.concat(besideCard.lightBar,besideCard.lightKeZi,besideCard.darkBar,besideCard.shunZi);
    var allBar = barCards.concat(besideCard.lightBar,besideCard.darkBar);
    var allKeZi = keZiCards.concat(besideCard.lightKeZi);
    var result = {
        allKeZi:allKeZi,
        allBar:allBar,
        bar:barCards,
        all:allCards,
        handCard:handCard,
        jiang:jiangCards,
        keZi:keZiCards,
        shunZi:shunCards,
        bDarkBar:besideCard.darkBar,
        bLightBar:besideCard.lightBar,
        bLightKeZi:besideCard.lightKeZi,
        bShunZi:besideCard.shunZi
    };
    console.log(result);
    return result;
};


multipleHelper.needCalculator = function(disAbleFanAry,thisFan)
{
//    console.log("thisFan===" + thisFan);

    var need = true;
    disAbleFanAry.forEach(function(fan)
    {
        if(need && fan == thisFan)
        {
            need =  false;
        }
    });
    return need;
};

multipleHelper.cardIsWord= function(card)
{
    if(card.number < 10)
    {
        return true;
    }
    return false;
};


multipleHelper.cardIsWind = function(card)
{
    if(card.number >9 && card.number < 14)
    {
        return true;
    }
    return false;
};

multipleHelper.cardIsArrow = function(card)
{
    if(card.number >13 )
    {
        return true;
    }
    return false;
};
//88 番

/**
 *   * 1.	大四喜
 * 由4服风牌组成的刻子（杠），加上一对将牌的牌型。
 * 不计算“小四喜”，“圈风刻”，“三风刻”，“碰碰和”, “幺九刻”
 * @param allCards
 * @param curFanAry
 * @param disAbleFanAry
 * @returns {boolean}
 */
multipleHelper.isDaSiXi = function(allCards,curFanAry,disAbleFanAry)
{
    var keZiCards = allCards.allKeZi;
    var barCards =  allCards.allBar;

    var keZiCount = 0;
    keZiCards.forEach(function(card)
    {
        if(self.cardIsWind(card))
        {
            keZiCount ++;
        }
    });

    var barCount = 0;
    barCards.forEach(function(card)
    {
        if(self.cardIsWind(card))
        {
            barCount ++;
        }
    });

    if(keZiCount /3  + barCount /4 == 4)
    {
        curFanAry.push(enums.Fan_type.DaSiXi);

        disAbleFanAry.push(enums.Fan_type.XiaoSiXi,
            enums.Fan_type.QuanFenKe,
            enums.Fan_type.SanFengKe,
            enums.Fan_type.PenPenHe,
            enums.Fan_type.YaoJiuKe
        );
        return true;
    }
    return false;
};

/**
 * 2.	大三元
 * 牌中有“中”，“发”，“白”三副刻子或杠。
 * 不计算“小三元”，“双箭刻”，“箭刻”
 */
multipleHelper.isDaSanYuan = function(allCards,curFanAry,disAbleFanAry)
{
    var keZiCards = allCards.allKeZi;
    var barCards =  allCards.allBar;

    var keZiCount = 0;
    keZiCards.forEach(function(card)
    {
        if(self.cardIsArrow(card))
        {
            keZiCount ++;
        }
    });

    var barCount = 0;
    barCards.forEach(function(card)
    {
        if(self.cardIsArrow(card))
        {
            barCount ++;
        }
    });

    if(keZiCount /3 +  barCount /4 == 3)
    {
        curFanAry.push(enums.Fan_type.DaSanYuan);

        disAbleFanAry.push(enums.Fan_type.XiaoSanYuan,enums.Fan_type.ShuangJianKe,enums.Fan_type.JianKe);

        return true;
    }
    return false;
};

/**
 * 3.	九莲宝灯
 * 一种花色牌按1112345678999组成，见同色同花即和牌。
 不计算“清一色”,“门前清”, “幺九刻”
 注意：所“和”的那张牌必须单独摆放，表明听9中牌，否则按“清一色”计算。
 */
multipleHelper.isJiuBaoLianDeng = function(allCards,curFanAry,disAbleFanAry)
{
    var needCards = [1,1,1,2,3,4,5,6,7,8,9,9,9];

    var allCardNumAry = [];
    allCards.all.forEach(function(card)
    {
        if(self.cardIsWord(card))
        {
            allCardNumAry.push(card.number);
        }
    });

    if(allCardNumAry.length != 14)
    {
        return false;
    }

    var findError = false;
    needCards.forEach(function(num1)
    {
        var error = true;
        allCardNumAry.forEach(function(num,index)
        {
            if(error && num == num1)
            {
                allCardNumAry[index]=0;
                error = false;
            }
        });

        if(error)
        {
           findError = true;
        }
    });
    if(findError)
    {
        return false;
    }
    curFanAry.push(enums.Fan_type.JiuBaoLianDeng);

    disAbleFanAry.push(enums.Fan_type.QinYiSe,
        enums.Fan_type.MenQianQin,
        enums.Fan_type.YaoJiuKe);

    return true;
};
/**
 * 4.	四杠
 * 有4副杠，明暗杠均可，即和牌。
 不计“三杠”、“碰碰和”、“双暗杠”、“双明杠”、“暗杠”、“明杠”、“单钓将”
 */
multipleHelper.isSiBar = function(allCards,curFanAry,disAbleFanAry)
{
    var barCards = allCards.allBar;
    if(barCards.length == 16)
    {
        curFanAry.push(enums.Fan_type.SiGang);

        disAbleFanAry.push(enums.Fan_type.SanGang,
            enums.Fan_type.PenPenHe,
            enums.Fan_type.ShuangAnGang,
            enums.Fan_type.ShuangMingGang,
            enums.Fan_type.AnGang,
            enums.Fan_type.MingGang,
            enums.Fan_type.DanDiaoJiang);
        return true;
    }
    return false;
};

/**
 * 5.	连七对：由一种花色牌顺序相连的七副对子组成的和牌。
 不计算“清一色”，“单钓”，“七对”，“门前清”，“缺一门”，“无字”，“一般高”，“平和”，“连六”，
 如果数字是从二到八，则追加计算“断幺”
 自摸的话，不计算“不求人”，但加计算“自摸”
 */
multipleHelper.isLianQiDui = function(allCards,curFanAry,disAbleFanAry,curPlayer)
{
    var tempCards = allCards.jiang.concat(allCards.bar);
    if(tempCards.length/2 != 7)
    {
        return false;
    }
    var minNum = 10;
    var maxNum = 0;
    tempCards.forEach(function(card)
    {
        if(card.number < minNum)
        {
            minNum = card.number;
        }

        if(card.number > maxNum)
        {
            maxNum = card.number;
        }
    });

    if(maxNum - minNum == 6)
    {
        curFanAry.push(enums.Fan_type.LianQiDui);
        if(minNum == 2 && maxNum == 8)
        {
            curFanAry.push(enums.Fan_type.DuanYao);
            disAbleFanAry.push(enums.Fan_type.DuanYao);
            //断幺
        }

        if(curPlayer.partLvl == 3)
        {
            disAbleFanAry.push(enums.Fan_type.BuQiuRen);
        }
        disAbleFanAry.push(enums.Fan_type.QinYiSe,
            enums.Fan_type.DanDiaoJiang,
            enums.Fan_type.QiDui,
            enums.Fan_type.MenQianQin,
            enums.Fan_type.QueYiMen,
            enums.Fan_type.WuZi,
            enums.Fan_type.YiBanGao,
            enums.Fan_type.PinHe,
            enums.Fan_type.LianLiu
        );
        return true;
    }
    return false;
};
/**
 * 6.	百万石：所有的牌由万字牌组成，且万字综合超过100万。必须由刻子或者顺子共计4副加上1副对子组成。
 */
multipleHelper.isBaiWanShi = function(allCards,curFanAry)
{
    var num = 0;
    var found = false;
    allCards.all.forEach(function(card)
    {
        if(self.cardIsWord(card))
        {
            num += card.number;
        }
        else
        {
            found =  true;
        }
    });

    if(found)
    {
        return false;
    }
    else
    {
        if(num >= 100)
        {
            if(allCards.allKeZi.length + allCards.shunZi.length + allCards.bShunZi.length  >= 12)
            {
                curFanAry.push(enums.Fan_type.BaiWanShi);
                return true;
            }
        }
        return false;
    }
};

// 64 番
/**
 * 	小四喜：由3服风牌组成的刻子（杠），加上一对风牌组成的将牌的牌型。
 	不计算 “三风刻”，“幺九刻”
 */
multipleHelper.isXiaoSiXi = function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.XiaoSiXi))
    {
        return false;
    }
    var keZiCards = allCards.allKeZi;
    var barCards =  allCards.allBar;

    var keZiCount = 0;
    keZiCards.forEach(function(card)
    {
        if(self.cardIsWind(card))
        {
            keZiCount ++;
        }
    });

    var barCount = 0;
    barCards.forEach(function(card)
    {
        if(self.cardIsWind(card))
        {
            barCount ++;
        }
    });

    var findWindJiang = false;
    allCards.jiang.forEach(function(card)
    {
        if(self.cardIsWind(card))
        {
            findWindJiang = true;
        }
    });

    if(findWindJiang && (keZiCount/3 + barCount/4 == 3))
    {
        curFanAry.push(enums.Fan_type.XiaoSiXi);

        disAbleFanAry.push(enums.Fan_type.SanFengKe,enums.Fan_type.YaoJiuKe);
        return true;
    }
    return false;
};

/**
 * 10.	小三元：由箭牌（中发白）组成2副刻子（111）与将牌（11）的牌型，配上任何其他牌的2副顺/刻/杠而成的和牌。
 不计算 “箭刻”，“双箭刻”
 */
multipleHelper.isXiaoSanYuan = function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.XiaoSanYuan))
    {
        return false;
    }
    var keZiCards = allCards.allKeZi;

    var jianKeZiAry = [];
    keZiCards.forEach(function(card)
    {
        if(self.cardIsArrow(card))
        {
            jianKeZiAry.push(card);
        }
    });
    var jianJiangAry = [];
    allCards.jiang.forEach(function(card)
    {
        if(self.cardIsArrow(card))
        {
            jianJiangAry.push(card);
        }
    });

    if(jianKeZiAry.length == 6 && jianJiangAry.length >0)
    {
        var findSame = false;
        jianJiangAry.forEach(function(card)
        {
            if(findSame)
            {
                jianKeZiAry.forEach(function(card1)
                {
                    if(card.number == card1.number)
                    {
                        findSame = true;
                    }
                });
            }
        });

        if(findSame)
        {
            return false;
        }
        else
        {
            curFanAry.push(enums.Fan_type.XiaoSanYuan);

            disAbleFanAry.push(enums.Fan_type.JianKe,enums.Fan_type.ShuangJianKe);
            return true;
        }
    }
    return false;
};

/**
 * 11.	字一色：由字牌（风向牌+中发白）的刻子（杠），将牌组合成的和牌。
 不计算“碰碰和”，“幺九刻”
 */
multipleHelper.isZiYiSe= function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.ZiYiSe))
    {
        return false;
    }
    var found = false;
    allCards.all.forEach(function(card)
    {
        if(!found && card.number <= 9)
        {
            found =  true;
        }
    });

    if(found)
    {
        return false;
    }
    else
    {
        curFanAry.push(enums.Fan_type.ZiYiSe);

        disAbleFanAry.push(enums.Fan_type.PenPenHe,enums.Fan_type.YaoJiuKe);
        return true;
    }
};

/**
 * 12.	四暗刻：由4个暗刻（刻子全是自摸，不是碰对家的牌组成）或暗杠组成的牌型。
 不计算“碰碰和”，“门前清”，“三暗刻”
 */
multipleHelper.isSiAnKe = function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.SiAnKe))
    {
        return false;
    }
    var barCount = parseInt(allCards.bDarkBar.length/4);
    var keZiCount = parseInt(allCards.keZi.length/3);

    if(barCount + keZiCount >= 4)
    {
        curFanAry.push(enums.Fan_type.SiAnKe);

        disAbleFanAry.push(enums.Fan_type.PenPenHe,enums.Fan_type.MenQianQin,enums.Fan_type.SanAnKe);
        return true;
    }
    return false;
};

/**
 * 13.	一色双龙会：由2套老少副（“123“，”789“）+将牌“5“组成的牌型。
 不计算“平和”，“七对”，“清一色”，“无字”，“一般高”，“老少副”
 */
multipleHelper.isYiSeShuangLongHui = function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.YiSeShuangLonghui))
    {
        return false;
    }

    var needCards = [1,2,3,1,2,3,7,8,9,7,8,9,5,5];

    if(allCards.all.length != needCards.length)
    {
        return false;
    }

    var tempAry = [];

    allCards.all.forEach(function(tempCard)
    {
        tempAry.push(tempCard.number);
    });

    for(var j = 0;j < needCards.length; j++)
    {
        var num = needCards[j];
        var find = false;
        for(var i = 0;i < tempAry.length; i++)
        {
            var cardNumber = tempAry[i];
            if(cardNumber != -2 && num == cardNumber)
            {
                tempAry[i] = -2;
                find = true;
                break;
            }
        }
        if(!find)
        {
            return false;
        }
    }
    curFanAry.push(enums.Fan_type.YiSeShuangLonghui);

    disAbleFanAry.push(enums.Fan_type.PinHe,
        enums.Fan_type.QiDui,
        enums.Fan_type.QinYiSe,
        enums.Fan_type.WuZi,
        enums.Fan_type.YiBanGao,
        enums.Fan_type.LaoShaoFu);
    return true;
};

// 48 番
/**
 * 14.	一色四同顺：由4副同花色且序数相同的顺子组成的牌型
 不计算“一色三节高”、“一般高”、“四归一”。
 */
multipleHelper.isYiSeSiTongShun = function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.YiSeSiTongShun))
    {
        return false;
    }
    var handShunZi = allCards.shunZi;
    var bShunZi = allCards.bShunZi;
    var allShunZi = allCards.shunZi.concat(allCards.bShunZi);
    if(allShunZi.length < 12)
    {
        return false;
    }

    var totalNumAry = [];
    for(var i = 0;i< allShunZi.length;i = i+3)
    {
        var num = allShunZi[i].number + allShunZi[i+1].number + allShunZi[i+2].number;
        totalNumAry.push(num);
    }

    var find = false;
    for(var j = 0;j< totalNumAry.length;j++)
    {
        var count = 0;
        for(var m = 0;m < totalNumAry.length;m++)
        {
            if(totalNumAry[j] == totalNumAry[m])
            {
                count ++;
            }
        }

        if(count >=4)
        {
            find = true;
        }
    }

    if(!find)
    {
        return false;
    }

    curFanAry.push(enums.Fan_type.YiSeSiTongShun);

    disAbleFanAry.push(enums.Fan_type.YiSeSiJieGao,
        enums.Fan_type.YiBanGao,
        enums.Fan_type.SiGuiYi,
        enums.Fan_type.YiSeSanTongShun);

    return true;
};

/**
 * 15.	一色四节高：由4副同花色且序数依次递增1位的刻子组成，并配以任意一队将牌而和的牌型
 不计算“一色三同顺”、“碰碰和”。
 */
multipleHelper.isYiSeSiJieGao = function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.YiSeSiJieGao))
    {
        return false;
    }
    var allKeZi = allCards.allKeZi;

    var numAry = [];
    allKeZi.forEach(function(card)
    {
       if(self.cardIsWord(card))
       {
           numAry.push(card.number);
       }
    });

    if(numAry.length  == 12)
    {
        numAry.sort();
        var totalNum = -1;
        var hasError = false;
        for(var m = 0;m < 12 ;m =m +3)
        {
            var num = totalNum;
            totalNum = numAry[m]+ numAry[m +1] + numAry[m +2];
            if(num != -1 && totalNum != num +3)
            {
                hasError = true;
            }
        }

        if(hasError)
        {
           return false;
        }
        curFanAry.push(enums.Fan_type.YiSeSiJieGao);

        disAbleFanAry.push(enums.Fan_type.YiSeSanTongShun,
            enums.Fan_type.PenPenHe,
            enums.Fan_type.YiSeSanJieGao);
        return true;
    }
    return false;
};

// 32 番
/**
 * 16.	一色四步高：同花色的4副顺子，并且顺子序数依次递增1或2。
 不计算“连六”，“老少副“,"一色三步高"
 */
multipleHelper.isYiSeSiBuGao = function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.YiSeSiBuGao))
    {
        return false;
    }
    var allShunZi = allCards.shunZi.concat(allCards.bShunZi);

    if(allShunZi.length == 12)
    {
        var startNumAry = [];
        allShunZi.forEach(function(card,index)
        {
            if(index%3 == 0 )
            {
                startNumAry.push(card.number);
            }
        });

        startNumAry.sort();

        var hasError = false;
        for(var i= 3;i >= 0;i--)
        {
            if(i != 0 && (startNumAry[i] - startNumAry[i-1] >= 3 || startNumAry[i] - startNumAry[i-1] == 0))
            {
                hasError = true;
            }
        }
        if(hasError)
        {
            return false;
        }
        curFanAry.push(enums.Fan_type.YiSeSiBuGao);

        disAbleFanAry.push(enums.Fan_type.LianLiu,enums.Fan_type.LaoShaoFu,enums.Fan_type.YiSeSanBuGao);
        return true;
    }
    return false;
};

/**
 * 17.	三杠：由3个杠组成的牌型（明暗杠均可）。
 */
multipleHelper.isSanGang = function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.SanGang))
    {
        return false;
    }
    var barCards = allCards.allBar;
    if(barCards.length >= 12)
    {
        curFanAry.push(enums.Fan_type.SanGang);
        return true;
    }
    return false;
};

/**
 * 18.	混幺九：由字牌（风向牌+中发白）的刻子与万字牌中的“一万”或者“九万”刻子或者将牌组合而成的牌型
 不计算“碰碰和”，“全带幺”，“幺九刻”
 */
multipleHelper.isHunYaoJiu = function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.HunYaoJiu))
    {
        return false;
    }

    var foundError = false;
    var allNeedCards = allCards.allKeZi.concat(allCards.jiang);
    if(allNeedCards.length != allCards.all.length)
    {
        return false;
    }
    allNeedCards.forEach(function(card)
    {
       if(!foundError && (card.number > 1 && card.number < 9))
       {
           foundError = true;
       }
    });
    if(foundError)
    {
        return false;
    }
    curFanAry.push(enums.Fan_type.HunYaoJiu);

    disAbleFanAry.push(enums.Fan_type.PenPenHe,enums.Fan_type.YaoJiuKe);
    return true;
};

//24 番

/**
 * 19.	七对【特殊和牌牌型】：由7个对子组成的牌型。
 不计算“不求人”，“单钓”
 有4张相同的牌做成2个对子时，要加计“四归一
 */
multipleHelper.isQiDui = function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.QiDui))
    {
        return false;
    }
    var DuiCount = allCards.jiang.length / 2 + allCards.bar.length / 2;
    if(DuiCount == 7)
    {
        curFanAry.push(enums.Fan_type.QiDui);

        if(allCards.bar.length > 0)
        {
            curFanAry.push(enums.Fan_type.SiGuiYi);
        }

        disAbleFanAry.push(enums.Fan_type.BuQiuRen,
            enums.Fan_type.DanDiaoJiang,
            enums.Fan_type.SiGuiYi);
        return true;
    }
    return false;
};

/**
 * 20.	清一色：牌型由一种花色的序数牌组成（只能由万字牌组成了）。
 * 不计算“无字”
 */
multipleHelper.isQinYiSe = function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.QinYiSe))
    {
        return false;
    }

    var foundNotFit = false;
    allCards.all.forEach(function(card)
    {
       if(!self.cardIsWord(card))
       {
           foundNotFit =  true;
       }
    });

    if(foundNotFit)
    {
        return false;
    }
    else
    {
        curFanAry.push(enums.Fan_type.QinYiSe);
        disAbleFanAry.push(enums.Fan_type.WuZi);
        return true;
    }
};

/**
 * 21.	一色三同顺：和牌时由一种花色3副序数相同的顺子组成的牌型。
 不计算“一色三节高”，“一般高”
 */
multipleHelper.isYiSeSanTongShun = function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.YiSeSanTongShun))
    {
        return false;
    }

    var allShunZi = allCards.shunZi.concat(allCards.bShunZi);
    var totalNum = -1;
    var totalAry = [];
    if(allShunZi.length != 0)
    {
        var i = allShunZi.length;
        for(var j = 0;j< i;j=j+3)
        {
            totalNum = allShunZi[j].number + allShunZi[j+1].number + allShunZi[j+2].number;
            totalAry.push(totalNum);
        }
    }

    if(totalAry.length >= 3)
    {
        totalAry.sort();
        var hasFound = false;
        totalAry.forEach(function(num)
        {
            var sameCount = 0;
            totalAry.forEach(function(num1)
            {
               if(num == num1)
               {
                   sameCount ++;
               }
            });
            if(sameCount >= 3)
            {
                hasFound = true;
            }
        });
        if(hasFound)
        {
            curFanAry.push(enums.Fan_type.YiSeSanTongShun);

            disAbleFanAry.push(enums.Fan_type.YiSeSanJieGao,
                enums.Fan_type.YiBanGao);
            return true;
        }
    }
    return false;
};

/**
 * 22.	一色三节高：和牌时由一种花色3副序数依次递增1位数的刻子组成的牌型。
 不计算“一色三同顺”
 */
multipleHelper.isYiSeSanJieGao= function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.YiSeSanJieGao))
    {
        return false;
    }
    console.log("isYiSeSanJieGao");
    var allKeZi = allCards.allKeZi;
    var keZiNum = [];
    allKeZi.forEach(function(card)
    {
        if(self.cardIsWord(card))
        {
            var tempCard = new Card();
            tempCard.number = card.number;
            keZiNum.push(tempCard);
        }
    });
    var shunCards = cardHelper.findOrderCardsForMulti(keZiNum);

    if(shunCards.length >= 9)
    {
        curFanAry.push(enums.Fan_type.YiSeSanJieGao);
        return true;
    }
    return false;

};

// 16番

/**
 * 23.	清龙：同1花色且1-9相连的牌型。（需3副顺子）
 * 不计算连六 和老少副
 */
multipleHelper.isQinLong= function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.QinLong))
    {
        return false;
    }
    var allShunZi = allCards.shunZi.concat(allCards.bShunZi);
    var needNumAry = [1,2,3,4,5,6,7,8,9];
    if(allShunZi.length >= 9)
    {
        allShunZi.sort(sortNumber);
        var hasError = false;
        needNumAry.forEach(function(num)
        {
            if(!hasError)
            {
                var hasFound = false;
                allShunZi.forEach(function(card)
                {
                    if(num == card.number)
                    {
                        hasFound = true;
                    }
                });
                hasError = !hasFound;
            }
        });
        if(!hasError)
        {
            curFanAry.push(enums.Fan_type.QinLong);
            disAbleFanAry.push(enums.Fan_type.LianLiu,enums.Fan_type.LaoShaoFu);
            return true;
        }
    }
    return false;
};

function sortNumber(x,y)
{
    if (x == null)
    {
        if (y == null)
        {
            return 0;
        }
        return 1;
    }
    if (y == null)
    {
        return -1;
    }
    return x.number - y.number;
}

/**
 * 24.	一色三步高：牌型由一种花色的三幅顺子，且序数依次递增1或2。
 比如“123 345 456 ”，“123 345 567”
 注：“123 234 345 567“只能算1个一色三步高加计1个连六（234与567）
 */
multipleHelper.isYiSeSanBuGao= function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.YiSeSanBuGao))
    {
        return false;
    }
    var allShunZi = allCards.shunZi.concat(allCards.bShunZi);

    if(allShunZi.length == 9)
    {
        var startNumAry = [];
        allShunZi.forEach(function(card,index)
        {
            if(index%3 == 0 )
            {
                startNumAry.push(card.number);
            }
        });

        startNumAry.sort();

        for(var i= startNumAry.length;i >= 0;i--)
        {
            if(startNumAry[i] - startNumAry[i-1] == 0 || startNumAry[i] - startNumAry[i-1] > 2)
            {
                return false;
            }
        }
        curFanAry.push(enums.Fan_type.YiSeSanBuGao);
        return true;
    }
    return false;
};


/**
 * 25.	三暗刻：由3副同花色暗刻或暗杠组成的牌型。（万字牌或者字牌）
 不计算“双暗刻”，“暗刻”
 若三暗刻与一般高同时成型时，只算最高的三暗刻。
 */
multipleHelper.isSanAnKe = function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.SanAnKe))
    {
        return false;
    }
    console.log("isSanAnKe");
    var DBar = allCards.bDarkBar.concat(allCards.bar);
    var DKeZi = allCards.keZi;
    var wordCount = 0;
    var ziCount = 0;
    var wordCountKeZi = 0;
    var ziCountKeZi = 0;
    if(DBar.length + DKeZi.length < 9)
    {
        return false;
    }

    DBar.forEach(function(card)
    {
        if(self.cardIsWord(card))
        {
            wordCount ++ ;
        }
        else
        {
            ziCount ++;
        }
    });

    DKeZi.forEach(function(card)
    {
        if(self.cardIsWord(card))
        {
            wordCountKeZi ++ ;
        }
        else
        {
            ziCountKeZi ++;
        }
    });

    if(wordCount/4 + wordCountKeZi/3 >= 3 || ziCount/4 + ziCountKeZi/3 >= 3)
    {
        curFanAry.push(enums.Fan_type.SanAnKe);
        disAbleFanAry.push(enums.Fan_type.ShuangAnKe,enums.Fan_type.YiBanGao);
        return true;
    }
    return false;
};

// 12 番

/**
 * 和牌的牌型中有3副风牌的刻子
 */
multipleHelper.isSanFenKe = function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.SanFengKe))
    {
        return false;
    }
    var keZiCards = allCards.allKeZi;
    var count = 0;
    keZiCards.forEach(function(card)
    {
        if(self.cardIsWind(card))
        {
            count++;
        }
    });

    if(count >= 9)
    {
        curFanAry.push(enums.Fan_type.SanFengKe);
        return true;
    }
    return false;
};

/**
 *29 大于5 和牌的牌型中，由万字牌6789的顺子，刻子，将牌组成。允许7对。
 不计算“无字”
 */
multipleHelper.isDaYuWu= function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.DaYuWu))
    {
        return false;
    }

    var foundNotFit = false;
    allCards.all.forEach(function(card)
    {
        if(!foundNotFit && (card.number <= 5 || card.number > 9))
        {
            foundNotFit =  true;
        }
    });

    if(foundNotFit)
    {
        return false;
    }
    else
    {
        curFanAry.push(enums.Fan_type.DaYuWu);
        disAbleFanAry.push(enums.Fan_type.WuZi);
        return true;
    }
};

/**
 * 30 小于5 和牌的牌型中，由万字牌1234的顺子，刻子，将牌组成。允许7对。
 不计“算无字”
 */
multipleHelper.isXiaoYuWu = function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.XiaoYuWu))
    {
        return false;
    }

    var foundNotFit = false;
    allCards.all.forEach(function(card)
    {
        if(!foundNotFit && card.number >= 5)
        {
            foundNotFit = true;
        }
    });

    if(foundNotFit)
    {
        return false;
    }
    else
    {
        curFanAry.push(enums.Fan_type.XiaoYuWu);
        disAbleFanAry.push(enums.Fan_type.WuZi);
        return true;
    }
};

// 6番

/**
 * 36.	碰碰和：由4副刻子（或杠），将牌组成的和牌。
 */
multipleHelper.isPengPengHe = function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.PenPenHe))
    {
        return false;
    }
    if(!this.needCalculator(curFanAry,enums.Fan_type.LianQiDui))
    {
        return false;
    }

    if(!this.needCalculator(curFanAry,enums.Fan_type.QiDui))
    {
        return false;
    }

    var shunZi = allCards.shunZi.concat(allCards.bShunZi);
    if(shunZi.length == 0)
    {
        curFanAry.push(enums.Fan_type.PenPenHe);
        return true;
    }
    return false;
};

/**
 * 37.	混一色：由一种花色的序数牌（万字）与字牌组成
 */
multipleHelper.isHunYiSe = function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.HunYiSe))
    {
        return false;
    }

    var haveZiPai = false;
    var hasWordPai = false;
    allCards.all.forEach(function(card)
    {
        if(!hasWordPai && card.number < 10)
        {
            hasWordPai = true;
        }

        if(!haveZiPai && card.number > 9)
        {
            haveZiPai = true;
        }
    });
    if(haveZiPai && hasWordPai)
    {
        curFanAry.push(enums.Fan_type.HunYiSe);
        return true;
    }
    else
    {
        return false;
    }
};

/**
 * 38.	双暗杠：和牌的牌型中有2副暗杠。
 不计算“暗杠”，“双暗刻”。
 */
multipleHelper.isShuangAnGang = function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.ShuangAnGang))
    {
        return false;
    }
    if(allCards.bDarkBar.length + allCards.bar.length >= 8)
    {
        curFanAry.push(enums.Fan_type.ShuangAnGang);

        disAbleFanAry.push(enums.Fan_type.AnGang,
            enums.Fan_type.ShuangAnKe);
        return true;
    }
    return false;
};

/**
 * 39.	双箭刻：和牌的牌型中有中，发，白，3副箭牌中的任意2副组成的2副箭刻（可以明暗杠）
 不计算“箭刻”
 */
multipleHelper.isShuangJianKe = function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.ShuangJianKe))
    {
        return false;
    }
    var keZi = allCards.allKeZi;
    var bar = allCards.allBar;

    var kNum = 0;
    keZi.forEach(function(card)
    {
        if(self.cardIsArrow(card))
        {
            kNum ++ ;
        }
    });

    var bNum = 0;
    bar.forEach(function(card)
    {
        if(self.cardIsArrow(card))
        {
            bNum ++ ;
        }
    });

    if(parseInt(kNum/3) + parseInt(bNum/4) == 2)
    {
        curFanAry.push(enums.Fan_type.ShuangJianKe);
        disAbleFanAry.push(enums.Fan_type.JianKe);
        return true;
    }

    return false;
};


/**
 40.	全求人：全靠吃牌，碰牌，单钓别人打出的牌而和牌。
 不计算“单钓”
 注：听牌时，手中只有1张牌未亮明，如果自摸到最后这张牌，不能算求人。
 */

multipleHelper.isQuanQiuRen = function(allCards,curFanAry,disAbleFanAry,curPlayer)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.QuanQiuRen))
    {
        return false;
    }
    if(allCards.handCard.length == 2 && curPlayer.partLvl == 1
        && allCards.allBar.length == 0)
    {
        curFanAry.push(enums.Fan_type.QuanQiuRen);
        disAbleFanAry.push(enums.Fan_type.DanDiaoJiang);
        return true;
    }
    return false;
};

/**
 * 42.	不求人：该局牌中玩家不吃，不碰，不明杠，全靠自己摸牌进入听牌状态。最后自摸和牌。
 不计算“明杠“
 */
// 4番
multipleHelper.isBuQiuRen = function(allCards,curFanAry,disAbleFanAry,curPlayer)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.BuQiuRen))
    {
        return false;
    }
    if(allCards.bLightBar.length +  allCards.bLightKeZi.length + allCards.bShunZi.length == 0&& curPlayer.partLvl == 3)
    {
        curFanAry.push(enums.Fan_type.BuQiuRen);
        return true;
    }
    return false;
};



/**
 * 43.	双明杠：和牌的牌型中有2副明杠。
 不计算“明杠“
 */
multipleHelper.isShuangMingGang = function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.ShuangMingGang))
    {
        return false;
    }

    var bar = allCards.bLightBar;
    if(bar.length >= 8)
    {
        curFanAry.push(enums.Fan_type.ShuangMingGang);
        disAbleFanAry.push(enums.Fan_type.MingGang);
        return true;
    }
    return false;
};


// 2番
/**
 * 45.	箭刻：由中，发，白3张相同的牌组成的刻子,和牌牌型中有1副。
 */
multipleHelper.isJianKe = function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.JianKe))
    {
        return false;
    }
    var count = 0;
    var keZi = allCards.allKeZi;
    keZi.forEach(function(card)
    {
        if(self.cardIsArrow(card))
        {
            count ++;
        }
    });
    if(count  == 3)
    {
        curFanAry.push(enums.Fan_type.JianKe);
        return true;
    }
    return false;
};

/**
 * 46.	圈风刻：与圈风相同的风刻。
 注：2个玩家各做一次庄，叫做一圈。
 圈风为：第1圈是“东风圈”，第2圈是“南风圈”，第3圈是“西风圈”，第4圈是“北风圈”。
 依次循环。如果玩家在东风圈时碰了东风，便是圈风刻。
 */
multipleHelper.isQuanFenKe = function(allCards,curFanAry,disAbleFanAry,windNum)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.QuanFenKe))
    {
        return false;
    }

    var isWind = false;
    allCards.bLightKeZi.forEach(function(card)
    {
       if(card.number == windNum)
       {
           isWind = true;
       }
    });

    if(isWind)
    {
        curFanAry.push(enums.Fan_type.QuanFenKe);
        return true;
    }
    return false;
};

/**
 * 47.	门前清：该局牌中玩家没有吃，碰，明杠，4个组合全由自己摸牌组成，最后和了对方打出的牌。
 */
multipleHelper.isMenQianQing = function(allCards,curFanAry,disAbleFanAry,curPlayer)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.MenQianQin))
    {
        return false;
    }

    if(allCards.bLightBar.length + allCards.bLightKeZi.length + allCards.bShunZi.length == 0 && curPlayer.partLvl == 1)
    {
        curFanAry.push(enums.Fan_type.MenQianQin);
        return true;
    }
    return false;
};

/**
 * 48.	平和：由4副顺子及序数牌做将组成的和牌。边、坎、钓不影响平和
 不计算“无字“
 */
multipleHelper.isPingHe = function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.PinHe))
    {
        return false;
    }
    var shunZi = allCards.shunZi.concat(allCards.bShunZi);
    var hasError = false;
    allCards.jiang.forEach(function(card)
    {
       if(!self.cardIsWord(card))
       {
           hasError = true;
       }
    });
    if(!hasError && shunZi.length >= 12 )
    {
        curFanAry.push(enums.Fan_type.PinHe);
        disAbleFanAry.push(enums.Fan_type.WuZi);
        return true;
    }
    return false;
};

/**
 * 49.	四归一：和牌中，有4张相同的牌归于一家的顺，刻子，对，将牌中（不包括杠牌）
 举例：二万四归一，你的牌里面有1.2.2.2.2.3万，凑成1.2.3万一顺，2.2.2万一刻，这时候就是四归一了
 允许重复计算。
 */
multipleHelper.isSiGuiYi = function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.SiGuiYi))
    {
        return false;
    }
    var flipCards = allCards.handCard.concat(allCards.bShunZi).concat(allCards.bLightKeZi);
    var Cards = cardHelper.findCards(flipCards,enums.card_sytle_type.Bar).findCards;
    var count = parseInt(Cards.length/4);
    if(count > 0)
    {
        for(var i = 0;i<count;i++)
        {
            curFanAry.push(enums.Fan_type.SiGuiYi);
        }
        return true;
    }
    return false;
};

/**
 * 50.	双暗刻：2副暗刻
 */
multipleHelper.isShuangAnKe = function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.ShuangAnKe))
    {
        return false;
    }
    if(allCards.keZi.length/3  + allCards.bDarkBar.length/4 >= 2)
    {
        curFanAry.push(enums.Fan_type.ShuangAnKe);
        return true;
    }
    return false;
};

/**
 * 暗杠
 * 自摸4张相同的牌开杠。
 */
multipleHelper.isAnGang = function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.AnGang))
    {
        return false;
    }
    var k = allCards.bDarkBar.length;
    if(k >0)
    {
        var m = k/4;
        for(var i = 0;i<m;i++)
        {
            curFanAry.push(enums.Fan_type.AnGang);
        }
        return true;
    }
    return false;
};

/**
 * 52.	断幺：和牌中没有“一”，“九”以及字牌。
 */
multipleHelper.isDuanYao = function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.DuanYao))
    {
        return false;
    }
    var found = true;
    allCards.all.forEach(function(card)
    {
        if(card.number == 1 || card.number >= 9 )
        {
            found =  false;
        }
    });
    if(found)
    {
        curFanAry.push(enums.Fan_type.DuanYao);
        return true;
    }
    else
    {
        return false;
    }

};

// 1番
/**
 * 53.	一般高：由一种花色2副相同的顺子组成的牌。允许重复计算。
 */
multipleHelper.isYiBanGao = function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.YiBanGao))
    {
        return false;
    }
    var shunZi = allCards.shunZi.concat(allCards.bShunZi);

    if(shunZi.length ==0 )
    {
        return false;
    }
    var totalNum = [];
    for(var i=0;i<shunZi.length;i=i+3)
    {
        var num = shunZi[i].number+shunZi[i+1].number+shunZi[i+2].number;
        totalNum.push(num);
    }
    var count = 0;
    totalNum.forEach(function(num1,index1)
    {
        if(num1 != 0)
        {
            totalNum.forEach(function(num2,index2)
            {
                if(num1 == num2 && num2 != 0 && index1 != index2)
                {
                    count ++;
                    totalNum[index1] = totalNum[index2] = 0;
                }
            });
        }
    });
    if(count > 0)
    {
        for(var i=0;i<count;i++)
        {
            curFanAry.push(enums.Fan_type.YiBanGao);
        }
        return true;
    }
    return false;
};

/**
 * 55.	连六：一种花色6张相连的序数牌。允许重复计算。并且允许在对子中出现。
 */
multipleHelper.isLianLiu = function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.LianLiu))
    {
        return false;
    }
    var wanCards = [];
    allCards.all.forEach(function(card)
    {
        if(self.cardIsWord(card))
        {
            wanCards.push(card.number);
        }
    });

    if(wanCards.length >= 6)
    {
        var count = 0;
        wanCards.sort();
        var findCards = [];
        for(var i =0 ;i< wanCards.length;i++)
        {
            var cardNumber = wanCards[i];
           if(cardNumber == 0 )
           {
               break;
           }
            var numA =  cardNumber +1;
            var numB =  cardNumber +2;
            var numC =  cardNumber +3;
            var numD =  cardNumber +4;
            var numE =  cardNumber +5;

            var ARes = this.hasSameNum(wanCards,numA);
            var BRes = this.hasSameNum(wanCards,numB);
            var CRes = this.hasSameNum(wanCards,numC);
            var DRes = this.hasSameNum(wanCards,numD);
            var ERes = this.hasSameNum(wanCards,numE);

            if(ARes != -1 && BRes != -1 && CRes != -1 && DRes != -1 && ERes != -1)
            {
                wanCards[i]= 0;
                wanCards[ARes]= 0;
                wanCards[BRes]= 0;
                wanCards[CRes]= 0;
                wanCards[DRes] = 0;
                wanCards[ERes] = 0;
                count ++;
            }
        }
        if(count >0)
        {
            for(var i=0;i<count;i++)
            {
                curFanAry.push(enums.Fan_type.LianLiu);
            }
            return true;
        }
    }
    return false;
};

multipleHelper.hasSameNum = function(allNum,compareNum)
{
    var hasFoundIndex = -1;
    allNum.forEach(function(num,index)
    {
        if(hasFoundIndex == -1 && num == compareNum)
        {
            hasFoundIndex = index;
        }
    });
    return hasFoundIndex;
};

multipleHelper.hasSameCard = function(handCard,compareCard)
{
    var aryIndex = -1;
    handCard.forEach(function(card,index)
    {
        if(aryIndex == -1 && card.number == compareCard.number)
        {
            aryIndex =  index;
        }
    });
    return aryIndex;
};

/**
 * 56.	老少副：一种花色牌的123,789两幅顺子。允许重复计算
 */
multipleHelper.isLaoShaoFu = function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.LaoShaoFu))
    {
        return false;
    }
    var shunZi = allCards.shunZi.concat(allCards.bShunZi);

    if(shunZi.length >= 6)
    {
        var findACount = 0;
        var findBCount = 0;
        var totalNum = [];
        for(var i=0;i<shunZi.length;i=i+3)
        {
            var num = shunZi[i].number+shunZi[i+1].number+shunZi[i+2].number;
            totalNum.push(num);
        }
        totalNum.forEach(function(num,index)
        {
            if(num == 6)
            {
                findACount ++;
            }
            else if(num == 24)
            {
                findBCount ++;
            }
        });

        if(findACount != 0 && findBCount != 0)
        {
            var realCount = findACount;
            if(findACount > findBCount)
            {
                realCount = findBCount;
            }
            for(var i=0;i<realCount;i++)
            {
                curFanAry.push(enums.Fan_type.LaoShaoFu);
            }
            return true;
        }
    }
    return false;
};

/**
 * 57.	幺九刻：3张相同的一，九序数牌或字牌组成的刻子（杠）.允许重复计算。
 */
multipleHelper.isYaoJiuKe = function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.YaoJiuKe))
    {
        return false;
    }
    var keZi = allCards.allKeZi;
    var bar = allCards.allBar;
    var countA = 0;
    var countB = 0;
    keZi.forEach(function(card)
    {
        if(card.number == 1 || card.number >= 9)
        {
            countA ++;
        }
    });

    bar.forEach(function(card)
    {
        if(card.number == 1 ||card.number >= 9)
        {
            countB ++;
        }
    });

    if(countA !=0 || countB != 0)
    {
        var realCount = parseInt(countA/3) + parseInt(countB/4);
        for(var i = 0;i< realCount;i++)
        {
            curFanAry.push(enums.Fan_type.YaoJiuKe);
        }
        return true;
    }
    return false;
};

/**
 * 58.	明杠：自己有暗刻，碰了别人打出的一张相同的牌开杠。或者自己抓进一张与碰的明刻相同的牌开杠。
 */
multipleHelper.isMingGang = function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.MingGang))
    {
        return false;
    }
    if(allCards.bLightBar.length > 0)
    {
        curFanAry.push(enums.Fan_type.MingGang);
        return true;
    }
    return false;
};

/**
 * 59. 边张
 * 单和123的3及789的7或1233和3,7789和7都为张。手中有12345和3,56789和7好不算张。
 */
multipleHelper.isBianZhang = function(allCards,curFanAry,disAbleFanAry,last_card)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.BianZhang))
    {
        return false;
    }
    if(last_card == 3 || last_card == 7)
    {
        var hasError = true;
        allCards.shunZi.forEach(function(card,index)
        {
            if(last_card == 3)
            {
                if(card.number == last_card && index %3 == 2){
                    hasError = false;
                }
            }
            else
            {
                if(card.number == last_card && index %3 == 0){
                    hasError = false;
                }
            }

        });

        if(!hasError)
        {
            var numAry = [];
            var removePre = false;
            var removeCur = false;
            var removeNext = false;
            var baseNum = 4;

            allCards.handCard.forEach(function(card)
            {
                var canAdd = false;
                var tempNum = 0;

                if(last_card == 3)
                {
                    tempNum = 1;
                }
                else
                {
                    tempNum = 7;
                }

                if(!removeCur && card.number == tempNum)
                {
                    removeCur = true;
                    canAdd = true;
                    var tempCard = new Card();
                    tempCard.number = baseNum;
                    numAry.push(tempCard);
                }

                if(!removePre && card.number == tempNum +1)
                {
                    removePre = true;
                    canAdd = true;
                    var tempCard = new Card();
                    tempCard.number = baseNum + 1;
                    numAry.push(tempCard);
                }
                if(!removeNext && card.number == tempNum +2)
                {
                    removeNext = true;
                    canAdd = true;
                    var tempCard = new Card();
                    tempCard.number = baseNum +2;
                    numAry.push(tempCard);
                }

                if(!canAdd)
                {
                    numAry.push(card);
                }
            });

            var heCheck = new CardHu(numAry);
            var huRes =  heCheck.isHu(true);
            if(huRes)
            {
                curFanAry.push(enums.Fan_type.BianZhang);
                return true;
            }
        }
    }
    return false;
};

/**
 * 59.坎张
 * 和2张牌之间的牌。4556和5也为坎张，手中有44467和6不算坎张
 */
multipleHelper.isKanZhang = function(allCards,curFanAry,disAbleFanAry,last_card)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.KanZhang))
    {
        return false;
    }

    var hasError = true;
    if(last_card == 1 ||  last_card == 9)
    {
        return false;
    }

    var shunCardsAry = [];
    if(allCards.jiang.length != 2)
    {
        //need remove
        shunCardsAry = allCards.shunZi;
    }
    else
    {
        var tempAllAry = [];
        var tempShunAry = [];
        allCards.all.forEach(function(card)
        {
            tempAllAry.push(card.number);
        });

        allCards.jiang.forEach(function(jiangCard)
        {
            var hasRemove = false;
            tempAllAry.forEach(function(num,index)
            {
                if(!hasRemove && jiangCard.number == num)
                {
                    hasRemove = true;
                    tempAllAry[index] = -1;
                }
            })
        });
        tempAllAry.forEach(function(num)
        {
           if(num != -1)
           {
               var tempCard = new Card();
               tempCard.number = num;
               tempShunAry.push(tempCard);
           }
        });
        shunCardsAry = cardHelper.findOrderCardsForMulti(tempShunAry);
    }

    shunCardsAry.forEach(function(card,index)
    {
        if(card.number == last_card && index %3 == 1){
            hasError = false;
        }
    });

    if(!hasError)
    {
        var numAry = [];
        var removePre = false;
        var removeCur = false;
        var removeNext = false;
        var tempNum = last_card;

        var baseNum = 2;
        if(last_card == 2)
        {
            baseNum = 3;
        }

        allCards.handCard.forEach(function(card,index)
        {
            var canAdd = false;
            if(!removeCur && card.number == tempNum)
            {
                removeCur = true;
                canAdd = true;
                var tempCard = new Card();
                tempCard.number = baseNum;
                numAry.push(tempCard);
            }

            if(!removePre && card.number == tempNum - 1)
            {
                removePre = true;
                canAdd = true;
                var tempCard = new Card();
                tempCard.number = baseNum-1;
                numAry.push(tempCard);
            }
            if(!removeNext && card.number == tempNum +1)
            {
                removeNext = true;
                canAdd = true;
                var tempCard = new Card();
                tempCard.number = baseNum +1;
                numAry.push(tempCard);
            }
            if(!canAdd)
            {
                numAry.push(card);
            }
        });

        var heCheck = new CardHu(numAry);
        var huRes =  heCheck.isHu(true);
        if(huRes)
        {
            curFanAry.push(enums.Fan_type.KanZhang);
            return true;
        }
    }
    return false;
};

/**
 * 59.	缺一门：和牌中缺少一种花色序数牌。
 */
multipleHelper.isQueYiMeng = function(allCards,curFanAry,disAbleFanAry)
{
    return false;
//    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.QueYiMen))
//    {
//        return false;
//    }
//    var hasFound = true;
//    allCards.all.forEach(function(card)
//    {
//        if(self.cardIsWord(card))
//        {
//            hasFound =  false;
//        }
//    });
//    if(hasFound)
//    {
//        curFanAry.push(enums.Fan_type.QueYiMen);
//        return true;
//    }
//    else
//    {
//        return false;
//    }
};

/**
 * 60.	无字：和牌中没有风，箭牌。
 */
multipleHelper.isWuZi = function(allCards,curFanAry,disAbleFanAry)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.WuZi))
    {
        return false;
    }
    var hasFound = true;
    allCards.all.forEach(function(card)
    {
        if(card.number >9 )
        {
            hasFound = false;
        }
    });
    if(hasFound)
    {
        curFanAry.push(enums.Fan_type.WuZi);
        return true;
    }
    else
    {
        return false;
    }
};

/**
 * 61 钓单张牌做将成和牌。
 */
multipleHelper.isDanDiaoJiang = function(allCards,curFanAry,disAbleFanAry,curPlayer)
{
    if(!this.needCalculator(disAbleFanAry,enums.Fan_type.DanDiaoJiang))
    {
        return false;
    }
    if(allCards.handCard.length == 2)
    {
        curFanAry.push(enums.Fan_type.DanDiaoJiang);
        return true;
    }
    return false;
};












