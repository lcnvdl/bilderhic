const fs = require("fs");
const os = require("os");
const path = require("path");

class DirectoryHelper {
    constructor() {
        if (fs.existsSync(this.home)) {
            if (!fs.existsSync(this.bhicHome)) {
                fs.mkdirSync(this.bhicHome);
            }

            if (!fs.existsSync(this.commandsDir)) {
                fs.mkdirSync(this.commandsDir);
            }
        }
    }

    get home() {
        return os.homedir();
    }

    get commandsDir() {
        return path.join(this.bhicHome, "commands");
    }

    get bhicHome() {
        return path.join(this.home, ".bilderhic");
    }
}

module.exports = DirectoryHelper;
