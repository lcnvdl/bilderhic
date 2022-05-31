/* eslint-disable class-methods-use-this */

const fs = require("fs");
const BaseEditor = require("./base/base-editor");

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
    const lines = this.content.split("\n");
    lines[number] = text;
    this.content = lines.join("\n");
  }

  append(text) {
    this.content += `\n${text}`;
  }

  replace(text, replacement, raw) {
    let parsedText;
    let parsedReplacement;

    if (!raw) {
      parsedText = this.parseText(text);
      parsedReplacement = this.parseText(replacement);
    }
    else {
      parsedText = text;
      parsedReplacement = replacement;
    }

    while (this.content.indexOf(parsedText) !== -1) {
      this.content = this.content.replace(parsedText, parsedReplacement);
    }
  }

  replaceOne(text, replacement, raw) {
    if (raw) {
      this.content = this.content.replace(text, replacement);
    }
    else {
      this.content = this.content.replace(this.parseText(text), this.parseText(replacement));
    }
  }

  parseText(text) {
    return (text || "").split(":space:").join(" ");
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
