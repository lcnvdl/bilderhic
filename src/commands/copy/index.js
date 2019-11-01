const fse = require('fs-extra');
const CommandBase = require("../base/command-base");

class CopyCommand extends CommandBase {
    run(args) {
        if (!args || args.length === 0) {
            return this.codes.missingArguments;
        }

        if (args.length > 2) {
            return this.codes.invalidArguments;
        }

        let file1 = this.parsePath(args[0]);
        let file2 = this.parsePath(args[1]);

        fse.copySync(file1, file2);

        return this.codes.success;
    }
}

module.exports = CopyCommand;