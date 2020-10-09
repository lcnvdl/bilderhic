const beep = require("beepbeep");
const CommandBase = require("../base/command-base");

class BeepCommand extends CommandBase {
  async run(args) {
    let a = 1;

    args = args || [];

    if (args.length > 0) {
      a = +this.environment.applyVariables(args[0]);
    }

    let b = 500;

    if (args.length > 1) {
      b = +this.environment.applyVariables(args[1]);
    }

    this.verbose("Beeping...");

    beep(a, b);

    await new Promise(resolve => {
      setTimeout(() => resolve(), b * a);
    });

    this.verbose("Beep finished");

    return this.codes.success;
  }
}

module.exports = BeepCommand;
