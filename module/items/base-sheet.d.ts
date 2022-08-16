/// <reference types="jquery" />
interface EditorOptions {
    target: Record<string, unknown>;
    height: number;
    save_onsavecallback: () => Promise<void>;
}
export declare class BaseSheet extends ItemSheet {
    static get defaultOptions(): FormApplication.Options;
    _injectHTML(html: JQuery<HTMLElement>, options: unknown): void;
    _createEditor(target: string, editorOptions: EditorOptions, initialContent: string): void;
    /**
     * @override
     */
    get template(): string;
    getData(): Record<string, unknown>;
}
export declare const sheet: typeof BaseSheet;
export declare const types: never[];
export {};
