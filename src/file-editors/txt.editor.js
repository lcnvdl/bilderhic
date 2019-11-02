const BaseEditor = require("./base/base-editor");
const fs = require("fs");

class TxtFileEditor extends BaseEditor {
    constructor() {
        super();
        this.content = null;
        this.file = null;
    }

    get formats() {
        return ["txt"];
    }

    get isObjectEditor() {
        return false;
    }

    open(file) {
        this.file = file;
        this.content = fs.readFileSync(file, "utf8");
    }

    load(content) {
        this.file = "";
        this.content = content;
    }

    setLine(number, text) {
        let lines = this.content.split("\n");
        lines[number] = text;
        this.content = lines.join("\n");
    }

    append(text) {
        this.content += "\n" + text;
    }

    replace(text, replacement) {
        while (this.content.indexOf(text) !== -1) {
            this.content = this.content.replace(text, replacement);
        }
    }

    replaceOne(text, replacement) {
        this.content = this.content.replace(text, replacement);
    }

    save(newFilename) {
        this._assertOpen();
        fs.writeFileSync(newFilename || this.file, this.content, "utf8");
    }

    close() {
        this.file = null;
        this.content = null;
    }

    _assertOpen() {
        if (!this.file) {
            throw new Error("Empty file");
        }
    }
}

module.exports = TxtFileEditor;