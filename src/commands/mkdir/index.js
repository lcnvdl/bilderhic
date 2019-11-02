const fs = require('fs');
const CommandBase = require("../base/command-base");

class MkdirCommand extends CommandBase {
    run(args) {
        let directory = this.parsePath(args[0]);

        if (fs.existsSync(directory)) {
            return this.codes.success;
        }

        fs.mkdirSync(directory, { recursive: true });

        return this.codes.success;
    }
}

module.exports = MkdirCommand;