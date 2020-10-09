const fse = require("fs-extra");
const CommandBase = require("../base/command-base");

class Base64Command extends CommandBase {
  async run(args) {
    if (!args || args.length === 0) {
      return this.codes.missingArguments;
    }

    let content = args[0];

    let outTo = null;

    if (args.length > 1) {
      const result = this.parseOrigin(args, 1);

      if (result.isOrigin) {
        outTo = result.outTo;
      }
    }
    else {
      this.debug("Base64 to console");
    }

    await this.breakpoint();

    content = this.environment.applyVariables(content);
    const buff = new Buffer(content, "base64");
    content = buff.toString("utf8");

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
