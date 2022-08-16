import { d20Roll, damageRoll } from "../dice.js";
import SelectItemsPrompt from "../apps/select-items-prompt.js";
// import ShortRestDialog from "../apps/short-rest.js";
// import LongRestDialog from "../apps/long-rest.js";
import {WWNPRETTY} from '../config.js';
import Item5e from "../item/entity.js";

/**
 * Extend the base Actor class to implement additional system-specific logic.
 * @extends {Actor}
 */
export default class Actor5e extends Actor {

  /**
   * The data source for Actor5e.classes allowing it to be lazily computed.
   * @type {Object<string, Item5e>}
   * @private
   */
  _classes = undefined;

  /* -------------------------------------------- */
  /*  Properties                                  */
  /* -------------------------------------------- */

  /**
   * A mapping of classes belonging to this Actor.
   * @type {Object<string, Item5e>}
   */
  get classes() {
    if ( this._classes !== undefined ) return this._classes;
    if ( !["character", "npc"].includes(this.data.type) ) return this._classes = {};
    return this._classes = this.items.filter((item) => item.type === "class").reduce((obj, cls) => {
      obj[cls.name.slugify({strict: true})] = cls;
      return obj;
    }, {});
  }

  /* -------------------------------------------- */

  /**
   * Is this Actor currently polymorphed into some other creature?
   * @type {boolean}
   */
  get isPolymorphed() {
    return this.getFlag("wwnpretty", "isPolymorphed") || false;
  }

  /* -------------------------------------------- */
  /*  Methods                                     */
  /* -------------------------------------------- */

  /** @override */
  prepareData() {
    this._preparationWarnings = [];
    super.prepareData();

    // iterate over owned items and recompute attributes that depend on prepared actor data
    this.items.forEach(item => item.prepareFinalAttributes());
  }

  /* -------------------------------------------- */

  /** @override */
  prepareBaseData() {
    this._prepareBaseArmorClass(this.data);
    switch ( this.data.type ) {
      case "character":
        return this._prepareCharacterData(this.data);
      case "npc":
        return this._prepareNPCData(this.data);
    }
  }

  /* --------------------------------------------- */

  /** @override */
  applyActiveEffects() {
    // The Active Effects do not have access to their parent at preparation time so we wait until this stage to
    // determine whether they are suppressed or not.
    this.effects.forEach(e => e.determineSuppression());
    return super.applyActiveEffects();
  }

  /* -------------------------------------------- */

  /** @override */
  prepareDerivedData() {
    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags.wwnpretty || {};
    const bonuses = getProperty(data, "bonuses.abilities") || {};

    let originalSkills = null;

    //Add 'other' attribute to the main attribute
    // for (let [id, abl] of Object.entries(data.abilities)) {
    //     abl.value = abl.input + abl.other;
    //   }


    // Ability modifiers and saves
    const dcBonus = Number.isNumeric(data.bonuses?.spell?.dc) ? parseInt(data.bonuses.spell.dc) : 0;
    const saveBonus = Number.isNumeric(bonuses.save) ? parseInt(bonuses.save) : 0;
    const checkBonus = Number.isNumeric(bonuses.check) ? parseInt(bonuses.check) : 0;

    //Compute ability bonus -Lofty
    for (let [id, abl] of Object.entries(data.abilities)) {
      if (8 <= abl.value && abl.value <=13){
        abl.mod = 0;
      }
      else if(abl.value <= 7){
        abl.mod = Math.floor((abl.value-8)/4);
      }
      else{
        abl.mod =Math.floor((abl.value - 10) / 4);
      }
      // console.log("abl is ",abl, "and mod is",abl.mod, "and id is",id, "and this should match");
        // data.abilities.id.mod = abl.mod;


      //Here I'm trying to get rid of poroficency bonus without breaking anything - lofty
      // abl.prof = (abl.proficient || 0) * data.attributes.prof;
      abl.prof = 0;

      abl.saveBonus = saveBonus;
      abl.checkBonus = checkBonus;
      // abl.save = abl.mod + abl.prof + abl.saveBonus;
      abl.dc = 8 + abl.mod + data.attributes.prof + dcBonus;

      // // If we merged saves when transforming, take the highest bonus here.
      // if (originalSaves && abl.proficient) {
      //   abl.save = Math.max(abl.save, originalSaves[id].save);
      // }
    }

    // Set save bonus -Lofty
    let level = null;
    if(data.details.level){
       level = data.details.level
    }
    //If it's an npc
    else{
       level = data.attributes.level.value;
    }
    data.attributes.saves.psave = 16 - level - Math.max((data.abilities.str.mod), (data.abilities.con.mod));
    data.attributes.saves.esave = 16 - level - Math.max((data.abilities.dex.mod), (data.abilities.int.mod));
    data.attributes.saves.msave = 16 - level - Math.max((data.abilities.wis.mod), (data.abilities.cha.mod));
    // console.log("The final msave is ", data.attributes.saves.msave, "and level is",level);
    // console.log("The data.details are", data.attributes.level.value);

    // Inventory encumbrance -lofty
    data.attributes.encumbrance = this._computeEncumbrance(actorData);
    data.attributes.readiedEnc = this._computeReadied(actorData);
    // console.log("normal enc- ",data.attributes.encumbrance)
    // console.log("readied enc- ",data.attributes.readiedEnc)

    //Effort Bonus
    // actorData.data.spells
    // let spellMax = 0;

    // //So below is my work so far on automating the max effort. However, I'm having trouble referencing the spell level -Lofty
    // console.log("ENTITY JS ITEMS- ",actorData.items);
    //
    // //Check all items, if they're a spell, see if they're a higher level than our current spells, if so replace that
    // for (let item in actorData.items){
    //   console.log("SPELLMAX IS ",actorData.items[item].data);
    //   if( item.type === "spell"){
    //     if(spellMax < item.data.level){
    //       spellMax = item.data.level;
    //
    //     }
    //   }
    // }
    // //For whatever reason, the console refuses to print the value for max effort, oh well, it seems to at least hold the values right
    // data.attributes.effort.max = 1 + Math.max(data.abilities.wis.mod, data.abilities.con.mod);

    // Prepare skills
    this._prepareSkills(actorData, bonuses, checkBonus, originalSkills);

    // Reset class store to ensure it is updated with any changes
    this._classes = undefined;

    // Determine Initiative Modifier -Lofty
    const init = data.attributes.init;
    init.mod = data.abilities.dex.mod;

    init.value = init.value ?? 0;
    init.custom = init.custom ?? 0;
    init.bonus = init.value;
    init.total = init.mod + init.bonus + init.custom;

    // Prepare spell-casting data
    // data.attributes.spelldc = data.attributes.spellcasting ? data.abilities[data.attributes.spellcasting].dc : 10;
    this._computeSpellcastingProgression(this.data);

    // Prepare armor class data
    const ac = this._computeArmorClass(data);
    this.armor = ac.equippedArmor || null;
    this.shield = ac.equippedShield || null;
    if ( ac.warnings ) this._preparationWarnings.push(...ac.warnings);

    // // Compute owned item attributes which depend on prepared Actor data
    // this.items.forEach(item => {
    //   item.getSaveDC();
    //   item.getAttackToHit();
    // });
  }

  /* -------------------------------------------- */

  /**
   * Return the amount of experience required to gain a certain character level.
   * @param level {Number}  The desired level
   * @return {Number}       The XP required
   */
  getLevelExp(level) {
    const levels = CONFIG.WWNPRETTY.CHARACTER_EXP_LEVELS;
    return levels[Math.min(level, levels.length - 1)];
  }

  /* -------------------------------------------- */

  /**
   * Return the amount of experience granted by killing a creature of a certain CR.
   * @param cr {Number}     The creature's challenge rating
   * @return {Number}       The amount of experience granted per kill
   */
  getCRExp(cr) {
    if (cr < 1.0) return Math.max(200 * cr, 10);
    return CONFIG.WWNPRETTY.CR_EXP_LEVELS[cr];
  }

  /* -------------------------------------------- */

  /** @override */
  getRollData() {
    const data = super.getRollData();
    data.prof = this.data.data.attributes.prof || 0;
    data.classes = Object.entries(this.classes).reduce((obj, e) => {
      const [slug, cls] = e;
      obj[slug] = cls.data.data;
      return obj;
    }, {});
    return data;
  }

  /* -------------------------------------------- */

  // /**
  //  * Return the features which a character is awarded for each class level
  //  * @param {string} className        The class name being added
  //  * @param {string} subclassName     The subclass of the class being added, if any
  //  * @param {number} level            The number of levels in the added class
  //  * @param {number} priorLevel       The previous level of the added class
  //  * @return {Promise<Item5e[]>}     Array of Item5e entities
  //  */
  // static async loadClassFeatures({className="", subclassName="", level=1, priorLevel=0}={}) {
    // className = className.toLowerCase();
    // subclassName = subclassName.slugify();

    // Get the configuration of features which may be added
    // const clsConfig = CONFIG.WWNPRETTY.classFeatures[className];
    // if (!clsConfig) return [];

    // Acquire class features
    // let ids = [];
    // for ( let [l, f] of Object.entries(clsConfig.features || {}) ) {
    //   l = parseInt(l);
    //   if ( (l <= level) && (l > priorLevel) ) ids = ids.concat(f);
    // }

    // Acquire subclass features
    // const subConfig = clsConfig.subclasses[subclassName] || {};
    // for ( let [l, f] of Object.entries(subConfig.features || {}) ) {
    //   l = parseInt(l);
    //   if ( (l <= level) && (l > priorLevel) ) ids = ids.concat(f);
    // }

    // // Load item data for all identified features
    // const features = [];
    // for ( let id of ids ) {
    //   features.push(await fromUuid(id));
    // }

    // // Class spells should always be prepared
    // for ( const feature of features ) {
    //   if ( feature.type === "spell" ) {
    //     const preparation = feature.data.data.preparation;
    //     preparation.mode = "always";
    //     preparation.prepared = true;
    //   }
    // }
    // return features;
  // }

  /* -------------------------------------------- */

  // /** @override */
  // async updateEmbeddedEntity(embeddedName, data, options={}) {
  //   const createItems = embeddedName === "OwnedItem" ? await this._createClassFeatures(data) : [];
  //   let updated = await super.updateEmbeddedEntity(embeddedName, data, options);
  //   if ( createItems.length ) await this.createEmbeddedEntity("OwnedItem", createItems);
  //   return updated;
  // }

  // async addEmbeddedItems(items, prompt=true) {
  //   let itemsToAdd = items;
  //   if ( !items.length ) return [];
  //
  //   // Obtain the array of item creation data
  //   let toCreate = [];
  //   if (prompt) {
  //     const itemIdsToAdd = await SelectItemsPrompt.create(items, {
  //       hint: game.i18n.localize('WWNPRETTY.AddEmbeddedItemPromptHint')
  //     });
  //     for (let item of items) {
  //       if (itemIdsToAdd.includes(item.id)) toCreate.push(item.toObject());
  //     }
  //   } else {
  //     toCreate = items.map(item => item.toObject());
  //   }
  //
  //   // Create the requested items
  //   if (itemsToAdd.length === 0) return [];
  //   return Item5e.createDocuments(toCreate, {parent: this});
  // }
  //
  //
  // /* -------------------------------------------- */
  //
  // /**
  //  * Create additional class features in the Actor when a class item is updated.
  //  * @private
  //  */
  // async _createClassFeatures(updated) {
  //   let toCreate = [];
  //   for (let u of updated instanceof Array ? updated : [updated]) {
  //     const item = this.items.get(u._id);
  //     if (!item || (item.data.type !== "class")) continue;
  //     const updateData = expandObject(u);
  //     const config = {
  //       className: updateData.name || item.data.name,
  //       subclassName: getProperty(updateData, "data.subclass") || item.data.data.subclass,
  //       level: getProperty(updateData, "data.levels"),
  //       priorLevel: item ? item.data.data.levels : 0
  //     }
  //
  //     // Get and create features for an increased class level
  //     let changed = false;
  //     if ( config.level && (config.level > config.priorLevel)) changed = true;
  //     if ( config.subclassName !== item.data.data.subclass ) changed = true;
  //
  //     // Get features to create
  //     if ( changed ) {
  //       const existing = new Set(this.items.map(i => i.name));
  //       const features = await Actor5e.getClassFeatures(config);
  //       for ( let f of features ) {
  //         if ( !existing.has(f.name) ) toCreate.push(f);
  //       }
  //     }
  //   }
  //   return toCreate
  // }

  /* -------------------------------------------- */
  /*  Data Preparation Helpers                    */
  /* -------------------------------------------- */

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    const data = actorData.data;

    // Determine character level and available hit dice based on owned Class items
    const [level, hd] = this.items.reduce((arr, item) => {
      if ( item.type === "class" ) {
        const classLevels = parseInt(item.data.data.levels) || 1;
        arr[0] += classLevels;
        arr[1] += classLevels - (parseInt(item.data.data.hitDiceUsed) || 0);
      }
      return arr;
    }, [0, 0]);
    data.details.level = level;
    data.attributes.hd = hd;

    // Character proficiency bonus
    // data.attributes.prof = Math.floor((level + 7) / 4);
    data.attributes.prof = 0;

    // Experience required for next level
    const xp = data.details.xp;
    xp.max = this.getLevelExp(level || 1);
    const prior = this.getLevelExp(level - 1 || 0);
    const required = xp.max - prior;
    const pct = Math.round((xp.value - prior) * 100 / required);
    xp.pct = Math.clamped(pct, 0, 100);
  }

  /* -------------------------------------------- */

  /**
   * Prepare NPC type specific data
   */
  _prepareNPCData(actorData) {
    const data = actorData.data;

    // Kill Experience
    data.details.xp.value = this.getCRExp(data.details.cr);

    // Proficiency
    // data.attributes.prof = Math.floor((Math.max(data.details.cr, 1) + 7) / 4);
    data.attributes.prof = 0;
    // Spellcaster Level
    if ( data.attributes.spellcasting && !Number.isNumeric(data.details.spellLevel) ) {
      data.details.spellLevel = Math.max(data.details.cr, 1);
    }
  }

  /* -------------------------------------------- */

  /**
   * Prepare skill checks.
   * @param actorData
   * @param bonuses Global bonus data.
   * @param checkBonus Ability check specific bonus.
   * @param originalSkills A transformed actor's original actor's skills.
   * @private
   */
  _prepareSkills(actorData, bonuses, checkBonus, originalSkills) {

    const data = actorData.data;
    // const flags = actorData.flags.wwnpretty || {};

    // Skill modifiers
    // const feats = WWNPRETTY.characterFlags;
    // const observant = flags.observantFeat;
    const skillBonus = Number.isNumeric(bonuses.skill) ? parseInt(bonuses.skill) :  0;
    for (let [id, skl] of Object.entries(data.skills)) {

      skl.value = Math.clamped(Number(skl.value).toNearest(1), -9, 99) ?? -1;
      //Fill in all the 'level' category with -1 as default
      // if (skl.level == null){
      //   skl.level = -1;
      // }
      //Yes I know it's bad, but I'm redoing the skill ability attribute to be a flag because it's convenient
      //I've placed all of the default values to be 'str', so when someone gets a level, it checks if it's 0
      //And if it's not, it adds to the 'other' if the flag is 'str', and changes the flag so it only happens once ever
      // if((skl.ability === "str")&&(skl.value > 0)){
      //   skl.prof = skl.prof +1;
      //   skl.ability = "dex";
      // }

      // skl.prof = Math.clamped(Number(skl.prof).toNearest(1), -9, 9) ?? -1;

      // let round = Math.floor;

      // Compute modifier. Right now it should just do the number you put in and save that.
      skl.bonus = checkBonus + skillBonus;
      skl.total = skl.value + skl.prof;


      // skl.mod = data.abilities[skl.ability].mod;
      // skl.total = skl.mod + skl.prof + skl.bonus;

      // Compute passive bonus
      // const passive = 0;
      // skl.passive = 10 + skl.total + passive;
    }
  }

  /* -------------------------------------------- */

  _prepareBaseArmorClass(actorData) {
    const ac = actorData.data.attributes.ac;
    ac.base = 10;
    ac.shield = ac.bonus = ac.cover = 0;
    this.armor = null;
    this.shield = null;
  }

  /**
   * Prepare data related to the spell-casting capabilities of the Actor
   * @private
   */
  _computeSpellcastingProgression (actorData) {
    const ad = actorData.data;
    const spells = ad.spells;
    const isNPC = actorData.type === 'npc';

    // Translate the list of classes into spell-casting progression
    const progression = {
      total: 0,
      slot: 0,
      pact: 0
    };

    // Keep track of the last seen caster in case we're in a single-caster situation.
    let caster = null;

    // Tabulate the total spell-casting progression
    const classes = this.data.items.filter(i => i.type === "class");
    for ( let cls of classes ) {
      const d = cls.data.data;
      if ( d.spellcasting.progression === "none" ) continue;
      const levels = d.levels;
      const prog = d.spellcasting.progression;

      // Accumulate levels
      if ( prog !== "pact" ) {
        caster = d;
        progression.total++;
      }
      switch (prog) {
        case 'third': progression.slot += Math.floor(levels / 3); break;
        case 'half': progression.slot += Math.floor(levels / 2); break;
        case 'full': progression.slot += levels; break;
        case 'artificer': progression.slot += Math.ceil(levels / 2); break;
        case 'pact': progression.pact += levels; break;
      }
    }

    // EXCEPTION: single-classed non-full progression rounds up, rather than down
    const isSingleClass = (progression.total === 1) && (progression.slot > 0);
    if (!isNPC && isSingleClass && ['half', 'third'].includes(caster.spellcasting.progression) ) {
      const denom = caster.spellcasting.progression === 'third' ? 3 : 2;
      progression.slot = Math.ceil(caster.levels / denom);
    }

    // EXCEPTION: NPC with an explicit spell-caster level
    if (isNPC && actorData.data.details.spellLevel) {
      progression.slot = actorData.data.details.spellLevel;
    }

    // Look up the number of slots per level from the progression table
    const levels = Math.clamped(progression.slot, 0, 20);
    const slots = WWNPRETTY.SPELL_SLOT_TABLE[levels - 1] || [];
    for ( let [n, lvl] of Object.entries(spells) ) {
      let i = parseInt(n.slice(-1));
      if ( Number.isNaN(i) ) continue;
      if ( Number.isNumeric(lvl.override) ) lvl.max = Math.max(parseInt(lvl.override), 0);
      else lvl.max = slots[i-1] || 0;
      lvl.value = parseInt(lvl.value);
    }

    // Determine the Actor's pact magic level (if any)
    let pl = Math.clamped(progression.pact, 0, 20);
    spells.pact = spells.pact || {};
    if ( (pl === 0) && isNPC && Number.isNumeric(spells.pact.override) ) pl = actorData.data.details.spellLevel;

    // Determine the number of Warlock pact slots per level
    if ( pl > 0) {
      spells.pact.level = Math.ceil(Math.min(10, pl) / 2);
      if ( Number.isNumeric(spells.pact.override) ) spells.pact.max = Math.max(parseInt(spells.pact.override), 1);
      else spells.pact.max = Math.max(1, Math.min(pl, 2), Math.min(pl - 8, 3), Math.min(pl - 13, 4));
      spells.pact.value = Math.min(spells.pact.value, spells.pact.max);
    } else {
      spells.pact.max = parseInt(spells.pact.override) || 0
      spells.pact.level = spells.pact.max > 0 ? 1 : 0;
    }
  }

  /* -------------------------------------------- */

  /** -From Lofty - this is the compute armor class function I can add if it might help, putting it here for convenience
   * Determine a character's AC value from their carried armor and shield.
   * @param {object} data
   * @param {object} [options]
   * @param {boolean} [options.ignoreFlat]  Should ac.flat be ignored while calculating the AC?
   * @return {Number}                       Calculated armor value.
   * @private
   */
  _computeArmorClass(data) {
    const ac = data.attributes.ac;
	ac.warnings = [];
	
	let cfg = CONFIG.WWNPRETTY.armorClasses[ac.calc];
	if (!cfg) {
		ac.calc = "flat";
		if ( Number.isNumeric(ac.value) ) ac.flat = Number(ac.value);
		cfg = CONFIG.WWNPRETTY.armorClasses.flat;
	}

	// Identify Equipped Items
    const armorTypes = new Set(Object.keys(CONFIG.WWNPRETTY.equipmentTypes));
    const {armors, shields} = this.itemTypes.equipment.reduce((obj, equip) => {
		const armor = equip.data.data.armor;
		if (equip.data.data.location !== "readied"|| !armorTypes.has(armor?.type)) return obj;
		if (armor.type === "shield") obj.shields.push(equip);
		else obj.armors.push(equip);
		return obj;
    }, {armors: [], shields: []});

	// Determine base AC
	switch (ac.calc) {
		
		case "flat":
			ac.value = ac.flat;
			return ac;
		
		case "natural":
			ac.base = ac.flat;
			break;
			
		case "default":
			if (armors.length) {
				if (armors.length > 1) ac.warnings.push("WWNPRETTY.WarnMultipleArmor");
				const armorData = armors[0].data.data.armor;
				ac.dex = Math.min(armorData.dex ?? Infinity, data.abilities.dex.mod);
				ac.base = (armorData.value ?? 0) + ac.dex;
				ac.equippedArmor = armors[0];
			} else {
				ac.dex = data.abilities.dex.mod;
				ac.base = 10 + ac.dex;
			}
			break;
		
		default:
			let formula = ac.calc === "custom" ? ac.formula : cfg.formula;
			const rollData = this.getRollData();
			try {
				const replaced = Roll.replaceFormulaData(formula, rollData);
				ac.base = Roll.safeEval(replaced);
			} catch (err) {
				ac.warnings.push("WWNPRETTY.WarnBadACFormula");
				const replaced = Roll.replaceFormulaData(CONFIG.WWNPRETTY.armorClasses.default.formula, rollData);
				ac.base = Roll.safeEval(replaced);
			}
			break;	
	}

    if ( shields.length ) {
      if ( shields.length > 1 ) ac.warnings.push("WWNPRETTY.WarnMultipleShields");
      ac.shield = shields[0].data.data.armor.value ?? 0;
      ac.equippedShield = shields[0];
    }

	ac.value = ac.base + ac.shield + ac.bonus + ac.cover;
	return ac;
}

  /* -------------------------------------------- */

  /**
   * Compute the carried level and percentage of encumbrance for an Actor.
   *
   * @param {Object} actorData      The data object for the Actor being rendered
   * @returns {{max: number, value: number, pct: number}}  An object describing the character's encumbrance level
   * @private
   */
  _computeEncumbrance(actorData) {

    // Get the total weight from items
    const physicalItems = ["weapon", "equipment", "consumable", "tool", "backpack", "loot"];
    let weight = actorData.items.reduce((weight, i) => {
      if ( !physicalItems.includes(i.type) ) return weight;
      //If item is carried or readied -Lofty -- This is incorrect. Readied Items do not count against stowed encumbrance. - Sorellia.
      let q = 0;
      let w = 0;

      if (i.data.data.location === "carried"){
        q += i.data.data.quantity || 0;
        w += i.data.data.weight || 0;
      }
      // console.log("This is the items quantity, weight -",q,w,i.data.data.weight);
      return weight + (q * w);
    }, 0);

      let carriedBonus = Number(actorData.data.bonuses.encumbrance.bonusCarried);

    // Compute Encumbrance percentage
    weight = weight.toNearest(0.1);

    let max = (actorData.data.abilities.str.value + carriedBonus);
    // console.log("carriedbonus is",carriedBonus, actorData.data.abilities.str.value,actorData.data.abilities.str.value + carriedBonus);
    // console.log("carriedbonus is",typeof carriedBonus,typeof actorData.data.abilities.str.value,typeof (actorData.data.abilities.str.value + carriedBonus));
    const pct = Math.clamped(((weight * 100) / max), 0, 100);

    return { value: weight.toNearest(0.1), max, pct, encumbered: pct > (2/3) };
  }

  /* -------------------------------------------- */

  /**
   * Compute the level and percentage of readied items for an Actor.
   *
   * @param {Object} actorData      The data object for the Actor being rendered
   * @returns {{max: number, value: number, pct: number}}  An object describing the character's encumbrance level
   * @private
   */
  _computeReadied(actorData) {
    //So yes, I know it's bad form, but I'm not sure where else to put it and this is easy to find later
    //Set the items status in template, since I'm not sure how to set multiple things directly from the html -lofty
    // actorData.data.


    const physicalItems = ["weapon", "equipment", "consumable", "tool", "backpack", "loot"];
    let weight = actorData.items.reduce((weight, i) => {
      if ( !physicalItems.includes(i.type) ) return weight;
      let q = 0;
      let w = 0;
      if (i.data.data.location === "readied"){
        q += i.data.data.quantity || 0;
        w += i.data.data.weight || 0;
      }
      return weight + (q * w);
    }, 0);
    let readiedBonus = Number(actorData.data.bonuses.encumbrance.bonusReadied);

    // Compute Encumbrance percentage
    weight = weight.toNearest(0.1);
    const max = Math.floor((actorData.data.abilities.str.value * CONFIG.WWNPRETTY.encumbrance.strMultiplier)/2) + readiedBonus;
        // + actorData.data.attributes.encumbrance.bonusReadied;
    const pct = Math.clamped((weight * 100) / max, 0, 100);
    return { value: weight.toNearest(0.1), max, pct, encumbered: pct > (2/3) };
  }

  /* -------------------------------------------- */
  /*  Event Handlers
  /* -------------------------------------------- */

  /** @inheritdoc */
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);
    const sourceId = this.getFlag("core", "sourceId");
    if ( sourceId?.startsWith("Compendium.") ) return;

    // Some sensible defaults for convenience
    // Token size category
    const s = CONFIG.WWNPRETTY.tokenSizes[this.data.data.traits.size || "med"];
    this.data.token.update({width: s, height: s});

    // Player character configuration
    if ( this.type === "character" ) {
      this.data.token.update({vision: true, actorLink: true, disposition: 1});
    }
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async _preUpdate(changed, options, user) {
    await super._preUpdate(changed, options, user);

    // Apply changes in Actor size to Token width/height
    const newSize = foundry.utils.getProperty(changed, "data.traits.size");
    if ( newSize && (newSize !== foundry.utils.getProperty(this.data, "data.traits.size")) ) {
      let size = CONFIG.WWNPRETTY.tokenSizes[newSize];
      if ( !foundry.utils.hasProperty(changed, "token.width") ) {
        changed.token = changed.token || {};
        changed.token.height = size;
        changed.token.width = size;
      }
    }

    // Reset death save counters
    const isDead = this.data.data.attributes.hp.value <= 0;
    if ( isDead && (foundry.utils.getProperty(changed, "data.attributes.hp.value") > 0) ) {
      foundry.utils.setProperty(changed, "data.attributes.death.success", 0);
      foundry.utils.setProperty(changed, "data.attributes.death.failure", 0);
    }

  //   // Perform the update
  //   return super.update(data, options);
  // }
  //
  // /* -------------------------------------------- */
  //
  // /** @override */
  // async createEmbeddedEntity(embeddedName, itemData, options={}) {
  //
  //   // Pre-creation steps for owned items
  //   if ( embeddedName === "OwnedItem" ) this._preCreateOwnedItem(itemData, options);
  //
  //   // Standard embedded entity creation
  //   return super.createEmbeddedEntity(embeddedName, itemData, options);
  }

  /* -------------------------------------------- */

  /**
   * Assign a class item as the original class for the Actor based on which class has the most levels
   * @protected
   */
  _assignPrimaryClass() {
    const classes = this.itemTypes.class.sort((a, b) => b.data.data.levels - a.data.data.levels);
    const newPC = classes[0]?.id || "";
    return this.update({"data.details.originalClass": newPC});
  }

  /* -------------------------------------------- */
  /*  Gameplay Mechanics                          */
  /* -------------------------------------------- */

  /** @override */
  async modifyTokenAttribute(attribute, value, isDelta, isBar) {
    if ( attribute === "attributes.hp" ) {
      const hp = getProperty(this.data.data, attribute);
      const delta = isDelta ? (-1 * value) : (hp.value + hp.temp) - value;
      return this.applyDamage(delta);
    }
    return super.modifyTokenAttribute(attribute, value, isDelta, isBar);
  }

  /* -------------------------------------------- */

  /**
   * Apply a certain amount of damage or healing to the health pool for Actor
   * @param {number} amount       An amount of damage (positive) or healing (negative) to sustain
   * @param {number} multiplier   A multiplier which allows for resistance, vulnerability, or healing
   * @return {Promise<Actor>}     A Promise which resolves once the damage has been applied
   */
  async applyDamage(amount=0, multiplier=1) {
    amount = Math.floor(parseInt(amount) * multiplier);
    const hp = this.data.data.attributes.hp;

    // Deduct damage from temp HP first
    const tmp = parseInt(hp.temp) || 0;
    const dt = amount > 0 ? Math.min(tmp, amount) : 0;

    // Remaining goes to health
    const tmpMax = parseInt(hp.tempmax) || 0;
    const dh = Math.clamped(hp.value - (amount - dt), 0, hp.max + tmpMax);

    // Update the Actor
    const updates = {
      "data.attributes.hp.temp": tmp - dt,
      "data.attributes.hp.value": dh
    };

    // Delegate damage application to a hook
    // TODO replace this in the future with a better modifyTokenAttribute function in the core
    const allowed = Hooks.call("modifyTokenAttribute", {
      attribute: "attributes.hp",
      value: amount,
      isDelta: false,
      isBar: true
    }, updates);
    return allowed !== false ? this.update(updates) : this;
  }

  /* -------------------------------------------- */
  /**
   * Choose which attribute to roll a skill with, then roll it.
   * Prompt the user for input on which attribute to use. Also this method is all by Lofty.
   * @param {String}skillId     The ability id (e.g. "str")
   * @param {Object} options      Options which configure how ability tests or saving throws are rolled
   */
  rollSkill(skillId, options={}) {

    const label = CONFIG.WWNPRETTY.skills[skillId];
    new Dialog({
      title: game.i18n.format("WWNPRETTY.SkillPromptTitle", {skill: label}),
      content: `<p>${game.i18n.format("WWNPRETTY.SkillPromptText", {skill: label})}</p>`,
        buttons: {
          str: {
            label: game.i18n.localize("STR"),
            callback: () => this.rollSkillFull(skillId, options, this.getAbilityMod("str"))
          },
          con: {
            label: game.i18n.localize("CON"),
            callback: () => this.rollSkillFull(skillId, options,this.getAbilityMod("con"))
          },
          dex: {
            label: game.i18n.localize("DEX"),
            callback: () => this.rollSkillFull(skillId, options, this.getAbilityMod("dex"))
          },
          int: {
            label: game.i18n.localize("INT"),
            callback: () => this.rollSkillFull(skillId, options, this.getAbilityMod("int"))
          },
          wis: {
            label: game.i18n.localize("WIS"),
            callback: () => this.rollSkillFull(skillId, options, this.getAbilityMod("wis"))
          },
          cha: {
            label: game.i18n.localize("CHA"),
            callback: () => this.rollSkillFull(skillId, options, this.getAbilityMod("cha"))
          },
          none: {
            label: game.i18n.localize("NONE"),
            callback: () => this.rollSkillFull(skillId, options, 0)
          }
        }

    }).render(true);
  }

  /* -------------------------------------------- */

  /**
   * Return the modifier for an ability. Also this method is all by Lofty.
   * @param {String}abilityId
   */
  getAbilityMod(abl){
    const choice = this.data.data.abilities[abl].value

    if (8 <= choice && choice <=13){
      return 0;
    }
    else if(choice <= 7){
      return Math.floor((choice-8)/4);

    }
    else{
      return Math.floor((choice - 10) / 4);
    }
  }

  /**
   * Roll a Skill Check
   * Prompt the user for input regarding Advantage/Disadvantage and any Situational Bonus
   * @param {string} skillId      The skill id (e.g. "ins")
   * @param {Object} options      Options which configure how the skill check is rolled
   * @param {int} options         Options which configure how the skill check is rolled
   * @param {int} attr            Which attribute the skill should roll with
   * @return {Promise<Roll>}      A Promise which resolves to the created Roll instance
   * Lofty has renamed this method from rollSkill in order to add another parameter
   */


  rollSkillFull(skillId, options={}, attr) {
    const skl = this.data.data.skills[skillId];
    const bonuses = getProperty(this.data.data, "bonuses.abilities") || {};
    // Compose roll parts and data
    const parts = ["@mod"];
    const data = {mod: skl.value + skl.prof + attr};

    // Ability test bonus
    if ( bonuses.check ) {
      data["checkBonus"] = bonuses.check;
      parts.push("@checkBonus");
    }

    // Skill check bonus
    if ( bonuses.skill ) {
      data["skillBonus"] = bonuses.skill;
      parts.push("@skillBonus");
    }

    // Add provided extra roll parts now because they will get clobbered by mergeObject below
    if (options.parts?.length > 0) {
      parts.push(...options.parts);
    }

    // Roll and return, lofty has changed some
    const rollData = foundry.utils.mergeObject(options, {
      parts: parts,
      data: data,
      title: game.i18n.format("WWNPRETTY.SkillPromptTitle", {skill: CONFIG.WWNPRETTY.skills[skillId]}),
      fastForward: true,
      die: skl.diceNum.concat("d6"),
      // die: "2d6",
      // formula:`2d6${skl.value}`,
      formula:`2d6${skl.value}dl`,
      critical: 6,
      // messageData: {"flags.wwnpretty.roll": {type: "skill", skillId }}
      messageData: {
        speaker: options.speaker || ChatMessage.getSpeaker({actor: this}),
        "flags.wwnpretty.roll": {type: "skill", skillId }
      }
    });
    // console.log("Roll data for rollskill is",rollData);
    // rollData.speaker = options.speaker || ChatMessage.getSpeaker({actor: this});
    return d20Roll(rollData);


    //Lofty's roll and return. Add apostrophes if not working
    // let total = skl.value; //soon, add skill.other modifiers
    // let formula = `2d8${total}`;



  }

  /* -------------------------------------------- */

  /**
   * Roll a generic ability test or saving throw.
   * Prompt the user for input on which variety of roll they want to do.
   * @param {String}abilityId     The ability id (e.g. "str")
   * @param {Object} options      Options which configure how ability tests or saving throws are rolled
   */
  rollAbility(abilityId, options={}) {
    const label = CONFIG.WWNPRETTY.abilities[abilityId];
    new Dialog({
      title: game.i18n.format("WWNPRETTY.AbilityPromptTitle", {ability: label}),
      content: `<p>${game.i18n.format("WWNPRETTY.AbilityPromptText", {ability: label})}</p>`,
      buttons: {
        test: {
          label: game.i18n.localize("WWNPRETTY.ActionAbil"),
          callback: () => this.rollAbilityTest(abilityId, options)
        },
        save: {
          label: game.i18n.localize("WWNPRETTY.ActionSave"),
          callback: () => this.rollAbilitySave(abilityId, options)
        }
      }
    }).render(true);
  }

  /* -------------------------------------------- */

  /**
   * Roll an Ability Test
   * Prompt the user for input regarding Advantage/Disadvantage and any Situational Bonus
   * @param {String} abilityId    The ability ID (e.g. "str")
   * @param {Object} options      Options which configure how ability tests are rolled
   * @return {Promise<Roll>}      A Promise which resolves to the created Roll instance
   */
  rollAbilityTest(abilityId, options={}) {
    const label = CONFIG.WWNPRETTY.abilities[abilityId];
    const abl = this.data.data.abilities[abilityId];

    // Construct parts
    const parts = ["@mod"];
    const data = {mod: abl.mod};


    // Add global actor bonus
    const bonuses = getProperty(this.data.data, "bonuses.abilities") || {};
    if ( bonuses.check ) {
      parts.push("@checkBonus");
      data.checkBonus = bonuses.check;
    }

    // Add provided extra roll parts now because they will get clobbered by mergeObject below
    if (options.parts?.length > 0) {
      parts.push(...options.parts);
    }

    // Roll and return
    const rollData = foundry.utils.mergeObject(options, {
      parts: parts,
      data: data,
      title: game.i18n.format("WWNPRETTY.AbilityPromptTitle", {ability: label}),
      messageData: {
        speaker: options.speaker || ChatMessage.getSpeaker({actor: this}),
        "flags.wwnpretty.roll": {type: "ability", abilityId }
      }
    });
    // rollData.speaker = options.speaker || ChatMessage.getSpeaker({actor: this});
    return d20Roll(rollData);
  }

  /* -------------------------------------------- */
  /**
   * Roll an Ability Saving Throw for WWN, function by Lofty
   * @param {String} saveType
   * @param {Object} options      Options which configure how ability tests are rolled
   * @return {Promise<Roll>}      A Promise which resolves to the created Roll instance
   */
  rollSaveWwn(saveType, options={}){

    const stype = CONFIG.WWNPRETTY.saves[saveType];
    const sval = this.data.data.attributes.saves[saveType];
    let saveLabel = game.i18n.localize(`${stype}`);
    // console.log("SVAL IS ",sval);
    // console.log("savetype is",saveType);
    // Construct parts
    const parts = [0];  //["@mod"];
    const data = {0:0};   //{mod: type};


    // Include a global actor ability save bonus
    const bonuses = getProperty(this.data.data, "bonuses.abilities") || {};
    if ( bonuses.save ) {
      parts.push("@saveBonus");
      data.saveBonus = bonuses.save;
    }

    // Add provided extra roll parts now because they will get clobbered by mergeObject below
    if (options.parts?.length > 0) {
      parts.push(...options.parts);
    }

    //Deal with morale checks
    var rollData;

    if(saveType === "morale"){
      saveLabel = "Morale";
      // Roll and return
      rollData = foundry.utils.mergeObject(options, {
        parts: parts,
        data: data,
        fastForward: true,
        isSave: sval,
        moraleSave: true,
        //To make this like the other saves where it publically says the dc, changed to SavePromptTitleVS -Lofty
        title: game.i18n.format("WWNPRETTY.SavePromptTitle", {ability: saveLabel, dc: sval}),
        messageData: {"flags.wwnpretty.roll": {type: "save", saveLabel}}
      });
    }
    else{
      rollData = foundry.utils.mergeObject(options, {
        parts: parts,
        data: data,
        fastForward: true,
        //Right now, sval doesn't include +/- extra modifiers. To do that, just add those in here also - Lofty
        isSave: sval,
        title: game.i18n.format("WWNPRETTY.SavePromptTitleVS", {ability: saveLabel, dc: sval}),
        messageData: {"flags.wwnpretty.roll": {type: "save", saveLabel}}
      });
    }

    // // Roll and return
    // rollData = foundry.utils.mergeObject(options, {
    //   parts: parts,
    //   data: data,
    //   title: game.i18n.format("WWNPRETTY.SavePromptTitle", {ability: label}),
    //   messageData: {
    //     speaker: options.speaker || ChatMessage.getSpeaker({actor: this}),
    //     "flags.wwnpretty.roll": {type: "save", abilityId }
    //   }
    // });
    //So this part is throwing up a warning, the game wants the speaker to be included inside of the actual arguments, so do that if it becomes a bigger problem
    rollData.speaker = options.speaker || ChatMessage.getSpeaker({actor: this});
    return d20Roll(rollData);
  }

  /* -------------------------------------------- */
  /**
   * Roll an Ability Saving Throw
   * Prompt the user for input regarding Advantage/Disadvantage and any Situational Bonus
   * @param {String} abilityId    The ability ID (e.g. "str")
   * @param {Object} options      Options which configure how ability tests are rolled
   * @return {Promise<Roll>}      A Promise which resolves to the created Roll instance
   */
  rollAbilitySave(abilityId, options={}) {
    const label = CONFIG.WWNPRETTY.abilities[abilityId];
    const abl = this.data.data.abilities[abilityId];

    // Construct parts
    const parts = ["@mod"];
    const data = {mod: abl.mod};

    // Include proficiency bonus
    if ( abl.prof > 0 ) {
      parts.push("@prof");
      data.prof = abl.prof;
    }

    // Include a global actor ability save bonus
    const bonuses = getProperty(this.data.data, "bonuses.abilities") || {};
    if ( bonuses.save ) {
      parts.push("@saveBonus");
      data.saveBonus = bonuses.save;
    }

    // Add provided extra roll parts now because they will get clobbered by mergeObject below
    if (options.parts?.length > 0) {
      parts.push(...options.parts);
    }

    // Roll and return
    const rollData = foundry.utils.mergeObject(options, {
      parts: parts,
      data: data,
      title: game.i18n.format("WWNPRETTY.SavePromptTitle", {ability: label}),
      messageData: {
        speaker: options.speaker || ChatMessage.getSpeaker({actor: this}),
        "flags.wwnpretty.roll": {type: "save", abilityId }
      }
    });
    // rollData.speaker = options.speaker || ChatMessage.getSpeaker({actor: this});
    return d20Roll(rollData);
  }

  /* -------------------------------------------- */

  /**
   * Perform a death saving throw, rolling a d20 plus any global save bonuses
   * @param {Object} options        Additional options which modify the roll
   * @return {Promise<Roll|null>}   A Promise which resolves to the Roll instance
   */
  async rollDeathSave(options={}) {

    // Display a warning if we are not at zero HP or if we already have reached 3
    const death = this.data.data.attributes.death;
    if ( (this.data.data.attributes.hp.value > 0) || (death.failure >= 3) || (death.success >= 3)) {
      ui.notifications.warn(game.i18n.localize("WWNPRETTY.DeathSaveUnnecessary"));
      return null;
    }

    // Evaluate a global saving throw bonus
    const parts = [];
    const data = {};
    const speaker = options.speaker || ChatMessage.getSpeaker({actor: this});

    // Include a global actor ability save bonus
    const bonuses = foundry.utils.getProperty(this.data.data, "bonuses.abilities") || {};
    if ( bonuses.save ) {
      parts.push("@saveBonus");
      data.saveBonus = bonuses.save;
    }

    // Evaluate the roll
    const rollData = foundry.utils.mergeObject(options, {
      parts: parts,
      data: data,
      title: game.i18n.localize("WWNPRETTY.DeathSavingThrow"),
      targetValue: 10,
      messageData: {
        speaker: options.speaker || ChatMessage.getSpeaker({actor: this}),
        "flags.wwnpretty.roll": {type: "death"}
      }
    });
    rollData.speaker = speaker;
    const roll = await d20Roll(rollData);
    if ( !roll ) return null;

    // Take action depending on the result
    const success = roll.total >= 10;
    const d20 = roll.dice[0].total;

    let chatString;

    // Save success
    if ( success ) {
      let successes = (death.success || 0) + 1;

      // Critical Success = revive with 1hp
      if ( d20 === 20 ) {
        await this.update({
          "data.attributes.death.success": 0,
          "data.attributes.death.failure": 0,
          "data.attributes.hp.value": 1
        });
        chatString = "WWNPRETTY.DeathSaveCriticalSuccess";
      }

      // 3 Successes = survive and reset checks
      else if ( successes === 3 ) {
        await this.update({
          "data.attributes.death.success": 0,
          "data.attributes.death.failure": 0
        });
        chatString = "WWNPRETTY.DeathSaveSuccess";
      }

      // Increment successes
      else await this.update({"data.attributes.death.success": Math.clamped(successes, 0, 3)});
    }

    // Save failure
    else {
      let failures = (death.failure || 0) + (d20 === 1 ? 2 : 1);
      await this.update({"data.attributes.death.failure": Math.clamped(failures, 0, 3)});
      if ( failures >= 3 ) {  // 3 Failures = death
        chatString = "WWNPRETTY.DeathSaveFailure";
      }
    }

    // Display success/failure chat message
    if ( chatString ) {
      let chatData = { content: game.i18n.format(chatString, {name: this.name}), speaker };
      ChatMessage.applyRollMode(chatData, roll.options.rollMode);
      await ChatMessage.create(chatData);
    }

    // Return the rolled result
    return roll;
  }

  /* -------------------------------------------- */

  /**
   * Roll a hit die of the appropriate type, gaining hit points equal to the die roll plus your CON modifier
   * @param {string} [denomination]   The hit denomination of hit die to roll. Example "d8".
   *                                  If no denomination is provided, the first available HD will be used
   * @param {boolean} [dialog]        Show a dialog prompt for configuring the hit die roll?
   * @return {Promise<Roll|null>}     The created Roll instance, or null if no hit die was rolled
   */
  async rollHitDie(denomination, {dialog=true}={}) {

    // If no denomination was provided, choose the first available
    let cls = null;
    if ( !denomination ) {
      cls = this.itemTypes.class.find(c => c.data.data.hitDiceUsed < c.data.data.levels);
      if ( !cls ) return null;
      denomination = cls.data.data.hitDice;
    }

    // Otherwise locate a class (if any) which has an available hit die of the requested denomination
    else {
      cls = this.items.find(i => {
        const d = i.data.data;
        return (d.hitDice === denomination) && ((d.hitDiceUsed || 0) < (d.levels || 1));
      });
    }

    // If no class is available, display an error notification
    if ( !cls ) {
      ui.notifications.error(game.i18n.format("WWNPRETTY.HitDiceWarn", {name: this.name, formula: denomination}));
      return null;
    }

    // Prepare roll data
    const parts = [`1${denomination}`, "@abilities.con.mod"];
    const title = game.i18n.localize("WWNPRETTY.HitDiceRoll");
    const rollData = foundry.utils.deepClone(this.data.data);

    // Call the roll helper utility
    const roll = await damageRoll({
      event: new Event("hitDie"),
      parts: parts,
      data: rollData,
      title: title,
      allowCritical: false,
      fastForward: !dialog,
      dialogOptions: {width: 350},
      messageData: {
        speaker: ChatMessage.getSpeaker({actor: this}),
        "flags.wwnpretty.roll": {type: "hitDie"}
      }
    });
    if ( !roll ) return null;

    // Adjust actor data
    await cls.update({"data.hitDiceUsed": cls.data.data.hitDiceUsed + 1});
    const hp = this.data.data.attributes.hp;
    const dhp = Math.min(hp.max + (hp.tempmax ?? 0) - hp.value, roll.total);
    await this.update({"data.attributes.hp.value": hp.value + dhp});
    return roll;
  }

  /* -------------------------------------------- */

  // /**
  //  * Cause this Actor to take a Short Rest
  //  * During a Short Rest resources and limited item uses may be recovered
  //  * @param {boolean} dialog  Present a dialog window which allows for rolling hit dice as part of the Short Rest
  //  * @param {boolean} chat    Summarize the results of the rest workflow as a chat message
  //  * @param {boolean} autoHD  Automatically spend Hit Dice if you are missing 3 or more hit points
  //  * @param {boolean} autoHDThreshold   A number of missing hit points which would trigger an automatic HD roll
  //  * @return {Promise}        A Promise which resolves once the short rest workflow has completed
  //  */
  // async shortRest({dialog=true, chat=true, autoHD=false, autoHDThreshold=3}={}) {
  //
  //   // Take note of the initial hit points and number of hit dice the Actor has
  //   const hp = this.data.data.attributes.hp;
  //   const hd0 = this.data.data.attributes.hd;
  //   const hp0 = hp.value;
  //   let newDay = false;
  //
  //   // Display a Dialog for rolling hit dice
  //   if ( dialog ) {
  //     try {
  //       newDay = await ShortRestDialog.shortRestDialog({actor: this, canRoll: hd0 > 0});
  //     } catch(err) {
  //       return;
  //     }
  //   }
  //
  //   // Automatically spend hit dice
  //   else if ( autoHD ) {
  //     while ( (hp.value + autoHDThreshold) <= hp.max ) {
  //       const r = await this.rollHitDie(undefined, {dialog: false});
  //       if ( r === null ) break;
  //     }
  //   }
  //
  //   // Note the change in HP and HD which occurred
  //   const dhd = this.data.data.attributes.hd - hd0;
  //   const dhp = this.data.data.attributes.hp.value - hp0;
  //
  //   // Recover character resources
  //   const updateData = {};
  //   for ( let [k, r] of Object.entries(this.data.data.resources) ) {
  //     if ( r.max && r.sr ) {
  //       updateData[`data.resources.${k}.value`] = r.max;
  //     }
  //   }
  //
  //   // Recover pact slots.
  //   const pact = this.data.data.spells.pact;
  //   updateData['data.spells.pact.value'] = pact.override || pact.max;
  //   await this.update(updateData);
  //
  //   // Recover item uses
  //   const recovery = newDay ? ["sr", "day"] : ["sr"];
  //   const items = this.items.filter(item => item.data.data.uses && recovery.includes(item.data.data.uses.per));
  //   const updateItems = items.map(item => {
  //     return {
  //       _id: item._id,
  //       "data.uses.value": item.data.data.uses.max
  //     };
  //   });
  //   await this.updateEmbeddedEntity("OwnedItem", updateItems);
  //
  //   // Display a Chat Message summarizing the rest effects
  //   if ( chat ) {
  //
  //     // Summarize the rest duration
  //     let restFlavor;
  //     switch (game.settings.get("wwnpretty", "restVariant")) {
  //       case 'normal': restFlavor = game.i18n.localize("WWNPRETTY.ShortRestNormal"); break;
  //       case 'gritty': restFlavor = game.i18n.localize(newDay ? "WWNPRETTY.ShortRestOvernight" : "WWNPRETTY.ShortRestGritty"); break;
  //       case 'epic':  restFlavor = game.i18n.localize("WWNPRETTY.ShortRestEpic"); break;
  //     }
  //
  //     // Summarize the health effects
  //     let srMessage = "WWNPRETTY.ShortRestResultShort";
  //     if ((dhd !== 0) && (dhp !== 0)) srMessage = "WWNPRETTY.ShortRestResult";
  //
  //     // Create a chat message
  //     ChatMessage.create({
  //       user: game.user._id,
  //       speaker: {actor: this, alias: this.name},
  //       flavor: restFlavor,
  //       content: game.i18n.format(srMessage, {name: this.name, dice: -dhd, health: dhp})
  //     });
  //   }
  //
  //   // Return data summarizing the rest effects
  //   return {
  //     dhd: dhd,
  //     dhp: dhp,
  //     updateData: updateData,
  //     updateItems: updateItems,
  //     newDay: newDay
  //   }
  // }
  //
  // /* -------------------------------------------- */
  //
  // /**
  //  * Take a long rest, recovering HP, HD, resources, and spell slots
  //  * @param {boolean} dialog  Present a confirmation dialog window whether or not to take a long rest
  //  * @param {boolean} chat    Summarize the results of the rest workflow as a chat message
  //  * @param {boolean} newDay  Whether the long rest carries over to a new day
  //  * @return {Promise}        A Promise which resolves once the long rest workflow has completed
  //  */
  // async longRest({dialog=true, chat=true, newDay=true}={}) {
  //   const data = this.data.data;
  //
  //   // Maybe present a confirmation dialog
  //   if ( dialog ) {
  //     try {
  //       newDay = await LongRestDialog.longRestDialog({actor: this});
  //     } catch(err) {
  //       return;
  //     }
  //   }
  //
  //   // Recover hit points to full, and eliminate any existing temporary HP
  //   const dhp = data.attributes.hp.max - data.attributes.hp.value;
  //   const updateData = {
  //     "data.attributes.hp.value": data.attributes.hp.max,
  //     "data.attributes.hp.temp": 0,
  //     "data.attributes.hp.tempmax": 0
  //   };
  //
  //   // Recover character resources
  //   for ( let [k, r] of Object.entries(data.resources) ) {
  //     if ( r.max && (r.sr || r.lr) ) {
  //       updateData[`data.resources.${k}.value`] = r.max;
  //     }
  //   }
  //
  //   // Recover spell slots
  //   for ( let [k, v] of Object.entries(data.spells) ) {
  //     updateData[`data.spells.${k}.value`] = Number.isNumeric(v.override) ? v.override : (v.max ?? 0);
  //   }
  //
  //   // Recover pact slots.
  //   const pact = data.spells.pact;
  //   updateData['data.spells.pact.value'] = pact.override || pact.max;
  //
  //   // Determine the number of hit dice which may be recovered
  //   let recoverHD = Math.max(Math.floor(data.details.level / 2), 1);
  //   let dhd = 0;
  //
  //   // Sort classes which can recover HD, assuming players prefer recovering larger HD first.
  //   const updateItems = this.items.filter(item => item.data.type === "class").sort((a, b) => {
  //     let da = parseInt(a.data.data.hitDice.slice(1)) || 0;
  //     let db = parseInt(b.data.data.hitDice.slice(1)) || 0;
  //     return db - da;
  //   }).reduce((updates, item) => {
  //     const d = item.data.data;
  //     if ( (recoverHD > 0) && (d.hitDiceUsed > 0) ) {
  //       let delta = Math.min(d.hitDiceUsed || 0, recoverHD);
  //       recoverHD -= delta;
  //       dhd += delta;
  //       updates.push({_id: item.id, "data.hitDiceUsed": d.hitDiceUsed - delta});
  //     }
  //     return updates;
  //   }, []);
  //
  //   // Iterate over owned items, restoring uses per day and recovering Hit Dice
  //   const recovery = newDay ? ["sr", "lr", "day"] : ["sr", "lr"];
  //   for ( let item of this.items ) {
  //     const d = item.data.data;
  //     if ( d.uses && recovery.includes(d.uses.per) ) {
  //       updateItems.push({_id: item.id, "data.uses.value": d.uses.max});
  //     }
  //     else if ( d.recharge && d.recharge.value ) {
  //       updateItems.push({_id: item.id, "data.recharge.charged": true});
  //     }
  //   }
  //
  //   // Perform the updates
  //   await this.update(updateData);
  //   if ( updateItems.length ) await this.updateEmbeddedEntity("OwnedItem", updateItems);
  //
  //   // Display a Chat Message summarizing the rest effects
  //   // let restFlavor;
  //   // switch (game.settings.get("wwnpretty", "restVariant")) {
  //   //   case 'normal': restFlavor = game.i18n.localize(newDay ? "WWNPRETTY.LongRestOvernight" : "WWNPRETTY.LongRestNormal"); break;
  //   //   case 'gritty': restFlavor = game.i18n.localize("WWNPRETTY.LongRestGritty"); break;
  //   //   case 'epic':  restFlavor = game.i18n.localize("WWNPRETTY.LongRestEpic"); break;
  //   // }
  //
  //   // Determine the chat message to display
  //   if ( chat ) {
  //     let lrMessage = "WWNPRETTY.LongRestResultShort";
  //     if((dhp !== 0) && (dhd !== 0)) lrMessage = "WWNPRETTY.LongRestResult";
  //     else if ((dhp !== 0) && (dhd === 0)) lrMessage = "WWNPRETTY.LongRestResultHitPoints";
  //     else if ((dhp === 0) && (dhd !== 0)) lrMessage = "WWNPRETTY.LongRestResultHitDice";
  //     ChatMessage.create({
  //       user: game.user._id,
  //       speaker: {actor: this, alias: this.name},
  //       flavor: restFlavor,
  //       content: game.i18n.format(lrMessage, {name: this.name, health: dhp, dice: dhd})
  //     });
  //   }
  //
  //   // Return data summarizing the rest effects
  //   return {
  //     dhd: dhd,
  //     dhp: dhp,
  //     updateData: updateData,
  //     updateItems: updateItems,
  //     newDay: newDay
  //   }
  // }

  /* -------------------------------------------- */

  /**
   * Transform this Actor into another one.
   *
   * @param {Actor} target The target Actor.
   * @param {boolean} [keepPhysical] Keep physical abilities (str, dex, con)
   * @param {boolean} [keepMental] Keep mental abilities (int, wis, cha)
   * @param {boolean} [keepSaves] Keep saving throw proficiencies
   * @param {boolean} [keepSkills] Keep skill proficiencies
   * @param {boolean} [mergeSaves] Take the maximum of the save proficiencies
   * @param {boolean} [mergeSkills] Take the maximum of the skill proficiencies
   * @param {boolean} [keepClass] Keep proficiency bonus
   * @param {boolean} [keepFeats] Keep features
   * @param {boolean} [keepSpells] Keep spells
   * @param {boolean} [keepItems] Keep items
   * @param {boolean} [keepBio] Keep biography
   * @param {boolean} [keepVision] Keep vision
   * @param {boolean} [transformTokens] Transform linked tokens too
   */
  async transformInto(target, { keepPhysical=false, keepMental=false, keepSaves=false, keepSkills=false,
    mergeSaves=false, mergeSkills=false, keepClass=false, keepFeats=false, keepSpells=false,
    keepItems=false, keepBio=false, keepVision=false, transformTokens=true}={}) {

    // Ensure the player is allowed to polymorph
    const allowed = game.settings.get("wwnpretty", "allowPolymorphing");
    if ( !allowed && !game.user.isGM ) {
      return ui.notifications.warn(game.i18n.localize("WWNPRETTY.PolymorphWarn"));
    }

    // Get the original Actor data and the new source data
    const o = duplicate(this.toJSON());
    o.flags.wwnpretty = o.flags.wwnpretty || {};
    o.flags.wwnpretty.transformOptions = {mergeSkills, mergeSaves};
    const source = target.toJSON();

    // Prepare new data to merge from the source
    const d = {
      type: o.type, // Remain the same actor type
      name: `${o.name} (${source.name})`, // Append the new shape to your old name
      data: source.data, // Get the data model of your new form
      items: source.items, // Get the items of your new form
      effects: o.effects.concat(source.effects), // Combine active effects from both forms
      img: source.img, // New appearance
      permission: o.permission, // Use the original actor permissions
      folder: o.folder, // Be displayed in the same sidebar folder
      flags: o.flags // Use the original actor flags
    };

    // Specifically delete some data attributes
    delete d.data.resources; // Don't change your resource pools
    delete d.data.currency; // Don't lose currency
    delete d.data.bonuses; // Don't lose global bonuses

    // Specific additional adjustments
    d.data.details.alignment = o.data.details.alignment; // Don't change alignment
    d.data.attributes.exhaustion = o.data.attributes.exhaustion; // Keep your prior exhaustion level
    d.data.attributes.inspiration = o.data.attributes.inspiration; // Keep inspiration
    d.data.spells = o.data.spells; // Keep spell slots
    d.data.attributes.ac.flat = target.data.data.attributes.ac.value; // Override AC

    // Token appearance updates
    d.token = {name: d.name};
    for ( let k of ["width", "height", "scale", "img", "mirrorX", "mirrorY", "tint", "alpha", "lockRotation"] ) {
      d.token[k] = source.token[k];
    }
    const vision = keepVision ? o.token : source.token;
    for ( let k of ['dimSight', 'brightSight', 'dimLight', 'brightLight', 'vision', 'sightAngle'] ) {
      d.token[k] = vision[k];
    }

    // Handle wildcard
    if ( source.token.randomImg ) {
      const images = await target.getTokenImages();
      d.token.img = images[Math.floor(Math.random() * images.length)];
    }

    // Transfer ability scores
    const abilities = d.data.abilities;
    for ( let k of Object.keys(abilities) ) {
      const oa = o.data.abilities[k];
      const prof = abilities[k].proficient;
      if ( keepPhysical && ["str", "dex", "con"].includes(k) ) abilities[k] = oa;
      else if ( keepMental && ["int", "wis", "cha"].includes(k) ) abilities[k] = oa;
      if ( keepSaves ) abilities[k].proficient = oa.proficient;
      else if ( mergeSaves ) abilities[k].proficient = Math.max(prof, oa.proficient);
    }

    // Transfer skills
    if ( keepSkills ) d.data.skills = o.data.skills;
    else if ( mergeSkills ) {
      for ( let [k, s] of Object.entries(d.data.skills) ) {
        s.value = Math.max(s.value, o.data.skills[k].value);
      }
    }

    // Keep specific items from the original data
    d.items = d.items.concat(o.items.filter(i => {
      if ( i.type === "class" ) return keepClass;
      else if ( i.type === "feat" ) return keepFeats;
      else if ( i.type === "spell" ) return keepSpells;
      else return keepItems;
    }));

    // Transfer classes for NPCs
    if (!keepClass && d.data.details.cr) {
      d.items.push({
        type: 'class',
        name: game.i18n.localize('WWNPRETTY.PolymorphTmpClass'),
        data: { levels: d.data.details.cr }
      });
    }

    // Keep biography
    if (keepBio) d.data.details.biography = o.data.details.biography;

    // Keep senses
    if (keepVision) d.data.traits.senses = o.data.traits.senses;

    // Set new data flags
    if ( !this.isPolymorphed || !d.flags.wwnpretty.originalActor ) d.flags.wwnpretty.originalActor = this.id;
    d.flags.wwnpretty.isPolymorphed = true;

    // Update unlinked Tokens in place since they can simply be re-dropped from the base actor
    if (this.isToken) {
      const tokenData = d.token;
      tokenData.actorData = d;
      delete tokenData.actorData.token;
      return this.token.update(tokenData);
    }

    // Update regular Actors by creating a new Actor with the Polymorphed data
    await this.sheet.close();
    Hooks.callAll('wwnpretty.transformActor', this, target, d, {
      keepPhysical, keepMental, keepSaves, keepSkills, mergeSaves, mergeSkills,
      keepClass, keepFeats, keepSpells, keepItems, keepBio, keepVision, transformTokens
    });
    const newActor = await this.constructor.create(d, {renderSheet: true});

    // Update placed Token instances
    if ( !transformTokens ) return;
    const tokens = this.getActiveTokens(true);
    const updates = tokens.map(t => {
      const newTokenData = foundry.utils.deepClone(d.token);
      newTokenData._id = t.data._id;
      newTokenData.actorId = newActor.id;
      newTokenData.actorLink = true;
      return newTokenData;
    });
    return canvas.scene?.updateEmbeddedDocuments("Token", updates);
  }

  /* -------------------------------------------- */

  /**
   * If this actor was transformed with transformTokens enabled, then its
   * active tokens need to be returned to their original state. If not, then
   * we can safely just delete this actor.
   */
  async revertOriginalForm() {
    if ( !this.isPolymorphed ) return;
    if ( !this.isOwner ) {
      return ui.notifications.warn(game.i18n.localize("WWNPRETTY.PolymorphRevertWarn"));
    }

    // If we are reverting an unlinked token, simply replace it with the base actor prototype
    if ( this.isToken ) {
      const baseActor = game.actors.get(this.token.data.actorId);
      const prototypeTokenData = await baseActor.getTokenData();
      const tokenUpdate = {actorData: {}};
      for ( let k of ["width", "height", "scale", "img", "mirrorX", "mirrorY", "tint", "alpha", "lockRotation", "name"] ) {
        tokenUpdate[k] = prototypeTokenData[k];
      }
      await this.token.update(tokenUpdate, {recursive: false});
      await this.sheet.close();
      const actor = this.token.getActor();
      actor.sheet.render(true);
      return actor;
    }

    // Obtain a reference to the original actor
    const original = game.actors.get(this.getFlag('wwnpretty', 'originalActor'));
    if ( !original ) return;

    // Get the Tokens which represent this actor
    if ( canvas.ready ) {
      const tokens = this.getActiveTokens(true);
      const tokenData = await original.getTokenData();
      const tokenUpdates = tokens.map(t => {
        const update = duplicate(tokenData);
        update._id = t.id;
        delete update.x;
        delete update.y;
        return update;
      });
      canvas.scene.updateEmbeddedDocuments("Token", tokenUpdates);
    }

    // Delete the polymorphed version of the actor, if possible
    const isRendered = this.sheet.rendered;
    if ( game.user.isGM ) await this.delete();
    else if ( isRendered ) this.sheet.close();
    if ( isRendered ) original.sheet.render(isRendered);
    return original;
  }

  /* -------------------------------------------- */

  /**
   * Add additional system-specific sidebar directory context menu options for Actor entities
   * @param {jQuery} html         The sidebar HTML
   * @param {Array} entryOptions  The default array of context menu options
   */
  static addDirectoryContextOptions(html, entryOptions) {
    entryOptions.push({
      name: 'WWNPRETTY.PolymorphRestoreTransformation',
      icon: '<i class="fas fa-backward"></i>',
      callback: li => {
        const actor = game.actors.get(li.data('entityId'));
        return actor.revertOriginalForm();
      },
      // condition: li => {
        // const allowed = game.settings.get("wwnpretty", "allowPolymorphing");
        // if ( !allowed && !game.user.isGM ) return false;
        // const actor = game.actors.get(li.data('entityId'));
        // return actor && actor.isPolymorphed;
      // }
    });
  }
  
  /* -------------------------------------------- */

  /**
   * Format a type object into a string.
   * @param {object} typeData          The type data to convert to a string.
   * @returns {string}
   */
  static formatCreatureType(typeData) {
    if ( typeof typeData === "string" ) return typeData; // backwards compatibility
    let localizedType;
    if ( typeData.value === "custom" ) {
      localizedType = typeData.custom;
    } else {
      let code = CONFIG.WWNPRETTY.creatureTypes[typeData.value];
      localizedType = game.i18n.localize(!!typeData.swarm ? `${code}Pl` : code);
    }
    let type = localizedType;
    if ( !!typeData.swarm ) {
      type = game.i18n.format('WWNPRETTY.CreatureSwarmPhrase', {
        size: game.i18n.localize(CONFIG.WWNPRETTY.actorSizes[typeData.swarm]),
        type: localizedType
      });
    }
    if (typeData.subtype) type = `${type} (${typeData.subtype})`;
    return type;
  }

  /* -------------------------------------------- */

  /*
   * Populate a proficiency object with a `selected` field containing a combination of
   * localizable group & individual proficiencies from `value` and the contents of `custom`.
   *
   * @param {object} data                Object containing proficiency data
   * @param {Array.<string>} data.value  Array of standard proficiency keys
   * @param {string} data.custom         Semicolon-separated string of custom proficiencies
   * @param {string} type                "armor", "weapon", or "tool"
   */
  static prepareProficiencies(data, type) {
    const profs = CONFIG.WWNPRETTY[`${type}Proficiencies`];
    const itemTypes = CONFIG.WWNPRETTY[`${type}Ids`];

    let values = [];
    if ( data.value ) {
      values = data.value instanceof Array ? data.value : [data.value];
    }

    // data.selected = {};
    // const pack = game.packs.get(CONFIG.WWNPRETTY.sourcePacks.ITEMS);
    // for ( const key of values ) {
    //   if ( profs[key] ) {
    //     data.selected[key] = profs[key];
    //   } else if ( itemTypes && itemTypes[key] ) {
    //     const item = pack.index.get(itemTypes[key]);
    //     data.selected[key] = item.name;
    //   } else if ( type === "tool" && CONFIG.WWNPRETTY.vehicleTypes[key] ) {
    //     data.selected[key] = CONFIG.WWNPRETTY.vehicleTypes[key];
    //   }
    // }

    // Add custom entries
    if ( data.custom ) {
      data.custom.split(";").forEach((c, i) => data.selected[`custom${i+1}`] = c.trim());
    }
  }

  /* -------------------------------------------- */
  /*  DEPRECATED METHODS                          */
  /* -------------------------------------------- */

  /**
   * @deprecated since wwnpretty 0.97
   */
  getSpellDC(ability) {
    console.warn(`The Actor5e#getSpellDC(ability) method has been deprecated in favor of Actor5e#data.data.abilities[ability].dc`);
    return this.data.data.abilities[ability]?.dc;
  }

  /* -------------------------------------------- */

  /**
   * Cast a Spell, consuming a spell slot of a certain level
   * @param {Item5e} item   The spell being cast by the actor
   * @param {Event} event   The originating user interaction which triggered the cast
   * @deprecated since wwnpretty 1.2.0
   */
  async useSpell(item, {configureDialog=true}={}) {
    console.warn(`The Actor5e#useSpell method has been deprecated in favor of Item5e#roll`);
    if ( item.data.type !== "spell" ) throw new Error("Wrong Item type");
    return item.roll();
  }
}
