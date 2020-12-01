const fs = require("fs");

class IoContext {
  constructor(env) {
    this.env = env;
  }

  exists(path) {
    const finalPath = this.env.parsePath(path);
    return fs.existsSync(finalPath);
  }
}

module.exports = IoContext;
