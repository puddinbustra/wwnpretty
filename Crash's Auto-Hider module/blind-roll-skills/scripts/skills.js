export function getSkillAbbreviations() {
  let skills = [];
  if(game.settings.get("blind-roll-skills", "hideAdminister")){ skills.push("adm");}
  if(game.settings.get("blind-roll-skills", "hideConnect")){ skills.push("con");}
  if(game.settings.get("blind-roll-skills", "hideExert")){ skills.push("exe");}
  if(game.settings.get("blind-roll-skills", "hideFix")){ skills.push("fix");}
  if(game.settings.get("blind-roll-skills", "hideHeal")){ skills.push("hea");}
  if(game.settings.get("blind-roll-skills", "hideHear")){ skills.push("her");}
  if(game.settings.get("blind-roll-skills", "hideKnow")){ skills.push("kno");}
  if(game.settings.get("blind-roll-skills", "hideLead")){ skills.push("lea");}
  if(game.settings.get("blind-roll-skills", "hideNotice")){ skills.push("not");}
  if(game.settings.get("blind-roll-skills", "hidePilot")){ skills.push("pil");}
  if(game.settings.get("blind-roll-skills", "hideProgram")){ skills.push("pro");}
  if(game.settings.get("blind-roll-skills", "hidePunch")){ skills.push("pun");}
  if(game.settings.get("blind-roll-skills", "hidePerformance")){ skills.push("per");}
  if(game.settings.get("blind-roll-skills", "hideSee")){ skills.push("see");}
  if(game.settings.get("blind-roll-skills", "hideShoot")){ skills.push("sho");}
  if(game.settings.get("blind-roll-skills", "hideSmell")){ skills.push("sme");}
  if(game.settings.get("blind-roll-skills", "hideSneak")){ skills.push("sne");}
  if(game.settings.get("blind-roll-skills", "hideStab")){ skills.push("stb");}
  if(game.settings.get("blind-roll-skills", "hideSurvive")){ skills.push("sur");}
  if(game.settings.get("blind-roll-skills", "hideTalk")){ skills.push("tal");}
  if(game.settings.get("blind-roll-skills", "hideTrade")){ skills.push("trd");}
  if(game.settings.get("blind-roll-skills", "hideWork")){ skills.push("wor");}
  return skills;
}

export function getSkillNames() {
  let skills = [];
  if(game.settings.get("blind-roll-skills", "hideAdminister")){ skills.push(CONFIG.WWNPRETTY.skills["adm"]);}
  if(game.settings.get("blind-roll-skills", "hideExert")){ skills.push(CONFIG.WWNPRETTY.skills["exe"]);}
  if(game.settings.get("blind-roll-skills", "hideFix")){ skills.push(CONFIG.WWNPRETTY.skills["fix"]);}
  if(game.settings.get("blind-roll-skills", "hideHeal")){ skills.push(CONFIG.WWNPRETTY.skills["hea"]);}
  if(game.settings.get("blind-roll-skills", "hideHear")){ skills.push(CONFIG.WWNPRETTY.skills["her"]);}
  if(game.settings.get("blind-roll-skills", "hideConnect")){ skills.push(CONFIG.WWNPRETTY.skills["con"]);}
  if(game.settings.get("blind-roll-skills", "hideKnow")){ skills.push(CONFIG.WWNPRETTY.skills["kno"]);}
  if(game.settings.get("blind-roll-skills", "hideLead")){ skills.push(CONFIG.WWNPRETTY.skills["lea"]);}
  if(game.settings.get("blind-roll-skills", "hideNotice")){ skills.push(CONFIG.WWNPRETTY.skills["not"]);}
  if(game.settings.get("blind-roll-skills", "hideTrade")){ skills.push(CONFIG.WWNPRETTY.skills["trd"]);}
  if(game.settings.get("blind-roll-skills", "hidePilot")){ skills.push(CONFIG.WWNPRETTY.skills["pil"]);}
  if(game.settings.get("blind-roll-skills", "hideProgram")){ skills.push(CONFIG.WWNPRETTY.skills["pro"]);}
  if(game.settings.get("blind-roll-skills", "hidePunch")){ skills.push(CONFIG.WWNPRETTY.skills["pun"]);}
  if(game.settings.get("blind-roll-skills", "hidePerformance")){ skills.push(CONFIG.WWNPRETTY.skills["per"]);}
  if(game.settings.get("blind-roll-skills", "hideSee")){ skills.push(CONFIG.WWNPRETTY.skills["see"]);}
  if(game.settings.get("blind-roll-skills", "hideShoot")){ skills.push(CONFIG.WWNPRETTY.skills["sho"]);}
  if(game.settings.get("blind-roll-skills", "hideSmell")){ skills.push(CONFIG.WWNPRETTY.skills["sme"]);}
  if(game.settings.get("blind-roll-skills", "hideSneak")){ skills.push(CONFIG.WWNPRETTY.skills["sne"]);}
  if(game.settings.get("blind-roll-skills", "hideStab")){ skills.push(CONFIG.WWNPRETTY.skills["stb"]);}
  if(game.settings.get("blind-roll-skills", "hideSurvive")){ skills.push(CONFIG.WWNPRETTY.skills["sur"]);}
  if(game.settings.get("blind-roll-skills", "hideTalk")){ skills.push(CONFIG.WWNPRETTY.skills["tal"]);}
  if(game.settings.get("blind-roll-skills", "hideWork")){ skills.push(CONFIG.WWNPRETTY.skills["wor"]);}
  return skills;
}
