const fs = require("fs");
const path = require("path");

const { expect } = require("chai");
const Environment = require("../src/environment");
const MkDirCommand = require("../src/commands/mkdir/index");

const folder = __dirname;

const env = new Environment(path.join(folder, "./files"), {});
const cmd = new MkDirCommand(env);

const unexistingDir = path.join(folder, "files/tempDir");

describe("MkDirCommand", () => {
  beforeEach(() => {
  });

  afterEach(() => {
    if (fs.existsSync(unexistingDir)) {
      fs.rmdirSync(unexistingDir);
    }
  });

  it("mkdir should work fine", async () => {
    expect(fs.existsSync(unexistingDir)).to.be.false;
    await cmd.run(["tempDir"]);
    expect(fs.existsSync(unexistingDir)).to.be.true;
  });
});
