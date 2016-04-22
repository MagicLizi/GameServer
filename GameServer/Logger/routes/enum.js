/**
 * Created by peihengyang on 14/12/9.
 */
var gameEnum = module.exports;

gameEnum.Stage_Type ={
    Normal:1,
    Special:2
};

gameEnum.Task_State = {
    None:0,
    FinishNoReward:1,
    FinishHasReward:2,
    HasOverTime:3,
    NotDone:4
};

gameEnum.Task_Type = {
    None:1,           //无目标
    OverStageTime:2, //完成指定关卡X次
    RechargeDiamond:3, //充值钻石X个
    TeamLvl:4,     //达到战队等级X级
    GetRewards:5,   //抽奖X次
    GetMoney:6,      //点金X次
    OverAnyNormalStage:7,    //完成任意普通关卡X次
    OverAnySpecialStage:8,   //完成任意精英关卡X次
    OverTimeCageTimes:9,      //完成时光之穴X次
    OverTestTimes:10,         //完成试炼王者X次
    PlayPvpTimes:11,          //进行PVP战斗X次
    WinPvpTimes:12,           //Pvp获胜X次
    UpSkillLvlTimes:13,       //技能升级X次
    EquipmentEnchantTimes:14,   //装备附魔X次
    PlayLongWay:15,             //进行X次远征
    HaveHero:16                  //拥有X品质的英雄Y位
//    BuyMonthCard:17             //购买月卡
};

gameEnum.Action_Type = {
    OverStage:1,     //通关
    PlayPvp:2,       //Pvp
    GetMoney:3,     //点金
    GetRewards:4,   //抽奖
    UPTeamLvl:5,    //战队升级
    HeroChange:6,   //英雄变化
    OverTest:7,      //完成试炼王者
    OverTimeCage:8,  //完成时光之穴
    UpSkillLvlTimes:9, //技能升级
    EquipmentEnchantTimes :10,  //装备附魔
    PlayLongWay:11,       //进行远征
    RechargeDiamond: 12 // 充值钻石
};


gameEnum.skill_Type = {
    InitiativeSkill:1,
    PassiveSkill:2,
    CharacteristicSkill:3
};


gameEnum.Item_Type = {
    Currency:1,
    Fragment:2,
    Scroll:3,
    SoulStone:4,
    Consumables:5,
    Equipment:6
}

gameEnum.Quality = {
    White:0,
    Green:1,
    Blue:2,
    Purple:3,
    Orange:4
}


gameEnum.Merger_Type = {
    None:0,
    Item:1,
    Scroll:2,
    Equip:3,
    Hero:4
}

gameEnum.Item_Effect_Type = {
    None:0,
    Coin:1,
    HeroExperience:2,
    MagicEnergy:3,
    Stamina:4,
    Raid:5,
    Hero:6,
    TroopExperience:7,
    Attack_Times:8,
    Skill_Point:9,
    HeroLife:51,
    Attack:52,
    Spell:53,
    Armor:54,
    MagicResistance:55,
    PhysicalCrit:56,
    PhysicalCritDamage:57,
    AvoidLvl:58,
    SuckBlood:59,
    HitLevel:60,
    CureSkillUp:61,
    InitiativeSkillEnergyLess:62,
    EnergyRestore:63,
    LifeRestore:64
};

gameEnum.FightType={
    PVE:1,
    PVP:2
};

gameEnum.FightResult = {
    UnKnown:0,
    Win:2,
    Lose:5
};

gameEnum.StageType = {
    Normal:1,
    Elite:2
};

gameEnum.FightStatus = {
    None:0,
    Start:1,
    Victory:2,
    Error:3,
    Cancel:4,
    Failure:5,
    PVERaid:6
};
