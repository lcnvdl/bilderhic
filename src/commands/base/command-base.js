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
            missingArguments: -2,
            invalidArguments: -1,
            success: 0,
            error: 1
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
            let msg = "" + (err.error || err.message || err);
            throw new Error(`Error parsing "${_path}". ${msg + ""}.`);
        }
    }

    info(msg) {
        console.log(msg);
    }

    debug(msg, obj) {
        if (this.environment.settings.debug || this.environment.settings.verbose) {
            if (typeof obj === 'undefined') {
                console.log(msg);
            }
            else {
                console.log(msg, obj);
            }
        }
    }
}

module.exports = CommandBase;