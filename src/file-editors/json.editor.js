const ObjectEditor = require("./base/object-editor");
const fs = require("fs");

class JsonFileEditor extends ObjectEditor {
    constructor() {
        super();
        this.object = null;
        this.file = null;
    }

    get formats() {
        return ["json"];
    }

    open(file) {
        this.file = file;
        this.object = JSON.parse(fs.readFileSync(file, "utf8"));
    }

    load(content) {
        this.file = "";
        this.object = JSON.parse(content);
    }

    get(selector) {
        let current = this.object;
        let members = selector.split(".");

        let values = [];

        for (let i = 0; i < members.length; i++) {
            values.push(current[members[i]]);
        }

        return values;
    }

    getFirst(selector) {
        const members = selector.split(".");
        const current = this.object;

        return current[members[0]];
    }

    set(selector, value) {
        const members = selector.split(".");
        let current = this.object;

        for (let i = 0; i < members.length; i++) {
            if (i === members.length - 1) {
                current[members[i]] = value;
            }
            else {
                current = current[members[i]];
            }
        }
    }

    save(newFilename) {
        this._assertOpen();
        fs.writeFileSync(newFilename || this.file, JSON.stringify(this.object, null, 2), "utf8");
    }

    close() {
        this.file = null;
        this.object = null;
    }

    _assertOpen() {
        if (!this.file) {
            throw new Error("Empty file");
        }
    }
}

module.exports = JsonFileEditor;