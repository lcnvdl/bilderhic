const { expect } = require("chai");
const EnvCommand = require("../src/commands/env/index");
const Environment = require("../src/environment");

/** @type {Environment} */
let env;

/** @type {EnvCommand} */
let cmd;

describe("EnvCommand", () => {
    beforeEach(() => {
        env = new Environment(__dirname);
        cmd = new EnvCommand(env);
    });

    it("load should add all environment variables", () => {
        cmd.run(["load", "./files/variables.yml"]);
        expect(env.variables.app).to.be.ok;
        expect(env.variables.app.id).to.equals("com.taxyfleet.drivers");
    });

    it("clear should delete all environment variables", () => {
        env.variables["test"] = true;
        expect(env.variables.test).to.be.true;
        cmd.run(["clear"]);
        expect(env.variables.test).to.be.undefined;
    });
});