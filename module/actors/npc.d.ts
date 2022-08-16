import { SWNRNPCData } from "../types";
export declare class SWNRNPCActor extends Actor<SWNRNPCData> {
    prepareBaseData(): void;
    _onCreate(data: Parameters<Entity["_onCreate"]>[0], options: Parameters<Entity["_onCreate"]>[1], userId: string): void;
}
export declare const entity: typeof SWNRNPCActor;
export declare const name = "npc";
