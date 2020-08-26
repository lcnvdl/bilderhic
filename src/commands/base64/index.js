const fse = require('fs-extra');
const CommandBase = require("../base/command-base");

class Base64Command extends CommandBase {
  async run(args) {
    if (!args || args.length === 0) {
      return this.codes.missingArguments;
    }

    let content = args[0];

    let outTo = null;

    if (typeof args[1] === "function") {
      outTo = args[1];
    }
    else if (args[1] === ">") {
      outTo = this.parsePath(args[2]);
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
