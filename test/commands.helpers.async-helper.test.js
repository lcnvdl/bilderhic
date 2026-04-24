const { expect } = require("chai");
const AsyncHelper = require("../src/commands/helpers/async-helper");

describe("AsyncHelper", () => {
  describe("waitForAllWithLimit", () => {
    it("should resolve all promises when limit is not provided", async () => {
      const calls = [];
      const pending = [
        new Promise(resolve => setTimeout(() => {
          calls.push("a");
          resolve();
        }, 5)),
        new Promise(resolve => setTimeout(() => {
          calls.push("b");
          resolve();
        }, 5)),
      ];

      await AsyncHelper.waitForAllWithLimit(pending);
      expect(calls.length).to.equals(2);
    });

    it("should execute all functions when limit is provided", async () => {
      const calls = [];
      const funcs = [
        () => Promise.resolve(calls.push("1")),
        () => Promise.resolve(calls.push("2")),
        () => Promise.resolve(calls.push("3")),
      ];

      await AsyncHelper.waitForAllWithLimit(funcs, 2);
      expect(calls).to.deep.equals(["1", "2", "3"]);
    });

    it("should not exceed concurrent limit", async () => {
      let running = 0;
      let maxRunning = 0;

      const funcs = [1, 2, 3, 4, 5].map(id => () => new Promise(resolve => {
        running += 1;
        if (running > maxRunning) {
          maxRunning = running;
        }

        setTimeout(() => {
          running -= 1;
          resolve(id);
        }, 5);
      }));

      await AsyncHelper.waitForAllWithLimit(funcs, 2);
      expect(maxRunning).to.equals(2);
    });
  });
});
