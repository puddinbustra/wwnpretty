/// <reference types="jquery" />
export declare type ButtonData = {
    label: string;
    callback: (html: JQuery<HTMLElement>) => void;
};
interface ValidatedDialogData extends DialogData {
    failCallback: (button: ButtonData) => void;
}
declare class Dialog extends Application {
    static confirm({ title, content, yes, no, defaultYes }?: ConfirmDialog, options?: Application.Options): Promise<void>;
    constructor(dialogData: DialogData, options?: Application.Options);
    submit(button: any): any;
}
export declare class ValidatedDialog extends Dialog {
    failCallback: ValidatedDialogData["failCallback"];
    constructor(dialogData: ValidatedDialogData, options?: Application.Options);
    validate(): boolean;
    submit(button: ButtonData): void;
}
export {};
