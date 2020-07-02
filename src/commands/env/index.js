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
            this.debug(this.environment.variables);
            return this.codes.success;
        }
        else if (args[0] === "set") {
            const key = args[1];
            const value = args[2];
            const obj = {};
            obj[key] = this.environment.applyVariables(value);
            this.environment.setVariables(obj, false);
            this.debug(this.environment.variables);
            return this.codes.success;
        }
        else if (args[0] === "add") {

            let parent = 0;
            if (args[3]) {
                parent = +args[3];
            }

            let environment = this.environment;

            const key = args[1];
            const existing = environment.variables[key];

            while (parent-- > 0) {
                environment = environment.parent;
            }

            if (existing === undefined || existing === null) {
                this.debug("The environment variable " + key + " doesn't exists");
                return this.codes.error;
            }

            if (isNaN(existing)) {
                this.debug("The environment variable " + key + " is not a number");
                return this.codes.error;
            }

            let arg2 = this.environment.applyVariables(args[2]);

            if (arg2 === null || arg2 === undefined || isNaN(arg2)) {
                this.debug("The parameter is not a valid number");
                return this.codes.invalidArguments;
            }

            const value = +arg2;

            const obj = {};
            obj[key] = (+existing) + value;

            environment.setVariables(obj, false);
            this.debug(environment.variables);
            return this.codes.success;
        }

        return this.codes.invalidArguments;
    }
}

module.exports = EnvCommand;