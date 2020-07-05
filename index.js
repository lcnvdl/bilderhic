#!/usr/bin/env node

if (!process.argv.slice(2).length) {
    console.log("bhic <file>")
    process.exit();
}

const Environment = require("./src/environment");
const Pipe = require("./src/commands/pipe/index");

let file;
let cwd;

let settings = {
    verbose: false,
    debug: false
};

for (let i = 0; i < process.argv.slice(2).length; i++) {
    let a = process.argv.slice(2)[i];
    if (a[0] === "-") {
        a = a.toLowerCase();
        if (a === "--debug" || a === "-d") {
            settings.debug = true;
        }
        else if (a === "--verbose" || a === "-vb") {
            settings.verbose = true;
        }
    }
    else if (!file) {
        file = a;
    }
    else if (!cwd) {
        cwd = a;
    }
    else {
        console.error("Wrong number of parameters.");
        return;
    }
}

cwd = cwd || process.cwd();

const env = new Environment(cwd, settings);

env.setFromProcess(process);

new Pipe(env).loadFromFile(file).then(() => {
    console.log("Program finished");
}, err => {
    console.error(err);
});
