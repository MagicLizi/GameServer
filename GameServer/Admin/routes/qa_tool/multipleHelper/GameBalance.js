/**
 * Created by David_shen on 6/20/14.
 */

var GameBalance = module.exports;
var MultipleHelper = require("./multipleHelper");
var enums = require("./enum");

GameBalance.calculator88 = function(allCard,curFanAry,disAbleFanAry,curPlayer,table)
{
   if(MultipleHelper.isDaSiXi(allCard,curFanAry,disAbleFanAry))
   {

   }
   else if(MultipleHelper.isDaSanYuan(allCard,curFanAry,disAbleFanAry))
   {

   }
   else if(MultipleHelper.isJiuBaoLianDeng(allCard,curFanAry,disAbleFanAry))
   {

   }
   else if(MultipleHelper.isSiBar(allCard,curFanAry,disAbleFanAry))
   {

   }
   else if(MultipleHelper.isLianQiDui(allCard,curFanAry,disAbleFanAry,curPlayer))
   {

   }
   else if(MultipleHelper.isBaiWanShi(allCard,curFanAry,disAbleFanAry))
   {

   }
   else
   {
//       console.log("others calculator88");
   }
   this.calculator64(allCard,curFanAry,disAbleFanAry,curPlayer,table);
};


GameBalance.calculator64 = function(allCard,curFanAry,disAbleFanAry,curPlayer,table)
{
   if(MultipleHelper.isXiaoSiXi(allCard,curFanAry,disAbleFanAry))
   {

   }
   else if(MultipleHelper.isXiaoSanYuan(allCard,curFanAry,disAbleFanAry))
   {

   }
   else if(MultipleHelper.isZiYiSe(allCard,curFanAry,disAbleFanAry))
   {

   }
   else if(MultipleHelper.isSiAnKe(allCard,curFanAry,disAbleFanAry))
   {

   }
   else if(MultipleHelper.isYiSeShuangLongHui(allCard,curFanAry,disAbleFanAry))
   {

   }
   else
   {
//       console.log("others calculator64");
   }
   this.calculator48(allCard,curFanAry,disAbleFanAry,curPlayer,table);

};

GameBalance.calculator48 = function(allCard,curFanAry,disAbleFanAry,curPlayer,table)
{
   if(MultipleHelper.isYiSeSiTongShun(allCard,curFanAry,disAbleFanAry))
   {

   }
   else if(MultipleHelper.isYiSeSiJieGao(allCard,curFanAry,disAbleFanAry))
   {

   }
   else
   {
//       console.log("others calculator48");
   }
   this.calculator32(allCard,curFanAry,disAbleFanAry,curPlayer,table);
};


GameBalance.calculator32 = function(allCard,curFanAry,disAbleFanAry,curPlayer,table)
{
    if(MultipleHelper.isYiSeSiBuGao(allCard,curFanAry,disAbleFanAry))
    {

    }
    else if(MultipleHelper.isSanGang(allCard,curFanAry,disAbleFanAry))
    {

    }
    else if(MultipleHelper.isHunYaoJiu(allCard,curFanAry,disAbleFanAry))
    {

    }
    else
    {
//        console.log("others calculator32");
    }
    this.calculator24(allCard,curFanAry,disAbleFanAry,curPlayer,table);
};

GameBalance.calculator24 = function(allCard,curFanAry,disAbleFanAry,curPlayer,table)
{
    if(MultipleHelper.isQiDui(allCard,curFanAry,disAbleFanAry))
    {

    }
    else if(MultipleHelper.isQinYiSe(allCard,curFanAry,disAbleFanAry))
    {

    }
    else if(MultipleHelper.isYiSeSanTongShun(allCard,curFanAry,disAbleFanAry))
    {

    }
    else if(MultipleHelper.isYiSeSanJieGao(allCard,curFanAry,disAbleFanAry))
    {

    }
    else
    {
//        console.log("others calculator24");
    }
    this.calculator16(allCard,curFanAry,disAbleFanAry,curPlayer,table);
};

GameBalance.calculator16  = function(allCard,curFanAry,disAbleFanAry,curPlayer,table) {
    if(MultipleHelper.isQinLong(allCard,curFanAry,disAbleFanAry))
    {

    }
    else if(MultipleHelper.isYiSeSanBuGao(allCard,curFanAry,disAbleFanAry))
    {

    }
    else if(MultipleHelper.isSanAnKe(allCard,curFanAry,disAbleFanAry))
    {

    }
    else
    {
//        console.log("others calculator16");
    }
    this.calculator12(allCard,curFanAry,disAbleFanAry,curPlayer,table);
};

GameBalance.calculator12  = function(allCard,curFanAry,disAbleFanAry,curPlayer,table) {
    if(MultipleHelper.isSanFenKe(allCard,curFanAry,disAbleFanAry))
    {

    }
    else if(MultipleHelper.isDaYuWu(allCard,curFanAry,disAbleFanAry))
    {

    }
    else if(MultipleHelper.isXiaoYuWu(allCard,curFanAry,disAbleFanAry))
    {

    }
    else
    {
//        console.log("others calculator12");
    }
    this.calculatorOthers(allCard,curFanAry,disAbleFanAry,curPlayer,table);
};

GameBalance.calculatorOthers  = function(allCard,curFanAry,disAbleFanAry,curPlayer,table) {

    //6
    MultipleHelper.isPengPengHe(allCard,curFanAry,disAbleFanAry);
    MultipleHelper.isHunYiSe(allCard,curFanAry,disAbleFanAry);
    MultipleHelper.isShuangAnGang(allCard,curFanAry,disAbleFanAry);
    MultipleHelper.isShuangJianKe(allCard,curFanAry,disAbleFanAry);
    MultipleHelper.isQuanQiuRen(allCard,curFanAry,disAbleFanAry,curPlayer);
    //4
    MultipleHelper.isBuQiuRen(allCard,curFanAry,disAbleFanAry,curPlayer);
    MultipleHelper.isShuangMingGang(allCard,curFanAry,disAbleFanAry);

    //2
    MultipleHelper.isJianKe(allCard,curFanAry,disAbleFanAry);
    MultipleHelper.isQuanFenKe(allCard,curFanAry,disAbleFanAry,table.cur_round_wind);
    MultipleHelper.isMenQianQing(allCard,curFanAry,disAbleFanAry,curPlayer);
    MultipleHelper.isPingHe(allCard,curFanAry,disAbleFanAry);
    MultipleHelper.isSiGuiYi(allCard,curFanAry,disAbleFanAry);
    MultipleHelper.isShuangAnKe(allCard,curFanAry,disAbleFanAry);
    MultipleHelper.isAnGang(allCard,curFanAry,disAbleFanAry);
    MultipleHelper.isDuanYao(allCard,curFanAry,disAbleFanAry);

    //1
    MultipleHelper.isYiBanGao(allCard,curFanAry,disAbleFanAry);

    MultipleHelper.isLianLiu(allCard,curFanAry,disAbleFanAry);

    MultipleHelper.isLaoShaoFu(allCard,curFanAry,disAbleFanAry);

    MultipleHelper.isYaoJiuKe(allCard,curFanAry,disAbleFanAry);

    MultipleHelper.isMingGang(allCard,curFanAry,disAbleFanAry);

    MultipleHelper.isQueYiMeng(allCard,curFanAry,disAbleFanAry);

    MultipleHelper.isWuZi(allCard,curFanAry,disAbleFanAry);

    MultipleHelper.isBianZhang(allCard,curFanAry,disAbleFanAry,curPlayer.last_card);

    MultipleHelper.isKanZhang(allCard,curFanAry,disAbleFanAry,curPlayer.last_card);

    MultipleHelper.isDanDiaoJiang(allCard,curFanAry,disAbleFanAry,curPlayer);
};


GameBalance.calculatorMultiple = function(curPlayer,table)
{
   var handCard = curPlayer.handCard;
   var beside =  curPlayer.besideCard;

   var allCards = MultipleHelper.getAllKindCards(handCard,beside);
   var curFanAry = [];
   var disAbleFanAry = [];
   this.calculator88(allCards,curFanAry,disAbleFanAry,curPlayer,table);


   if(curPlayer.partLvl == 3)
   {
       //自摸
       if(table.round_count == 3 && !curPlayer.is_banker)
       {
           curFanAry.push(enums.Fan_type.DiHe);
       }
       if(table.leftCardCount == 0)
       {
           curFanAry.push(enums.Fan_type.MiaoShouHuiChun);
       }
       else
       {
           var length = curPlayer.specialAction.length;
           if(length >0 &&
               curPlayer.specialAction[length - 1] == enums.Behavior_type.GetCard  &&
               (curPlayer.specialAction[length - 2] == enums.Behavior_type.Gang ||
                   curPlayer.specialAction[length - 2] == enums.Behavior_type.DarkGang ||
                   curPlayer.specialAction[length - 2] == enums.Behavior_type.LightGangBeside))
           {
               curFanAry.push(enums.Fan_type.GangShangKaiHua);
           }
           else
           {
               curFanAry.push(enums.Fan_type.ZiMo);
           }
       }
   }

    if(curPlayer.partLvl == 1 && table.leftCardCount == 0)
    {
        curFanAry.push(enums.Fan_type.HaiDiLaoYue);
    }

    if(curPlayer.is_banker &&  table.round_count == 1 && curPlayer.partLvl == 3)
    {
        curFanAry.push(enums.Fan_type.TianHe);
    }
    else if(!curPlayer.is_banker && table.round_count == 2  && curPlayer.partLvl == 1)
    {
        curFanAry.push(enums.Fan_type.RenHe);
    }

    if(curPlayer.tingRound >0 && curPlayer.tingRound <=2)
    {
        curFanAry.push(enums.Fan_type.TianTin);
    }

    if(curPlayer.huNeedCardNum.length > 0)
    {
        curFanAry.push(enums.Fan_type.BaoTing);
    }
    return curFanAry;
};
