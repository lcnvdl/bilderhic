const CommandsExtractor = require("../src/commands/helpers/commands-extractor");
const { expect } = require("chai");

describe("CommandsExtractor", () => {
    describe("extract", () => {
        it("empty", () => {
            const line = "";
            const expected = [];
            const result = CommandsExtractor.extract(line);
            expect(result).deep.equals(expected);
        });

        it("should split spaces", () => {
            const line = "a b cde";
            const expected = ["a","b","cde"];
            const result = CommandsExtractor.extract(line);
            expect(result).deep.equals(expected);
        });
        
        it("should ignore empty spaces", () => {
            const line = "  a b   cde   ";
            const expected = ["a","b","cde"];
            const result = CommandsExtractor.extract(line);
            expect(result).deep.equals(expected);
        });
        
        it("should ignore spaces when comillas", () => {
            const line = "a b \"c d e\"";
            const expected = ["a","b","c d e"];
            const result = CommandsExtractor.extract(line);
            expect(result).deep.equals(expected);
        });
        
        it("should ignore double comillas", () => {
            const line = "a b \"\"c d e\"\"";
            const expected = ["a","b","\"c","d", "e\""];
            const result = CommandsExtractor.extract(line);
            expect(result).deep.equals(expected);
        });
    });
});