const ConsoleLogger = require("./loggers/console-logger");
const FileLogger = require("./loggers/file-logger");

const loggers = [
  new ConsoleLogger(),
];

class Log {
  static addLogger(loggerClass, instructions) {
    let logger;

    if (loggerClass === "file") {
      logger = new FileLogger();
    }

    logger.setInstructions(instructions);

    if (logger) {
      loggers.push(logger);
    }
    else {
      throw new Error(`Unknown logger type: ${loggerClass}.`);
    }
  }

  static write(a, b) {
    loggers.forEach(m => m.write(a, b));
  }

  static info(a, b) {
    loggers.forEach(m => m.info(a, b));
  }

  static verbose(a, b) {
    loggers.forEach(m => m.verbose(a, b));
  }

  static success(a, b) {
    loggers.forEach(m => m.success(a, b));
  }

  static debug(a, b) {
    loggers.forEach(m => m.debug(a, b));
  }

  static warn(a, b) {
    loggers.forEach(m => m.warn(a, b));
  }

  static error(a, b) {
    loggers.forEach(m => m.error(a, b));
  }
}

module.exports = Log;
