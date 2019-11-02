const util = require("util");
const exec = util.promisify(require("child_process").exec);
const CommandBase = require("../base/command-base");

class RunCommand extends CommandBase {
    async run(args) {
        let command = args.join(" ");

        const { stdout, stderr } = await exec(command, { cwd: this.environment.cwd });

        if (stdout && stdout !== "") {
            console.log(stdout);
        }

        if (stderr && stderr !== "") {
            console.error(stderr);
        }

        return this.codes.success;
    }
}

module.exports = RunCommand;