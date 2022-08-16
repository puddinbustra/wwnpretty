import { SWNRWeaponData } from "../types";
import { SWNRBaseItem } from "./../base-item";
export declare class SWNRWeapon extends SWNRBaseItem<SWNRWeaponData> {
    get ammo(): SWNRWeaponData["ammo"];
    get canBurstFire(): boolean;
    get hasAmmo(): boolean;
    rollAttack(damageBonus: number, stat: number, skillMod: number, modifier: number, useBurst: boolean): Promise<void>;
}
export declare const entity: typeof SWNRWeapon;
export declare const name = "weapon";
