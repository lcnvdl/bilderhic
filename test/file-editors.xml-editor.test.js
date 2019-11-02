const XmlEditor = require("../src/file-editors/xml.editor");
const path = require("path");
const { expect } = require("chai");

/** @type {XmlEditor} */
let editor;

describe("XmlFileEditor", () => {
    describe("set", () => {
        beforeEach(() => {
            editor = new XmlEditor();
        });

        it("should set text of element", () => {
            editor.load("<text></text>");
            expect(editor.object.text).to.equals("");
            editor.set("text", "Lorem Olorem");
            expect(editor.object.text).to.equals("Lorem Olorem");
        });

        it("should set text of child element", () => {
            editor.load("<div><p></p></div>");
            expect(editor.object.div.p).to.equals("");
            editor.set("div>p", "Lorem Olorem");
            expect(editor.object.div.p).to.equals("Lorem Olorem");
        });

        it("should set node.id", () => {
            editor.open(path.join(__dirname, "./files/file.xml"));
            expect(editor.object.note["@_id"]).to.equals("1");
            editor.set("note.id", "2");
            expect(editor.object.note["@_id"]).to.equals("2");
        });
    });
});