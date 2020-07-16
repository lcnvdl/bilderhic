const MkDirCommand = require("../src/commands/mkdir/index");
const Environment = require("../src/environment");
const fs = require("fs");
const path = require("path");

const { expect } = require("chai");

const folder = __dirname;

let env = new Environment(path.join(folder, "./files"), {});
let cmd = new MkDirCommand(env);

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