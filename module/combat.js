
/**
 * Override the default Initiative formula to customize special behaviors of the system.
 * Apply advantage, proficiency, or bonuses where appropriate
 * Apply the dexterity score as a decimal tiebreaker if requested
 * See Combat._getInitiativeFormula for more detail.
 */
export const _getInitiativeFormula = function() {
  const actor = this.actor;
  if ( !actor ) return "1d8";
  const init = actor.data.data.attributes.init;

  //Constructive initiative part
  let nd = 1;
  let mods = "";
  // if (actor.getFlag("wwnpretty", "halflingLucky")) mods += "r1=1";
  // if (actor.getFlag("wwnpretty", "initiativeAdv")) {
  //   nd = 2;
  //   mods += "kh";
  // }

  // const parts = [`${nd}d8${mods}`, init.mod, (init.prof !== 0) ? init.prof : null, (init.bonus !== 0) ? init.bonus : null];
  const parts = [`${nd}d8${mods}`, init.total];

  // Optionally apply Dexterity tiebreaker
  const tiebreaker = game.settings.get("wwnpretty", "initiativeDexTiebreaker");
  if ( tiebreaker ) parts.push(actor.data.data.abilities.dex.value / 100);
  return parts.filter(p => p !== null).join(" + ");
};
