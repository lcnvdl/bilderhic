const fs = require('fs');
const CommandBase = require("../base/command-base");
const DelCommand = require("../del/index");

class RenCommand extends CommandBase {
    async run(args) {
        let file1 = this.parsePath(args[0]);
        let file2 = this.parsePath(args[1]);
        let overwrite = false;

        if (args.length > 2) {
            if (args[2] === "--overwrite" || args[2] === "-w") {
                overwrite = true;
            }
            else {
                return this.codes.invalidArguments;
            }
        }

        if (!fs.existsSync(file1)) {
            throw new Error(`The file or folder ${file1} doesn't exists`);
        }

        if (fs.existsSync(file2)) {
            if (!overwrite) {
                throw new Error(`The destination file or folder ${file2} already exists`);
            }
            else {
                await this.breakpoint(`Deleting the existing file ${file2} before rename ${file1}`);
                const delCmd = new DelCommand(this.environment);
                delCmd.run(file2);
            }
        }

        fs.renameSync(file1, file2);

        return this.codes.success;
    }
}

module.exports = RenCommand;