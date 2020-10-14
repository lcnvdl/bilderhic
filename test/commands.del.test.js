const path = require("path");
const fs = require("fs");
const { expect } = require("chai");

const Environment = require("../src/environment");
const DelCommand = require("../src/commands/del/index");

const folder = __dirname;

let existents = [];
let deleted = [];

const envFolder = path.join(folder, "./files");
const env = new Environment(envFolder, {});
const cmd = new DelCommand(env, {
  unlinkSync(fileOrFolder) {
    deleted.push(fileOrFolder);
  },
  existsSync(fileOrFolder) {
    return existents.includes(fileOrFolder);
  },
  rmdirSync(dir) {
    deleted.push(dir);
  }
});

describe("DelCommand", () => {
  afterEach(() => {
    deleted = [];
    if (fs.existsSync(path.join(envFolder, "del.txt"))) {
      fs.unlinkSync(path.join(envFolder, "del.txt"));
    }
  });

  it("should fail if argument count is 0", async () => {
    const code = await cmd.run([]);
    expect(code).to.be.equals(cmd.codes.missingArguments);
  });

  it("should fail if argument count is 0", async () => {
    const code = await cmd.run([]);
    expect(code).to.be.equals(cmd.codes.missingArguments);
  });
});
