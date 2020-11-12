const fs = require("fs");

class IoContext {
  static exists(path) {
    return fs.existsSync(path);
  }
}

module.exports = IoContext;
