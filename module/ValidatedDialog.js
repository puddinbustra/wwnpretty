export class ValidatedDialog extends Dialog {
    constructor(dialogData, options) {
        super(dialogData, options);
        this.failCallback = dialogData.failCallback;
    }
    validate() {
        const innerHTML = this.element
            .find(".window-content")
            .children();
        const elementsToCheck = (Array.from(innerHTML.find("select,input,textarea")));
        const good = elementsToCheck
            .map((e) => {
            var _a, _b;
            const markedRequired = e.getAttribute("required") == null;
            const checkValid = e.checkValidity();
            const blankValue = e.value !== "";
            const elementGood = markedRequired || (checkValid && blankValue);
            // TODO: add some basic error messages
            if (elementGood) {
                (_a = e.parentElement) === null || _a === void 0 ? void 0 : _a.classList.remove("failed-validation");
            }
            else {
                (_b = e.parentElement) === null || _b === void 0 ? void 0 : _b.classList.add("failed-validation");
            }
            return elementGood;
        })
            .reduce((e, n) => {
            return e && n;
        });
        return good;
    }
    submit(button) {
        if (this.validate()) {
            return super.submit(button);
        }
        else {
            this.failCallback(button);
        }
    }
}

//# sourceMappingURL=ValidatedDialog.js.map
