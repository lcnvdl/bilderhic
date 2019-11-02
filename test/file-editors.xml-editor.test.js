const XmlEditor = require("../src/file-editors/xml.editor");
const path = require("path");
const { expect } = require("chai");

/** @type {XmlEditor} */
let editor;

describe("XmlFileEditor", () => {
    describe("add", () => {
        beforeEach(() => {
            editor = new XmlEditor();
        });

        it("should add a text element", () => {
            editor.load("");
            expect(editor.object.text).to.be.undefined;
            editor.add("text");
            expect(editor.object.text).to.be.null;

            let xml = editor.serialize();

            expect(xml).to.equals("<text/>");
        });

        it("should add a hi element inside the text element", () => {
            editor.load("<text></text>");
            expect(editor.object.text.hi).to.be.undefined;
            editor.add("text>hi");
            expect(editor.object.text.hi).to.be.null;

            let xml = editor.serialize();

            expect(xml).to.equals("<text><hi/></text>");
        });

        it("should add a hi element with attribute inside the text element", () => {
            editor.load("<text></text>");
            expect(editor.object.text.hi).to.be.undefined;
            editor.add("text>hi.id", "1");
            expect(editor.object.text.hi).to.be.ok;
            expect(editor.object.text.hi["@_id"]).to.equals("1");

            let xml = editor.serialize();

            expect(xml).to.equals("<text><hi id=\"1\"></hi></text>");
        });
    });

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