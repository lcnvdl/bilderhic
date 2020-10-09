const fs = require("fs");
const parser = require("fast-xml-parser");
const ObjectEditor = require("./base/object-editor");
const XmlHelper = require("./helpers/xml.helper");

const JsonToXmlParser = parser.j2xParser;

const defaultOptions = {
  ignoreAttributes: false,
  format: true,
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

    const content = fs.readFileSync(file, "utf8");

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
    const members = selector.split(">");

    members.slice(0, members.length - 1).forEach(child => {
      if (typeof current[child] !== "object") {
        current[child] = {};
      }

      current = current[child];
    });

    const memberName = members[members.length - 1];

    if (memberName.indexOf(".") === -1) {
      current[memberName] = optionalValue || null;
    }
    else {
      const spl = memberName.split(".");

      if (typeof current[spl[0]] !== "object") {
        current[spl[0]] = {};
      }

      const member = current[spl[0]];
      if (member instanceof Array) {
        const newMember = {};
        newMember[`@_${spl[1]}`] = optionalValue || "";
        member.push(newMember);
      }
      else {
        member[`@_${spl[1]}`] = optionalValue || "";
      }
    }
  }

  configure(key, value) {
    if (value === "true") {
      value = true;
    }
    else if (value === "false") {
      value = false;
    }

    super.configure(key, value);
  }

  get(selector) {
    return this.getFirst(selector);
  }

  getFirst(selector) {
    let current = this.object;
    const members = selector.split(">");

    members.slice(0, members.length - 1).forEach(child => {
      current = current[child];
    });

    const memberName = members[members.length - 1];

    if (memberName.indexOf(".") === -1) {
      return current[memberName];
    }

    const spl = memberName.split(".");
    const member = current[spl[0]];
    return member[`@_${spl[1]}`];
  }

  set(selector, value) {
    let current = this.object;
    const members = selector.split(">");

    members.slice(0, members.length - 1).forEach(child => {
      current = current[child];
    });

    const memberName = members[members.length - 1];

    if (memberName.indexOf(".") === -1) {
      current[memberName] = value;
    }
    else {
      const spl = memberName.split(".");
      const member = current[spl[0]];
      member[`@_${spl[1]}`] = value;
    }
  }

  save(newFilename) {
    this._assertOpen();
    let finalContent = this.serialize();

    if (this.options.selfClosingTags) {
      let ignores = [];

      if (this.options.selfClosingTagsIgnores && this.options.selfClosingTagsIgnores != "") {
        ignores = this.options.selfClosingTagsIgnores.trim().split(",");
      }

      finalContent = XmlHelper.generateSelfClosingTags(finalContent, ignores);
    }

    fs.writeFileSync(newFilename || this.file, finalContent, "utf8");
  }

  serialize() {
    const jsonParser = new JsonToXmlParser(this.options);
    const finalContent = this.declaration + jsonParser.parse(this.object);
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
