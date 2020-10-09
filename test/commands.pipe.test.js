const { expect } = require("chai");
const Pipe = require("../src/commands/pipe/index");

describe("Pipe", () => {
  it("#constructor", () => {
    const instance = new Pipe();
    expect(instance).to.be.ok;
  });
});
