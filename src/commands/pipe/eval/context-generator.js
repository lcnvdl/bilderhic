const IoContext = require("./io-context");

class EvalContextGenerator {
  static newContext() {
    return {
      io: IoContext,
    };
  }
}

module.exports = EvalContextGenerator;
