export default function registerHelpers() {
    Handlebars.registerHelper("debug", function () {
        return JSON.stringify(this, null, 2);
    });
    Handlebars.registerHelper("stringify", function (obj) {
        return JSON.stringify(obj, null, 2);
    });
    Handlebars.registerHelper("concat", function (a, b) {
        return a + b;
    });
    Handlebars.registerHelper("zeroWidthBreaker", (message) => {
        return new Handlebars.SafeString(message.replace(/[:/]/g, (match) => Handlebars.Utils.escapeExpression(match) + "&#8203;"));
    });
    Handlebars.registerHelper("getPCStatModForWeapon", (actor, weapon, forDamage = false) => {
        var _a;
        if (forDamage && weapon.data.data.skillBoostsDamage === false)
            return 0;
        const stats = actor.data.data.stats;
        const statsToCheck = [stats[weapon.data.data.stat].mod];
        if (weapon.data.data.secondStat !== "none")
            statsToCheck.push(((_a = stats[weapon.data.data.secondStat]) === null || _a === void 0 ? void 0 : _a.mod) || 0);
        return Math.max(...statsToCheck);
    });
}

//# sourceMappingURL=handlebar-helpers.js.map
