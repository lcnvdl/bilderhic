const fs = require("fs");
const path = require("path");

const { expect } = require("chai");
const Environment = require("../src/environment");
const OpenCommand = require("../src/commands/open/index");

const folder = __dirname;

const baseEnv = new Environment(path.join(folder, "./files"), {});

/** @type {Environment} */
let env;

/** @type {OpenCommand} */
let cmd;
describe("OpenCommand", () => {
  beforeEach(() => {
    env = baseEnv.fork();
    cmd = new OpenCommand(env);
  });

  afterEach(() => {
  });

  it("unexisting file should fail", async () => {
    let error = null;
    try {
      await cmd.run(["unexisting.txt", null]);
    }
    catch (err) {
      error = err;
    }

    expect(error).to.be.ok;
  });

  it("should choose the right editor", async () => {
    const result = await cmd.run(["json-file.json", null, " - get first boolean > booleanResult", "- close"]);
    const booleanResult = env.getVariable("booleanResult");
    expect(result).to.eq(0);
    expect(booleanResult).to.be.true;
  });

  it("json using text editor should fail if use get", async () => {
    const result = await cmd.run(["json-file.json", "txt", " - get first boolean > booleanResult", "- close"]);
    expect(result).to.eq(-1);
  });

  it("json using text editor", async () => {
    const result = await cmd.run(["json-file.json", "txt", "- close"]);
    expect(result).to.eq(0);
  });

  it("save-as should work fine", async () => {
    const finalPath = path.join(folder, "./files", "json-file.json.txt");

    try {
      const result = await cmd.run(["json-file.json", "txt", " - save json-file.json.txt", "- close"]);
      expect(result).to.eq(0);
      expect(fs.existsSync(finalPath)).to.be.true;
    }
    finally {
      if (fs.existsSync(finalPath)) {
        fs.rmSync(finalPath);
      }
    }
  });

  it("xml using xml editor", async () => {
    const result = await cmd.run(["config.xml", "xml", "- close"]);
    expect(result).to.eq(0);
  });

  it("xml should work fine", async () => {
    const configPath = path.join(folder, "./files", "config.xml");
    const config2Path = path.join(folder, "./files", "config-2.xml");

    try {
      const result = await cmd.run(["config.xml", "xml", " -save config-2.xml", "- close"]);
      expect(result).to.eq(0);
      expect(fs.existsSync(configPath)).to.be.true;
      expect(fs.existsSync(config2Path)).to.be.true;

      // const content1 = fs.readFileSync(configPath, "utf-8");

      const content2 = fs.readFileSync(config2Path, "utf-8");
      expect(content2.includes("@_")).to.be.false;
    }
    finally {
      if (fs.existsSync(config2Path)) {
        // fs.rmSync(config2Path);
      }
    }
  });
});
