const { expect } = require("chai");
const FileEditorsFactory = require("../src/file-editors/file-editors.factory");
const JsonFileEditor = require("../src/file-editors/json.editor");
const XmlFileEditor = require("../src/file-editors/xml.editor");
const TxtFileEditor = require("../src/file-editors/txt.editor");

describe("FileEditorsFactory", () => {
  describe("getEditorByFormat", () => {
    it("should return null when file has no extension", () => {
      const editor = FileEditorsFactory.getEditorByFormat("README");
      expect(editor).to.equals(null);
    });

    it("should return JsonFileEditor for json extension", () => {
      const editor = FileEditorsFactory.getEditorByFormat("config.json");
      expect(editor).to.be.instanceof(JsonFileEditor);
    });

    it("should return XmlFileEditor for uppercase extension", () => {
      const editor = FileEditorsFactory.getEditorByFormat("file.XML");
      expect(editor).to.be.instanceof(XmlFileEditor);
    });

    it("should fallback to TxtFileEditor for unknown extension", () => {
      const editor = FileEditorsFactory.getEditorByFormat("file.md");
      expect(editor).to.be.instanceof(TxtFileEditor);
    });
  });

  describe("getEditor", () => {
    it("should return JsonFileEditor for trimmed lowercase name", () => {
      const editor = FileEditorsFactory.getEditor(" json ");
      expect(editor).to.be.instanceof(JsonFileEditor);
    });

    it("should return XmlFileEditor for uppercase name", () => {
      const editor = FileEditorsFactory.getEditor("XML");
      expect(editor).to.be.instanceof(XmlFileEditor);
    });

    it("should fallback to TxtFileEditor for unknown editor name", () => {
      const editor = FileEditorsFactory.getEditor("whatever");
      expect(editor).to.be.instanceof(TxtFileEditor);
    });
  });
});
