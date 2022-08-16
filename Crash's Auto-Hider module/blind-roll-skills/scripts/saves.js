export function getBrSaveNames() {
  let saves = [];
  if(game.settings.get("blind-roll-skills", "hideSaves")){
    saves.push(CONFIG.WWNPRETTY.abilities["str"] + " " + game.i18n.localize("br5e.chat.save"));
    saves.push(CONFIG.WWNPRETTY.abilities["dex"] + " " + game.i18n.localize("br5e.chat.save"));
    saves.push(CONFIG.WWNPRETTY.abilities["con"] + " " + game.i18n.localize("br5e.chat.save"));
    saves.push(CONFIG.WWNPRETTY.abilities["int"] + " " + game.i18n.localize("br5e.chat.save"));
    saves.push(CONFIG.WWNPRETTY.abilities["wis"] + " " + game.i18n.localize("br5e.chat.save"));
    saves.push(CONFIG.WWNPRETTY.abilities["cha"] + " " + game.i18n.localize("br5e.chat.save"));
  }
  return saves;
}
