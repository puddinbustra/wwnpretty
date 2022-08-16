/// <reference types="jquery" />
import { SWNRNPCData } from "../types";
import { SWNRNPCActor } from "./npc";
export declare class NPCActorSheet extends ActorSheet<SWNRNPCData, SWNRNPCActor> {
    popUpDialog?: Dialog;
    _injectHTML(html: JQuery<HTMLElement>, options: unknown): void;
    getData(): ActorSheet.Data<SWNRNPCData>;
    static get defaultOptions(): FormApplication.Options;
    activateListeners(html: JQuery): void;
    _onItemEdit(event: JQuery.ClickEvent): void;
    _onItemDelete(event: JQuery.ClickEvent): Promise<void>;
    _onItemDamage(event: JQuery.ClickEvent): Promise<void>;
    _onReaction(event: JQuery.ClickEvent): Promise<void>;
    _onMorale(event: JQuery.ClickEvent): void;
    _onSavingThrow(event: JQuery.ClickEvent): void;
    _onSkill(event: JQuery.ClickEvent): void;
    /** @override */
    _updateObject(event: Event, formData: Record<string, number | string>): Promise<unknown>;
    _itemEditHandler(formData: Record<string, number | string>): void;
}
export declare const sheet: typeof NPCActorSheet;
export declare const types: string[];
