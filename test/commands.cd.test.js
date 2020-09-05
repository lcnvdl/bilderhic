const CdCommand = require("../src/commands/cd/index");
const Environment = require("../src/environment");
const fs = require("fs");
const path = require("path");

const { expect } = require("chai");

const folder = __dirname;
const envFolder = path.join(folder, "./files");

let env = new Environment(envFolder, {});
let cmd = new CdCommand(env);

describe("CdCommand", () => {
  it("should print the current directory if is empty", async () => {
    const result = await cmd.run([]);
    expect(result).to.eq(0);
  });

  it("cd to function", async () => {
    let content = null;
    await cmd.run([m => content = m]);

    expect(content).to.equals(envFolder);
  });

  it("cd to environment", async () => {
    let content = null;
    await cmd.run([">>", "content"]);

    content = env.getVariables()["content"];

    expect(content).to.equals(envFolder);
  });
});
