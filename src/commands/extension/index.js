const fs = require('fs');
const CommandBase = require("../base/command-base");
const inquirer = require('inquirer');
const DirectoryHelper = require("../helpers/directory-helper");

class ExtensionCommand extends CommandBase {
    async run(args) {
        if (args[0] === "install" || args[0] === "i") {
            if (!args[1]) {
                return this.codes.missingArguments;
            }

            if (args[1].startsWith("git:")) {
                //  TODO    Git clone
            }

            return this.codes.success;
        }
        else {
            return this.codes.success;
        }
    }
}

module.exports = ExtensionCommand;