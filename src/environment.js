const path = require("path");

class Environment {
  /**
     * @param {string} [dir] Base directory
     */
  constructor(dir, settings) {
    this.variables = {};
    this._cwd = null;

    this.cwd = dir || process.cwd();

    const { verbose = false, debug = false } = settings || {};

    this.settings = { verbose, debug };
    this.parent = null;
  }

  get cwd() {
    return this._cwd;
  }

  set cwd(v) {
    this._cwd = v;
    if (this.variables.initialCwd) {
      this.variables.initialCwd = v;
    }
    this.variables.cwd = v;
    this.variables.WORKING_DIRECTORY = v;
  }

  get isDebugOrVerbose() {
    return this.isDebugEnabled || this.isVerboseEnabled;
  }

  get isDebugEnabled() {
    return this.settings.debug;
  }

  get isVerboseEnabled() {
    return this.settings.verbose;
  }

  setDebugMode(enabled) {
    this.settings.debug = enabled;
  }

  setFromProcess(process) {
    this.setVariables(process.env);
  }

  fork(subFolder) {
    let fork;

    if (!subFolder || subFolder === ".") {
      fork = new Environment(this.cwd, this.settings);
    }
    else {
      fork = new Environment(this.parsePath(subFolder), this.settings);
    }

    fork.parent = this;
    fork.variables = JSON.parse(JSON.stringify(this.variables));
    return fork;
  }

  parsePath(_path) {
    try {
      if (!_path) {
        return this.cwd;
      }
      let newPath = _path;
      newPath = this.applyVariables(_path);
      newPath = path.resolve(this.cwd, _path);
      return newPath;
    }
    catch (err) {
      throw new Error(`Error parsing "${_path}". ${`${err}`}.`);
    }
  }

  setVariable(key, value) {
    this.variables[key] = value;
  }

  /**
   * @param {*} newVariables New variables dictionary
   * @param {boolean} [clear] Clear all existing variables?
   */
  setVariables(newVariables, clear) {
    if (clear) {
      this.variables = newVariables;
    }
    else {
      this.variables = Object.assign(this.variables, newVariables);
    }
  }

  setDefaultVariable(id, value) {
    const existing = this.getVariable(id);
    if (typeof existing === "undefined") {
      this.setVariable(id, value);
    }
  }

  getVariable(id) {
    return this.getVariables()[id];
  }

  getVariables() {
    const variables = {};

    Object.keys(this.variables).forEach(k => {
      const variable = this.variables[k];

      if (typeof variable === "object") {
        extractVariables(variable, k).forEach(kv => {
          variables[kv.key] = kv.value;
        });
      }
      else {
        variables[k] = this.variables[k];
      }
    });

    return variables;
  }

  applyVariables(str) {
    if (!str) {
      return str;
    }

    let finalStr = str;
    const variables = this.getVariables();

    while (finalStr.indexOf("[$p") !== -1) {
      const i = finalStr.indexOf("[$p");
      const f1 = finalStr.indexOf("]", i + 1) + 1;
      const str2 = finalStr.substring(i, f1);

      //  TODO    Hacer recorrido hacia arriba
      console.warn("Experimental function.");

      const pVars = this.parent.getVariables();
      let key = str2.substr(str2.lastIndexOf(".") + 1);
      key = key.substr(0, key.lastIndexOf("]"));

      if (typeof pVars[key] !== "undefined") {
        finalStr = finalStr.replace(str2, `${pVars[key]}`);
      }
      else {
        finalStr = finalStr.replace(str2, "undefined");
      }
    }

    Object.keys(variables).forEach(key => {
      while (finalStr.includes(`[${key}]`) || finalStr.includes(`[${key}:`)) {
        let args = null;
        let keyWithArgs;

        if (finalStr.includes(`[${key}:`)) {
          args = finalStr.substr(finalStr.indexOf(`[${key}:`));
          args = args.substring(args.indexOf(":") + 1, args.indexOf("]"));
          keyWithArgs = `${key}:${args}`;
        }
        else {
          keyWithArgs = key;
        }

        let val = variables[key];

        if (typeof variables[key] === "function") {
          if (args) {
            if (args.includes(":")) {
              val = val(args.split(":"));
            }
            else {
              val = val(args);
            }
          }
          else {
            val = val();
          }
        }

        finalStr = finalStr.replace(`[${keyWithArgs}]`, `${val}`);
      }
    });

    finalStr = finalStr.split("\\[").join("[").split("\\]").join("]");

    /* if (finalStr.indexOf("[") !== -1 && finalStr.indexOf("]") !== -1) {
            throw new Error(`One or more undefined variables in path "${finalStr}"`);
        } */

    return finalStr;
  }
}

function extractVariables(obj, parentName) {
  const variables = [];

  Object.keys(obj).forEach(k => {
    if (typeof obj[k] === "object") {
      const subVariables = extractVariables(obj[k], k);

      subVariables.forEach(kv => {
        variables.push({
          key: `${parentName}.${kv.key}`,
          value: kv.value,
        });
      });
    }
    else {
      variables.push({
        key: `${parentName}.${k}`,
        value: obj[k],
      });
    }
  });

  return variables;
}

module.exports = Environment;
