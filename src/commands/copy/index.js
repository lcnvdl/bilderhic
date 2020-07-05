const fse = require('fs-extra');
const CommandBase = require("../base/command-base");

class CopyCommand extends CommandBase {
    run(args) {
        if (!args || args.length === 0) {
            return this.codes.missingArguments;
        }

        if (args.length < 2) {
            return this.codes.invalidArguments;
        }

        let file1 = this.parsePath(args[0]);
        let file2 = this.parsePath(args[1]);
        let ignores = [];

        for (let i = 2; i < args.length; i++) {
            const arg = args[i];
            if (arg === "-i" || arg === "--ignore") {
                ignores.push(args[++i]);
            }
            else {
                return this.codes.invalidArguments;
            }
        }

        fse.copySync(file1, file2, {
            filter: (src, dest) => {
                if (ignores.length > 0) {
                    for (let ignore of ignores) {
                        if (src === ignore || src.endsWith("/" + ignore) || src.endsWith("\\" + ignore)) {
                            return false;
                        }
                    }
                }

                return true;
            }
        });

        return this.codes.success;
    }
}

module.exports = CopyCommand;