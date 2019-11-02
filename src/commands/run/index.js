const child_process = require("child_process");
const CommandBase = require("../base/command-base");

class RunCommand extends CommandBase {
    run(args) {
        return new Promise((resolve, reject) => {
            try {
                const command = args.join(" ");
                const child = child_process.exec(command, { cwd: this.environment.cwd });

                child.stdout.setEncoding('utf8');
                child.stdout.on('data', function (data) {
                    data = data.toString();
                    console.log(data);
                });

                child.stderr.setEncoding('utf8');
                child.stderr.on('data', function (data) {
                    data = data.toString();
                    console.error(data);
                });

                child.on('close', code => {
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
