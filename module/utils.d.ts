import { SWNRCharacterActor } from "./actors/character";
import { SWNRCharacterData } from "./types";
export declare function calculateStats(stats: SWNRCharacterData["stats"]): void;
export declare function limitConcurrency<Callback extends (...unknown: any[]) => unknown>(fn: Callback): Callback;
export declare function combineRolls(arr: Roll[]): Roll;
export declare function initSkills(actor: SWNRCharacterActor, skillSet: keyof typeof skills): void;
declare const skills: {
    none: string[];
    spaceMagic: string[];
    classic: string[];
    revised: string[];
    psionic: string[];
};
export {};
