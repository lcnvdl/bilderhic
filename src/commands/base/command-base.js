/** @typedef {import("../../environment")} Environment */

const path = require("path");
const inquirer = require('inquirer');
const Log = require("../../log");

class CommandBase {
    /**
     * @param {Environment} env Environment
     */
    constructor(env) {
        this.environment = env;
    }

    get codes() {
        return {
            missingArguments: -2,
            invalidArguments: -1,
            success: 0,
            error: 1,
            exitPipe: 10,
            exitProcess: 11
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

    /**
     * @param {Array} args Args
     * @param {number} [offset] Offset
     */
    parseOrigin(args, offset) {
        const index = (offset || 0);
        let outTo = null;
        let isOrigin = null;

        if (args.length > index) {
            if (typeof args[index] === "function") {
                outTo = args[index];
                isOrigin = true;
                this.debug("Command to a function");
            }
            else if (args[index] === ">") {
                outTo = this.parsePath(args[index + 1]);
                isOrigin = true;
                this.debug("Command to a file");
            }
            else if (args[index] === ">>") {
                const key = args[index + 1];
                outTo = (m => this.environment.setVariable(key, m));
                isOrigin = true;
                this.debug(`Command to environment variable ${key}`);
            }
            else {
                isOrigin = false;
            }
        }

        return {
            isOrigin,
            outTo
        };
    }

    info(msg) {
        Log.info(msg);
    }

    verbose(msg) {
        Log.verbose(msg);
    }

    debug(msg, obj) {
        if (this.environment.isDebugOrVerbose) {
            if (typeof obj === 'undefined') {
                Log.debug(msg);
            }
            else {
                Log.debug(msg, obj);
            }
        }
    }

    debugError(msg, obj) {
        if (this.environment.isdebugorverbose) {
            if (typeof obj === 'undefined') {
                Log.error(msg);
            }
            else {
                Log.error(msg, obj);
            }
        }
    }

    debugSuccess(msg, obj) {
        if (this.environment.isdebugorverbose) {
            if (typeof obj === 'undefined') {
                Log.success(msg);
            }
            else {
                Log.success(msg, obj);
            }
        }
    }

    async breakpoint(message) {
        await breakpoint(this.environment, message);
    }
}

/**
 * @param {Environment} env Environment
 * @param {string} message Message
 */
async function breakpoint(env, message) {
    if (!env) {
        Log.warn("Breakpoint without environment. Ignored.");
        return;
    }

    if (!env.isDebugEnabled) {
        return;
    }

    if (message) {
        if (message.error) {
            Log.error(message.error);
        }
        else {
            Log.debug(message);
        }
    }

    let result = await inquirer.prompt([{ name: "Continue", type: "confirm", default: true }]);
    if (!result.Continue) {
        throw new Error("Interrupted");
    }
}

module.exports = CommandBase;