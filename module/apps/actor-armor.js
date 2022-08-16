/**
 * Interface for managing a character's armor calculation.
 *
 * @extends {DocumentSheet}
 */
export default class ActorArmorConfig extends DocumentSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "actor-armor-config",
      classes: ["WWNPRETTY", "actor-armor-config"],
      template: "systems/wwnpretty/templates/apps/actor-armor.html",
      width: 320,
      height: "auto"
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  get title() {
    return `${game.i18n.localize("WWNPRETTY.ArmorConfig")}: ${this.document.name}`;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async getData() {
    const actorData = foundry.utils.deepClone(this.object.data.data);
	const ac = foundry.utils.getProperty(actorData, "attributes.ac");
	
	let cfg = CONFIG.WWNPRETTY.armorClasses[ac.calc];
	if (!cfg) {
		ac.calc = "flat";
		cfg = CONFIG.WWNPRETTY.armorClasses.flat;
	}
	
	return {
		ac: ac,
		calculations: CONFIG.WWNPRETTY.armorClasses,
		value: this.object._computeArmorClass(actorData).value,
		valueDisabled: !["flat", "natural"].includes(ac.calc),
		formula: ac.calc === "custom" ? ac.formula : cfg.formula,
		formulaDisabled: ac.calc !== "custom"
	};
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async _updateObject(event, formData) {
    const ac = foundry.utils.expandObject(formData).ac;
    return this.object.update({"data.attributes.ac": ac});
  }

  /* -------------------------------------------- */
  /*  Event Listeners and Handlers                */
  /* -------------------------------------------- */

  /** @inheritdoc */
  async _onChangeInput(event) {
    await super._onChangeInput(event);

    // Reference actor data
    let actorData = this.object.toObject(false);
    let ac = actorData.data.attributes.ac;

    // Reference form data
    const calc = this.form["ac.calc"].value;
    const cfg = CONFIG.WWNPRETTY.armorClasses[calc];
    const enableFlat = ["flat", "natural"].includes(calc);

    // Handle changes to the calculation mode specifically
    let formula = this.form["ac.formula"].value;
    let flat = this.form["ac.flat"].value;
    if ( event.currentTarget.name === "ac.calc" ) {
      formula = calc === "custom" ? ac.formula : cfg.formula;
      if ( enableFlat ) flat = ac.flat;
    }

    // Recompute effective AC
    actorData = foundry.utils.mergeObject(actorData, {"data.attributes.ac": {calc, formula}});
    if ( enableFlat ) actorData.data.attributes.ac.flat = flat;
    ac = this.object._computeArmorClass(actorData.data);

    // Update fields
    this.form["ac.formula"].value = ac.formula;
    this.form["ac.formula"].disabled = calc !== "custom";
    this.form["ac.flat"].value = enableFlat ? ac.flat : ac.value;
    this.form["ac.flat"].disabled = !enableFlat;
  }
}
