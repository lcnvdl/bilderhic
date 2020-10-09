const fs = require("fs");
const CommandBase = require("../base/command-base");
const DelCommand = require("../del/index");

class RenCommand extends CommandBase {
  async run(args) {
    const file1 = this.parsePath(args[0]);
    const file2 = this.parsePath(args[1]);
    let overwrite = false;
    let skipUnexisting = false;

    for (let i = 2; i < args.length; i++) {
      if (args[i] === "--overwrite" || args[i] === "-w") {
        overwrite = true;
      }
      else if (args[i] === "--skip-unexisting" || args[i] === "-sk") {
        skipUnexisting = true;
      }
      else {
        return this.codes.invalidArguments;
      }
    }

    if (!fs.existsSync(file1)) {
      if (!skipUnexisting) {
        throw new Error(`The file or folder ${file1} doesn't exists`);
      }
      else {
        return this.codes.success;
      }
    }

    if (args[0] === args[1]) {
      return this.codes.success;
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
