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
    NotDone:4,
    Close:5
};

gameEnum.Task_Type = {
    Circle:1, //循环
    Thread:2, //主线
    MonthCard:3, //月卡
    VipPower:4 //vip特权任务
};

gameEnum.Task_Target_Type = {
    None:1,           //无目标
    OverStageTime:2, //完成指定关卡X次
    RechargeDiamond:3,  //充值钻石X个
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
    RechargeDiamond: 12, // 充值钻石
    VipLevelUp: 13 // vip等级升级
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
    Diamone:10,
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
    PVP:2,
    TreasureHouse:3
};

gameEnum.FightResult = {
    UnKnown:0,
    Win:2,
    Lose:5
};

gameEnum.StageType = {
    Normal:1,
    Elite:2,
    Coin:3,
    Experience:4,
    MagicEquipment:5,
    PhysicalEquipment:6
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

gameEnum.AvatarGrade = {
    NormalAvatar:1,
    HeroAvatar:2,
    AwakeningAvatar:3,
    CustomAvatar:7,
    NormalAvatarFrame:4,
    VIPAvatarFrame:5,
    FirstRankAvatarFrame:6
};
gameEnum.AvatarType = {
    Avatar:1,
    AvatarFrame:2
};

gameEnum.GameFunction = {
    Arena:1,
    Elite_Stage:2,
    Leaderboard:3,
    Expedition:4,
    Caverns_Of_Time:5,
    Businessman:6,
    Guild:7,
    Hero_Trial:8,
    Enchanting:9,
    Buried_Treasure:10,
    Pool_Of_Prophecy:11
}
gameEnum.Raid_Type = {
    RaidCoin:1,
    Diamond:2
}

gameEnum.Rank_Rewards_Type = {
    DailyRewards:1,
    TopRewards:2
}

gameEnum.paramType = {
    Request:1,
    Response:2,
    ReqHeader:3
}

gameEnum.SourceType = {
    Normal: 0,
    GameCenter: 1,
    Oauth: 2,
    Anonymous: 3,
    WXOauth:4,
    WXIOS:5,
    XiaoMi:6,
    SanLiuLing:7,
    HuaWei:8
};

gameEnum.Activity_Type = {
    Daily_Reward1:1,
    Daily_Reward2:2,
    Seven_Days:3
};

gameEnum.Activity_Reward_Status = {
    Not_Receiving:1,
    Received:2,
    Expired:0,
    Invalid:-1
};

gameEnum.Server_Type = {
    Normal:1,
    txGame:2,
    Other:3
};
gameEnum.Server_Status = {
    Normal:1,
    Crowded:2,
    Full:3
};
gameEnum.VIP_Authority = {
    TenRaid:1,
    ForeverGoblinStore:2,
    BuySkillPoint:3
};
gameEnum.VIPAction = {
    BuyStaminaTimes:1,
    BuyCoinTimes:2,
    BuyPVETimes:3,
    BuyPVPTimes:4,
    ResetFarFightTimes:5,
};
gameEnum.VIPType = {
    FarFightRewardsAdd:1,
    SkillPointLimit:2
}

