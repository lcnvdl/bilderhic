const { expect } = require("chai");
const JsonEditor = require("../src/file-editors/json.editor");

/** @type {JsonEditor} */
let editor;

describe("JsonFileEditor", () => {
  describe("set", () => {
    beforeEach(() => {
      editor = new JsonEditor();
    });

    it("should set attribute of an element", () => {
      editor.load("{ \"id\": 0 }");
      expect(editor.object.id).to.equals(0);
      editor.set("id", 1);
      expect(editor.object.id).to.equals(1);
    });

    it("should set attribute of a child element", () => {
      editor.load("{ \"value\": { \"n\": 1, \"i\": 0 } }");
      expect(editor.object.value.i).to.equals(0);
      expect(editor.object.value.n).to.equals(1);
      editor.set("value.i", 1);
      expect(editor.object.value.i).to.equals(1);
      expect(editor.object.value.n).to.equals(1);
    });
  });
});
