const path = require("path");
const { expect } = require("chai");
const Environment = require("../src/environment");
const Log = require("../src/log");
const LogCommand = require("../src/commands/log/index");

const env = new Environment(path.join(__dirname, "./files"), {});

describe("LogCommand", () => {
  it("should fail when no arguments are provided", () => {
    const cmd = new LogCommand(env);
    const result = cmd.run([]);
    expect(result).to.equals(cmd.codes.missingArguments);
  });

  it("should write with explicit warn mode", () => {
    const cmd = new LogCommand(env);
    const originalWarn = Log.warn;
    let message = null;

    Log.warn = text => {
      message = text;
    };

    const result = cmd.run(["warn", "hello", "world"]);

    Log.warn = originalWarn;

    expect(result).to.equals(cmd.codes.success);
    expect(message).to.equals("hello world");
  });

  it("should use info as default mode", () => {
    const cmd = new LogCommand(env);
    const originalInfo = Log.info;
    let message = null;

    Log.info = text => {
      message = text;
    };

    const result = cmd.run(["hello"]);

    Log.info = originalInfo;

    expect(result).to.equals(cmd.codes.success);
    expect(message).to.equals("hello");
  });
});
