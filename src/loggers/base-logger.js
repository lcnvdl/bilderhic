const CommandsExtractor = require("../commands/helpers/commands-extractor");

/* eslint-disable class-methods-use-this */
class BaseLogger {
  constructor() {
    this.name = (`Logger-${new Date().getTime()}`);
  }

  /** @virtual */
  setInstructions(instructions) {
    for (const line of instructions) {
      const cmd = CommandsExtractor.extract(line);
      if (!this._processInstruction(cmd)) {
        /** @todo Error: invalid instruction */
      }
    }
  }

  /** @virtual */
  _processInstruction(cmd) {
    if (cmd[0] === "set") {
      if (cmd[1] === "name") {
        this.name = cmd[2];
        return true;
      }
    }

    return false;
  }

  /** @abstract */
  write(_a, _b) {
    throw new Error("Abstract method");
  }

  /** @abstract */
  info(_a, _b) {
    throw new Error("Abstract method");
  }

  /** @abstract */
  verbose(_a, _b) {
    throw new Error("Abstract method");
  }

  /** @abstract */
  success(_a, _b) {
    throw new Error("Abstract method");
  }

  /** @abstract */
  debug(_a, _b) {
    throw new Error("Abstract method");
  }

  /** @abstract */
  warn(_a, _b) {
    throw new Error("Abstract method");
  }

  /** @abstract */
  error(_a, _b) {
    throw new Error("Abstract method");
  }
}

module.exports = BaseLogger;
