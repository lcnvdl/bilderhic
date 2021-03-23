const { expect } = require("chai");
const CommandsExtractor = require("../src/commands/helpers/commands-extractor");

describe("CommandsExtractor", () => {
  describe("extractBlock", () => {
    it("dont extract if the first line is not a begin", () => {
      const block = [
        "hi",
        ":begin",
        "test",
        ":end",
      ];
      const finalBlock = [
        "hi",
        ":begin",
        "test",
        ":end",
      ];
      const expected = [];
      const result = CommandsExtractor.extractBlock(block);
      expect(result).deep.equals(expected);
      expect(block).deep.equals(finalBlock);
    });

    it("simple instruction", () => {
      const block = [
        ":begin",
        "test",
        ":end",
        "hi",
      ];
      const finalBlock = [
        "hi",
      ];
      const expected = [
        ":begin",
        "test",
        ":end",
      ];
      const result = CommandsExtractor.extractBlock(block);
      expect(result).deep.equals(expected);
      expect(block).deep.equals(finalBlock);
    });

    it("instructions with sublevels", () => {
      const block = [
        ":begin",
        "hi",
        ":begin",
        "test",
        ":end",
        ":end",
        "hi",
      ];
      const finalBlock = [
        "hi",
      ];
      const expected = [
        ":begin",
        "hi",
        ":begin",
        "test",
        ":end",
        ":end",
      ];
      const result = CommandsExtractor.extractBlock(block);
      expect(result).deep.equals(expected);
      expect(block).deep.equals(finalBlock);
    });
  });

  describe("extract", () => {
    it("empty", () => {
      const line = "";
      const expected = [];
      const result = CommandsExtractor.extract(line);
      expect(result).deep.equals(expected);
    });

    it("should split spaces", () => {
      const line = "a b cde";
      const expected = ["a", "b", "cde"];
      const result = CommandsExtractor.extract(line);
      expect(result).deep.equals(expected);
    });

    it("should ignore empty spaces", () => {
      const line = "  a b   cde   ";
      const expected = ["a", "b", "cde"];
      const result = CommandsExtractor.extract(line);
      expect(result).deep.equals(expected);
    });

    it("should ignore spaces when comillas", () => {
      const line = "a b \"c d e\"";
      const expected = ["a", "b", "c d e"];
      const result = CommandsExtractor.extract(line);
      expect(result).deep.equals(expected);
    });

    it("should ignore double comillas", () => {
      const line = "a b \"\"c d e\"\"";
      const expected = ["a", "b", "\"c", "d", "e\""];
      const result = CommandsExtractor.extract(line);
      expect(result).deep.equals(expected);
    });

    it("should work fine - env set example", () => {
      const line = "env set hola \"hola mundo\"";
      const expected = ["env", "set","hola", "hola mundo"];
      const result = CommandsExtractor.extract(line);
      expect(result).deep.equals(expected);
    });
  });
});
