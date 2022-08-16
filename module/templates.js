/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {
  return loadTemplates([

    // Shared Partials
    "systems/wwnpretty/templates/actors/parts/active-effects.html",

    // Actor Sheet Partials
    "systems/wwnpretty/templates/actors/parts/actor-traits.html",
    "systems/wwnpretty/templates/actors/parts/actor-inventory.html",
    "systems/wwnpretty/templates/actors/parts/actor-features.html",
    "systems/wwnpretty/templates/actors/parts/actor-spellbook.html",
    "systems/wwnpretty/templates/actors/parts/actor-warnings.html",

    // Item Sheet Partials
    "systems/wwnpretty/templates/items/parts/item-action.html",
    "systems/wwnpretty/templates/items/parts/item-activation.html",
    "systems/wwnpretty/templates/items/parts/item-description.html",
    "systems/wwnpretty/templates/items/parts/item-mountable.html"
  ]);
};
