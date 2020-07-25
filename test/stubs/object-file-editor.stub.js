const BaseEditor = require("../../src/file-editors/base/base-editor");
const fs = require("fs");

class ObjectFileEditorStub extends BaseEditor {
    constructor() {
        super();
        this.object = null;
        this.file = null;
        this.onClose = null;
        this.onSave = null;
        this.onOpen = null;
        this.onFail = null;
    }

    get formats() {
        return ["json"];
    }

    open(file) {
        this.file = file;
        this.object = (this.onOpen ? this.onOpen() : {}) || {};
    }

    save() {
        this._assertOpen();
        this.onSave && this.onSave(this.object);
    }

    close() {
        this.file = null;
        this.object = null;
        this.onClose && this.onClose();
    }

    _assertOpen() {
        if (!this.file) {
            this.onFail && this.onFail();
            throw new Error("Empty file");
        }
    }
}

module.exports = ObjectFileEditorStub;