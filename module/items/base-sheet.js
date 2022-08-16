export class BaseSheet extends ItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["swnr", "sheet", "item"],
            width: 520,
            height: 480,
            tabs: [],
        });
    }
    _injectHTML(html, options) {
        html
            .find(".window-content")
            .addClass(["cq", "overflow-y-scroll", "relative"]);
        super._injectHTML(html, options);
    }
    _createEditor(target, editorOptions, initialContent) {
        editorOptions.height = Math.max(editorOptions.height, 100);
        TextEditor.create(editorOptions, initialContent).then((mce) => {
            const editor = mce[0];
            editor.focus(false);
            editor.on("change", () => (this.editors[target].changed = true));
        });
    }
    /**
     * @override
     */
    get template() {
        return `systems/swnr/templates/items/${this.item.data.type}-sheet.html`;
    }
    getData() {
        const data = super.getData();
        data.actor = this.actor;
        return data;
    }
}
export const sheet = BaseSheet;
export const types = [];

//# sourceMappingURL=base-sheet.js.map
