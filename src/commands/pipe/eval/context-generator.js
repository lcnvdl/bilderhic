const IoContext = require("./io-context");

class EvalContextGenerator {
  static newContext(env) {
    return {
      io: new IoContext(env),
    };
  }
}

module.exports = EvalContextGenerator;
