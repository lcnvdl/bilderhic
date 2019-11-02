const path = require("path");

class Environment {
    /**
     * @param {string} [dir] Base directory
     */
    constructor(dir, settings) {
        this.variables = {};
        this.cwd = dir || process.cwd();

        const { verbose = false, debug = false } = settings || {};

        this.settings = { verbose, debug };
    }

    fork(subFolder) {
        let fork = new Environment(this.parsePath(subFolder), this.settings);
        fork.variables = JSON.parse(JSON.stringify(this.variables));
        return fork;
    }

    parsePath(_path) {
        try {
            if (!_path) {
                return this.cwd;
            }

            _path = this.applyVariables(_path);
            _path = path.resolve(this.cwd, _path);
            return _path;
        }
        catch (err) {
            throw new Error(`Error parsing "${_path}". ${err + ""}.`);
        }
    }

    setVariables(newVariables, clear) {
        if (clear) {
            this.variables = newVariables;
        }
        else {
            this.variables = Object.assign(this.variables, newVariables);
        }
    }

    applyVariables(str) {
        let finalStr = str;
        let variables = {};

        Object.keys(this.variables).forEach(k => {
            if (typeof this.variables[k] === "object") {
                extractVariables(this.variables[k], k).forEach(kv => variables[kv.key] = kv.value);
            }
            else {
                variables[k] = this.variables[k];
            }
        });

        Object.keys(variables).forEach(key => {
            while (finalStr.indexOf(`[${key}]`) !== -1) {
                const val = variables[key];
                finalStr = finalStr.replace(`[${key}]`, `${val}`);
            }
        });

        if (finalStr.indexOf("[") !== -1 && finalStr.indexOf("]") !== -1) {
            throw new Error(`One or more undefined variables in path "${finalStr}"`);
        }

        return finalStr;
    }
}

function extractVariables(obj, parentName) {
    let variables = [];

    Object.keys(obj).forEach(k => {
        if (typeof obj[k] === "object") {
            let subVariables = extractVariables(obj[k], k);

            subVariables.forEach(kv => {
                variables.push({
                    key: parentName + "." + kv.key,
                    value: kv.value
                })
            });
        }
        else {
            variables.push({
                key: parentName + "." + k,
                value: obj[k]
            });
        }
    });

    return variables;
}

module.exports = Environment;