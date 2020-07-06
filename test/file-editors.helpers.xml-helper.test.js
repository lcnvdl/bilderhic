const XmlHelper = require("../src/file-editors/helpers/xml.helper");
const { expect } = require("chai");

describe("XmlHelper", () => {
    describe("normalizeEmptyTags", () => {
        it("should work fine", () => {
            const content = "<i></i><br></br>";
            const expected = "<i></i><br/>";
            const result = XmlHelper.generateSelfClosingTags(content, ["i"]);

            expect(result).to.equal(expected);
        });
        it("should work fine", () => {
            const content = "<my-property id='123'></my-property>";
            const expected = "<my-property id='123'/>";
            const result = XmlHelper.generateSelfClosingTags(content, ["i"]);

            expect(result).to.equal(expected);
        });
    });
});