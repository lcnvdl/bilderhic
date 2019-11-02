/** @typedef {import("../../environment")} Environment */

const path = require("path");
const inquirer = require('inquirer');

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

    async breakpoint(message) {
        await breakpoint(this.environment, message);
    }
}

async function breakpoint(env, message) {
    if (!env) {
        console.warn("Breakpoint without environment. Ignored.");
        return;
    }

    if (!env.settings.debug)
        return;

    if (message) {
        if (message.error) {
            console.error(message.error);
        }
        else {
            console.log(message);
        }
    }

    let result = await inquirer.prompt([{ name: "Continue", type: "confirm", default: true }]);
    if (!result.Continue) {
        throw new Error("Interrupted");
    }
}

module.exports = CommandBase;