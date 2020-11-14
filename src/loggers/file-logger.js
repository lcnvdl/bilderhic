const fs = require("fs");
const CentralizedBaseLogger = require("./centralized-base-logger");

function logToFile(file, a, b) {
  let log = a;
  if (b) {
    log += `, ${b}`;
  }
  fs.appendFileSync(file, `${log}\n`);
}

class FileLogger extends CentralizedBaseLogger {
  constructor() {
    super();
    this.file = "info.log";
  }

  doLog(type, a, b) {
    logToFile(this.file, a, b);
  }

  _processInstruction(cmd) {
    if (super._processInstruction(cmd)) {
      return true;
    }

    if (cmd[0] === "set") {
      if (cmd[1] === "filename" || cmd[1] === "file") {
        this.file = cmd[2];
        return true;
      }
    }

    return false;
  }
}

module.exports = FileLogger;
