const fse = require('fs-extra');
const CommandBase = require("../base/command-base");

class CatCommand extends CommandBase {
  async run(args) {
    if (!args || args.length === 0) {
      return this.codes.missingArguments;
    }

    let origin = this.parsePath(args[0]);
    const content = fse.readFileSync(origin, "utf8");

    let outTo = null;

    if (args.length > 1) {
      if (typeof args[1] === "function") {
        outTo = args[1];
        this.debug("Cat to a function");
      }
      else if (args[1] === ">") {
        outTo = this.parsePath(args[2]);
        this.debug("Cat to a file");
      }
      else if (args[1] === ">>") {
        const key = args[2];
        outTo = (m => this.environment.setVariable(key, m));
        this.debug(`Cat to environment variable ${key}`);
      }
      else {
        this.debug("Cat to console");
      }
    }
    else {
      this.debug("Cat to console");
    }

    await this.breakpoint();


    if (outTo) {
      if (typeof outTo === "function") {
        outTo(content);
      }
      else {
        fse.writeFileSync(outTo, content, "utf8");
      }
    }
    else {
      this.info(content);
    }

    return this.codes.success;
  }
}

module.exports = CatCommand;
