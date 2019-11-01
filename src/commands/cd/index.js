const fs = require('fs');
const path = require('path');
const CommandBase = require("../base/command-base");

class CdCommand extends CommandBase {
    run(args) {
        if (!args || args.length === 0) {
            return this.codes.missingArguments;
        }

        let folder = this.parsePath(args[0]);

        if (!fs.existsSync(folder)) {
            throw new Error(`The folder ${folder} doesn't exists`);
        }

        if (!fs.lstatSync(folder).isDirectory()) {
            throw new Error(`The path ${folder} is not a folder`);
        }
        
        this.environment.cwd = folder;

        return this.codes.success;
    }
}

module.exports = CdCommand;