// import {ClassFeatures} from "./classFeatures.js"

// Namespace Configuration Values
export const WWNPRETTY = {};

// ASCII Artwork
WWNPRETTY.ASCII = `_______________________________
______      ______ _____ _____
|  _  \\___  |  _  \\  ___|  ___|
| | | ( _ ) | | | |___ \\| |__
| | | / _ \\/\\ | | |   \\ \\  __|
| |/ / (_>  < |/ //\\__/ / |___
|___/ \\___/\\/___/ \\____/\\____/
_______________________________`;


/**
 * The set of Ability Scores used within the system
 * @type {Object}
 */
WWNPRETTY.abilities = {
  "str": "WWNPRETTY.AbilityStr",
  "dex": "WWNPRETTY.AbilityDex",
  "con": "WWNPRETTY.AbilityCon",
  "int": "WWNPRETTY.AbilityInt",
  "wis": "WWNPRETTY.AbilityWis",
  "cha": "WWNPRETTY.AbilityCha"
};

WWNPRETTY.abilityAbbreviations = {
  "str": "WWNPRETTY.AbilityStrAbbr",
  "dex": "WWNPRETTY.AbilityDexAbbr",
  "con": "WWNPRETTY.AbilityConAbbr",
  "int": "WWNPRETTY.AbilityIntAbbr",
  "wis": "WWNPRETTY.AbilityWisAbbr",
  "cha": "WWNPRETTY.AbilityChaAbbr"
};

WWNPRETTY.attackSkills = {
  "pun": "WWNPRETTY.SkillPun",
  "sho": "WWNPRETTY.SkillSho",
  "stb": "WWNPRETTY.SkillStb"
};

/* -------------------------------------------- */
/**
 * The set of saves used within the system, added by Lofty
 * @type {Object}
 */
  WWNPRETTY.saves = {
    "psave": "WWNPRETTY.pSave",
    "esave": "WWNPRETTY.eSave",
    "msave": "WWNPRETTY.mSave"
  }


/* -------------------------------------------- */
/**
 * Character alignment options
 * @type {Object}
 */
WWNPRETTY.alignments = {
  'lg': "WWNPRETTY.AlignmentLG",
  'ng': "WWNPRETTY.AlignmentNG",
  'cg': "WWNPRETTY.AlignmentCG",
  'ln': "WWNPRETTY.AlignmentLN",
  'tn': "WWNPRETTY.AlignmentTN",
  'cn': "WWNPRETTY.AlignmentCN",
  'le': "WWNPRETTY.AlignmentLE",
  'ne': "WWNPRETTY.AlignmentNE",
  'ce': "WWNPRETTY.AlignmentCE"
};

/* -------------------------------------------- */


/**
 * NPC attitude options
 * @type {Object}
 */
WWNPRETTY.attitudes = {
  'unknown': "WWNPRETTY.AttitudeUnknown",
  'hostile': "WWNPRETTY.AttitudeHostile",
  'negative': "WWNPRETTY.AttitudeNegative",
  'neutral': "WWNPRETTY.AttitudeNeutral",
  'positive': "WWNPRETTY.AttitudePositive",
  'friendly': "WWNPRETTY.AttitudeFriendly",
};

/* -------------------------------------------- */
/**
 * An enumeration of item attunement types
 * @enum {number}
 */
WWNPRETTY.attunementTypes = {
  NONE: 0,
  REQUIRED: 1,
  ATTUNED: 2,
}

/**
 * An enumeration of item attunement states
 * @type {{"0": string, "1": string, "2": string}}
 */
WWNPRETTY.attunements = {
  0: "WWNPRETTY.AttunementNone",
  1: "WWNPRETTY.AttunementRequired",
  2: "WWNPRETTY.AttunementAttuned"
};

/* -------------------------------------------- */


WWNPRETTY.weaponProficiencies = {
  // "bows": "WWNPRETTY.BowsProf"
};

WWNPRETTY.toolProficiencies = {
  "bows": "WWNPRETTY.BowsProf",
};


/* -------------------------------------------- */

/**
 * This Object defines the various lengths of time which can occur
 * @type {Object}
 */
WWNPRETTY.timePeriods = {
  "inst": "WWNPRETTY.TimeInst",
  "turn": "WWNPRETTY.TimeTurn",
  "round": "WWNPRETTY.TimeRound",
  "minute": "WWNPRETTY.TimeMinute",
  "hour": "WWNPRETTY.TimeHour",
  "day": "WWNPRETTY.TimeDay",
  "month": "WWNPRETTY.TimeMonth",
  "year": "WWNPRETTY.TimeYear",
  "perm": "WWNPRETTY.TimePerm",
  "spec": "WWNPRETTY.Special"
};


/* -------------------------------------------- */

/**
 * This describes the ways that an ability can be activated
 * @type {Object}
 */
WWNPRETTY.abilityActivationTypes = {
  "none": "WWNPRETTY.None",
  "action": "WWNPRETTY.Action",
  "move": "WWNPRETTY.MoveAction",
  "onturn": "WWNPRETTY.OnTurnAction",
  "instant": "WWNPRETTY.InstantAction",
  "minute": WWNPRETTY.timePeriods.minute,
  "hour": WWNPRETTY.timePeriods.hour,
  "day": WWNPRETTY.timePeriods.day,
  "special": WWNPRETTY.timePeriods.spec,
  // "legendary": "WWNPRETTY.LegAct",
  // "lair": "WWNPRETTY.LairAct",

};

/* -------------------------------------------- */


WWNPRETTY.abilityConsumptionTypes = {
  "ammo": "WWNPRETTY.ConsumeAmmunition",
  "attribute": "WWNPRETTY.ConsumeAttribute",
  "material": "WWNPRETTY.ConsumeMaterial",
  "charges": "WWNPRETTY.ConsumeCharges"
};


/* -------------------------------------------- */

// Creature Sizes
WWNPRETTY.actorSizes = {
  "tiny": "WWNPRETTY.SizeTiny",
  "sm": "WWNPRETTY.SizeSmall",
  "med": "WWNPRETTY.SizeMedium",
  "lg": "WWNPRETTY.SizeLarge",
  "huge": "WWNPRETTY.SizeHuge",
  "grg": "WWNPRETTY.SizeGargantuan"
};

WWNPRETTY.tokenSizes = {
  "tiny": 1,
  "sm": 1,
  "med": 1,
  "lg": 2,
  "huge": 3,
  "grg": 4
};

/* -------------------------------------------- */

/**
 * Classification types for item action types
 * @type {Object}
 */
WWNPRETTY.itemActionTypes = {
  "mwak": "WWNPRETTY.ActionMWAK",
  "rwak": "WWNPRETTY.ActionRWAK",
  // "msak": "WWNPRETTY.ActionMSAK",
  // "rsak": "WWNPRETTY.ActionRSAK",
  "abil": "WWNPRETTY.ActionAbil",
  "save": "WWNPRETTY.ActionSave",
  "heal": "WWNPRETTY.ActionHeal",
  "util": "WWNPRETTY.ActionUtil",
  "other": "WWNPRETTY.ActionOther"
};

/* -------------------------------------------- */

WWNPRETTY.itemCapacityTypes = {
  "items": "WWNPRETTY.ItemContainerCapacityItems",
  "weight": "WWNPRETTY.ItemContainerCapacityWeight"
};

/* -------------------------------------------- */

/**
 * Enumerate the lengths of time over which an item can have limited use ability
 * @type {Object}
 */
WWNPRETTY.limitedUsePeriods = {
  "sr": "WWNPRETTY.ShortRest",
  "lr": "WWNPRETTY.LongRest",
  "day": "WWNPRETTY.Day",
  "charges": "WWNPRETTY.Charges"
};


/* -------------------------------------------- */

/**
 * The set of equipment types for armor, clothing, and other objects which can ber worn by the character
 * @type {Object}
 */
WWNPRETTY.equipmentTypes = {
  // "light": "WWNPRETTY.EquipmentLight",
  // "medium": "WWNPRETTY.EquipmentMedium",
  // "heavy": "WWNPRETTY.EquipmentHeavy",
  "bonus": "WWNPRETTY.EquipmentBonus",
  "natural": "WWNPRETTY.EquipmentNatural",
  "shield": "WWNPRETTY.EquipmentShield",
  "clothing": "WWNPRETTY.EquipmentClothing",
  "trinket": "WWNPRETTY.EquipmentTrinket",

};


/**
 * Common armor class calculations.
 * @enum {object}
 */
WWNPRETTY.armorClasses = {
  flat: {
    label: "Flat",
    formula: "@attributes.ac.flat"
  },
  natural: {
    label: "Natural Armor",
    formula: "@attributes.ac.flat"
  },
  default: {
    label: "Equipped Armor",
    formula: "10 + @abilities.dex.mod"
  },
  tele_arm: {
    label: "Telekinetic Armory",
    formula: "15 + @abilities.int.mod"
  },
  custom: {
    label: "Custom Formula"
  }
};

/* -------------------------------------------- */

/**
 * The set of Armor Proficiencies which a character may have
 * @type {Object}
 */
WWNPRETTY.armorProficiencies = {

};


/* -------------------------------------------- */

/**
 * Enumerate the valid consumable types which are recognized by the system
 * @type {Object}
 */
WWNPRETTY.consumableTypes = {
  "ammo": "WWNPRETTY.ConsumableAmmunition",
  "drug": "WWNPRETTY.ConsumablePotion",
  // "poison": "WWNPRETTY.ConsumablePoison",
  "food": "WWNPRETTY.ConsumableFood",
  // "scroll": "WWNPRETTY.ConsumableScroll",
  // "wand": "WWNPRETTY.ConsumableWand",
  // "rod": "WWNPRETTY.ConsumableRod",
  "trinket": "WWNPRETTY.ConsumableTrinket"
};

/* -------------------------------------------- */

/**
 * The valid currency denominations supported by the 5e system
 * @type {Object}
 */
WWNPRETTY.currencies = {
  "credits": "WWNPRETTY.CurrencyCredits",
};


/**
 * Define the upwards-conversion rules for registered currency types
 * @type {{string, object}}
 */
WWNPRETTY.currencyConversion = {
  credits: {into: "credits", each: 1},
};

/* -------------------------------------------- */


// Damage Types
WWNPRETTY.damageTypes = {
  "acid": "WWNPRETTY.DamageAcid",
  "electrical": "WWNPRETTY.DamageElectrical",
  "cold": "WWNPRETTY.DamageCold",
  "heat": "WWNPRETTY.DamageHeat",
  "physical": "WWNPRETTY.DamagePhysical",
  "psychic": "WWNPRETTY.DamagePsychic",
  "shock":"WWNPRETTY.DamageShock"
};

// Damage Resistance Types
WWNPRETTY.damageResistanceTypes = mergeObject(duplicate(WWNPRETTY.damageTypes), {
  "physical": "WWNPRETTY.DamagePhysical"
});


/* -------------------------------------------- */

/**
 * The valid units of measure for movement distances in the game system.
 * By default this uses the imperial units of feet and miles.
 * @type {Object<string,string>}
 */
WWNPRETTY.movementTypes = {
  "burrow": "WWNPRETTY.MovementBurrow",
  "climb": "WWNPRETTY.MovementClimb",
  "drive": "WWNPRETTY.MovementDrive",
  "fly": "WWNPRETTY.MovementFly",
  "swim": "WWNPRETTY.MovementSwim",
  "walk": "WWNPRETTY.MovementWalk",
}

/**
 * The valid units of measure for movement distances in the game system.
 * By default this uses the imperial units of feet and miles.
 * @type {Object<string,string>}
 */
WWNPRETTY.movementUnits = {
  "ft": "WWNPRETTY.DistFt",
  "mi": "WWNPRETTY.DistMi",
  "m": "WWNPRETTY.DistM",
  "km": "WWNPRETTY.DistKm"
}

/**
 * The valid units of measure for the range of an action or effect.
 * This object automatically includes the movement units from WWNPRETTY.movementUnits
 * @type {Object<string,string>}
 */
WWNPRETTY.distanceUnits = {
  "none": "WWNPRETTY.None",
  "self": "WWNPRETTY.DistSelf",
  "touch": "WWNPRETTY.DistTouch",
  "spec": "WWNPRETTY.Special",
  "any": "WWNPRETTY.DistAny"
};
for ( let [k, v] of Object.entries(WWNPRETTY.movementUnits) ) {
  WWNPRETTY.distanceUnits[k] = v;
}

/* -------------------------------------------- */


/**
 * Configure aspects of encumbrance calculation so that it could be configured by modules
 * @type {Object}
 */
WWNPRETTY.encumbrance = {
  currencyPerWeight: 0,
  // strMultiplier: 15,
  // vehicleWeightMultiplier: 2000 // 2000 lbs in a ton
  strMultiplier: 1,
};

/* -------------------------------------------- */

/**
 * This Object defines the types of single or area targets which can be applied
 * @type {Object}
 */
WWNPRETTY.targetTypes = {
  "none": "WWNPRETTY.None",
  "self": "WWNPRETTY.TargetSelf",
  "creature": "WWNPRETTY.TargetCreature",
  "ally": "WWNPRETTY.TargetAlly",
  "enemy": "WWNPRETTY.TargetEnemy",
  "object": "WWNPRETTY.TargetObject",
  "space": "WWNPRETTY.TargetSpace",
  "radius": "WWNPRETTY.TargetRadius",
  "sphere": "WWNPRETTY.TargetSphere",
  "cylinder": "WWNPRETTY.TargetCylinder",
  "cone": "WWNPRETTY.TargetCone",
  "square": "WWNPRETTY.TargetSquare",
  "cube": "WWNPRETTY.TargetCube",
  "line": "WWNPRETTY.TargetLine",
  "wall": "WWNPRETTY.TargetWall"
};


/* -------------------------------------------- */


/**
 * Map the subset of target types which produce a template area of effect
 * The keys are WWNPRETTY target types and the values are MeasuredTemplate shape types
 * @type {Object}
 */
WWNPRETTY.areaTargetTypes = {
  cone: "cone",
  cube: "rect",
  cylinder: "circle",
  line: "ray",
  radius: "circle",
  sphere: "circle",
  square: "rect",
  wall: "ray"
};


/* -------------------------------------------- */

// Healing Types
WWNPRETTY.healingTypes = {
  "healing": "WWNPRETTY.Healing",
  "temphp": "WWNPRETTY.HealingTemp"
};


/* -------------------------------------------- */


/**
 * Enumerate the denominations of hit dice which can apply to classes
 * @type {Array.<string>}
 */
WWNPRETTY.hitDieTypes = ["d6", "d8", "d10", "d12"];


/* -------------------------------------------- */

/**
 * The set of possible sensory perception types which an Actor may have
 * @type {object}
 */
WWNPRETTY.senses = {
  "heatvision": "WWNPRETTY.SenseHeatvision",
  "darkvision": "WWNPRETTY.SenseDarkvision",
  "tremorsense": "WWNPRETTY.SenseTremorsense",
  "truesight": "WWNPRETTY.SenseTruesight"
};

/* -------------------------------------------- */

/**
 * The set of skill which can be trained
 * @type {Object}
 */
WWNPRETTY.skills = {
  "adm": "WWNPRETTY.SkillAdm",
  "con": "WWNPRETTY.SkillCon",
  "exe": "WWNPRETTY.SkillExe",
  "fix": "WWNPRETTY.SkillFix",
  "hea": "WWNPRETTY.SkillHea",
  "her": "WWNPRETTY.SkillHer",
  "kno": "WWNPRETTY.SkillKno",
  "lea": "WWNPRETTY.SkillLea",
  "not": "WWNPRETTY.SkillNot",
  "per": "WWNPRETTY.SkillPer",
  "pil": "WWNPRETTY.SkillPil",
  "pro": "WWNPRETTY.SkillPro",
  "pun": "WWNPRETTY.SkillPun",
  "see": "WWNPRETTY.SkillSee",
  "sho": "WWNPRETTY.SkillSho",
  "sme": "WWNPRETTY.SkillSme",
  "sne": "WWNPRETTY.SkillSne",
  "stb": "WWNPRETTY.SkillStb",
  "sur": "WWNPRETTY.SkillSur",
  "tal": "WWNPRETTY.SkillTal",
  "trd": "WWNPRETTY.SkillTrd",
  "wor": "WWNPRETTY.SkillWor"
};


/* -------------------------------------------- */

WWNPRETTY.spellPreparationModes = {
  "prepared": "WWNPRETTY.SpellPrepPrepared",
  // "pact": "WWNPRETTY.PactMagic",
  "always": "WWNPRETTY.SpellPrepAlways",
  "atwill": "WWNPRETTY.SpellPrepAtWill",
  "innate": "WWNPRETTY.SpellPrepInnate"
};

WWNPRETTY.spellUpcastModes = ["always", "pact", "prepared"];

WWNPRETTY.spellProgression = {
  "none": "WWNPRETTY.SpellNone",
  "half": "WWNPRETTY.SpellProgHalf",
  "full": "WWNPRETTY.SpellProgFull"
  // "third": "WWNPRETTY.SpellProgThird",
  // "pact": "WWNPRETTY.SpellProgPact",
  // "artificer": "WWNPRETTY.SpellProgArt"
};

/* -------------------------------------------- */

/**
 * The available choices for how spell damage scaling may be computed
 * @type {Object}
 */
WWNPRETTY.spellScalingModes = {
  "none": "WWNPRETTY.SpellNone",
  // "cantrip": "WWNPRETTY.SpellCantrip",
  "level": "WWNPRETTY.SpellLevel"
};

/* -------------------------------------------- */

/**
 * Define the set of locations an item can be stored -Lofty
 * @type {Object}
 */
WWNPRETTY.equipmentLocation = {
  "readied": "WWNPRETTY.Readied",
  "carried": "WWNPRETTY.Carried",
  "stored": "WWNPRETTY.Stored",
};

/* -------------------------------------------- */

/**
 * Define the set of types which a weapon item can take
 * @type {Object}
 */
WWNPRETTY.weaponTypes = {
  "simpleM": "WWNPRETTY.WeaponSimpleM",
  "simpleR": "WWNPRETTY.WeaponSimpleR"
  // "siege": "WWNPRETTY.WeaponSiege"
};


/* -------------------------------------------- */

/**
 * Define the set of weapon property flags which can exist on a weapon
 * Lofty has moved imrpov and natural from weaponTypes to weaponProperties
 * @type {Object}
 */
WWNPRETTY.weaponProperties = {
  // "ada": "WWNPRETTY.WeaponPropertiesAda",
  "amm": "WWNPRETTY.WeaponPropertiesAmm",
  "bur": "WWNPRETTY.WeaponPropertiesBur",
  // "fin": "WWNPRETTY.WeaponPropertiesFin",
  // "fir": "WWNPRETTY.WeaponPropertiesFir",
  // "foc": "WWNPRETTY.WeaponPropertiesFoc",
  // "hvy": "WWNPRETTY.WeaponPropertiesHvy",
  "imp": "WWNPRETTY.WeaponImprov",
  // "lgt": "WWNPRETTY.WeaponPropertiesLgt",
  // "lod": "WWNPRETTY.WeaponPropertiesLod",
  // "mgc": "WWNPRETTY.WeaponPropertiesMgc",
  "nat": "WWNPRETTY.WeaponNatural",
  // "rch": "WWNPRETTY.WeaponPropertiesRch",
  "rel": "WWNPRETTY.WeaponPropertiesRel",
  "ret": "WWNPRETTY.WeaponPropertiesRet",
  "sil": "WWNPRETTY.WeaponPropertiesSil",
  "spc": "WWNPRETTY.WeaponPropertiesSpc",
  // "thr": "WWNPRETTY.WeaponPropertiesThr",
  "two": "WWNPRETTY.WeaponPropertiesTwo",
  "ver": "WWNPRETTY.WeaponPropertiesVer"
};


// Spell Components
WWNPRETTY.spellComponents = {
  "V": "WWNPRETTY.ComponentVerbal",
  "S": "WWNPRETTY.ComponentSomatic",
  "M": "WWNPRETTY.ComponentMaterial"
};

// Spell Schools
WWNPRETTY.spellSchools = {
  // "abj": "WWNPRETTY.SchoolAbj",
  // "con": "WWNPRETTY.SchoolCon",
  // "div": "WWNPRETTY.SchoolDiv",
  // "enc": "WWNPRETTY.SchoolEnc",
  // "evo": "WWNPRETTY.SchoolEvo",
  // "ill": "WWNPRETTY.SchoolIll",
  // "trs": "WWNPRETTY.SchoolTrs"
  // "tep": "WWNPRETTY.SchoolTap",
  // "tor": "WWNPRETTY.SchoolTep",
  "bio": "WWNPRETTY.SchoolBio",
  "met": "WWNPRETTY.SchoolMet",
  "pre": "WWNPRETTY.SchoolPre",
  "nec": "WWNPRETTY.SchoolNec",
  "tek": "WWNPRETTY.SchoolTek"
};

// Spell Levels
WWNPRETTY.spellLevels = {
  0: "WWNPRETTY.SpellLevel0",
  1: "WWNPRETTY.SpellLevel1",
  2: "WWNPRETTY.SpellLevel2",
  3: "WWNPRETTY.SpellLevel3",
  4: "WWNPRETTY.SpellLevel4",
  5: "WWNPRETTY.SpellLevel5"
  // 6: "WWNPRETTY.SpellLevel6",
  // 7: "WWNPRETTY.SpellLevel7",
  // 8: "WWNPRETTY.SpellLevel8",
  // 9: "WWNPRETTY.SpellLevel9"
};

// Spell Scroll Compendium UUIDs
WWNPRETTY.spellScrollIds = {
  0: 'Compendium.wwnpretty.items.rQ6sO7HDWzqMhSI3',
  1: 'Compendium.wwnpretty.items.9GSfMg0VOA2b4uFN',
  2: 'Compendium.wwnpretty.items.XdDp6CKh9qEvPTuS',
  3: 'Compendium.wwnpretty.items.hqVKZie7x9w3Kqds',
  4: 'Compendium.wwnpretty.items.DM7hzgL836ZyUFB1',
  5: 'Compendium.wwnpretty.items.wa1VF8TXHmkrrR35',
  6: 'Compendium.wwnpretty.items.tI3rWx4bxefNCexS',
  7: 'Compendium.wwnpretty.items.mtyw4NS1s7j2EJaD',
  8: 'Compendium.wwnpretty.items.aOrinPg7yuDZEuWr',
  9: 'Compendium.wwnpretty.items.O4YbkJkLlnsgUszZ'
};

/**
 * Define the standard slot progression by character level.
 * The entries of this array represent the spell slot progression for a full spell-caster.
 * @type {Array[]}
 */
WWNPRETTY.SPELL_SLOT_TABLE = [
  [2],
  [3],
  [4, 2],
  [4, 3],
  [4, 3, 2],
  [4, 3, 3],
  [4, 3, 3, 1],
  [4, 3, 3, 2],
  [4, 3, 3, 3, 1],
  [4, 3, 3, 3, 2],
  [4, 3, 3, 3, 2, 1],
  [4, 3, 3, 3, 2, 1],
  [4, 3, 3, 3, 2, 1, 1],
  [4, 3, 3, 3, 2, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 2, 1, 1]
];

/* -------------------------------------------- */

// Polymorph options.
WWNPRETTY.polymorphSettings = {
  keepPhysical: 'WWNPRETTY.PolymorphKeepPhysical',
  keepMental: 'WWNPRETTY.PolymorphKeepMental',
  keepSaves: 'WWNPRETTY.PolymorphKeepSaves',
  keepSkills: 'WWNPRETTY.PolymorphKeepSkills',
  mergeSaves: 'WWNPRETTY.PolymorphMergeSaves',
  mergeSkills: 'WWNPRETTY.PolymorphMergeSkills',
  keepClass: 'WWNPRETTY.PolymorphKeepClass',
  keepFeats: 'WWNPRETTY.PolymorphKeepFeats',
  keepSpells: 'WWNPRETTY.PolymorphKeepSpells',
  keepItems: 'WWNPRETTY.PolymorphKeepItems',
  keepBio: 'WWNPRETTY.PolymorphKeepBio',
  keepVision: 'WWNPRETTY.PolymorphKeepVision'
};

/* -------------------------------------------- */

/**
 * Skill, ability, and tool proficiency levels
 * Each level provides a proficiency multiplier
 * @type {Object}
 */
WWNPRETTY.proficiencyLevels = {
  0: "WWNPRETTY.NotProficient",
  1: "WWNPRETTY.Proficient",
  0.5: "WWNPRETTY.HalfProficient",
  2: "WWNPRETTY.Expertise"
};

/* -------------------------------------------- */

/**
 * The amount of cover provided by an object.
 * In cases where multiple pieces of cover are
 * in play, we take the highest value.
 */
WWNPRETTY.cover = {
  0: 'WWNPRETTY.None',
  .5: 'WWNPRETTY.CoverHalf',
  .75: 'WWNPRETTY.CoverThreeQuarters',
  1: 'WWNPRETTY.CoverTotal'
};

/* -------------------------------------------- */


// Condition Types
WWNPRETTY.conditionTypes = {
  "blinded": "WWNPRETTY.ConBlinded",
  "deafened": "WWNPRETTY.ConDeafened",
  "frightened": "WWNPRETTY.ConFrightened",
  "invisible": "WWNPRETTY.ConInvisible",
  "stunned": "WWNPRETTY.ConStunned",
  "unconscious": "WWNPRETTY.ConUnconscious"
};

// Languages
WWNPRETTY.languages = {
  "english": "WWNPRETTY.LanguagesEnglish",
  "spanish": "WWNPRETTY.LanguagesSpanish",
  "japanese": "WWNPRETTY.LanguagesJapanese",
  "chinese": "WWNPRETTY.LanguagesChinese",
  "arabic": "WWNPRETTY.LanguagesArabic",
  "swahili": "WWNPRETTY.LanguagesSwahili",
  "signlanguage": "WWNPRETTY.LanguagesSignLanguage",
  "prisonspeak": "WWNPRETTY.LanguagesPrisonSpeak"
};

// Character Level XP Requirements
WWNPRETTY.CHARACTER_EXP_LEVELS =  [
  0, 20, 60, 100, 180, 260, 420, 740, 1060, 1700, 2340, 2980];

// Challenge Rating XP Levels
WWNPRETTY.CR_EXP_LEVELS = [
  10, 200, 450, 700, 1100, 1800, 2300, 2900, 3900, 5000, 5900, 7200, 8400, 10000, 11500, 13000, 15000, 18000,
  20000, 22000, 25000, 33000, 41000, 50000, 62000, 75000, 90000, 105000, 120000, 135000, 155000
];

// Character Features Per Class And Level
// WWNPRETTY.classFeatures = ClassFeatures;

// Configure Optional Character Flags
WWNPRETTY.characterFlags = {
  // "initiativeAdv": {
  //   name: "WWNPRETTY.FlagsInitiativeAdv",
  //   hint: "WWNPRETTY.FlagsInitiativeAdvHint",
  //   section: "Feats",
  //   type: Boolean
  // },
  // "weaponCriticalThreshold": {
  //   name: "WWNPRETTY.FlagsWeaponCritThreshold",
  //   hint: "WWNPRETTY.FlagsWeaponCritThresholdHint",
  //   section: "Feats",
  //   type: Number,
  //   placeholder: 20
  // },
  // "spellCriticalThreshold": {
  //   name: "WWNPRETTY.FlagsSpellCritThreshold",
  //   hint: "WWNPRETTY.FlagsSpellCritThresholdHint",
  //   section: "Feats",
  //   type: Number,
  //   placeholder: 20
  // },
  // "meleeCriticalDamageDice": {
  //   name: "WWNPRETTY.FlagsMeleeCriticalDice",
  //   hint: "WWNPRETTY.FlagsMeleeCriticalDiceHint",
  //   section: "Feats",
  //   type: Number,
  //   placeholder: 0
  // },
};

// Configure allowed status flags
WWNPRETTY.allowedActorFlags = ["isPolymorphed", "originalActor"].concat(Object.keys(WWNPRETTY.characterFlags));
