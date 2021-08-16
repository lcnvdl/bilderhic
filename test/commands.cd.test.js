const path = require("path");

const { expect } = require("chai");
const Environment = require("../src/environment");
const CdCommand = require("../src/commands/cd/index");

const folder = __dirname;
const envFolder = path.join(folder, "./files");

const env = new Environment(envFolder, {});
const cmd = new CdCommand(env);

describe("CdCommand", () => {
  it("should print the current directory if is empty", async () => {
    const result = await cmd.run([]);
    expect(result).to.eq(0);
  });

  it("cd to function", async () => {
    let content = null;
    await cmd.run([m => { content = m; }]);

    expect(content).to.equals(envFolder);
  });

  it("cd to environment", async () => {
    let content = null;
    await cmd.run([">>", "content"]);

    content = env.getVariables().content;

    expect(content).to.equals(envFolder);
  });

  it("cd test navigation to environment (non existing folder)", async () => {
    let content = null;
    await cmd.run(["xyz_", "-t", ">>", "content"]);

    content = env.getVariables().content;

    expect(content).to.equals(false);
  });

  it("cd test navigation to environment (existing folder)", async () => {
    let content = null;
    await cmd.run([envFolder, "-t", ">>", "folderr"]);

    content = env.getVariables().folderr;

    expect(content).to.equals(true);
  });
});
