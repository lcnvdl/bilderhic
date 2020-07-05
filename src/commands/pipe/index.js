const CommandBase = require("../base/command-base");
const fs = require('fs');
const path = require("path");
const commands = require("../index");
const OpenCommand = require("../open/index");
const safeEval = require('safe-eval');

class Pipe extends CommandBase {
    constructor(env, pipeId) {
        super();
        this.pipeId = pipeId || "1";
        this.environment = env;
    }

    async loadFromFile(path) {
        await this.load(fs.readFileSync(this.parsePath(path), "utf8"));
    }

    /**
     * @param {string} str Content
     */
    async load(str) {
        this.info(`Running pipe "${this.pipeId}"`);

        await this.breakpoint();

        let instructions = str.split("\n")
            .map(m => m.trim())
            .filter(m => m && m !== "")
            .filter(m => m.indexOf("//") !== 0)
            .filter(m => m.indexOf("rem") !== 0);

        try {
            while (instructions.length > 0) {
                let current = instructions.shift();

                if (current[0] === ":") {
                    let result = await this._processPipeCommand(current, instructions);
                    if (result) {
                        break;
                    }
                }
                else {
                    let code = await this._processCommand(current);
                    if (code === this.codes.invalidArguments) {
                        throw new Error(`Invalid arguments in instruction "${current}".`);
                    }
                    else if (code === this.codes.missingArguments) {
                        throw new Error(`Missing arguments in instruction "${current}".`);
                    }
                    else if (code === this.codes.exitPipe) {
                        break;
                    }
                    else if (code === this.codes.exitProcess) {
                        process.exit(0);
                    }
                }

                // await this.breakpoint();
            }
        }
        catch (error) {
            this.debug(`Pipe "${this.pipeId}" failed`);
            await this.breakpoint({ error });
            throw error;
        }

        this.debug(`Pipe "${this.pipeId}" finished successfully`);

        return this.codes.success;
    }

    async _processCommand(current) {
        let cmds = current.split(" ");

        const cmd = cmds.shift();

        /** @type {CommandBase} */
        let CommandClass = commands[cmd];

        if (!CommandClass) {
            cmds.unshift(cmd);
            CommandClass = commands.run;
        }

        let command = new CommandClass(this.environment);

        if (!(command instanceof CommandBase)) {
            throw new Error(`${command} (${current}) is not a Command`);
        }

        this.info("> " + current);
        await this.breakpoint();

        let result = command.run(cmds);

        this.debug(" - " + (result === this.codes.invalidArguments ? "Invalid arguments" : (result === this.codes.missingArguments ? "Missing arguments" : "Success")));

        if (result instanceof Promise) {
            return await result;
        }

        return result;
    }

    async _processPipeCommand(current, instructions) {
        let cmd = current.split(" ");

        if (cmd[0] === ":each") {
            if (cmd[1] === "folder") {
                await this._pipeCmdEachFolder(instructions);
                return true;
            }
            else if (cmd[1] === "file") {
                await this._pipeCmdEachFile(instructions);
                return true;
            }
        }
        else if (cmd[0] === ":break") {
            await this.breakpoint("Manual breakpoint");
        }
        else if (cmd[0] === ":eval") {
            this.info(current);
            await this.breakpoint();

            const condition = "(" + this.environment.applyVariables(current.substr(current.indexOf(" ") + 1).trim()) + ")";

            const result = safeEval(condition);

            this.environment.setVariable("$eval", result);
        }
        else if (cmd[0] === ":if") {
            this.info(current);

            const condition = "(" + this.environment.applyVariables(current.substr(current.indexOf(" ") + 1).trim()) + ")";

            await this.breakpoint();

            const result = safeEval(condition);

            if (!result) {
                instructions.shift();
            }

            this.info(`Inline if eq command success with ${result}`);
            await this.breakpoint();
        }
        else if (cmd[0] === ":open") {
            const file = cmd[1].trim();

            let openInstructions = [file];

            this.info(current);

            while (instructions.length > 0 && instructions[0].trim().length > 0 && instructions[0].trim()[0] === "-") {
                const instruction = instructions.shift();
                openInstructions.push(instruction);
                this.debug(` - Instruction added: ${instruction}`);
            }

            this.info("Running open command...");
            await this.breakpoint();

            const command = new OpenCommand(this.environment);
            const commandCode = await command.run(openInstructions);

            if (commandCode !== this.codes.success) {
                await this.breakpoint({ error: `Open command has exited with an error code: ${commandCode}.` });
                return true;
            }

            this.info("Open command success");
            await this.breakpoint();
        }

        return false;
    }

    async _pipeCmdEachFolder(instructions) {
        const rootFolder = this.environment.cwd;
        let folders = getDirectories(rootFolder);
        let subPipeId = 1;

        for (let i = 0; i < folders.length; i++) {
            this.debug(`Forking pipe to ${folders[i]}`);
            await this.breakpoint();

            const dirname = folders[i];

            const fork = this.environment.fork(dirname);
            fork.setVariables({
                "$currentFolder": dirname,
                "$currentFolderPath": path.join(rootFolder, dirname),
                "$currentFolderAbsolutePath": path.resolve(path.join(rootFolder, dirname)),
                "$foldersCount": folders.length,
                "$folderIndex": i
            });
            const pipe = new Pipe(fork, this.pipeId + "." + (subPipeId++));
            await pipe.load(instructions.join("\n"));
        }
    }

    async _pipeCmdEachFile(instructions) {
        const folder = this.environment.cwd;
        let files = getFiles(folder);
        let subPipeId = 1;

        for (let i = 0; i < files.length; i++) {
            this.debug(`Forking pipe for file ${files[i]}`);
            await this.breakpoint();
            const fork = this.environment.fork();
            fork.setVariables({
                "$currentFile": files[i],
                "$currentFilePath": path.join(folder, files[i]),
                "$currentFileAbsolutePath": path.resolve(path.join(folder, files[i])),
                "$filesCount": files.length,
                "$fileIndex": i
            });
            const pipe = new Pipe(fork, this.pipeId + "." + (subPipeId++));
            await pipe.load(instructions.join("\n"));
        }
    }
}

function getDirectories(path) {
    return fs.readdirSync(path).filter(file => fs.statSync(path + '/' + file).isDirectory());
}

function getFiles(path) {
    return fs.readdirSync(path).filter(file => fs.statSync(path + '/' + file).isFile());
}

module.exports = Pipe;