const child_process = require("child_process");
const CommandBase = require("../base/command-base");
const Log = require("../../log");

class RunCommand extends CommandBase {
  run(args) {
    return new Promise((resolve, reject) => {
      try {
        let command = args.join(" ");

        command = this.environment.applyVariables(command);

        const child = child_process.exec(command, { cwd: this.environment.cwd });

        child.stdout.setEncoding("utf8");
        child.stdout.on("data", data => {
          data = data.toString();
          Log.write(data);
        });

        child.stderr.setEncoding("utf8");
        child.stderr.on("data", data => {
          data = data.toString();
          Log.error(data);
        });

        child.on("close", code => {
          if (code === 0) {
            resolve(this.codes.success);
          }
          else {
            resolve(this.codes.error);
          }
        });
      }
      catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = RunCommand;
