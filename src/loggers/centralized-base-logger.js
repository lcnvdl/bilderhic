const BaseLogger = require("./base-logger");

class CentralizedBaseLogger extends BaseLogger {
  /**
   * @abstract
   * @param {string} type Type
   * @param {*} a A
   * @param {*} [b] B
   */
  doLog(type, a, b) {
    throw new Error("Not implemented");
  }

  write(a, b) {
    this.doLog("write", a, b);
  }

  info(a, b) {
    this.doLog("info", a, b);
  }

  verbose(a, b) {
    this.doLog("verbose", a, b);
  }

  success(a, b) {
    this.doLog("success", a, b);
  }

  debug(a, b) {
    this.doLog("debug", a, b);
  }

  warn(a, b) {
    this.doLog("warn", a, b);
  }

  error(a, b) {
    this.doLog("error", a, b);
  }
}

module.exports = CentralizedBaseLogger;
