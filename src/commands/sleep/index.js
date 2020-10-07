const CommandBase = require("../base/command-base");

class SleepCommand extends CommandBase {
    async run(args) {
        if (!args || args.length === 0) {
            return this.codes.missingArguments;
        }

        let time = +this.environment.applyVariables(args[0]);

        if (time <= 0) {
            return this.codes.invalidArguments;
        }

        await new Promise((resolve) => {
            setTimeout(() => resolve(), time);
        });

        return this.codes.success;
    }
}

module.exports = SleepCommand;