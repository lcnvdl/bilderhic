const path = require("path");
const { expect } = require("chai");
const Pipe = require("../src/commands/pipe/index");
const Environment = require("../src/environment");

const env = new Environment(path.join(__dirname, "./files"), {});

describe("Pipe", () => {
  it("#constructor", () => {
    const instance = new Pipe(env);
    expect(instance).to.be.ok;
  });

  it("_processCodes should throw on invalid arguments", () => {
    const instance = new Pipe(env);
    const fn = () => instance._processCodes("cat", instance.codes.invalidArguments);
    expect(fn).to.throw("Invalid arguments in instruction");
  });

  it("_processCodes should return true on exitPipe", () => {
    const instance = new Pipe(env);
    const result = instance._processCodes("exit", instance.codes.exitPipe);
    expect(result).to.equals(true);
  });

  it("_processCodes should call process.exit on exitProcess", () => {
    const instance = new Pipe(env);
    const originalExit = process.exit;
    let exitCode = null;

    process.exit = code => {
      exitCode = code;
    };

    const result = instance._processCodes("exit", instance.codes.exitProcess);

    process.exit = originalExit;

    expect(result).to.equals(false);
    expect(exitCode).to.equals(0);
  });

  it("_runProcess should return async command code", async () => {
    const instance = new Pipe(env);
    const command = {
      run: () => Promise.resolve(instance.codes.success),
    };

    const result = await instance._runProcess(command, []);
    expect(result).to.equals(instance.codes.success);
  });

  it("_evalCmd should save eval result in environment", async () => {
    const instance = new Pipe(env);

    await instance._evalCmd(":eval 2 > 1");

    expect(instance.environment.getVariable("$eval")).to.equals(true);
  });

  it("_ifCmd should skip :begin/:end block when condition is false", async () => {
    const instance = new Pipe(env);
    const instructions = [":begin", "set a b", ":end", "echo keep"];

    await instance._ifCmd(":if false", instructions);

    expect(instructions).to.deep.equals(["echo keep"]);
  });
});
