const path = require("path");
const fs = require("fs");
const { expect } = require("chai");

const Environment = require("../src/environment");
const SyncCommand = require("../src/commands/sync/index");

const folder = __dirname;

const envFolder = path.join(folder, "./files");
const env = new Environment(envFolder, {});
const cmd = new SyncCommand(env);

const fsStub = {
  folders: { folder1: {} },
  existsSync(flder) {
    return !!fsStub.folders[flder];
  },
  mkdirSync(flder) {
    fsStub[flder] = fsStub[flder] || {};
  },
  lstatSync(file) {
    return {
      isFile() {
        return [].includes(file);
      },
    };
  },
};

const fseStub = {
  copies: [],
  copySync(file1, file2, opts) {
    this.copies.push({ file1, file2, opts });
  },
};

const globStub = {
};

describe("SyncCommand", () => {
  afterEach(() => {
    fseStub.copies = [];
    cmd._fs = fsStub;
    cmd._fse = fseStub;
    cmd._glob = (pattern, cb) => {
      const error = null;
      const matches = [];

      cb(error, matches);
    };
  });

  it("should fail if argument count is 0", async () => {
    const code = await cmd.run([]);
    expect(code).to.be.equals(cmd.codes.missingArguments);
  });

  it("should fail if argument count is 1", async () => {
    const code = await cmd.run(["a"]);
    expect(code).to.be.equals(cmd.codes.invalidArguments);
  });

  it("should work fine", async () => {
    const code = await cmd.run(["./folder1", "./folder2"]);
    // const f1 = fseStub.copies[0].file1.substr(fseStub.copies[0].file1.lastIndexOf("\\") + 1);
    // const f2 = fseStub.copies[0].file2.substr(fseStub.copies[0].file2.lastIndexOf("\\") + 1);
    expect(code).to.be.equals(cmd.codes.success);
    expect(fseStub.copies.length).to.equal(1);
    // expect(f1).to.equal("folder1");
    // expect(f2).to.equal("folder2");
  });
});
