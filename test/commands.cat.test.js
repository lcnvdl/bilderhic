const CatCommand = require("../src/commands/cat/index");
const Environment = require("../src/environment");
const fs = require("fs");
const path = require("path");

const { expect } = require("chai");

const folder = __dirname;

let env = new Environment(path.join(folder, "./files"), {});
let cmd = new CatCommand(env);

describe("CatCommand", () => {
  it("cat to function", async () => {
    let content = null;
    await cmd.run(["cat.txt", m => content = m]);

    expect(content).to.equals("contenido");
  });

  it("cat to environment", async () => {
    let content = null;
    await cmd.run(["cat.txt", ">>", "content"]);

    content = env.getVariables()["content"];

    expect(content).to.equals("contenido");
  });
});
