/* eslint-disable class-methods-use-this */
class BaseLogger {
  constructor() {
    this.name = (`Logger-${new Date().getTime()}`);
  }

  /** @virtual */
  setInstructions(instructions) {
    /** @todo Apply the instructions */
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
