/* eslint-disable no-restricted-syntax */
const md5File = require("md5-file");
const fse = require("fs-extra");
const fs = require("fs");
const glob = require("glob");
const path = require("path");
const CommandBase = require("../base/command-base");

class SyncCommand extends CommandBase {
  async run(args) {
    if (!args || args.length === 0) {
      return this.codes.missingArguments;
    }

    if (args.length < 2) {
      return this.codes.invalidArguments;
    }

    const file1 = this.parsePath(args[0]);
    const file2 = this.parsePath(args[1]);
    const ignores = [];

    if (!fs.existsSync(file2)) {
      fs.mkdirSync(file2);
    }

    if (isFile(file1) || isFile(file2)) {
      return this.codes.invalidArguments;
    }

    let quiet = false;

    this.debug(`Sync (mirror) "${file1}" to "${file2}"`);
    await this.breakpoint();

    for (let i = 2; i < args.length; i++) {
      const arg = args[i];
      if (arg === "-i" || arg === "--ignore") {
        ignores.push(args[++i]);
      }
      else if (arg === "-q" || arg === "--quiet") {
        quiet = true;
      }
      else {
        return this.codes.invalidArguments;
      }
    }

    const self = this;

    let ignored = 0;
    let copied = 0;
    let deleted = 0;

    let deleteFiles = [
      ...(await asyncGlob(path.join(file2, "*"))),
      ...(await asyncGlob(path.join(file2, "**/*"))),
    ].map(m => path.normalize(m));

    fse.copySync(file1, file2, {
      filter: (src, dest) => {
        const l = deleteFiles.length;
        deleteFiles = deleteFiles.filter(m => m !== path.normalize(dest));
        if (l !== deleteFiles.length) {
          self.debug(`The file ${dest} will not be deleted by the sync`);
        }

        if (ignores.length > 0) {
          for (const ignore of ignores) {
            if (src === ignore || src.endsWith(`/${ignore}`) || src.endsWith(`\\${ignore}`)) {
              ignored++;
              return false;
            }
          }
        }

        if (fs.existsSync(dest)) {
          if (isFile(src) && isFile(dest)) {
            const [hash1, hash2] = [
              md5File.sync(src),
              md5File.sync(dest),
            ];

            if (hash1 === hash2) {
              ignored++;
              self.debug(`The file ${src} will not be copied because has the same content as the destination.`);
              return false;
            }
          }
        }

        if (!quiet && (isFile(src) || (fs.existsSync(dest) && isFile(dest)))) {
          self.info(`Copy\t${src}`);
          self.info(`  =>\t${dest}`);
          copied++;
        }

        return true;
      },
    });

    deleteFiles = deleteFiles.filter(m => isFile(m));

    deleteFiles.forEach(d => {
      if (!quiet) {
        if (fs.existsSync(d)) {
          self.info(`Deleting file ${d}...`);
          deleted++;
          fs.unlinkSync(d);
        }
      }
    });

    self.info(" ");
    self.info(`Copied ${copied} files`);
    self.info(`Deleted ${deleted} files`);
    self.info(`Ignored ${ignored} files`);
    self.info(" ");

    return this.codes.success;
  }
}

function isFile(m) {
  return fs.lstatSync(m).isFile();
}

function asyncGlob(pattern) {
  return new Promise((resolve, reject) => {
    glob(pattern, (err, matches) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(matches);
      }
    });
  });
}

module.exports = SyncCommand;
