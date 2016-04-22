/**
 * Created by David_shen on 7/2/14.
 */
var enums = require("./enum");
var Card = require("./card");
var cardHelper= module.exports;
/**
 * 筛选牌
 * @param handCard
 * @param cardType
 * @returns {Array}
 */
cardHelper.findCards = function(handCard,cardType)
{
    var cards = [];
    var leftCards = [];
    handCard.forEach(function(card){
        leftCards.push(card);
    });
    var number = 0;
    for(var i=0;i<handCard.length;i++)
    {
         for(var j=0;j<handCard.length;j++)
         {
            if(handCard[i].number == handCard[j].number)
            {
               number++;
            }
         }
        if(cardType == enums.card_sytle_type.Jiang)
        {
            if(number == 2)
            {
                cards.push(handCard[i]);
                leftCards.splice(i,1);
            }
        }
        else if(cardType == enums.card_sytle_type.KeZi)
        {
            if(number == 3)
            {
                cards.push(handCard[i]);
                leftCards.splice(i,1);
            }
        }
        else if(cardType == enums.card_sytle_type.Bar)
        {
            if(number == 4)
            {
                cards.push(handCard[i]);
                leftCards.splice(i,1);
            }
        }
        number = 0;
    }
    var resultAry = {
        findCards:cards,
        leftCards:leftCards
    };
    return resultAry;
};

cardHelper.findOrderCardsForMulti = function(handCard)
{
    var findCards = [];
    handCard.sort(sortNumber);

    var tempCards = [];
    for(var j = 0;j< handCard.length;j++)
    {
        var tempCard = new Card();
        tempCard.number = handCard[j].number;
        tempCards.push(tempCard);
    }

    for(var i =0 ;i< tempCards.length;i++)
    {
        var card = tempCards[i];
        if(card.number <= 7 && card.number > 0)
        {
            var cardA = new Card();
            var cardB = new Card();

            cardA.number = card.number + 1;

            cardB.number = card.number + 2;

            var indexA = this.getSameCardIndex(tempCards,cardA);
            var indexB = this.getSameCardIndex(tempCards,cardB);

            if(indexA!=-1 && indexB !=-1)
            {
                var oriCard = new Card();
                oriCard.number = card.number;
                findCards.push(oriCard);
                findCards.push(cardA);
                findCards.push(cardB);

                tempCards[i].number = 0;
                tempCards[indexA].number = 0;
                tempCards[indexB].number = 0;
            }
        }
    }
    return findCards;
};

cardHelper.getSameCardIndex = function(handCard,compareCard)
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


cardHelper.findSameCard = function(handCard,oriCard,isAll)
{
    var cards = [];
    handCard.forEach(function(card)
    {
        if(card.number == oriCard.number)
        {
            cards.push(card);
        }
    });
    if(isAll)
    {
        return cards;
    }
    else
    {
        return cards[0];
    }
};

cardHelper.hasCard = function(handCard,compareCard)
{
    var hasFound = false;
    handCard.forEach(function(card)
    {
        if(!hasFound && card.number == compareCard.number )
        {
            hasFound = true;
        }
    });
    return hasFound;
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