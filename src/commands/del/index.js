const fs = require('fs');
const path = require('path');
const CommandBase = require("../base/command-base");

const deleteFolderRecursive = function (folder, self) {
    if (fs.existsSync(folder)) {

        fs.readdirSync(folder).forEach((file) => {
            const curPath = path.join(folder, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath, self);
            } else {
                fs.unlinkSync(curPath);
                self.info(`File ${curPath} deleted`);
            }
        });

        fs.rmdirSync(folder);
        self.info(`Folder ${folder} deleted`);
    }
};

class DelCommand extends CommandBase {
    run(args) {
        if (Array.isArray(args)) {
            args.forEach(arg => this.run(arg));
            return this.codes.success;
        }

        args = args.trim();

        if (args.indexOf(":/") !== -1 || args[0] === "/") {
            throw new Error("Operation not allowed");
        }

        let fileOrFolder = this.parsePath(args);

        if (!fs.existsSync(fileOrFolder)) {
            return;
        }

        if (fs.lstatSync(fileOrFolder).isDirectory()) {
            deleteFolderRecursive(fileOrFolder, this);
        }
        else {
            fs.unlinkSync(fileOrFolder);
            this.info(`File ${fileOrFolder} deleted`);
        }
    }
}

module.exports = DelCommand;