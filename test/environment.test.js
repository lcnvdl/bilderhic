const Environment = require("../src/environment");
const { expect } = require("chai");

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
                        number: 3
                    }
                }
            });
        });

        it("apply simple variable", () => {
            let path = "[name]/file";
            let result = env.applyVariables(path);
            let expected = "Test/file";
            expect(result).to.equals(expected);
        });

        it("apply chained variables", () => {
            let path = "[name]_[version.mayor].[version.minor].[version.patch]/file";
            let result = env.applyVariables(path);
            let expected = "Test_1.0.5/file";
            expect(result).to.equals(expected);
        });

        it("apply recursive chained variables", () => {
            let path = "[version.subversion.number]/file";
            let result = env.applyVariables(path);
            let expected = "3/file";
            expect(result).to.equals(expected);
        });
    });
});