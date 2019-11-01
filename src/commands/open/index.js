const fs = require('fs');
const CommandBase = require("../base/command-base");
const FileEditorsFactory = require("../../file-editors/file-editors.factory");

class OpenCommand extends CommandBase {
    run(args) {
        const file = this.parsePath(args[0]);
        if (!fs.existsSync(file)) {
            throw new Error(`The file ${file} doesn't exists`);
        }

        const editor = FileEditorsFactory.getEditor(file);
        if (!editor) {
            throw new Error(`Cannot find an editor for the file "${file}".`);
        }

        /** @type {string[]} */
        const lines = args.slice(1).map(m => {
            /** @type {string} */
            let final = m.trimLeft();
            if (final[0] === "-") {
                final = final.substr(1).trimLeft();
            }

            return final;
        });

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];

            let cmd = line;

            if (cmd.indexOf(" ") !== -1) {
                cmd = cmd.substr(0, cmd.indexOf(" ")).toLowerCase();
                line = line.substr(line.indexOf(" ") + 1);
            }

            if (cmd === "close") {
                editor.close();
            }
            else if (cmd === "save") {
                editor.save();
            }
            else if (editor.isObjectEditor) {
                if (cmd === "set") {
                    throw new Error("Not implemented");
                }
                else {
                    return this.codes.invalidArguments;
                }
            }
            else {
                if (cmd === "append") {
                    editor.append(line);
                }
                else {
                    return this.codes.invalidArguments;
                }
            }
        }

        return this.codes.success;
    }
}

module.exports = OpenCommand;