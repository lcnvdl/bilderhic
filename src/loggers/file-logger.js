const fs = require("fs");
const BaseLogger = require("./base-logger");

function logToFile(file, a, b) {
  let log = a;
  if (b) {
    log += `, ${b}`;
  }
  fs.appendFileSync(file, `${log}\n`);
}

class FileLogger extends BaseLogger {
  constructor() {
    super();
    this.file = "info.log";
  }

  write(a, b) {
    logToFile(this.file, a, b);
  }

  info(a, b) {
    logToFile(this.file, a, b);
  }

  verbose(a, b) {
    logToFile(this.file, a, b);
  }

  success(a, b) {
    logToFile(this.file, a, b);
  }

  debug(a, b) {
    logToFile(this.file, a, b);
  }

  warn(a, b) {
    logToFile(this.file, a, b);
  }

  error(a, b) {
    logToFile(this.file, a, b);
  }
}

module.exports = FileLogger;
