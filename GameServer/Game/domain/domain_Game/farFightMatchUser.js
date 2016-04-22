/**
 * Created by lizi on 15/9/10.
 */
var async = require('async');
var gameUserProvider = require("../../dao_provider/dao_Game/gameUser");
var farFightProvider = require("../../dao_provider/dao_Game/farFight");
var heroModel = require("../domain_Game/Hero");
module.exports = FarFightMatchUser;

function FarFightMatchUser(troopDate,heros,power)
{
    //console.log("inithero");
    //console.log("---------------");
    //console.log(troopDate);
    //console.log(heros);
    //if(troopDate == undefined)
    //{
    //    troopDate =
    //    {
    //        "User_Id":1,
    //        "userName":"无效用户",
    //        "userLvl":1,
    //        "avatarId":1,
    //        "avatarFramId":1
    //    }
    //}
    //console.log(heros);
    this.userId = troopDate.User_Id;
    this.userName =troopDate.Troop_Name;
    this.userLvl = troopDate.Troop_Lvl;
    this.avatarId = troopDate.Troop_Avatar_Id;
    this.avatarFramId = troopDate.Troop_Avatar_Frame_Id;
    this.hasAttacked = 0;
    this.power =power;

    this.defendHeros = [];
    for(var i = 0;i<heros.length;i++)
    {
        var hero = heros[i];
        hero.curLifePersent = 10000;
        hero.PassSkillEnergy = 0;
        hero.IniSkillEnergy = 0;
        this.defendHeros.push(hero);
    }
    this.state = 0;//0 未攻打 1 攻打中 2 已经被击败
}

FarFightMatchUser.InitMatchUsers = function(data,callback)
{
    var tasks = [];
    var j = 0;
    for(var i = 0;i<data.length;i++)
    {
        var task = function(cb)
        {
            var userData = data[j];
            var userId = userData["UserId"];
            var power = userData["CurPower"];
            j++;

            var tasks1 = [];

            var t1 = function(cb1)
            {
                //console.log("imm t1");
                //console.log(userId);
                gameUserProvider.getUserTroopByUserId(userId,cb1);
            };
            tasks1.push(t1);


            var t2 = function(cb2)
            {
                //console.log("imm t2");
                //console.log(userId);
                farFightProvider.getUserFarFightDefendHeros(userId,cb2);
            };
            tasks1.push(t2);

            async.series(tasks1,function(e,r)
            {
                if(e)
                {
                    cb(e,r);
                }
                else
                {
                    //console.log("lizi result");
                    //console.log(r);
                    var troopData = r[0][0];
                    var herosData = r[1];
                    var matchUser = new FarFightMatchUser(troopData,herosData,power);
                    cb(null,matchUser);
                }
            });
        };

        tasks.push(task);
    }

    async.series(tasks,function(error,result)
    {
        //console.log("r");
        //console.log(JSON.stringify(result));

        callback(error,result);
    });
};