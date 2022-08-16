/**
 * A simple form to set Actor movement speeds.
 * @extends {DocumentSheet}
 */
export default class ActorSensesConfig extends DocumentSheet {

  /** @inheritdoc */
	static get defaultOptions() {
	  return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["WWNPRETTY"],
      template: "systems/wwnpretty/templates/apps/senses-config.html",
      width: 300,
      height: "auto"
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  get title() {
    return `${game.i18n.localize("WWNPRETTY.SensesConfig")}: ${this.document.name}`;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData(options) {
    const senses = foundry.utils.getProperty(this.document.data._source, "data.attributes.senses") || {};
    const data = {
      senses: {},
      special: senses.special ?? "",
      units: senses.units, movementUnits: CONFIG.WWNPRETTY.movementUnits
    };
    for ( let [name, label] of Object.entries(CONFIG.WWNPRETTY.senses) ) {
      const v = senses[name];
      data.senses[name] = {
        label: game.i18n.localize(label),
        value: Number.isNumeric(v) ? v.toNearest(0.1) : 0
      }
    }
    return data;
  }
}
