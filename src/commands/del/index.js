const fs = require("fs");
const path = require("path");
const CommandBase = require("../base/command-base");

const deleteFolderRecursive = function (folder, self) {
  if (fs.existsSync(folder)) {
    fs.readdirSync(folder).forEach(file => {
      const curPath = path.join(folder, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath, self);
      }
      else {
        fs.unlinkSync(curPath);
        self.info(`File ${curPath} deleted`);
      }
    });

    fs.rmdirSync(folder);
    self.info(`Folder ${folder} deleted`);
  }
};

class DelCommand extends CommandBase {
  constructor(env) {
    super(env);
    this.quiet = false;
  }

  run(args) {
    if (Array.isArray(args)) {
      if (args.some(m => m === "--quiet" || m === "-q")) {
        this.quiet = true;
        args = args.filter(m => m[0] !== "-");
      }

      args.forEach(arg => this.run(arg));
      return this.codes.success;
    }

    args = args.trim();

    if (args === "--quiet" || args === "-q") {
      return this.codes.invalidArguments;
    }

    if (args.indexOf(":/") !== -1 || args[0] === "/") {
      throw new Error("Operation not allowed");
    }

    const fileOrFolder = this.parsePath(args);

    if (!fs.existsSync(fileOrFolder)) {
      return this.codes.success;
    }

    if (fs.lstatSync(fileOrFolder).isDirectory()) {
      deleteFolderRecursive(fileOrFolder, this);
    }
    else {
      fs.unlinkSync(fileOrFolder);
      this.info(`File ${fileOrFolder} deleted`);
    }

    return this.codes.success;
  }

  info(m) {
    if (!this.quiet) {
      super.info(m);
    }
  }
}

module.exports = DelCommand;
