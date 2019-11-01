const fs = require('fs');
const CommandBase = require("../base/command-base");

class RenCommand extends CommandBase {
    run(args) {
        let file1 = this.parsePath(args[0]);
        let file2 = this.parsePath(args[1]);

        if (!fs.existsSync(file1)) {
            throw new Error(`The file or folder ${file1} doesn't exists`);
        }

        if (fs.existsSync(file2)) {
            throw new Error(`The destination file or folder ${file2} already exists`);
        }

        fs.renameSync(file1, file2);
        
        return this.codes.success;
    }
}

module.exports = RenCommand;