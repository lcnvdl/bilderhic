const { expect } = require("chai");
const TxtEditor = require("../src/file-editors/txt.editor");

/** @type {TxtEditor} */
let editor;

describe("TxtFileEditor", () => {
  describe("set", () => {
    beforeEach(() => {
      editor = new TxtEditor();
    });

    it("append should append text", () => {
      const expected = "line 1\nline 2\nline 3";
      editor.load("line 1\nline 2");
      editor.append("line 3");
      expect(editor.content).to.equals(expected);
    });

    it("replace one should replace one occurence of a text", () => {
      const expected = "Line 1\nline 2";
      editor.load("line 1\nline 2");
      editor.replaceOne("line", "Line");
      expect(editor.content).to.equals(expected);
    });

    it("replace should replace all occurences of a text", () => {
      const expected = "Line 1\nLine 2";
      editor.load("line 1\nline 2");
      editor.replace("line", "Line");
      expect(editor.content).to.equals(expected);
    });

    it("set line should change a specific line", () => {
      const expected = "line 1\nline 2\nline 3";
      editor.load("line 1\nline 4\nline 3");
      editor.setLine(1, "line 2");
      expect(editor.content).to.equals(expected);
    });
  });
});
