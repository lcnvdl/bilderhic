/* eslint-disable no-restricted-syntax */
const md5File = require("md5-file");
const fse = require("fs-extra");
const fs = require("fs");
const glob = require("glob");
const path = require("path");
const CommandBase = require("../base/command-base");

class SyncCommand extends CommandBase {
  constructor(env) {
    super(env);
    this._fs = fs;
    this._fse = fse;
    this._glob = glob;
  }

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

    if (!this._fs.existsSync(file2)) {
      this._fs.mkdirSync(file2);
    }

    if (this.isFile(file1) || this.isFile(file2)) {
      return this.codes.invalidArguments;
    }

    let quiet = false;
    let canDelete = true;
    let compareBy = "hash";

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
      else if (arg === "-nd" || arg === "--disable-delete") {
        canDelete = false;
      }
      else if (arg === "--compare-by") {
        compareBy = args[++i];
        if (compareBy !== "hash" && compareBy !== "default" && compareBy !== "date-and-size") {
          return this.codes.invalidArguments;
        }
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
      ...(await this.asyncGlob(path.join(file2, "*"))),
      ...(await this.asyncGlob(path.join(file2, "**/*"))),
    ].map(m => path.normalize(m));

    const ignoredFolders = [];

    this._fse.copySync(file1, file2, {
      filter: (src, dest) => {
        const l = deleteFiles.length;
        deleteFiles = deleteFiles.filter(m => m !== path.normalize(dest));
        if (l !== deleteFiles.length) {
          self.debug(`The file ${dest} will not be deleted by the sync`);
        }

        if (ignores.length > 0) {
          for (const ignore of ignores) {
            if (ignore.includes("*")) {
              const isStart = ignore[0] === "*";
              const strIgnore = ignore.split("*").join("").toLowerCase();

              if ((isStart && src.toLowerCase().endsWith(strIgnore)) || (!isStart && src.toLowerCase().startsWith(strIgnore))) {
                if (!self.isFile(src)) {
                  ignoredFolders.push(dest);
                }

                ignored++;
                return false;
              }
            }
            else if (src === ignore || src.endsWith(`/${ignore}`) || src.endsWith(`\\${ignore}`)) {
              if (!self.isFile(src)) {
                ignoredFolders.push(dest);
              }

              ignored++;
              return false;
            }
          }
        }

        if (self._fs.existsSync(dest)) {
          if (self.isFile(src) && self.isFile(dest)) {
            if (self.shouldSkipFile(src, dest, compareBy)) {
              ignored++;
              self.debug(`The file ${src} will not be copied because has the same content as the destination.`);
              return false;
            }
          }
        }

        if (!quiet && (this.isFile(src) || (this._fs.existsSync(dest) && this.isFile(dest)))) {
          self.info(`Copy\t${src}`);
          self.info(`  =>\t${dest}`);
          copied++;
        }

        return true;
      },
    });

    if (canDelete) {
      deleteFiles = deleteFiles.filter(m => this.isFile(m));
    }
    else {
      ignored += deleteFiles.length;
      deleteFiles = [];
    }

    deleteFiles.forEach(d => {
      if (ignoredFolders.some(m => d.startsWith(m))) {
        // if (!quiet) {
        //  self.info(`The file ${d} was not deleted because the folder was ignored.`);
        // }
        return;
      }

      if (this._fs.existsSync(d)) {
        if (!quiet) {
          self.info(`Deleting file ${d}...`);
        }

        deleted++;
        this._fs.unlinkSync(d);
      }
    });

    self.info(" ");
    self.info(`Copied ${copied} files`);
    self.info(`Deleted ${deleted} files`);
    self.info(`Ignored ${ignored} files`);
    self.info(" ");

    return this.codes.success;
  }

  isFile(m) {
    return this._fs.lstatSync(m).isFile();
  }

  getFileSize(filePath) {
    return this._fs.statSync(filePath).size;
  }

  shouldSkipFile(src, dest, compareBy) {
    const srcSize = this.getFileSize(src);
    const destSize = this.getFileSize(dest);

    if (compareBy === "date-and-size") {
      if (srcSize === destSize) {
        const srcMtime = this._fs.statSync(src).mtime.getTime();
        const destMtime = this._fs.statSync(dest).mtime.getTime();
        return srcMtime === destMtime;
      }
      return false;
    }

    // default and hash strategies
    if (srcSize === destSize) {
      const [hash1, hash2] = [
        md5File.sync(src),
        md5File.sync(dest),
      ];
      return hash1 === hash2;
    }
    return false;
  }

  asyncGlob(pattern) {
    return new Promise((resolve, reject) => {
      this._glob(pattern, (err, matches) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(matches);
        }
      });
    });
  }
}

module.exports = SyncCommand;
