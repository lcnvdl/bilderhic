/* eslint-disable no-restricted-syntax */
const fse = require("fs-extra");
const CommandBase = require("../base/command-base");

class CopyCommand extends CommandBase {
  async run(args) {
    if (!args || args.length === 0) {
      return this.codes.missingArguments;
    }

    if (args.length < 2) {
      return this.codes.invalidArguments;
    }

    let file1 = null;
    let file2 = null;
    const ignores = [];

    let quiet = false;

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg === "-i" || arg === "--ignore") {
        ignores.push(args[++i]);
      }
      else if (arg === "-q" || arg === "--quiet") {
        quiet = true;
      }
      else if (!file1) {
        file1 = this.parsePath(arg);
      }
      else if (!file2) {
        file2 = this.parsePath(arg);
      }
      else {
        return this.codes.invalidArguments;
      }
    }

    if (!file1 || !file2) {
      return this.codes.invalidArguments;
    }

    this.debug(`Copy "${file1}" to "${file2}"`);
    await this.breakpoint();

    const self = this;

    fse.copySync(file1, file2, {
      filter: (src, dest) => {
        if (ignores.length > 0) {
          for (const ignore of ignores) {
            if (src === ignore || src.endsWith(`/${ignore}`) || src.endsWith(`\\${ignore}`)) {
              return false;
            }
          }
        }

        if (!quiet) {
          self.info(src);
          self.info(` => ${dest}`);
        }

        return true;
      },
    });

    return this.codes.success;
  }
}

module.exports = CopyCommand;
