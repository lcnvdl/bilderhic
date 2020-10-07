#!/usr/bin/env node

const args = process.argv.slice(2);

if (!args.length) {
    console.log("bhic <file> [--debug or -d] [--verbose or -vb]")
    process.exit();
}

const Environment = require("./src/environment");
const Pipe = require("./src/commands/pipe/index");
const Log = require("./src/log");

let file;
let cwd;
let command = null;

let settings = {
    verbose: false,
    debug: false
};

for (let i = 0; i < args.length; i++) {
    let a = args[i];
    if (a[0] === "-") {
        a = a.toLowerCase();
        if (a === "--debug" || a === "-d") {
            settings.debug = true;
            Log.debug("Debug mode on");
        }
        else if (a === "--verbose" || a === "-vb") {
            settings.verbose = true;
            Log.verbose("Verbose mode on");
        }
        else if (a === "--command" || a === "-c") {
            command = "";
            for (let j = i + 1; j < args.length; j++) {
                command += " " + args[j];
            }

            command = command.trim();

            if (settings.verbose || settings.debug) {
                Log.debug("Command: " + command);
            }

            break;
        }
    }
    else if (!file) {
        file = a;
    }
    else if (!cwd) {
        cwd = a;
    }
    else {
        Log.error("Wrong number of parameters.");
        return;
    }
}

cwd = cwd || process.cwd();

const env = new Environment(cwd, settings);

env.setFromProcess(process);

const pipe = new Pipe(env);
let thread;

if (command) {
    thread = pipe.load(command);
}
else {
    thread = pipe.loadFromFile(file);
}

thread.then(() => {
    Log.success("Program finished");
}, err => {
    Log.error(err);
});
