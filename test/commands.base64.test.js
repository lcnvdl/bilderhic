const Base64Command = require("../src/commands/base64/index");
const Environment = require("../src/environment");
const fs = require("fs");
const path = require("path");

const { expect } = require("chai");

const folder = __dirname;

let env = new Environment(path.join(folder, "./files"), {});
let cmd = new Base64Command(env);

describe("Base64Command", () => {

  afterEach(() => {
      if (fs.existsSync(path.join(folder, "./files/b64.txt")))
          fs.unlinkSync(path.join(folder, "./files/b64.txt"));
  });

  it("base64 should work fine", async () => {
    let content = null;
    await cmd.run(["cHJ1ZWJh", m => content = m]);

    expect(content).to.equals("prueba");
  });

  it("base64 should write a file", async () => {
    let content = null;
    await cmd.run(["cHJ1ZWJh", ">", "b64.txt"]);

    content = fs.readFileSync(path.join(folder, "./files/b64.txt"), "utf8");

    expect(content).to.equals("prueba");
  });
});
