const util = require("util");
const exec = util.promisify(require("child_process").exec);
const CommandBase = require("../base/command-base");
const Log = require("../../log");

class RunCommand extends CommandBase {
    async run(args) {
        let command = args.join(" ");

        command = this.environment.applyVariables(command);

        const { stdout, stderr } = await exec(command, { cwd: this.environment.cwd });

        if (stdout && stdout !== "") {
            Log.write(stdout);
        }

        if (stderr && stderr !== "") {
            Log.error(stderr);
        }

        return this.codes.success;
    }
}

module.exports = RunCommand;