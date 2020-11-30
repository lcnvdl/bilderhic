/* eslint-disable no-throw-literal */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-await-in-loop */
// eslint-disable-next-line camelcase
const child_process = require("child_process");
const CommandBase = require("../base/command-base");
const Log = require("../../log");

class RunCommand extends CommandBase {
  _extractArgs(args) {
    let skipArgs = 0;
    let silent = false;
    let tout = 0;
    let retries = 0;

    while (args && args.length > 0 && args[skipArgs] && args[skipArgs].startsWith("-")) {
      if (args[skipArgs] === "-q" || args[skipArgs] === "--quiet") {
        this.verbose("Silent mode ON");
        silent = true;
      }
      else if (args[skipArgs] === "-t" || args[skipArgs] === "--timeout") {
        tout = +args[++skipArgs];
        if (tout < 0) {
          return this.codes.invalidArguments;
        }

        this.verbose(`Timeout: ${tout}ms`);
      }
      else if (args[skipArgs] === "-r" || args[skipArgs] === "--retry" || args[skipArgs] === "--retries") {
        retries = +args[++skipArgs];
        if (retries < 0 || retries > 99 || Number.isNaN(retries)) {
          return this.codes.invalidArguments;
        }

        this.verbose(`Retries: ${retries} times`);
      }
      else {
        return this.codes.invalidArguments;
      }

      skipArgs++;
    }

    let command = args.slice(skipArgs).join(" ");
    command = this.environment.applyVariables(command);

    return { silent, retries, tout, command };
  }

  _run(silent, tout, command) {
    return new Promise((resolve, reject) => {
      try {
        const child = child_process.exec(command, { cwd: this.environment.cwd });

        let finished = false;

        if (tout && tout > 0) {
          setTimeout(() => {
            if (!finished) {
              finished = true;
              try {
                child.kill();
              }
              finally {
                reject(new Error("Timeout"));
              }
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

  async run(args) {
    // eslint-disable-next-line prefer-const
    let { silent, tout, retries, command } = this._extractArgs(args);

    let result = null;

    do {
      try {
        result = await this._run(silent, tout, command);
        this.verbose(`Finished with status code: ${result}`);

        if (result === this.codes.error) {
          throw "The process has exited with an error code";
        }
      }
      catch (err) {
        if (retries-- <= 0) {
          throw err;
        }
        else {
          await this.breakpoint(`Failed. Retrying... ${retries} left.`);
        }
      }
    }
    while (result === null || result === this.codes.error);

    return result;
  }
}

module.exports = RunCommand;
