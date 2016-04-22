/**
 * Created by David_shen on 7/25/14.
 */
var enums = require('./enum');

module.exports = cardHuBalance;

function cardHuBalance(cards)
{
    if(cards)
    {
        this.handCard = cards;
    }
    else
    {
        this.handCard = [];
    }

    this.wAry = [];
    this.ZAry = [];
    this.jiang = false;//是否找到将
    this.huase = function(hua)
    {
        if (hua.length==7)
        {
            //判断字，自比较特殊，没有顺
            for (var i=0;i<hua.length ;i++ )
            {
                if (hua[i]==3||hua[i]==4)
                {
                    hua[i]=0;
                    this.huase(hua);
                }
                //如果字有两个，肯定是将
                if (hua[i]==2&&!this.jiang)
                {
                    hua[i]=0;
                    this.jiang=true;
                    this.huase(hua);
                }
            }
        }
        else
        {
            for (var i=0;i<hua.length ;i++ )
            {
                //如果没有将，先把将减出去
                if (!this.jiang&&hua[i]>=2)
                {
                    hua[i]=hua[i]-2;
                    this.jiang=true;
                    var fanhui= this.huase(hua);
                    //如果递归回来依旧没有减完，则把将加回去
                    if (fanhui!=0)
                    {
                        hua[i]=hua[i]+2;
                        this.jiang=false;
                    }
                }
                if (hua[i]!=0&&i<7&&hua[i+1]!=0&&hua[i+2]!=0)
                {
                    hua[i]--;
                    hua[i+1]--;
                    hua[i+2]--;
                    this.huase(hua);
                    var fanhui= this.huase(hua);
                    //如果递归回来依旧没有减完，减去的加回去
                    if (fanhui!=0)
                    {
                        hua[i]++;
                        hua[i+1]++;
                        hua[i+2]++;
                    }
                }
                if (hua[i]==3||hua[i]==4)
                {
                    var temp=hua[i];
                    hua[i]=0;
                    this.huase(hua);
                    var fanhui= this.huase(hua);
                    //如果递归回来依旧没有减完，减去的加回去
                    if (fanhui!=0)
                    {
                        hua[i]++;
                        hua[i]=temp;
                    }
                }
            }
        }
        var re=0;
        //最后判断减没减完
        for (var i =0;i<hua.length ;i++ )
        {
            re=re+hua[i];
        }
        return re;
    };

    this.sortHandCard = function()
    {
        var w = [0,0,0,0,0,0,0,0,0];
        var z = [0,0,0,0,0,0,0];
//        console.log(this.handCard);
        this.handCard.forEach(function(card)
        {
            var aryIndex = 0;
            if(card.number > 9)    //字
            {
                aryIndex = card.number - 10;
                z[aryIndex] ++;
            }
            else                  //万字
            {
                aryIndex = card.number -1;
                w[aryIndex] ++;
            }
        });

        this.wAry = w;
        this.ZAry = z;
    };

    this.isQiDui = function()
    {
        var jiangCount = 0;
        this.wAry.forEach(function(num)
        {
            if(num % 2 == 0 && num != 0)
            {
                jiangCount += parseInt(num/2);
            }
        });

        this.ZAry.forEach(function(numZ)
        {
            if(numZ % 2 == 0 && numZ != 0)
            {
                jiangCount += parseInt(numZ/2);
            }
        });

        if(jiangCount == 7)
        {
            return true;
        }
        return false;
    };

    this.isHu = function(needSort)
    {
        if(needSort)
        {
            this.sortHandCard();
        }

        //七对判断
        if(this.handCard.length == 14 && this.isQiDui())
        {
            return true;
        }

        if(this.huase(this.wAry) == 0 && this.huase(this.ZAry)==0 && this.jiang)
        {
            return true;
        }
        return false;
    }
}