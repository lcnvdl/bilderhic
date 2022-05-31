/* eslint-disable no-await-in-loop */
const fs = require("fs");
const CommandBase = require("../base/command-base");
const FileEditorsFactory = require("../../file-editors/file-editors.factory");

class OpenCommand extends CommandBase {
  async run(args) {
    const file = this.parsePath(args[0]);
    if (!fs.existsSync(file)) {
      throw new Error(`The file ${file} doesn't exists`);
    }

    let editor;

    if (args[1] && args[1] !== "") {
      editor = FileEditorsFactory.getEditor(args[1]);
      if (!editor) {
        throw new Error(`Cannot find the editor "${args[1]}".`);
      }
    }
    else {
      editor = FileEditorsFactory.getEditorByFormat(file);
      if (!editor) {
        throw new Error(`Cannot find an editor for the file "${file}".`);
      }
    }

    /** @type {string[]} */
    const lines = args.slice(2).map(m => {
      /** @type {string} */
      let final = m.trimLeft();
      if (final[0] === "-") {
        final = final.substr(1).trimLeft();
      }

      return final;
    });

    this.debug(`Open ${file}`);
    await this.breakpoint();

    editor.open(file);

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      let cmd = line;

      this.debug(` - ${cmd}`);
      await this.breakpoint();

      if (cmd.indexOf(" ") !== -1) {
        cmd = cmd.substr(0, cmd.indexOf(" ")).toLowerCase();
        line = line.substr(line.indexOf(" ") + 1);
      }

      if (cmd === "configure") {
        const selector = line.substr(0, line.indexOf("=")).trim();
        const value = this.environment.applyVariables(line.substr(line.indexOf("=") + 1));
        editor.configure(selector, value);
      }
      else if (cmd === "close") {
        editor.close();
      }
      else if (cmd === "save") {
        editor.save();
      }
      else if (editor.isObjectEditor) {
        if (cmd === "set") {
          const selector = line.substr(0, line.indexOf("=")).trim();
          const value = this.environment.applyVariables(line.substr(line.indexOf("=") + 1));
          editor.set(selector, value);
        }
        else if (cmd === "get") {
          let selector = line.substr(0, line.indexOf(">")).trim();
          let resultIndex = null;

          if (selector.includes(" ")) {
            resultIndex = selector.substr(0, selector.indexOf(" "));
            selector = selector.substr(selector.indexOf(" ") + 1).trim();
          }

          if (resultIndex !== null) {
            if (resultIndex === "first") {
              resultIndex = 0;
            }
            else if (resultIndex === "last") {
              resultIndex = -1;
            }
            else if (!Number.isNaN(resultIndex)) {
              resultIndex = +resultIndex;
            }
            else {
              await this.breakpoint({ error: `Unknown result index: ${resultIndex}` });
              return this.codes.invalidArguments;
            }
          }

          const envVarName = line.substr(line.indexOf(">") + 1).trim();
          let value = editor.get(selector);

          if (resultIndex !== null && Array.isArray(value) && typeof value !== "string") {
            if (resultIndex === -1) {
              resultIndex = value.length - 1;
            }

            value = value[resultIndex];
          }

          this.environment.setVariable(envVarName, value);
        }
        else if (cmd === "add") {
          const attribute = line.indexOf("=") !== -1;
          const selector = attribute ? line.substr(0, line.indexOf("=")).trim() : line;
          const value = attribute ? this.environment.applyVariables(line.substr(line.indexOf("=") + 1)) : undefined;
          editor.add(selector, value);
        }
        else {
          await this.breakpoint({ error: `Invalid command "${cmd}" for object editor` });
          return this.codes.invalidArguments;
        }
      }
      else if (cmd === "append") {
        line = this.environment.applyVariables(line);
        editor.append(line);
      }
      else if (cmd === "set") {
        const lineNumber = +(line.substr(0, line.indexOf(" ")));
        line = line.substr(line.indexOf(" ") + 1);
        line = this.environment.applyVariables(line);
        editor.setLine(lineNumber, line);
      }
      else if (cmd === "replace") {
        //  TODO Mejorar para cuando hay espacios en las palabras a reemplazar
        const spl = line.split(" ").map(m => this.environment.applyVariables(m));
        editor.replace(spl[0], spl[1]);
      }
      else if (cmd === "replaceone") {
        //  TODO Mejorar para cuando hay espacios en las palabras a reemplazar
        const spl = line.split(" ").map(m => this.environment.applyVariables(m));
        editor.replaceOne(spl[0], spl[1]);
      }
      else if (cmd === "replace:raw") {
        //  TODO Mejorar para cuando hay espacios en las palabras a reemplazar
        const spl = line.split(" ").map(m => this.environment.applyVariables(m));
        editor.replace(spl[0], spl[1], true);
      }
      else if (cmd === "replaceone:raw") {
        //  TODO Mejorar para cuando hay espacios en las palabras a reemplazar
        const spl = line.split(" ").map(m => this.environment.applyVariables(m));
        editor.replaceOne(spl[0], spl[1], true);
      }
      else {
        await this.breakpoint({ error: `Invalid command "${cmd}" for plain text editor` });
        return this.codes.invalidArguments;
      }
    }

    this.debug(`Close ${file}`);
    await this.breakpoint();

    editor.close();

    return this.codes.success;
  }
}

module.exports = OpenCommand;
