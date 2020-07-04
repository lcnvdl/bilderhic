const ObjectEditor = require("./base/object-editor");
const fs = require("fs");
const parser = require('fast-xml-parser');
const JsonToXmlParser = parser.j2xParser;

const defaultOptions = {
    ignoreAttributes: false,
    format: true
};

class XmlFileEditor extends ObjectEditor {
    constructor() {
        super();
        this.declaration = "";
        this.object = null;
        this.file = null;
        this.options = defaultOptions;
    }

    get formats() {
        return ["xml"];
    }

    open(file) {
        this.file = file;

        let content = fs.readFileSync(file, "utf8");

        if (content.indexOf("<?xml") !== -1) {
            this.declaration = content.substr(content.indexOf("<?xml"));
            this.declaration = this.declaration.substr(0, this.declaration.indexOf(">") + 1);
        }

        if (!content || content === "") {
            this.object = {};
        }
        else {
            this.object = parser.parse(content, this.options);
        }
    }

    load(content) {
        this.file = "";

        if (!content || content === "") {
            this.object = {};
        }
        else {
            this.object = parser.parse(content, this.options);
        }
    }

    add(selector, optionalValue) {
        let current = this.object;
        let members = selector.split(">");

        members.slice(0, members.length - 1).forEach(child => {
            if (typeof current[child] !== "object") {
                current[child] = {};
            }

            current = current[child];
        });

        let memberName = members[members.length - 1];

        if (memberName.indexOf(".") === -1) {
            current[memberName] = optionalValue || null;
        }
        else {
            let spl = memberName.split(".");

            if (typeof current[spl[0]] !== "object") {
                current[spl[0]] = {};
            }

            let member = current[spl[0]];
            if (member instanceof Array) {
                let newMember = {};
                newMember["@_" + spl[1]] = optionalValue || "";
                member.push(newMember);
            }
            else {
                member["@_" + spl[1]] = optionalValue || "";
            }
        }
    }

    configure(key, value) {
        if (key === "format") {
            value = value == "true";
        }

        super.configure(key, value);
    }

    get(selector) {
        return this.getFirst(selector);
    }

    getFirst(selector) {
        let current = this.object;
        let members = selector.split(">");

        members.slice(0, members.length - 1).forEach(child => {
            current = current[child];
        });

        let memberName = members[members.length - 1];

        if (memberName.indexOf(".") === -1) {
            return current[memberName];
        }
        else {
            let spl = memberName.split(".");
            let member = current[spl[0]];
            return member["@_" + spl[1]];
        }
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
            let member = current[spl[0]];
            member["@_" + spl[1]] = value;
        }
    }

    save(newFilename) {
        this._assertOpen();
        let finalContent = this.serialize();
        fs.writeFileSync(newFilename || this.file, finalContent, "utf8");
    }

    serialize() {
        const jsonParser = new JsonToXmlParser(this.options);
        let finalContent = this.declaration + jsonParser.parse(this.object);
        return finalContent;
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