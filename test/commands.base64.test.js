const fs = require("fs");
const path = require("path");

const { expect } = require("chai");
const Environment = require("../src/environment");
const Base64Command = require("../src/commands/base64/index");

const folder = __dirname;

const env = new Environment(path.join(folder, "./files"), {});
const cmd = new Base64Command(env);

describe("Base64Command", () => {
  afterEach(() => {
    if (fs.existsSync(path.join(folder, "./files/b64.txt"))) fs.unlinkSync(path.join(folder, "./files/b64.txt"));
  });

  it("base64 to function", async () => {
    let content = null;
    await cmd.run(["cHJ1ZWJh", m => content = m]);

    expect(content).to.equals("prueba");
  });

  it("base64 to environment", async () => {
    let content = null;
    await cmd.run(["cHJ1ZWJh", ">>", "content"]);

    content = env.getVariables().content;

    expect(content).to.equals("prueba");
  });

  it("base64 to file", async () => {
    let content = null;
    await cmd.run(["cHJ1ZWJh", ">", "b64.txt"]);

    content = fs.readFileSync(path.join(folder, "./files/b64.txt"), "utf8");

    expect(content).to.equals("prueba");
  });
});
