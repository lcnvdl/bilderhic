const { expect } = require("chai");
const Environment = require("../src/environment");

/** @type {Environment} */
let env;

describe("Environment", () => {
  describe("setDefaultVariable", () => {
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

    it("set simple non-existing default variable", () => {
      env.setDefaultVariable("lastName", "Good");
      const result = env.getVariable("lastName");
      const expected = "Good";
      expect(result).to.equals(expected);
    });

    it("set simple existing default variable", () => {
      env.setDefaultVariable("name", "Fail");
      const result = env.getVariable("name");
      const expected = "Test";
      expect(result).to.equals(expected);
    });

    it("set chained existing variables", () => {
      env.setDefaultVariable("version.minor", 999);
      const result = env.getVariable("version.minor");
      const expected = 0;
      expect(result).to.equals(expected);
    });

    it("set chained non-existing variables", () => {
      env.setDefaultVariable("version.xyz", 999);
      const result = env.getVariable("version.xyz");
      const expected = 999;
      expect(result).to.equals(expected);
    });

    it("set chained (2 lvl) existing variables", () => {
      env.setDefaultVariable("version.subversion.number", 123);
      const result = env.getVariable("version.subversion.number");
      const expected = 3;
      expect(result).to.equals(expected);
    });

    it("set chained (2 lvl) non-existing variables", () => {
      env.setDefaultVariable("version.subversion.xyz", 123);
      const result = env.getVariable("version.subversion.xyz");
      const expected = 123;
      expect(result).to.equals(expected);
    });
  });

  describe("getVariable", () => {
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

    it("get simple variable", () => {
      const result = env.getVariable("name");
      const expected = "Test";
      expect(result).to.equals(expected);
    });

    it("get chained variables", () => {
      const result = env.getVariable("version.minor");
      const expected = 0;
      expect(result).to.equals(expected);
    });

    it("get chained (2 lvl) variables", () => {
      const result = env.getVariable("version.subversion.number");
      const expected = 3;
      expect(result).to.equals(expected);
    });
  });

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

    it("non existing variables", () => {
      const path = "[xyz]/file";
      const result = env.applyVariables(path);
      const expected = "/file";
      expect(result).to.equals(expected);
    });

    it("non a variable", () => {
      const path = "\\[xyz\\]/file";
      const result = env.applyVariables(path);
      const expected = "[xyz]/file";
      expect(result).to.equals(expected);
    });

    it("apply a function variable", () => {
      env.setVariable("test", () => "testVar");
      const path = "[test].ok";
      const result = env.applyVariables(path);
      const expected = "testVar.ok";
      expect(result).to.equals(expected);
    });

    it("apply a function variable with parameters", () => {
      env.setVariable("test", x => `testVar${x}`);
      const path = "[test:iable].ok";
      const result = env.applyVariables(path);
      const expected = "testVariable.ok";
      expect(result).to.equals(expected);
    });
  });
});
