const fse = require("fs-extra");
const CommandBase = require("../base/command-base");

class CatCommand extends CommandBase {
  async run(args) {
    if (!args || args.length === 0) {
      return this.codes.missingArguments;
    }

    const origin = this.parsePath(args[0]);
    const content = fse.readFileSync(origin, "utf8");

    let outTo = null;

    if (args.length > 1) {
      const result = this.parseOrigin(args, 1);
      if (result.isOrigin) {
        outTo = result.outTo;
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
