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

  it("load should add all environment variables", async () => {
    await cmd.run(["load", "./files/variables.yml"]);
    expect(env.variables.app).to.be.ok;
    expect(env.variables.app.id).to.equals("com.mydomain.myapp");
  });

  it("clear should delete all environment variables", async () => {
    env.variables.test = true;
    expect(env.variables.test).to.be.true;
    await cmd.run(["clear"]);
    expect(env.variables.test).to.be.undefined;
  });

  it("set should work fine", async () => {
    expect(env.getVariables().variable).to.be.undefined;
    await cmd.run(["set", "variable", "true"]);
    expect(env.getVariables().variable).to.equals("true");
  });

  it("add should fail if variable doesn't exists", async () => {
    const code = await cmd.run(["add", "unknownVariable", "1"]);
    expect(code).to.equals(1);
  });

  it("add should work fine", async () => {
    expect(env.getVariables().counter).to.be.undefined;
    await cmd.run(["set", "counter", "1"]);
    await cmd.run(["add", "counter", "1"]);
    expect(env.getVariables().counter).to.equals(2);
    await cmd.run(["add", "counter", "10"]);
    expect(env.getVariables().counter).to.equals(12);
  });

  it("add without value argument should add one", async () => {
    expect(env.getVariables().counter).to.be.undefined;
    await cmd.run(["set", "counter", "1"]);
    await cmd.run(["add", "counter"]);
    expect(env.getVariables().counter).to.equals(2);
  });
});
