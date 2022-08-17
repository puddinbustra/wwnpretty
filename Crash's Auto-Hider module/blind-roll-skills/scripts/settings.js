export const registerSettings = function() {

  // game.settings.register("blind-roll-skills", "showHelpCards", {
  //   name: game.i18n.localize("BLINDROLLSKILLS.SettingShowHelpCards"),
  //   hint: game.i18n.localize("BLINDROLLSKILLS.SettingShowHelpCardsHint"),
  //   scope: "client",
  //   config: true,
  //   default: true,
  //   type: Boolean
  // });

  // TODO: Implement once modules adopt functionality
  // game.settings.register("blind-roll-skills", "hideAttacks", {
  //   name: game.i18n.localize("BLINDROLLSKILLS.SettingHideAttackRolls"),
  //   scope: "world",
  //   config: true,
  //   default: false,
  //   type: Boolean
  // });

  //TODO: Implement once modules adopt functionality
  // game.settings.register("blind-roll-skills", "hideSaves", {
  //   name: game.i18n.localize("BLINDROLLSKILLS.SettingHideSaves"),
  //   hint: game.i18n.localize("BLINDROLLSKILLS.SettingHideSavesHint"),
  //   scope: "world",
  //   config: true,
  //   default: false,
  //   type: Boolean
  // });

  // game.settings.register("blind-roll-skills", "hideDeathSaves", {
  //   name: game.i18n.localize("BLINDROLLSKILLS.SettingHideDeathSaves"),
  //   hint: game.i18n.localize("BLINDROLLSKILLS.SettingHideDeathSavesHint"),
  //   scope: "world",
  //   config: true,
  //   default: false,
  //   type: Boolean
  // });

  game.settings.register("blind-roll-skills", "hideInitiative", {
    name: game.i18n.localize("BLINDROLLSKILLS.SettingHideInitiative"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  game.settings.register("blind-roll-skills", "hideAdminister", {
    name: game.i18n.localize("BLINDROLLSKILLS.SettingHideAdminister"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  game.settings.register("blind-roll-skills", "hideConnect", {
    name: game.i18n.localize("BLINDROLLSKILLS.SettingHideConnect"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  game.settings.register("blind-roll-skills", "hideNotice", {
    name: game.i18n.localize("BLINDROLLSKILLS.SettingHideNotice"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

    game.settings.register("blind-roll-skills", "hideFix", {
    name: game.i18n.localize("BLINDROLLSKILLS.SettingHideFix"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  game.settings.register("blind-roll-skills", "hideExert", {
    name: game.i18n.localize("BLINDROLLSKILLS.SettingHideExert"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

    game.settings.register("blind-roll-skills", "hideHeal", {
    name: game.i18n.localize("BLINDROLLSKILLS.SettingHideHeal"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  game.settings.register("blind-roll-skills", "hideHear", {
    name: game.i18n.localize("BLINDROLLSKILLS.SettingHideHear"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  game.settings.register("blind-roll-skills", "hideKnow", {
    name: game.i18n.localize("BLINDROLLSKILLS.SettingHideKnow"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  game.settings.register("blind-roll-skills", "hideLead", {
    name: game.i18n.localize("BLINDROLLSKILLS.SettingHideLead"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  game.settings.register("blind-roll-skills", "hidePilot", {
    name: game.i18n.localize("BLINDROLLSKILLS.SettingHidePilot"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  game.settings.register("blind-roll-skills", "hidePerformance", {
    name: game.i18n.localize("BLINDROLLSKILLS.SettingHidePerformance"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });


  game.settings.register("blind-roll-skills", "hideProgram", {
    name: game.i18n.localize("BLINDROLLSKILLS.SettingHideProgram"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  game.settings.register("blind-roll-skills", "hidePunch", {
    name: game.i18n.localize("BLINDROLLSKILLS.SettingHidePunch"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  game.settings.register("blind-roll-skills", "hideTalk", {
    name: game.i18n.localize("BLINDROLLSKILLS.SettingHideTalk"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

    game.settings.register("blind-roll-skills", "hideSail", {
    name: game.i18n.localize("BLINDROLLSKILLS.SettingHideSail"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  game.settings.register("blind-roll-skills", "hideShoot", {
    name: game.i18n.localize("BLINDROLLSKILLS.SettingHideShoot"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

 game.settings.register("blind-roll-skills", "hideSee", {
    name: game.i18n.localize("BLINDROLLSKILLS.SettingHideSee"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  game.settings.register("blind-roll-skills", "hideSneak", {
    name: game.i18n.localize("BLINDROLLSKILLS.SettingHideSneak"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

   game.settings.register("blind-roll-skills", "hideSmell", {
    name: game.i18n.localize("BLINDROLLSKILLS.SettingHideSmell"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  game.settings.register("blind-roll-skills", "hideStab", {
    name: game.i18n.localize("BLINDROLLSKILLS.SettingHideStab"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  game.settings.register("blind-roll-skills", "hideSurvive", {
    name: game.i18n.localize("BLINDROLLSKILLS.SettingHideSurvive"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  game.settings.register("blind-roll-skills", "hideTrade", {
    name: game.i18n.localize("BLINDROLLSKILLS.SettingHideTrade"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  game.settings.register("blind-roll-skills", "hideWork", {
    name: game.i18n.localize("BLINDROLLSKILLS.SettingHideWork"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });
}
