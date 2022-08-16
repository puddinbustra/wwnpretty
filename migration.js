const VERSION_KEY = "systemMigrationVersion";
let newVersion = "0.0";
Hooks.on("init", () => (newVersion = game.system.data.version));
const _allMigrations = new Array();
class MigrationError extends Error {
    constructor(migration, capturedErrors) {
        super(`Migration failed, ${capturedErrors.length} exceptions thrown for type ${migration.type.name}, version "${migration.version}", sort ${migration.sort}`);
        this.migration = migration;
        this.capturedErrors = capturedErrors;
    }
}
function getCurrentVersion() {
    const version = game.settings.get("swnr", VERSION_KEY);
    if (version !== "")
        return version;
    setCurrentVersion();
    return newVersion;
}
async function setCurrentVersion() {
    if (game.user.isGM)
        await game.settings.set("swnr", VERSION_KEY, newVersion);
}
export default async function checkAndRunMigrations() {
    await loadMigrations();
    const migrations = orderedMigrations().filter((m) => isNewerVersion(m.version, getCurrentVersion()));
    if (migrations.length === 0)
        return await setCurrentVersion();
    const oldVersion = await getCurrentVersion();
    if (!game.user.isGM)
        return ui.notifications.error(game.i18n.format(game.i18n.localize("swnr.migration.needsGM"), {
            count: migrations.length,
            oldVersion,
            newVersion,
        }));
    ui.notifications.warn(game.i18n.format(game.i18n.localize("swnr.migration.start"), {
        oldVersion,
        newVersion,
    }));
    for await (const migration of migrations) {
        const errors = await applyMigration(migration);
        if (errors.length > 0) {
            const error = new MigrationError(migration, errors);
            ui.notifications.error(error.message);
            console.error(error);
        }
    }
    await setCurrentVersion();
    ui.notifications.info(game.i18n.format(game.i18n.localize("swnr.migration.done"), { newVersion }));
}
export async function loadMigrations() {
    const files = await (await fetch("systems/swnr/migrations.json")).json();
    await Promise.all(files.map((f) => import(f)));
}
export function registerMigration(type, version, sort, func) {
    if (!Object.prototype.isPrototypeOf.call(Entity, type))
        throw new TypeError(`${type.name} is not a Entity of some sort!`);
    _allMigrations.push({ type, version, sort, func });
}
export function orderedMigrations() {
    return _allMigrations.sort((left, right) => {
        //Version sort, lowest first
        if (left.version !== right.version)
            return isNewerVersion(left.version, right.version) ? 1 : -1;
        //Sort No. order, lowest first
        if (left.sort !== right.sort)
            return left.sort - right.sort;
        //Prototype sort, if parent, sorted first.
        if (left.type !== right.type) {
            if (Object.prototype.isPrototypeOf.call(left.type, right.type))
                return -1;
            if (Object.prototype.isPrototypeOf.call(right.type, left.type))
                return 1;
        }
        return 0;
    });
}
async function applyMigration(migration) {
    const collections = Object.values(game).filter(
    // Block compendiums for now.
    (v) => v instanceof Collection && v.constructor !== Collection);
    const errors = [];
    for await (const type of collections) {
        for await (const entity of type.values()) {
            try {
                await applyMigrationTo(entity, undefined, migration);
            }
            catch (e) {
                errors.push({
                    type: type.constructor.name,
                    entity: entity.constructor.name,
                    error: e,
                });
            }
        }
    }
    return errors;
}
async function applyMigrationTo(target, updateData = { _id: target._id }, migration) {
    var _a, _b, _c, _d;
    if (target instanceof migration.type) {
        migration.func(target, updateData);
    }
    if (!(target instanceof Entity)) {
        return updateData;
    }
    const embeddedEntities = (_c = (_b = (_a = target.constructor) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.embeddedEntities) !== null && _c !== void 0 ? _c : {};
    for await (const [cName, location] of Object.entries(embeddedEntities)) {
        const updates = [];
        const collection = (_d = target[location]) !== null && _d !== void 0 ? _d : target.getEmbeddedCollection(cName);
        for await (const embedded of collection) {
            const eUpdate = await applyMigrationTo(embedded, undefined, migration);
            if (Object.keys(eUpdate).length > 1)
                updates.push(eUpdate);
        }
        target.updateEmbeddedEntity(cName, updates);
    }
    return updateData;
}

//# sourceMappingURL=migration.js.map
