const fse = require('fs-extra');
const CommandBase = require("../base/command-base");

class Base64Command extends CommandBase {
  async run(args) {
    if (!args || args.length === 0) {
      return this.codes.missingArguments;
    }

    let content = args[0];

    let outTo = null;

    if(args.length > 1) {
      if (typeof args[1] === "function") {
        outTo = args[1];
        this.debug("Base64 to a function");
      }
      else if (args[1] === ">") {
        outTo = this.parsePath(args[2]);
        this.debug("Base64 to a file");
      }
      else if (args[1] === ">>") {
        const key = args[2];
        outTo = (m => this.environment.setVariable(key, m));
        this.debug(`Base64 to environment variable ${key}`);
      }
      else {
        this.debug("Base64 to console");
      }
    }
    else {
      this.debug("Base64 to console");
    }

    await this.breakpoint();

    content = this.environment.applyVariables(content);
    const buff = new Buffer(content, 'base64');
    content = buff.toString('utf8');

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

module.exports = Base64Command;
