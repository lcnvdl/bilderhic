const DirectoryHelper = require("./helpers/directory-helper");

async function loadCommands() {
  const path = require("path");
  const glob = require("glob");
  const commands = require("./index");
  const CommandBase = require("./base/command-base");

  const dir = new DirectoryHelper();

  await new Promise((resolve, reject) => {
    glob(
      "**/entry-point.js",
      { cwd: dir.commandsDir },
      (err, matches) => {
        if (!err) {
          matches.forEach(match => {
            const file = match.substr(0, match.lastIndexOf("."));
            const entry = require(path.join(dir.commandsDir, file));
            const name = match.substr(0, match.indexOf("/"));

            commands[name] = entry({ CommandBase, commands });
          });

          resolve(commands);
        }
        else {
          console.error(err);
          reject(err);
        }
      },
    );
  });

  return commands;
}

module.exports = { loadCommands };
