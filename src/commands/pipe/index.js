/* eslint-disable no-await-in-loop */
/** @typedef {import("../../environment")} Environment */

const fs = require("fs");
const path = require("path");
const safeEval = require("safe-eval-2");
const wildcardMatch = require("wildcard-match");
const CommandBase = require("../base/command-base");
const { loadCommands } = require("../load-commands");
const OpenCommand = require("../open/index");
const CommandsExtractor = require("../helpers/commands-extractor");
const EvalContextGenerator = require("./eval/context-generator");
const Log = require("../../log");

let commands = null;

class Pipe extends CommandBase {
  /**
     * @param {Environment} env Environment
     * @param {string} [pipeId] Pipe ID
     */
  constructor(env, pipeId) {
    super(env);
    this.pipeId = pipeId || "1";
    /** @type {Promise<number>[]} */
    this.threads = [];
  }

  async loadFromFile(_path) {
    await this.load(fs.readFileSync(this.parsePath(_path), "utf8"));
  }

  /**
     * @param {string} content Content
     */
  async load(content) {
    this.info(`Running pipe "${this.pipeId}"`);

    if (!commands) {
      commands = await loadCommands();
    }

    await this.breakpoint();

    let str = content || "";
    str = str.split(":eol:").join("\n");
    str = str.split(":gt:").join(">");
    str = str.split(":dq:").join("\"");
    str = str.split(":sq:").join("'");
    str = str.split(":lt:").join("<");

    const instructions = str.split("\n")
      .map(m => m.trim())
      .filter(m => m && m !== "")
      .filter(m => m.indexOf("//") !== 0)
      .filter(m => m.indexOf("rem") !== 0);

    try {
      while (instructions.length > 0) {
        const current = instructions.shift();

        if (current && (["!bhic", "!bilderhic"].includes(current.trim().toLowerCase()))) {
          //  Ignore the line
        }
        else if (current[0] === ":") {
          const result = await this._processPipeCommand(current, instructions);
          if (result) {
            break;
          }
        }
        else {
          const code = await this._processCommand(current);
          const exitPipe = this._processCodes(current, code);

          if (exitPipe) {
            break;
          }
        }
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

  /**
   * @param {string} current Current CMD
   * @param {number} code Exit code
   * @returns {boolean} True if must exit pipe, false if not.
   */
  _processCodes(current, code) {
    if (code === this.codes.invalidArguments) {
      throw new Error(`Invalid arguments in instruction "${current}".`);
    }
    else if (code === this.codes.missingArguments) {
      throw new Error(`Missing arguments in instruction "${current}".`);
    }
    else if (code === this.codes.exitPipe) {
      return true;
    }
    else if (code === this.codes.exitProcess) {
      process.exit(0);
    }

    return false;
  }

  async _processCommand(currentCmd) {
    let current = (currentCmd || "").trim();
    let isAsync = false;

    if (current && current[0] === "~") {
      current = current.substr(1);
      isAsync = true;
    }

    const argumnts = CommandsExtractor.extract(current);

    const cmd = argumnts.shift();

    /** @type {CommandBase} */
    let CommandClass = commands[cmd];

    if (!CommandClass) {
      argumnts.unshift(cmd);
      CommandClass = commands.run;
    }

    const command = new CommandClass(this.environment);

    if (!(command instanceof CommandBase)) {
      throw new Error(`${command} (${current}) is not a Command`);
    }

    await this.breakpoint(`> ${current}`);

    if (isAsync) {
      this.threads.push(this._runProcess(command, argumnts));
      return this.codes.newThread;
    }

    return await this._runProcess(command, argumnts);
  }

  async _runProcess(command, argumnts) {
    const result = command.run(argumnts);

    if (result === this.codes.invalidArguments) {
      this.debugError(" - Invalid arguments");
    }
    else if (result === this.codes.missingArguments) {
      this.debugError(" - Missing arguments");
    }
    else {
      this.debugSuccess(" - Success");
    }

    if (result instanceof Promise) {
      return await result;
    }

    return result;
  }

  async _processPipeCommand(current, instructions) {
    const cmd = CommandsExtractor.extract(current);

    if (cmd[0] === ":each") {
      const isRecursive = cmd[2] && cmd[2].toLowerCase() === "recursive";
      const filter = (isRecursive ? cmd[3] : cmd[2]) || null;

      if (cmd[1] === "folder") {
        await this._pipeCmdEachFolder(instructions, isRecursive, filter);
        return instructions.length === 0;
      }
      if (cmd[1] === "file") {
        await this._pipeCmdEachFile(instructions, isRecursive, filter);
        return instructions.length === 0;
      }
    }
    else if (cmd[0] === ":pipeline") {
      this.info(current);
      await this.breakpoint();

      const inlineInstructions = `(${this.environment.applyVariables(current.substr(current.indexOf(" ") + 1).trim())})`;

      this.debug("Running inline pipe");
      await this.breakpoint();
      const fork = this.environment.fork();
      const pipe = new Pipe(fork, `${this.pipeId}.il`);
      await pipe.load(inlineInstructions);
    }
    else if (cmd[0] === ":break") {
      await this.breakpoint("Manual breakpoint");
    }
    else if (cmd[0] === ":begin") {
      this.debug("Begin");
    }
    else if (cmd[0] === ":end") {
      this.debug("End");
    }
    else if (cmd[0] === ":eval") {
      await this._evalCmd(current);
    }
    else if (cmd[0] === ":if") {
      await this._ifCmd(current, instructions);
    }
    else if (cmd[0] === ":logger") {
      if (cmd[1] && cmd[1].trim().toLowerCase() === "add") {
        const loggerClass = cmd[2];
        if (!loggerClass) {
          await this.breakpoint({ error: "Missing logger type." });
          return true;
        }

        const loggerName = cmd[3] || null;

        this.info(current);

        const loggerInstructions = [];

        if (loggerName) {
          loggerInstructions.push(`set name ${loggerName}`);
        }

        while (instructions.length > 0 && instructions[0].trim().length > 0 && instructions[0].trim()[0] === "-") {
          const instruction = instructions.shift();
          loggerInstructions.push(instruction);
          this.debug(` - Instruction added: ${instruction}`);
        }

        this.info("Running logger add command...");
        await this.breakpoint();

        Log.addLogger(loggerClass, loggerInstructions);

        this.info("Command success");
        await this.breakpoint();
      }
      else {
        await this.breakpoint({ error: "Wrong command." });
        return true;
      }
    }
    else if (cmd[0] === ":open") {
      const file = cmd[1].trim();
      let openSettings = null;

      if (cmd[2] && cmd[2] !== "") {
        openSettings = cmd[2].trim();
      }

      const openInstructions = [file, openSettings];

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
    else if (cmd[0] === ":await") {
      await this.breakpoint("Await");

      if (this.threads.length > 0) {
        const exitCodes = await Promise.all(this.threads);
        let exitPipe = false;

        exitCodes.forEach(code => {
          const localExitPipe = this._processCodes("$thread$", code);
          if (localExitPipe) {
            exitPipe = true;
          }
        });

        this.threads = [];

        await this.breakpoint("Exit pipe");
        if (exitPipe) {
          return true;
        }
      }
    }

    return false;
  }

  async _evalCmd(current) {
    this.debug(current);
    await this.breakpoint();

    const condition = `(${this.environment.applyVariables(current.substr(current.indexOf(" ") + 1).trim())})`;

    const extraContext = EvalContextGenerator.newContext(this.environment);

    const result = safeEval(condition, extraContext);

    this.debug("Eval result", result);

    this.environment.setVariable("$eval", result);
  }

  async _ifCmd(current, instructions) {
    this.debug(current);
    const condition = `(${this.environment.applyVariables(current.substr(current.indexOf(" ") + 1).trim())})`;

    await this.breakpoint();

    const extraContext = EvalContextGenerator.newContext(this.environment);

    const result = safeEval(condition, extraContext);

    this.debug(`Condition result: ${result}`);

    if (!result) {
      let next = instructions.shift();
      if (next === ":begin") {
        do {
          next = instructions.shift();
        }
        while (next !== ":end");
      }
    }

    if (this.environment.isVerboseEnabled) {
      this.verbose(`Inline if succed with ${result}`);
    }

    await this.breakpoint();
  }

  async _pipeCmdEachFolder(instructions, isRecursive, filter) {
    const rootFolder = this.environment.cwd;
    const folders = getDirectories(rootFolder, isRecursive, filter);
    let subPipeId = 1;

    let instructionsBlock;

    if (instructions[0] && instructions[0].trim().toLowerCase() === ":begin") {
      instructionsBlock = CommandsExtractor.extractBlock(instructions);
    }
    else {
      instructionsBlock = [...instructions];
      instructions.splice(0, instructions.length);
    }

    for (let i = 0; i < folders.length; i++) {
      this.debug(`Forking pipe to ${folders[i]}`);
      await this.breakpoint();

      const folderPath = folders[i];
      const dirname = path.basename(folderPath);

      const fork = this.environment.fork(folderPath);
      fork.setVariables({
        $currentFolder: dirname,
        $currentFolderPath: folderPath,
        $currentFolderAbsolutePath: path.resolve(folderPath),
        $foldersCount: folders.length,
        $folderIndex: i,
      });

      const pipe = new Pipe(fork, `${this.pipeId}.${subPipeId++}`);
      await pipe.load(instructionsBlock.join("\n"));
    }
  }

  async _pipeCmdEachFile(instructions, isRecursive, filter) {
    const folder = this.environment.cwd;
    const files = getFiles(folder, isRecursive, filter);
    let subPipeId = 1;

    let instructionsBlock;

    if (instructions[0] && instructions[0].trim().toLowerCase() === ":begin") {
      instructionsBlock = CommandsExtractor.extractBlock(instructions);
    }
    else {
      instructionsBlock = [...instructions];
      instructions.splice(0, instructions.length);
    }

    for (let i = 0; i < files.length; i++) {
      this.debug(`Forking pipe for file ${files[i]}`);
      await this.breakpoint();

      const filePath = files[i];
      const fileName = path.basename(filePath);
      const folderPath = path.dirname(filePath);
      const folderName = path.basename(folderPath);

      const fork = this.environment.fork();
      fork.setVariables({
        $currentFolder: folderName,
        $currentFolderPath: folderPath,
        $currentFile: fileName,
        $currentFilePath: filePath,
        $currentFileAbsolutePath: path.resolve(filePath),
        $filesCount: files.length,
        $fileIndex: i,
      });

      const pipe = new Pipe(fork, `${this.pipeId}.${subPipeId++}`);
      await pipe.load(instructionsBlock.join("\n"));
    }
  }
}

/**
 * Gets a list of directories.
 * @todo Put the method into a helper class.
 * @param {string} directory Root directory
 * @param {string} [isRecursive] Is recursive?
 * @param {string} [filter] Wilcard filter
 * @returns {string[]} Directories
 */
function getDirectories(directory, isRecursive, filter) {
  const folders = fs.readdirSync(directory)
    .filter(file => fs.statSync(`${directory}/${file}`).isDirectory())
    .map(m => path.join(directory, m));

  if (isRecursive) {
    folders.forEach(folder => {
      folders.push(...getDirectories(folder, true));
    });
  }

  if (filter && filter !== "*") {
    const isMatch = wildcardMatch(filter);
    return folders.filter(f => isMatch(f));
  }

  return folders;
}

/**
 * Gets a list of files.
 * @todo Put the method into a helper class.
 * @param {string} directory Root directory
 * @param {string} [isRecursive] Is recursive?
 * @param {string} [filter] Wilcard filter
 * @returns {string[]} Directories
 */
function getFiles(directory, isRecursive, filter) {
  const files = fs.readdirSync(directory)
    .filter(file => fs.statSync(`${directory}/${file}`).isFile())
    .map(m => path.join(directory, m));

  if (isRecursive) {
    const folders = getDirectories(directory, true);
    folders.forEach(folder => {
      files.push(...getFiles(folder, false));
    });
  }

  if (filter && filter !== "*") {
    const isMatch = wildcardMatch(filter);
    return files.filter(f => isMatch(f));
  }

  return files;
}

module.exports = Pipe;
