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
        let fork = new Environment(this.parsePath(subFolder));
        fork.variables = JSON.parse(JSON.stringify(this.variables));
    }

    parsePath(_path) {
        try {
            if (!_path) {
                return this.cwd;
            }

            console.log(this.cwd, _path);
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

        Object.keys(this.variables).forEach(key => {
            while (finalStr.indexOf(`[${key}]`) !== -1) {
                const val = this.variables[key];
                finalStr = finalStr.replace(`[${key}]`, `[${val}]`);
            }
        });

        return finalStr;
    }
}

module.exports = Environment;