const CommandBase = require("../base/command-base");
const fs = require('fs');
const commands = require("../index");
const inquirer = require('inquirer');
const OpenCommand = require("../open/index");

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

        await breakpoint(this.environment);

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
                }

                // await breakpoint(this.environment);
            }
        }
        catch (error) {
            this.debug(`Pipe "${this.pipeId}" failed`);
            await breakpoint(this.environment, { error });
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
        await breakpoint(this.environment);

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
        }
        else if (cmd[0] === ":open") {
            const file = cmd[1].trim();

            let openInstructions = [file];

            this.debug(current);

            while (instructions.length > 0 && instructions[0].trim().length > 0 && instructions[0].trim()[0] === "-") {
                const instruction = instructions.shift();
                openInstructions.push(instruction);
                this.debug(` - Instruction added: ${instruction}`);
            }

            this.debug("Running open command...");
            await breakpoint(this.environment);

            const command = new OpenCommand(this.environment);
            const commandCode = command.run(openInstructions);

            if (commandCode !== this.codes.success) {
                await breakpoint(this.environment, { error: `Open command has exited with an error code: ${commandCode}.` });
                return true;
            }

            this.debug("Open command success");
            await breakpoint(this.environment);
        }

        return false;
    }

    async _pipeCmdEachFolder(instructions) {
        let folders = getDirectories(this.environment.cwd);
        let subPipeId = 1;

        for (let i = 0; i < folders.length; i++) {
            this.debug(`Forking pipe to ${folders[i]}`);
            await breakpoint(this.environment);

            const pipe = new Pipe(this.environment.fork(folders[i]), this.pipeId + "." + (subPipeId++));
            await pipe.load(instructions.join("\n"));
        }
    }
}

function getDirectories(path) {
    return fs.readdirSync(path).filter(file => fs.statSync(path + '/' + file).isDirectory());
}

async function breakpoint(env, message) {
    if (!env) {
        console.warn("Breakpoint without environment. Ignored.");
        return;
    }

    if (!env.settings.debug)
        return;

    if (message) {
        if (message.error) {
            console.error(message.error);
        }
        else {
            console.log(message);
        }
    }

    let result = await inquirer.prompt([{ name: "Continue", type: "confirm", default: true }]);
    if (!result.Continue) {
        throw new Error("Interrupted");
    }
}

module.exports = Pipe;