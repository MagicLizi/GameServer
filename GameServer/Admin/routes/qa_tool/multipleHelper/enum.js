/**
 * Created by David_shen on 6/9/14.
 */

var Enum = module.exports;

Enum.card_state = {
    Normal:0,
    Ting:1,
    Hu:2
};

Enum.beside_child_card_type = {
    LightKeZi:0,
    LightBar:1,
    DarkBar:2,
    ShunZi:3,
    None:4
};

Enum.round_wind_type = {
    None:9,
    East:10,
    South:11,
    West:12,
    North:13
};

Enum.card_sytle_type ={
    None:0,
    Jiang:1,
    KeZi:2,
    Bar:3
};

Enum.bar_type = {
    None:0,
    Dark:1,
    Light:2
};

Enum.cardMark_type = {
    Word:0,
    Wind:1,
    Arrow:2,
    None:3
};

Enum.Behavior_type = {
    Chi : 0,
    Peng : 1,
    Gang : 2,
    Ting : 3,
    He : 4,
    Cancel : 5,
    GetCard : 6,
    PopCard : 7,
    ChangePlayer:8,
    DarkGang:9,
    LightGangBeside:10,
    None:11
};


Enum.player_state = {
    Matching:1,
    Playing:2,
    GameOver:3
};

Enum.Chess_fight_result_type = {
    Win:1,
    Lose:2
};

Enum.Game_end_type = {
    Normal:0,
    OverMoveLimit:1,
    Peace:2,
    GiveUp:3
};

Enum.Fan_type= {
    //88 fan
    DaSiXi:100,
    DaSanYuan:101,
    JiuBaoLianDeng:102,
    SiGang:103,
    LianQiDui:104,
    BaiWanShi:105,
    TianHe:106,
    DiHe:107,
    RenHe:108,
    //64
    XiaoSiXi:200,
    XiaoSanYuan:201,
    ZiYiSe:202,
    SiAnKe:203,
    YiSeShuangLonghui:204,
    //48
    YiSeSiTongShun:300,
    YiSeSiJieGao:301,
    //32
    YiSeSiBuGao:400,
    SanGang:401,
    HunYaoJiu:402,
    //24
    QiDui:500,
    QinYiSe:501,
    YiSeSanTongShun:502,
    YiSeSanJieGao:503,
    //16
    QinLong:600,
    YiSeSanBuGao:601,
    SanAnKe:602,
    TianTin:603,
    //12
    SanFengKe:700,
    DaYuWu:701,
    XiaoYuWu:702,
    //8
    MiaoShouHuiChun:800,
    HaiDiLaoYue:801,
    GangShangKaiHua:802,
    QianGangHe:803,
    //6
    PenPenHe:900,
    HunYiSe:901,
    ShuangAnGang:902,
    ShuangJianKe:903,
    QuanQiuRen:904,
    //4
    BuQiuRen:1000,
    ShuangMingGang:1001,
    HeJueZhang:1002,
    //2
    JianKe:1100,
    QuanFenKe:1101,
    MenQianQin:1102,
    PinHe:1103,
    SiGuiYi:1104,
    ShuangAnKe:1105,
    AnGang:1106,
    DuanYao:1107,
    //1
    YiBanGao:1200,
    LianLiu:1201,
    LaoShaoFu:1202,
    YaoJiuKe:1203,
    MingGang:1204,
    QueYiMen:1205,
    WuZi:1206,
    BianZhang:1207,
    KanZhang:1208,
    DanDiaoJiang:1209,
    ZiMo:1210,
    BaoTing:1211
};
