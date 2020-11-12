const Log = require("../../log");
const CommandBase = require("../base/command-base");

class LogCommand extends CommandBase {
  run(args) {
    if (args.length === 0) {
      return this.codes.missingArguments;
    }

    let mode = "info";

    if (["info", "warn", "error", "debug", "success"].includes(args[0].toLowerCase())) {
      // eslint-disable-next-line prefer-destructuring
      mode = args.shift();

      if (args.length === 0) {
        return this.codes.missingArguments;
      }
    }

    const text = args.map(m => this.environment.applyVariables(m)).join(" ");

    Log[mode](text);

    return this.codes.success;
  }
}

module.exports = LogCommand;
