import { SWNRCharacterData } from "../types";
export declare class SWNRCharacterActor extends Actor<SWNRCharacterData> {
    getRollData(): Record<string, unknown>;
    prepareBaseData(): void;
    prepareDerivedData(): void;
}
export declare const entity: typeof SWNRCharacterActor;
export declare const name = "character";
