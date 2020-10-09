const { expect } = require("chai");
const Environment = require("../src/environment");

/** @type {Environment} */
let env;

describe("Environment", () => {
  describe("applyVariables", () => {
    beforeEach(() => {
      env = new Environment(__dirname);
      env.setVariables({
        name: "Test",
        version: {
          minor: 0,
          mayor: 1,
          patch: 5,
          subversion: {
            number: 3,
          },
        },
      });
    });

    it("apply simple variable", () => {
      const path = "[name]/file";
      const result = env.applyVariables(path);
      const expected = "Test/file";
      expect(result).to.equals(expected);
    });

    it("apply chained variables", () => {
      const path = "[name]_[version.mayor].[version.minor].[version.patch]/file";
      const result = env.applyVariables(path);
      const expected = "Test_1.0.5/file";
      expect(result).to.equals(expected);
    });

    it("apply recursive chained variables", () => {
      const path = "[version.subversion.number]/file";
      const result = env.applyVariables(path);
      const expected = "3/file";
      expect(result).to.equals(expected);
    });
  });
});
