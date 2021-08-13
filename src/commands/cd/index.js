const fs = require("fs");
const CommandBase = require("../base/command-base");

let navigation = [];

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

    /** @type {Array<string>} */
    let folder = null;
    const clear = (args[0] === "--clear");
    const goBack = (args[0] === "--back");

    if (clear) {
      navigation = [];
      return this.codes.success;
    }

    if (goBack) {
      if (navigation.length === 0) {
        return this.codes.invalidArguments;
      }

      folder = navigation.pop();
    }

    folder = folder || this.parsePath(args[0]);

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

    if (!goBack) {
      navigation.push(this.environment.cwd);
    }

    this.environment.cwd = folder;

    return this.codes.success;
  }
}

module.exports = CdCommand;
