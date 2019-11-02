const Pipe = require("../src/commands/pipe/index");
const { expect } = require("chai");

describe("Pipe", () => {
    it("#constructor", () => {
        const instance = new Pipe();
        expect(instance).to.be.ok;
    });
});