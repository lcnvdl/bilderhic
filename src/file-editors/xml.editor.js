const BaseEditor = require("./base/base-editor");
const fs = require("fs");
const parser = require('fast-xml-parser');
const JsonToXmlParser = parser.j2xParser;

const options = {
    ignoreAttributes: false
};

class XmlFileEditor extends BaseEditor {
    constructor() {
        super();
        this.object = null;
        this.file = null;
    }

    get formats() {
        return ["xml"];
    }

    get isObjectEditor() {
        return true;
    }

    open(file) {
        this.file = file;
        this.object = parser.parse(fs.readFileSync(file, "utf8"), options);
    }

    load(content) {
        this.file = "";
        this.object = parser.parse(content, options);
    }

    set(selector, value) {
        let current = this.object;
        let members = selector.split(">");

        members.slice(0, members.length - 1).forEach(child => {
            current = current[child];
        });

        let memberName = members[members.length - 1];

        if (memberName.indexOf(".") === -1) {
            current[memberName] = value;
        }
        else {
            let spl = memberName.split(".");
            current[spl[0]]["@_" + spl[1]] = value;
        }
    }

    save(newFilename) {
        this._assertOpen();
        const jsonParser = new JsonToXmlParser(options);
        fs.writeFileSync(newFilename || this.file, jsonParser.parse(this.object), "utf8");
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