import * as _c5508d2b3cfa6722 from "./actors/character-sheet.js";
import * as _c168feeea0a0ae85 from "./actors/character.js";
import * as _0d133bd5ba70937b from "./actors/npc-sheet.js";
import * as _82582732da445be3 from "./actors/npc.js";
import * as _def494ced6496029 from "./items/armor.js";
import * as _f8dca6c4deef743c from "./items/background.js";
import * as _380ae9e637628742 from "./items/base-sheet.js";
import * as _3a4e047bc8fe3a73 from "./items/class.js";
import * as _1c6483efb00775b9 from "./items/focus.js";
import * as _60aa40001fff4701 from "./items/item.js";
import * as _6eee7a35b2f04855 from "./items/power.js";
import * as _571509211148bc83 from "./items/skill.js";
import * as _0acf088bb99b3d4e from "./items/weapon.js";
//This file is auto generated, leave it alone!
import proxy from "./proxy.js";
const items = {};
const actors = {};
Actors.registerSheet("swnr", _c5508d2b3cfa6722.sheet, {
    makeDefault: true,
    types: _c5508d2b3cfa6722.types,
});
actors[_c168feeea0a0ae85.name] = _c168feeea0a0ae85.entity;
Actors.registerSheet("swnr", _0d133bd5ba70937b.sheet, {
    makeDefault: true,
    types: _0d133bd5ba70937b.types,
});
actors[_82582732da445be3.name] = _82582732da445be3.entity;
items[_def494ced6496029.name] = _def494ced6496029.entity;
items[_f8dca6c4deef743c.name] = _f8dca6c4deef743c.entity;
Items.registerSheet("swnr", _380ae9e637628742.sheet, {
    makeDefault: true,
    types: _380ae9e637628742.types,
});
items[_3a4e047bc8fe3a73.name] = _3a4e047bc8fe3a73.entity;
items[_1c6483efb00775b9.name] = _1c6483efb00775b9.entity;
items[_60aa40001fff4701.name] = _60aa40001fff4701.entity;
items[_6eee7a35b2f04855.name] = _6eee7a35b2f04855.entity;
items[_571509211148bc83.name] = _571509211148bc83.entity;
items[_0acf088bb99b3d4e.name] = _0acf088bb99b3d4e.entity;
export const SWNRItem = proxy(items, Item);
export const SWNRActor = proxy(actors, Actor);

//# sourceMappingURL=entities.js.map
