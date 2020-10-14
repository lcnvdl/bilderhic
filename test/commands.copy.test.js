const path = require("path");
const fs = require("fs");
const { expect } = require("chai");

const Environment = require("../src/environment");
const CopyCommand = require("../src/commands/copy/index");

const folder = __dirname;

const envFolder = path.join(folder, "./files");
const env = new Environment(envFolder, {});
const cmd = new CopyCommand(env);

describe("CopyCommand", () => {
  afterEach(() => {
    if (fs.existsSync(path.join(envFolder, "cat.copy.txt"))) {
      fs.unlinkSync(path.join(envFolder, "cat.copy.txt"));
    }
    if (fs.existsSync(path.join(envFolder, "cat.copy.2.txt"))) {
      fs.unlinkSync(path.join(envFolder, "cat.copy.2.txt"));
    }
    if (fs.existsSync(path.join(envFolder, "cat.copy.3.txt"))) {
      fs.unlinkSync(path.join(envFolder, "cat.copy.3.txt"));
    }
  });

  it("should fail if argument count is 0", async () => {
    const code = await cmd.run([]);
    expect(code).to.be.equals(cmd.codes.missingArguments);
  });

  it("should fail if argument count is 1", async () => {
    const code = await cmd.run(["a"]);
    expect(code).to.be.equals(cmd.codes.invalidArguments);
  });

  it("should fail if input file doesn't exists", async () => {
    let error = null;
    try {
      await cmd.run(["aqowpej2", "dstination"]);
    }
    catch (err) {
      error = err;
    }

    expect(error).to.not.be.null;
  });

  it("copy should work fine", async () => {
    await cmd.run(["cat.txt", "cat.copy.txt"]);
    expect(fs.existsSync(path.join(envFolder, "cat.copy.txt"))).to.be.true;
  });

  it("copy -q should work fine", async () => {
    await cmd.run(["-q", "cat.txt", "cat.copy.2.txt"]);
    expect(fs.existsSync(path.join(envFolder, "cat.copy.2.txt"))).to.be.true;
  });

  it("copy --quiet should work fine", async () => {
    await cmd.run(["--quiet", "cat.txt", "cat.copy.3.txt"]);
    expect(fs.existsSync(path.join(envFolder, "cat.copy.3.txt"))).to.be.true;
  });
});
