const path = require("path");
const fs = require("fs");
const os = require("os");
const { expect } = require("chai");
const XmlEditor = require("../src/file-editors/xml.editor");

/** @type {XmlEditor} */
let editor;

describe("XmlFileEditor", () => {
  describe("add", () => {
    beforeEach(() => {
      editor = new XmlEditor();
      editor.options.format = false;
    });

    it("should add a text element", () => {
      editor.load("");
      expect(editor.object.text).to.be.undefined;
      editor.add("text");
      expect(editor.object.text).to.be.null;

      const xml = editor.serialize();

      expect(xml).to.equals("<text/>");
    });

    it("should add a hi element inside the text element", () => {
      editor.load("<text></text>");
      expect(editor.object.text.hi).to.be.undefined;
      editor.add("text>hi");
      expect(editor.object.text.hi).to.be.null;

      const xml = editor.serialize();

      expect(xml).to.equals("<text><hi/></text>");
    });

    it("should add a new attribute object when selector points to an array", () => {
      editor.load("<text><hi name='gato1'></hi><hi name='gato2'></hi></text>");
      editor.add("text>hi.id", "3");
      const xml = editor.serialize();
      expect(xml).to.equals("<text><hi name=\"gato1\"></hi><hi name=\"gato2\"></hi><hi id=\"3\"></hi></text>");
    });

    it("should add an attribute in non-array node", () => {
      editor.load("<text><hi></hi></text>");
      editor.add("text>hi.id", "1");
      expect(editor.object.text.hi["@_id"]).to.equals("1");
    });

    // it("should add a hi element with multiple attributes", () => {
    //     editor.load("<text><hi name='gato1'></hi><hi name='gato2'></hi></text>");
    //     editor.add("text>hi.name", "test");
    //     editor.add("text>hi.value", "v");

    //     let xml = editor.serialize();

    //     expect(xml).to.equals("<text><hi name=\"gato1\"></hi><hi name=\"gato2\"></hi><hi name=\"test\" value=\"v\"></hi></text>");
    // });

    // it("should add a hi element with attribute inside the text element", () => {
    //     editor.load("<text></text>");
    //     expect(editor.object.text.hi).to.be.undefined;
    //     editor.add("text>hi.id", "1");
    //     expect(editor.object.text.hi).to.be.ok;
    //     expect(editor.object.text.hi["@_id"]).to.equals("1");

    //     let xml = editor.serialize();

    //     expect(xml).to.equals("<text><hi id=\"1\"></hi></text>");
    // });
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

  describe("load/open/get/configure/save", () => {
    beforeEach(() => {
      editor = new XmlEditor();
      editor.options.format = false;
    });

    it("should load empty content as empty object", () => {
      editor.load("");
      expect(editor.object).to.deep.equals({});
    });

    it("should read declaration when opening xml file", () => {
      const tempFile = path.join(os.tmpdir(), `bhic-decl-${Date.now()}.xml`);
      fs.writeFileSync(tempFile, "<?xml version='1.0'?><note><to>Tove</to></note>", "utf8");

      editor.open(tempFile);

      expect(editor.declaration).to.equals("<?xml version='1.0'?>");
      fs.unlinkSync(tempFile);
    });

    it("should get child text and attribute values", () => {
      editor.load("<note id='1'><to>Tove</to></note>");
      expect(editor.get("note>to")).to.equals("Tove");
      expect(editor.get("note.id")).to.equals("1");
    });

    it("should configure boolean options from strings", () => {
      editor.configure("format", "false");
      editor.configure("selfClosingTags", "true");
      expect(editor.options.format).to.equals(false);
      expect(editor.options.selfClosingTags).to.equals(true);
    });

    it("should save self-closing tags when option is enabled", () => {
      const tempFile = path.join(os.tmpdir(), `bhic-save-${Date.now()}.xml`);
      editor.file = tempFile;
      editor.object = { text: "" };
      editor.configure("selfClosingTags", "true");
      editor.save();

      const content = fs.readFileSync(tempFile, "utf8");
      expect(content).to.equals("<text />");

      fs.unlinkSync(tempFile);
    });
  });
});
