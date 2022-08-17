/**
 * An application class which provides advanced configuration for special character flags which modify an Actor
 * @implements {DocumentSheet}
 */
export default class ActorSheetFlags extends DocumentSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "actor-flags",
	    classes: ["WWNPRETTY"],
      template: "systems/wwnpretty/templates/apps/actor-flags.html",
      width: 500,
      closeOnSubmit: true
    });
  }

  /* -------------------------------------------- */

  /** @override */
  get title() {
    return `${game.i18n.localize('WWNPRETTY.FlagsTitle')}: ${this.object.name}`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = {};
    data.actor = this.object;
    data.classes = this._getClasses();
    data.flags = this._getFlags();
    data.bonuses = this._getBonuses();
    data.skills = this._getSkills();
    return data;
  }

  /* -------------------------------------------- */

  /**
   * Prepare an object of sorted classes.
   * @return {object}
   * @private
   */
  _getClasses() {
    const classes = this.object.items.filter(i => i.type === "class");
    return classes.sort((a, b) => a.name.localeCompare(b.name)).reduce((obj, i) => {
      obj[i.id] = i.name;
      return obj;
    }, {});
  }

  /* -------------------------------------------- */

  /**
   * Prepare an object of flags data which groups flags by section
   * Add some additional data for rendering
   * @return {object}
   * @private
   */
  _getFlags() {
    const flags = {};
    const baseData = this.document.toJSON();
    for ( let [k, v] of Object.entries(CONFIG.WWNPRETTY.characterFlags) ) {
      if ( !flags.hasOwnProperty(v.section) ) flags[v.section] = {};
      let flag = foundry.utils.deepClone(v);
      flag.type = v.type.name;
      flag.isCheckbox = v.type === Boolean;
      flag.isSelect = v.hasOwnProperty('choices');
      flag.value = getProperty(baseData.flags, `wwnpretty.${k}`);
      flags[v.section][`flags.wwnpretty.${k}`] = flag;
    }
    return flags;
  }

  /* -------------------------------------------- */

  /**
   * Get the bonuses fields and their localization strings
   * @return {Array<object>}
   * @private
   */
  _getBonuses() {
    const bonuses = [
      {name: "data.bonuses.encumbrance.bonusReadied", label: "WWNPRETTY.BonusReadied"},
      {name: "data.bonuses.encumbrance.bonusCarried", label: "WWNPRETTY.BonusCarried"},
      {name: "data.bonuses.mwak.attack", label: "WWNPRETTY.BonusMWAttack"},
      {name: "data.bonuses.mwak.damage", label: "WWNPRETTY.BonusMWDamage"},
      {name: "data.bonuses.rwak.attack", label: "WWNPRETTY.BonusRWAttack"},
      {name: "data.bonuses.rwak.damage", label: "WWNPRETTY.BonusRWDamage"},
      // {name: "data.bonuses.msak.attack", label: "WWNPRETTY.BonusMSAttack"},
      // {name: "data.bonuses.msak.damage", label: "WWNPRETTY.BonusMSDamage"},
      // {name: "data.bonuses.rsak.attack", label: "WWNPRETTY.BonusRSAttack"},
      // {name: "data.bonuses.rsak.damage", label: "WWNPRETTY.BonusRSDamage"},
      {name: "data.bonuses.abilities.check", label: "WWNPRETTY.BonusAbilityCheck"},
      {name: "data.bonuses.abilities.save", label: "WWNPRETTY.BonusAbilitySave"},
      {name: "data.bonuses.abilities.skill", label: "WWNPRETTY.BonusAbilitySkill"},
      // {name: "data.bonuses.spell.dc", label: "WWNPRETTY.BonusSpellDC"}
    ];
    for ( let b of bonuses ) {
      b.value = getProperty(this.object.data._source, b.name) || "";
    }
    return bonuses;
  }

  /* -------------------------------------------- */

  /**
   * Get the skills fields and their localization strings -Lofty
   * @return {Array<object>}
   * @private
   */
  _getSkills() {
    const bonuses = [
      {name: "data.skills.adm.diceNum", label: "WWNPRETTY.SkillAdm"},
      {name: "data.skills.con.diceNum", label: "WWNPRETTY.SkillCon"},
      {name: "data.skills.exe.diceNum", label: "WWNPRETTY.SkillExe"},
      {name: "data.skills.fix.diceNum", label: "WWNPRETTY.SkillFix"},
      {name: "data.skills.her.diceNum", label: "WWNPRETTY.SkillHer"},
      {name: "data.skills.hea.diceNum", label: "WWNPRETTY.SkillHea"},
      {name: "data.skills.kno.diceNum", label: "WWNPRETTY.SkillKno"},
      {name: "data.skills.lea.diceNum", label: "WWNPRETTY.SkillLea"},
      {name: "data.skills.not.diceNum", label: "WWNPRETTY.SkillNot"},
      {name: "data.skills.per.diceNum", label: "WWNPRETTY.SkillPer"},
      {name: "data.skills.pro.diceNum", label: "WWNPRETTY.SkillPro"},
      {name: "data.skills.pun.diceNum", label: "WWNPRETTY.SkillPun"},
      {name: "data.skills.see.diceNum", label: "WWNPRETTY.SkillSee"},
      {name: "data.skills.sme.diceNum", label: "WWNPRETTY.SkillSme"},
      {name: "data.skills.sho.diceNum", label: "WWNPRETTY.SkillSho"},
      {name: "data.skills.stb.diceNum", label: "WWNPRETTY.SkillStb"},
      {name: "data.skills.sur.diceNum", label: "WWNPRETTY.SkillSur"},
      {name: "data.skills.tal.diceNum", label: "WWNPRETTY.SkillTal"},
      {name: "data.skills.trd.diceNum", label: "WWNPRETTY.SkillTrd"},
      {name: "data.skills.wor.diceNum", label: "WWNPRETTY.SkillWor"},
    ];
    // console.log("getSkills is ", bonuses)

    //This seems to connect the actual value
    for ( let b of bonuses ) {
      b.value = getProperty(this.object.data._source, b.name) || "";
    }
    return bonuses;
  }

  /* -------------------------------------------- */

  /** @override */
  async _updateObject(event, formData) {
    const actor = this.object;
    let updateData = expandObject(formData);


    // Unset any flags which are "false"
    // Lofty updating for undefined flag case
    let unset = false;
    let flags = null;
    if (updateData.flags) {
     flags = updateData.flags.wwnpretty;

    for ( let [k, v] of Object.entries(flags) ) {
      if ( [undefined, null, "", false, 0].includes(v) ) {
        delete flags[k];
        if ( hasProperty(actor.data._source.flags, `wwnpretty.${k}`) ) {
          unset = true;
          flags[`-=${k}`] = null;
        }
      }
    }
    }
    // Clear any bonuses which are whitespace only
    for ( let b of Object.values(updateData.data.bonuses ) ) {
      for ( let [k, v] of Object.entries(b) ) {
        b[k] = v.trim();
      }
    }

    // Diff the data against any applied overrides and apply
    await actor.update(updateData, {diff: false});
  }
}
