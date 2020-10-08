const fs = require('fs');
const path = require("path");
const CommandBase = require("../base/command-base");
const inquirer = require('inquirer');
const DirectoryHelper = require("../helpers/directory-helper");
const RunCommand = require("../run/index");
const PipeCommand = require("../pipe/index");
const DelCommand = require("../del/index");

class ExtensionCommand extends CommandBase {
    async run(args) {
        const dir = new DirectoryHelper();

        if (args[0] === "remove") {
            if (!args[1]) {
                return this.codes.missingArguments;
            }

            const env = this.environment.fork(dir.commandsDir);
            const delCmd = new DelCommand(env);

            if (!fs.existsSync(path.join(dir.commandsDir, args[1]))) {
                throw new Error(`The package "${args[1]}" does not exists.`);
            }

            this.info(`Removing ${args[1]}...`);

            await delCmd.run(["-q", args[1]]);

            return this.codes.success;
        }
        else if (args[0] === "update") {
            if (!args[1]) {
                return this.codes.missingArguments;
            }

            if (args[1] === "all") {
                const env = this.environment.fork(dir.commandsDir);
                const pipe = new PipeCommand(env);
                await pipe.load(":each folder :eol: echo Updating [$currentFolder] :eol: git reset --hard :eol: git pull");
            }
            else {
                const finalPath = path.join(dir.commandsDir, args[1]);

                if (!fs.existsSync(finalPath)) {
                    throw new Error(`The package "${args[1]}" does not exists.`);
                }

                const env = this.environment.fork(finalPath);
                const command = new RunCommand(env);

                this.info(`Updating ${args[1]}...`);

                await command.run(["git", "reset", "--hard"]);
                await command.run(["git", "pull"]);
            }

            return this.codes.success;
        }
        else if (args[0] === "install" || args[0] === "i") {
            if (!args[1]) {
                return this.codes.missingArguments;
            }

            if (args[1].startsWith("git:") || args[1].endsWith(".git")) {
                this.info(`Installing ${args[1]}...`);

                this.breakpoint();

                const env = this.environment.fork(dir.commandsDir);

                const delCmd = new DelCommand(env);
                const runCmd = new RunCommand(env);

                let name;

                if (args[2] && args[2] != "") {
                    name = args[2];
                }
                else {
                    name = args[1].substr(args[1].lastIndexOf("/" + 1));
                    if (name.includes(".")) {
                        name = name.substr(0, name.indexOf("."));
                    }
                }

                await delCmd.run(["-q", name]);
                await runCmd.run(["git", "clone", args[1], name]);

                this.info(`Package installed`);
            }
            else {
                return this.codes.invalidArguments;
            }

            return this.codes.success;
        }
        else {
            return this.codes.success;
        }
    }
}

module.exports = ExtensionCommand;
