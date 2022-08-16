export {default as D20Roll} from "./dice/d20-roll.js";
export {default as DamageRoll} from "./dice/damage-roll.js";

/**
 * A standardized helper function for simplifying the constant parts of a multipart roll formula
 *
 * @param {string} formula                 The original Roll formula
 * @param {Object} data                    Actor or item data against which to parse the roll
 * @param {Object} options                 Formatting options
 * @param {boolean} options.constantFirst  Puts the constants before the dice terms in the resulting formula
 *
 * @return {string}                        The resulting simplified formula
 */
export function simplifyRollFormula(formula, data, {constantFirst = false} = {}) {
  const roll = new Roll(formula, data); // Parses the formula and replaces any @properties
  const terms = roll.terms;

  // Some terms are "too complicated" for this algorithm to simplify
  // In this case, the original formula is returned.
  if (terms.some(_isUnsupportedTerm)) return roll.formula;

  const rollableTerms = []; // Terms that are non-constant, and their associated operators
  const constantTerms = []; // Terms that are constant, and their associated operators
  let operators = [];       // Temporary storage for operators before they are moved to one of the above

  for (let term of terms) {                                 // For each term
    if (term instanceof OperatorTerm) operators.push(term); // If the term is an addition/subtraction operator, push the term into the operators array
    else {                                                  // Otherwise the term is not an operator
      if (term instanceof DiceTerm) {                       // If the term is something rollable
        rollableTerms.push(...operators);                   // Place all the operators into the rollableTerms array
        rollableTerms.push(term);                           // Then place this rollable term into it as well
      }                                                     //
      else {                                                // Otherwise, this must be a constant
        constantTerms.push(...operators);                   // Place the operators into the constantTerms array
        constantTerms.push(term);                           // Then also add this constant term to that array.
      }                                                     //
      operators = [];                                       // Finally, the operators have now all been assigend to one of the arrays, so empty this before the next iteration.
    }
  }

  const constantFormula = Roll.getFormula(constantTerms);  // Cleans up the constant terms and produces a new formula string
  const rollableFormula = Roll.getFormula(rollableTerms);  // Cleans up the non-constant terms and produces a new formula string

  // Mathematically evaluate the constant formula to produce a single constant term
  let constantPart = undefined;
  if ( constantFormula ) {
    try {
      constantPart = Roll.safeEval(constantFormula)
    } catch (err) {
      console.warn(`Unable to evaluate constant term ${constantFormula} in simplifyRollFormula`);
    }
  }

  // Order the rollable and constant terms, either constant first or second depending on the optional argument
  const parts = constantFirst ? [constantPart, rollableFormula] : [rollableFormula, constantPart];

  // Join the parts with a + sign, pass them to `Roll` once again to clean up the formula
  return new Roll(parts.filterJoin(" + ")).formula;
}

/* -------------------------------------------- */

/**
 * Only some terms are supported by simplifyRollFormula, this method returns true when the term is not supported.
 * @param {*} term - A single Dice term to check support on
 * @return {Boolean} True when unsupported, false if supported
 */
function _isUnsupportedTerm(term) {
	const diceTerm = term instanceof DiceTerm;
	const operator = term instanceof OperatorTerm && ["+", "-"].includes(term.operator);
    const number   = term instanceof NumericTerm;

	return !(diceTerm || operator || number);
}

/* -------------------------------------------- */

/**
 * A standardized helper function for managing core 5e d20 rolls.
 * Holding SHIFT, ALT, or CTRL when the attack is rolled will "fast-forward".
 * This chooses the default options of a normal attack with no bonus, Advantage, or Disadvantage respectively
 *
 * @param {string[]} parts          The dice roll component parts, excluding the initial d20
 * @param {object} data             Actor or item data against which to parse the roll
 *
 * @param {boolean} [advantage]       Apply advantage to the roll (unless otherwise specified)
 * @param {boolean} [disadvantage]    Apply disadvantage to the roll (unless otherwise specified)
 * @param {number} [critical]         The value of d20 result which represents a critical success
 * @param {number} [fumble]           The value of d20 result which represents a critical failure
 * @param {number} [targetValue]      Assign a target value against which the result of this roll should be compared
 * @param {string} [die]              If you don't want to use a d20 roll - by lofty

 * @param {boolean} [chooseModifier=false] Choose the ability modifier that should be used when the roll is made
 * @param {boolean} [fastForward=false] Allow fast-forward advantage selection
 * @param {Event} [event]             The triggering event which initiated the roll
 * @param {string} [template]         The HTML template used to render the roll dialog
 * @param {string} [title]            The dice roll UI window title
 * @param {Object} [dialogOptions]    Modal dialog options
 *
 * @param {save} save                 Tells if this is a save - Lofty
 * @param {save} [moraleSave]         Is this a morale save (different dice formula)?- Lofty
 *
 * @param {boolean}[chatMessage=true] Automatically create a Chat Message for the result of this roll
 * @param {object} [messageData={}]   Additional data which is applied to the created Chat Message, if any
 * @param {string} [rollMode]         A specific roll mode to apply as the default for the resulting roll
 * @param {object} [speaker]          The ChatMessage speaker to pass when creating the chat
 * @param {string} [flavor]           Flavor text to use in the posted chat message

 * @return {Promise<D20Roll|null>} The evaluated D20Roll, or null if the workflow was cancelled
 */
export async function d20Roll({
  parts=[], data={}, // Roll creation
  advantage, disadvantage, fumble=1, critical=20, targetValue, die,chooseModifier=false, // Roll customization
  fastForward=false, event, template, title, dialogOptions, // Dialog configuration
  isSave=null, moraleSave=null,chatMessage=true, messageData={}, rollMode, speaker, flavor // Chat Message customization
  }={}) {

  //I'm updating this to use non-d20s, edit as necessary. -Lofty
  //The suffix is to drop the lowest as a result of the roll
  let suffix = "";

  // Checks the last digit is a 6. So if it's a 6 sided ie, it will do a d6 roll, otherwise a d20 roll -Lofty
  //This first if makes sure it's not undefined, like for attack rolls
  if(die){
    if(die[(die.length)-1] !== "6"){
      die = "1d20";
      critical = 6;
      suffix = "kh2";
    }
  }
  else{
      die = "1d20";
    }
  // Handle input arguments
  let formula = [die].concat(parts).join(" + ");



  // console.log("formula after concat is ",formula);
  // console.log("die is ",die);
  // let formula = `${nd}d20${mods}`;


  const {advantageMode, isFF} = _determineAdvantageMode({advantage, disadvantage, fastForward, event});
  const defaultRollMode = rollMode || game.settings.get("core", "rollMode");
  if ( chooseModifier && !isFF ) data["mod"] = "@mod";

  // Construct the D20Roll instance
  const roll = new CONFIG.Dice.D20Roll(formula, data, {
    flavor: flavor || title,
    advantageMode,
    defaultRollMode,
    critical,
    fumble,
    targetValue
  });

  if(suffix === "kh2"){
    roll.terms[0].modifiers.push("kh2");
  }


  // // Prompt a Dialog to further configure the D20Roll
  // if ( !isFF ) {
  //   const configured = await roll.configureDialog({
  //     title,
  //     chooseModifier,
  //     defaultRollMode: defaultRollMode,
  //     defaultAction: advantageMode,
  //     defaultAbility: data?.item?.ability,
  //     template
  //   }, dialogOptions);
  //   if ( configured === null ) return null;
  // }

  // Evaluate the configured roll
  // console.log("this is the formula after is dice->d20 roll",formula);
  // console.log("damage roll data",formula);
  // console.log("these are the parts is",parts);
  await roll.evaluate({async: true});

  //   // Handle disadvantage
  //   else if (adv === -1) {
  //     nd = 2;
  //     messageData.flavor += ` (${game.i18n.localize("WWNPRETTY.Disadvantage")})`;
  //     if ( "flags.wwnpretty.roll" in messageData ) messageData["flags.wwnpretty.roll"].disadvantage = true;
  //     mods += "kl";
  //   }
  //
  //   // Prepend the d20 roll
  //   let formula = `${nd}d20${mods}`;
  //   if (reliableTalent) formula = `{${nd}d20${mods},10}kh`;
  //   //I don't know why this works, I just know it does. Also, doesn't work with advantage/disadvantage -Lofty
  //   if (moraleSave) formula = `2d6${mods}`;
  //   parts.unshift(formula);
  //
  //   // Optionally include a situational bonus
  //   if ( form ) {
  //     data['bonus'] = form.bonus.value;
  //     messageOptions.rollMode = form.rollMode.value;
  //   }
  //   if (!data["bonus"]) parts.pop();
  //
  //   // Optionally include an ability score selection (used for tool checks)
  //   const ability = form ? form.ability : null;
  //   if (ability && ability.value) {
  //     data.ability = ability.value;
  //     const abl = data.abilities[data.ability];
  //     if (abl) {
  //       data.mod = abl.mod;
  //       messageData.flavor += ` (${CONFIG.WWNPRETTY.abilities[data.ability]})`;
  //     }
  //   }
  //
  //   // Execute the roll
  //   let roll = new Roll(parts.join(" + "), data);
  //   try {
  //     roll.roll();
  //   } catch (err) {
  //     console.error(err);
  //     ui.notifications.error(`Dice roll evaluation failed: ${err.message}`);
  //     return null;
  //   }
  //
  //   // Flag d20 options for any 20-sided dice in the roll
  //   for (let d of roll.dice) {
  //     if (d.faces === 20) {
  //       d.options.critical = critical;
  //       d.options.fumble = fumble;
  //       if(isSave != null){
  //         d.options.isSave = isSave;
  //       }
  //       if ( adv === 1 ) d.options.advantage = true;
  //       else if ( adv === -1 ) d.options.disadvantage = true;
  //       if (targetValue) d.options.target = targetValue;
  //     }
  //   }
  //
  //   // If reliable talent was applied, add it to the flavor text
  //   if (reliableTalent && roll.dice[0].total < 10) {
  //     messageData.flavor += ` (${game.i18n.localize("WWNPRETTY.FlagsReliableTalent")})`;
  //   }
  //   return roll;
  // };
  //
  // // Create the Roll instance
  // const roll = fastForward ? _roll(parts, adv) :
  //   await _d20RollDialog({template, title, parts, data, rollMode: messageOptions.rollMode, dialogOptions, roll: _roll});

  // Create a Chat Message
  if ( speaker ) {
    console.warn(`You are passing the speaker argument to the d20Roll function directly which should instead be passed as an internal key of messageData`);
    messageData.speaker = speaker;
  }
  if ( roll && chatMessage ) await roll.toMessage(messageData);
  return roll;
}

/* -------------------------------------------- */

/**
 * Determines whether this d20 roll should be fast-forwarded, and whether advantage or disadvantage should be applied
 * @returns {{isFF: boolean, advantageMode: number}}  Whether the roll is fast-forward, and its advantage mode
 */
function _determineAdvantageMode({event, advantage=false, disadvantage=false, fastForward=false}={}) {
  const isFF = fastForward || (event && (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey));
  let advantageMode = CONFIG.Dice.D20Roll.ADV_MODE.NORMAL;
  if ( advantage || event?.altKey ) advantageMode = CONFIG.Dice.D20Roll.ADV_MODE.ADVANTAGE;
  else if ( disadvantage || event?.ctrlKey || event?.metaKey ) advantageMode = CONFIG.Dice.D20Roll.ADV_MODE.DISADVANTAGE;
  return {isFF, advantageMode};
}
  // // Render modal dialog
  // template = template || "systems/wwnpretty/templates/chat/roll-dialog.html";
  // let dialogData = {
  //   formula: parts.join(" + "),
  //   data: data,
  //   rollMode: rollMode,
  //   rollModes: CONFIG.Dice.rollModes,
  //   config: CONFIG.WWNPRETTY
  // };
  // const html = await renderTemplate(template, dialogData);
  //
  // // Create the Dialog window
  // return new Promise(resolve => {
  //   new Dialog({
  //     title: title,
  //     content: html,
  //     buttons: {
  //       advantage: {
  //         label: game.i18n.localize("WWNPRETTY.Advantage"),
  //         callback: html => resolve(roll(parts, 1, html[0].querySelector("form")))
  //       },
  //       normal: {
  //         label: game.i18n.localize("WWNPRETTY.Normal"),
  //         callback: html => resolve(roll(parts, 0, html[0].querySelector("form")))
  //       },
  //       disadvantage: {
  //         label: game.i18n.localize("WWNPRETTY.Disadvantage"),
  //         callback: html => resolve(roll(parts, -1, html[0].querySelector("form")))
  //       }
  //     },
  //     default: "normal",
  //     close: () => resolve(null)
  //   }, dialogOptions).render(true);
  // });


/* -------------------------------------------- */

/**
 * A standardized helper function for managing core 5e damage
 * Holding SHIFT, ALT, or CTRL when the attack is rolled will "fast-forward".
 * This chooses the default options of a normal attack with no bonus, Critical, or no bonus respectively
 *
 * @param {string[]} parts          The dice roll component parts, excluding the initial d20
 * @param {object} [data]           Actor or item data against which to parse the roll
 *
 * @param {boolean} [critical=false] Flag this roll as a critical hit for the purposes of fast-forward or default dialog action
 * @param {number} [criticalBonusDice=0] A number of bonus damage dice that are added for critical hits
 * @param {number} [criticalMultiplier=2] A critical hit multiplier which is applied to critical hits
 * @param {boolean} [multiplyNumeric=false] Multiply numeric terms by the critical multiplier
 * @param {boolean} [powerfulCritical=false] Apply the "powerful criticals" house rule to critical hits

 * @param {boolean} [fastForward=false] Allow fast-forward advantage selection
 * @param {Event}[event]            The triggering event which initiated the roll
 * @param {boolean} [allowCritical=true] Allow the opportunity for a critical hit to be rolled
 * @param {string} [template]       The HTML template used to render the roll dialog
 * @param {string} [title]          The dice roll UI window title
 * @param {object} [dialogOptions]  Configuration dialog options
 *
 * @param {boolean} [chatMessage=true] Automatically create a Chat Message for the result of this roll
 * @param {object} [messageData={}] Additional data which is applied to the created Chat Message, if any
 * @param {string} [rollMode]       A specific roll mode to apply as the default for the resulting roll
 * @param {object} [speaker]        The ChatMessage speaker to pass when creating the chat
 * @param {string} [flavor]         Flavor text to use in the posted chat message
 *
 * @return {Promise<DamageRoll|null>} The evaluated DamageRoll, or null if the workflow was canceled
 */
export async function damageRoll({
  parts=[], data, // Roll creation
  critical=false, criticalBonusDice, criticalMultiplier, multiplyNumeric, powerfulCritical, // Damage customization
  fastForward=false, event, allowCritical=true, template, title, dialogOptions, // Dialog configuration
  chatMessage=true, messageData={}, rollMode, speaker, flavor, // Chat Message customization
  }={}) {

  // Handle input arguments
  const defaultRollMode = rollMode || game.settings.get("core", "rollMode");

  // Construct the DamageRoll instance
  const formula = parts.join(" + ");
  // const formula = "2d30";
  const {isCritical, isFF} = _determineCriticalMode({critical, fastForward, event});
  const roll = new CONFIG.Dice.DamageRoll(formula, data, {
    flavor: flavor || title,
    critical: isCritical,
    criticalBonusDice,
    criticalMultiplier,
    multiplyNumeric,
    powerfulCritical
  });

  // // Prompt a Dialog to further configure the DamageRoll
  // if ( !isFF ) {
  //   const configured = await roll.configureDialog({
  //     title,
  //     defaultRollMode: defaultRollMode,
  //     defaultCritical: isCritical,
  //     template,
  //     allowCritical
  //   }, dialogOptions);
  //   if ( configured === null ) return null;
  // }

  // Evaluate the configured roll
  // console.log("damage roll formula is",formula)
  // console.log("damage roll parts are",formula)
  // console.log("damage roll data",formula)
  await roll.evaluate({async: true});

  // Create a Chat Message
  if ( speaker ) {
    console.warn(`You are passing the speaker argument to the damageRoll function directly which should instead be passed as an internal key of messageData`);
    messageData.speaker = speaker;
  }
  if ( roll && chatMessage ) await roll.toMessage(messageData);
  return roll;
}

/* -------------------------------------------- */

/**
 * Determines whether this d20 roll should be fast-forwarded, and whether advantage or disadvantage should be applied
 * @returns {{isFF: boolean, isCritical: boolean}}  Whether the roll is fast-forward, and whether it is a critical hit
 */
function _determineCriticalMode({event, critical=false, fastForward=false}={}) {
  const isFF = fastForward || (event && (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey));
  if ( event?.altKey ) critical = true;
  return {isFF, isCritical: critical};
}
