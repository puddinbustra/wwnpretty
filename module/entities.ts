import * as _c5508d2b3cfa6722 from "./actors/character-sheet";
import * as _c168feeea0a0ae85 from "./actors/character";
import * as _0d133bd5ba70937b from "./actors/npc-sheet";
import * as _82582732da445be3 from "./actors/npc";
import * as _def494ced6496029 from "./items/armor";
import * as _f8dca6c4deef743c from "./items/background";
import * as _380ae9e637628742 from "./items/base-sheet";
import * as _3a4e047bc8fe3a73 from "./items/class";
import * as _1c6483efb00775b9 from "./items/focus";
import * as _60aa40001fff4701 from "./items/item";
import * as _6eee7a35b2f04855 from "./items/power";
import * as _571509211148bc83 from "./items/skill";
import * as _0acf088bb99b3d4e from "./items/weapon";
//This file is auto generated, leave it alone!
import proxy from "./proxy";
const items = <Record<string, typeof Item>>{};
const actors = <Record<string, typeof Actor>>{};
Actors.registerSheet("swnr", _c5508d2b3cfa6722.sheet, {
  makeDefault: true,
  types: _c5508d2b3cfa6722.types,
});
actors[_c168feeea0a0ae85.name] = _c168feeea0a0ae85.entity as typeof Actor;
Actors.registerSheet("swnr", _0d133bd5ba70937b.sheet, {
  makeDefault: true,
  types: _0d133bd5ba70937b.types,
});
actors[_82582732da445be3.name] = _82582732da445be3.entity as typeof Actor;
items[_def494ced6496029.name] = _def494ced6496029.entity as typeof Item;
items[_f8dca6c4deef743c.name] = _f8dca6c4deef743c.entity as typeof Item;
Items.registerSheet("swnr", _380ae9e637628742.sheet, {
  makeDefault: true,
  types: _380ae9e637628742.types,
});
items[_3a4e047bc8fe3a73.name] = _3a4e047bc8fe3a73.entity as typeof Item;
items[_1c6483efb00775b9.name] = _1c6483efb00775b9.entity as typeof Item;
items[_60aa40001fff4701.name] = _60aa40001fff4701.entity as typeof Item;
items[_6eee7a35b2f04855.name] = _6eee7a35b2f04855.entity as typeof Item;
items[_571509211148bc83.name] = _571509211148bc83.entity as typeof Item;
items[_0acf088bb99b3d4e.name] = _0acf088bb99b3d4e.entity as typeof Item;
export const SWNRItem = proxy(items, Item) as typeof Item;
export const SWNRActor = proxy(actors, Actor) as typeof Actor;
