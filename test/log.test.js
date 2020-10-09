const { expect } = require("chai");
const Log = require("../src/log");

describe("Log", () => {
  it("shouldn't fail", () => {
    Log.error("a");
    Log.error("a", "b");
    Log.info("a");
    Log.info("a", "b");
    Log.success("a");
    Log.success("a", "b");
    Log.warn("a");
    Log.warn("a", "b");
    Log.debug("a");
    Log.debug("a", "b");
    Log.verbose("a");
    Log.verbose("a", "b");
    Log.write("a");
    Log.write("a", "b");
  });
});
