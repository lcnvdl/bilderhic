/** @typedef {import("../../environment")} Environment */

const path = require("path");

class CommandBase {
    /**
     * @param {Environment} env Environment
     */
    constructor(env) {
        this.environment = env;
    }

    get command() {
        return null;
    }

    get codes() {
        return {
            missingArguments: -1,
            invalidArguments: 0,
            success: 1
        }
    }

    run(_args) {
        throw new Error("Not implemented");
    }

    parsePath(_path) {
        try {
            _path = this.environment.applyVariables(_path);
            _path = path.resolve(this.environment.cwd, _path);
            return _path;
        }
        catch (err) {
            throw new Error(`Error parsing "${_path}". ${err + ""}.`);
        }
    }

    info(msg) {
        console.log(msg);
    }

    debug(msg) {
        if (this.environment.settings.debug || this.environment.settings.verbose) {
            console.log(msg);
        }
    }
}

module.exports = CommandBase;