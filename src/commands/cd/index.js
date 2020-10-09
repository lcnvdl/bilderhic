const fs = require("fs");
const path = require("path");
const CommandBase = require("../base/command-base");

class CdCommand extends CommandBase {
  run(args) {
    if (!args || args.length === 0) {
      this.info(this.environment.cwd);
      return this.codes.success;
    }

    const { isOrigin, outTo } = this.parseOrigin(args);

    if (isOrigin) {
      outTo(this.environment.cwd);
      return this.codes.success;
    }

    const folder = this.parsePath(args[0]);

    if (args[1] === "-t" || args[1] === "--test") {
      const result = this.parseOrigin(args, 2);
      let existence = true;

      if (!fs.existsSync(folder)) {
        existence = false;
      }
      else if (!fs.lstatSync(folder).isDirectory()) {
        existence = false;
      }

      if (result.isOrigin) {
        result.outTo(existence);
      }
      else if (existence) {
        this.success(`The folder ${folder} exists.`);
      }
      else {
        this.error(`The folder ${folder} doesn't exists.`);
      }

      return this.codes.success;
    }

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
