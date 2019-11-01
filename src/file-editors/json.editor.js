const BaseEditor = require("./base/base-editor");
const fs = require("fs");

class JsonFileEditor extends BaseEditor {
    constructor() {
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

    save() {
        fs.writeFileSync(this.file, JSON.stringify(this.object, null, 2), "utf8");
    }

    close() {
        this.file = null;
        this.object = null;
    }
}

module.exports = JsonFileEditor;