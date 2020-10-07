const fs = require('fs');
const CommandBase = require("../base/command-base");
const inquirer = require('inquirer');
const DirectoryHelper = require("../helpers/directory-helper");
const RunCommand = require("../run/index");

class ExtensionCommand extends CommandBase {
    async run(args) {
        if (args[0] === "install" || args[0] === "i") {
            if (!args[1]) {
                return this.codes.missingArguments;
            }

            const dir = new DirectoryHelper();

            if (args[1].startsWith("git:") || args[1].endsWith(".git")) {
                this.info(`Installing ${args[1]}...`);

                this.breakpoint();

                const env = this.environment.fork(dir.commandsDir);
                const command = new RunCommand(env);
                await command.run(["git", "clone", args[1]]);

                this.info(`Package installed`);
            }
            else {
                this.codes.invalidArguments;
            }

            return this.codes.success;
        }
        else {
            return this.codes.success;
        }
    }
}

module.exports = ExtensionCommand;