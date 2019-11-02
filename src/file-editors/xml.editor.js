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
        this.declaration = "";
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

        let content = fs.readFileSync(file, "utf8");

        if (content.indexOf("<?xml") !== -1) {
            this.declaration = content.substr(content.indexOf("<?xml"));
            this.declaration = this.declaration.substr(0, this.declaration.indexOf(">") + 1);
        }

        this.object = parser.parse(content, options);
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
        let finalContent = this.declaration + jsonParser.parse(this.object);
        fs.writeFileSync(newFilename || this.file, finalContent, "utf8");
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