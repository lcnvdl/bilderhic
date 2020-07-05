const CommandBase = require("../base/command-base");

class ExitCommand extends CommandBase {
    async run(args) {
        await this.breakpoint();

        if (args.length > 1) {
            return this.codes.invalidArguments;
        }

        if (args[0] === "pipe") {
            return this.codes.exitPipe;
        }
        else {
            return this.codes.exitProcess;
        }
    }
}

module.exports = ExitCommand;