/**
 * Created by peihengyang on 15/7/30.
 */
var editProvider = require('../domain_config/config');
var gameEmun = require('../../enum');
var edit = module.exports;
var GlouserHero, x, y, z;
var editGlobal = editProvider.getConfig("global").info;
//console.log(editGlobal.hero_lvl_fighting_force);
x = editGlobal.hero_lvl_fighting_force;
y = editGlobal.hero_skill_fighting_force;
u = Number(editGlobal.skill_unlock_fighting_force);
edit.Hero = function(userHero){
    GlouserHero = userHero;
    var editHeros = editProvider.getConfig('hero').info;
    //console.log(editHeros);
    var hero,equipmentAdd;
    z = 0;
    editHeros.forEach(function(editHero){
        if(editHero.recharge_id == GlouserHero.Hero_Id){
            hero = editHero;
            if(editGlobal.initiative_skill_enable > hero.quality){
                GlouserHero.InitiativeSkill_Lvl = 0;
            }
            else
            {
                z = z+u;
            }
            if(editGlobal.passive_skill_enable > hero.quality){
                GlouserHero.PassiveSkill_Lvl = 0;
            }
            else
            {
                z = z+u;
            }
            if(editGlobal.characteristic_skill_enable > hero.quality){
                GlouserHero.CharacteristicSkill_Lvl = 0;
            }
            else
            {
                z = z+u;
            }
        }
    });
    /*
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
     */
    var equipmentAddFun = function(GoluserHero){
        var equment1 = new edit.Item(GoluserHero.Hero_Equipment1);
        var equment2 = new edit.Item(GoluserHero.Hero_Equipment2);
        var equment3 = new edit.Item(GoluserHero.Hero_Equipment3);
        var equment4 = new edit.Item(GoluserHero.Hero_Equipment4);
        var equment5 = new edit.Item(GoluserHero.Hero_Equipment5);
        var equment6 = new edit.Item(GoluserHero.Hero_Equipment6);
        var TotalAdd = {
            life:equment1.Effects.life + equment2.Effects.life +equment3.Effects.life +equment4.Effects.life +
            equment5.Effects.life + equment6.Effects.life,
            attack:equment1.Effects.attack + equment2.Effects.attack +equment3.Effects.attack +equment4.Effects.attack +
            equment5.Effects.attack + equment6.Effects.attack,
            spell:equment1.Effects.spell + equment2.Effects.spell +equment3.Effects.spell +equment4.Effects.spell +
            equment5.Effects.spell + equment6.Effects.spell,
            armor:equment1.Effects.armor + equment2.Effects.armor +equment3.Effects.armor +equment4.Effects.armor +
            equment5.Effects.armor + equment6.Effects.armor,
            magic_resistance:equment1.Effects.magic_resistance + equment2.Effects.magic_resistance +
            equment3.Effects.magic_resistance +equment4.Effects.life +
            equment5.Effects.magic_resistance + equment6.Effects.magic_resistance,
            physical_crit:equment1.Effects.physical_crit + equment2.Effects.physical_crit +
            equment3.Effects.physical_crit +equment4.Effects.physical_crit +
            equment5.Effects.physical_crit + equment6.Effects.physical_crit,
            physical_crit_damage:equment1.Effects.physical_crit_damage + equment2.Effects.physical_crit_damage +
            equment3.Effects.physical_crit_damage +equment4.Effects.physical_crit_damage +
            equment5.Effects.physical_crit_damage + equment6.Effects.physical_crit_damage,
            avoid_lvl:equment1.Effects.avoid_lvl + equment2.Effects.avoid_lvl +equment3.Effects.avoid_lvl +
            equment4.Effects.avoid_lvl + equment5.Effects.avoid_lvl + equment6.Effects.avoid_lvl,
            suck_blood_lvl:equment1.Effects.suck_blood_lvl + equment2.Effects.suck_blood_lvl +
            equment3.Effects.suck_blood_lvl +equment4.Effects.suck_blood_lvl + equment5.Effects.suck_blood_lvl +
            equment6.Effects.suck_blood_lvl,
            hit_lvl:equment1.Effects.hit_lvl + equment2.Effects.hit_lvl +equment3.Effects.hit_lvl +equment4.Effects.hit_lvl +
            equment5.Effects.hit_lvl + equment6.Effects.hit_lvl,
            skill_cure_lvl:equment1.Effects.skill_cure_lvl + equment2.Effects.skill_cure_lvl +
            equment3.Effects.skill_cure_lvl +equment4.Effects.skill_cure_lvl +
            equment5.Effects.skill_cure_lvl + equment6.Effects.skill_cure_lvl,
            initiative_skill_energy_less_lvl:equment1.Effects.initiative_skill_energy_less_lvl +
            equment2.Effects.initiative_skill_energy_less_lvl +equment3.Effects.initiative_skill_energy_less_lvl
            +equment4.Effects.initiative_skill_energy_less_lvl + equment5.Effects.initiative_skill_energy_less_lvl
            + equment6.Effects.initiative_skill_energy_less_lvl,
            energy_Restore:equment1.Effects.energy_Restore + equment2.Effects.energy_Restore +
            equment3.Effects.energy_Restore +equment4.Effects.energy_Restore + equment5.Effects.energy_Restore
            + equment6.Effects.energy_Restore,
            life_Restore:equment1.Effects.life_Restore + equment2.Effects.life_Restore +equment3.Effects.life_Restore
            +equment4.Effects.life_Restore + equment5.Effects.life_Restore + equment6.Effects.life_Restore
        }
        //console.log("GoluserHero:",GoluserHero);
        //console.log("TotalAdd:",TotalAdd);
        return TotalAdd;
    };
    equipmentAdd = equipmentAddFun(GlouserHero);
    //console.log('GlouserHero:',GlouserHero);
    this.life = calStar(hero.life,hero.life_add) + ((equipmentAdd.life == null) ? 0 : equipmentAdd.life);
    this.attack = calStar(hero.attack,hero.attack_add) + ((equipmentAdd.attack == null) ? 0 : equipmentAdd.attack);
    this.spell = calStar(hero.spell,hero.spell_add) + ((equipmentAdd.spell == null) ? 0 : equipmentAdd.spell);
    this.armor = calStar(hero.armor,hero.armor_add) + ((equipmentAdd.armor == null) ? 0 : equipmentAdd.armor);
    this.magic_resistance = calStar(hero.magic_resistance,hero.magic_resistance_add) +
    ((equipmentAdd.magic_resistance == null) ? 0 : equipmentAdd.magic_resistance);
    this.attack_crit_lvl = calStar(hero.attack_crit_lvl,hero.attack_crit_lvl_add) +
    ((equipmentAdd.attack_crit_lvl == null) ? 0 : equipmentAdd.attack_crit_lvl);
    this.attack_crit_damage_addition_lvl =
        calStar(hero.attack_crit_damage_addition_lvl,hero.attack_crit_damage_addition_lvl_add) +
        ((equipmentAdd.attack_crit_damage_addition_lvl == null) ? 0 : equipmentAdd.attack_crit_damage_addition_lvl);
    this.avoid_lvl = calStar(hero.avoid_lvl,hero.avoid_lvl_add) +
    ((equipmentAdd.avoid_lvl == null) ? 0 : equipmentAdd.avoid_lvl);
    this.hit_lvl = calStar(hero.hit_lvl,hero.hit_lvl_add) + ((equipmentAdd.hit_lvl == null) ? 0 : equipmentAdd.hit_lvl);
    this.suck_blood_lvl = calStar(hero.suck_blood_lvl,hero.suck_blood_lvl_add) +
    ((equipmentAdd.suck_blood_lvl == null) ? 0 : equipmentAdd.suck_blood_lvl);
    this.initiative_skill_energy_less_lvl =
        calStar(hero.initiative_skill_energy_less_lvl,hero.initiative_skill_energy_less_lvl_add) +
        ((equipmentAdd.initiative_skill_energy_less_lvl == null) ? 0 : equipmentAdd.initiative_skill_energy_less_lvl);
    this.skill_cure_lvl = calStar(hero.skill_cure_lvl,hero.skill_cure_lvl_add) +
    ((equipmentAdd.skill_cure_lvl == null) ? 0 : equipmentAdd.skill_cure_lvl);
    this.life_Restore = calStar(hero.life_Restore,hero.life_Restore_add) +
    ((equipmentAdd.life_Restore == null) ? 0 : equipmentAdd.life_Restore);
    this.energy_Restore = calStar(hero.energy_Restore,hero.energy_Restore_add) +
    ((equipmentAdd.energy_Restore == null) ? 0 : equipmentAdd.energy_Restore);
    //console.log('FightForce:',(GlouserHero.Hero_Lvl * x
    //+ (GlouserHero.InitiativeSkill_Lvl + GlouserHero.PassiveSkill_Lvl + GlouserHero.CharacteristicSkill_Lvl) * y
    //+ z));
    this.Fighting_Force = GlouserHero.Hero_Lvl * x
    + (GlouserHero.InitiativeSkill_Lvl + GlouserHero.PassiveSkill_Lvl + GlouserHero.CharacteristicSkill_Lvl) * y
    + z
    + this.life * 0.04
    + this.attack * 0.6
    + this.spell * 0.3
    + this.armor * 2
    + this.magic_resistance * 2
    + this.attack_crit_lvl * 1.25
    + this.attack_crit_damage_addition_lvl *1.25
    + this.avoid_lvl * 1
    + this.suck_blood_lvl * 0.6
    + this.hit_lvl * 2
    + this.skill_cure_lvl * 3
    + this.initiative_skill_energy_less_lvl * 1.25
    + this.life_Restore * 0.06
    + this.energy_Restore * 0.15;
};

edit.Item = function(itemId){
    //console.log('editItems',editProvider.getConfig('item'));
    var editItems = editProvider.getConfig('item').info.Item;
    //console.log("itemId:",itemId);
    var editItemEffects = editProvider.getConfig('item').info.ItemEffect;
    var item,Effects;
    Effects={life : 0,
    attack : 0,
    spell : 0,
    armor : 0,
    magic_resistance : 0,
    physical_crit : 0,
    physical_crit_damage : 0,
    avoid_lvl : 0,
    suck_blood_lvl : 0,
    hit_lvl : 0,
    skill_cure_lvl : 0,
    initiative_skill_energy_less_lvl : 0,
    energy_Restore : 0,
    life_Restore : 0};
    if(itemId != 0 && itemId != null){
        editItems.forEach(function(editItem){
            console.log('editItem:',editItem);
            if(editItem.Item_Id == itemId){
                item = editItem;
            }
        });
//console.log("end:",editItemEffects);
        editItemEffects.forEach(function(editItemEffect){
            //console.log("editItemEffect:",editItemEffect);
            //console.log('item:',item);
            if(editItemEffect.Item_Id == item.Item_Id){
                switch (editItemEffect.Effect_Type)
                {
                    case gameEmun.Item_Effect_Type.HeroLife:
                        Effects.life = editItemEffect.Effect_Value;
                        break;
                    case gameEmun.Item_Effect_Type.Attack:
                        Effects.attack = editItemEffect.Effect_Value;
                        break;
                    case gameEmun.Item_Effect_Type.Spell:
                        Effects.spell = editItemEffect.Effect_Value;
                        break;
                    case gameEmun.Item_Effect_Type.Armor:
                        Effects.armor = editItemEffect.Effect_Value;
                        break;
                    case gameEmun.Item_Effect_Type.MagicResistance:
                        Effects.magic_resistance = editItemEffect.Effect_Value;
                        break;
                    case gameEmun.Item_Effect_Type.PhysicalCrit:
                        Effects.physical_crit = editItemEffect.Effect_Value;
                        break;
                    case gameEmun.Item_Effect_Type.PhysicalCritDamage:
                        Effects.physical_crit_damage = editItemEffect.Effect_Value;
                        break;
                    case gameEmun.Item_Effect_Type.AvoidLvl:
                        Effects.avoid_lvl = editItemEffect.Effect_Value;
                        break;
                    case gameEmun.Item_Effect_Type.SuckBlood:
                        Effects.suck_blood_lvl = editItemEffect.Effect_Value;
                        break;
                    case gameEmun.Item_Effect_Type.HitLevel:
                        Effects.hit_lvl = editItemEffect.Effect_Value;
                        break;
                    case gameEmun.Item_Effect_Type.CureSkillUp:
                        Effects.skill_cure_lvl = editItemEffect.Effect_Value;
                        break;
                    case gameEmun.Item_Effect_Type.InitiativeSkillEnergyLess:
                        Effects.initiative_skill_energy_less_lvl = editItemEffect.Effect_Value;
                        break;
                    case gameEmun.Item_Effect_Type.EnergyRestore:
                        Effects.energy_Restore = editItemEffect.Effect_Value;
                        break;
                    case gameEmun.Item_Effect_Type.LifeRestore:
                        Effects.life_Restore = editItemEffect.Effect_Value;
                        break;
                }
            }

        })
    }
    //console.log('Effects:',Effects);
    this.Effects = Effects;
}

var calStar =  function(base,addition){
    var addArray = addition.split(',');
    var finalAdd = 0;
    //var index = 0;
    //console.log("addArray:",addArray);
    addArray.forEach(function(addOne,index){
        if(index < GlouserHero.Hero_Star){
            finalAdd += Number(addOne);
        }
        //index++;
    });
    //console.log("finalAdd:",finalAdd);
    return (base + finalAdd * (GlouserHero.Hero_Lvl - 1) == null)? 0 : base + finalAdd * (GlouserHero.Hero_Lvl - 1);
}



