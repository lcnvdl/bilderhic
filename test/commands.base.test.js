const path = require("path");

const { expect } = require("chai");
const Environment = require("../src/environment");
const CatCommand = require("../src/commands/cat/index");

const folder = __dirname;

const env = new Environment(path.join(folder, "./files"), {});
const cmd = new CatCommand(env);

describe("BaseCommand", () => {
  it("parsePath", () => {
    const finalPath = cmd.parsePath("~/test");
    expect(finalPath).to.not.includes("~");
    expect(finalPath.endsWith("test")).to.be.true;
  });
});
