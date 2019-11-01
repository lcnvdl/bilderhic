const BaseEditor = require("./base/base-editor");
const fs = require("fs");
const parser = require('fast-xml-parser');
const JsonToXmlParser = parser.j2xParser;

const options = {
    ignoreAttributes: false
};

class XmlFileEditor extends BaseEditor {
    constructor() {
        this.object = null;
        this.file = null;
    }

    get formats() {
        return ["xml"];
    }

    open(file) {
        this.file = file;
        
        this.object = parser.parse(fs.readFileSync(file, "utf8"), options);
    }

    set(selector, value) {
        throw new Error("Not implemented");
    }

    save() {
        this._assertOpen();
        const jsonParser = new JsonToXmlParser(options);
        fs.writeFileSync(this.file, jsonParser.parse(this.object), "utf8");
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

module.exports = XmlFileEditor;