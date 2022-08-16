/// <reference types="jquery" />
import { SWNRCharacterActor } from "./character";
import { SWNRCharacterData } from "../types";
interface CharacterActorSheetData extends ActorSheet.Data<SWNRCharacterData> {
    weapons?: Item[];
    armor?: Item[];
    gear?: Item[];
    skills?: Item[];
    useHomebrewLuckSave: boolean;
    itemTypes: {
        [type: string]: Item[];
    };
}
export declare class CharacterActorSheet extends ActorSheet<SWNRCharacterData, SWNRCharacterActor> {
    popUpDialog?: Dialog;
    constructor(...args: unknown[]);
    _injectHTML(html: JQuery<HTMLElement>, options: unknown): void;
    static get defaultOptions(): FormApplication.Options;
    activateListeners(html: JQuery): void;
    _onLoadSkills(event: JQuery.ClickEvent): Promise<Application>;
    _onItemEdit(event: JQuery.ClickEvent): void;
    _onItemDelete(event: JQuery.ClickEvent): Promise<void>;
    _onWeaponRoll(event: JQuery.ClickEvent<HTMLElement>): Promise<Application | undefined>;
    _onSaveThrow(event: JQuery.ClickEvent): Promise<Application | undefined>;
    _onStatsRoll(event: JQuery.ClickEvent): Promise<Application>;
    _onHpRoll(event: JQuery.ClickEvent): Promise<Application>;
    _onSkillRoll(event: JQuery.ClickEvent): Promise<Application>;
    /** @override */
    getData(): CharacterActorSheetData;
    /** @override */
    _updateObject(event: Event, formData: Record<string, number | string>): Promise<unknown>;
    _itemEditHandler(formData: Record<string, string | number>): void;
}
export declare const sheet: typeof CharacterActorSheet;
export declare const types: string[];
export {};
