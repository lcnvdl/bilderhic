const fs = require('fs');
const CommandBase = require("../base/command-base");
const YAML = require('yaml');

class EnvCommand extends CommandBase {
    run(args) {
        if (args[0] === "clear") {
            this.environment.variables = {};
            return this.codes.success;
        }
        else if (args[0] === "load") {
            const filename = this.parsePath(args[1]);
            const variables = YAML.parse(fs.readFileSync(filename, "utf8"));
            this.environment.setVariables(variables);
            return this.codes.success;
        }

        return this.codes.invalidArguments;
    }
}

module.exports = EnvCommand;