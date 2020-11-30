// eslint-disable-next-line camelcase
const child_process = require("child_process");
const CommandBase = require("../base/command-base");
const Log = require("../../log");

class RunCommand extends CommandBase {
  run(args) {
    return new Promise((resolve, reject) => {
      try {
        let skipArgs = 0;
        let silent = false;
        let tout = 0;

        while (args && args.length > 0 && args[skipArgs] && args[skipArgs].startsWith("-")) {
          if (args[skipArgs] === "-q" || args[skipArgs] === "--quiet") {
            silent = true;
          }
          else if (args[skipArgs] === "-t" || args[skipArgs] === "--timeout") {
            tout = +args[++skipArgs];
            if (tout < 0) {
              return this.codes.invalidArguments;
            }
          }
          else {
            return this.codes.invalidArguments;
          }

          skipArgs++;
        }

        let command = args.slice(skipArgs).join(" ");

        command = this.environment.applyVariables(command);

        const child = child_process.exec(command, { cwd: this.environment.cwd });

        let finished = false;

        if (tout && tout > 0) {
          setTimeout(() => {
            if (!finished) {
              finished = true;
              reject(new Error("Timeout"));
            }
          }, tout);
        }

        child.stdout.setEncoding("utf8");
        child.stdout.on("data", data => {
          const str = data.toString();
          if (!silent) {
            Log.write(str);
          }
        });

        child.stderr.setEncoding("utf8");
        child.stderr.on("data", data => {
          const str = data.toString();
          Log.error(str);
        });

        child.on("close", code => {
          if (finished) {
            reject(new Error("Timeout"));
          }
          else if (code === 0) {
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
