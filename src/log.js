/* eslint-disable no-console */
const colors = require("./theme")(true);

class Log {
  static write(a, b) {
    if (typeof b === "undefined") {
      console.log(a);
    }
    else {
      console.log(a, b);
    }
  }

  static info(a, b) {
    if (typeof b === "undefined") {
      console.log(a);
    }
    else {
      console.log(a, b);
    }
  }

  static verbose(a, b) {
    if (typeof b === "undefined") {
      console.log(colors.verbose(a));
    }
    else {
      console.log(colors.verbose(a), b);
    }
  }

  static success(a, b) {
    if (typeof b === "undefined") {
      console.log(colors.success(a));
    }
    else {
      console.log(colors.success(a), b);
    }
  }

  static debug(a, b) {
    if (typeof b === "undefined") {
      console.log(colors.debug(a));
    }
    else {
      console.log(colors.debug(a), b);
    }
  }

  static warn(a, b) {
    if (typeof b === "undefined") {
      console.warn(colors.warn(a));
    }
    else {
      console.warn(colors.warn(a), b);
    }
  }

  static error(a, b) {
    if (typeof b === "undefined") {
      console.error(colors.error(a));
    }
    else {
      console.error(colors.error(a), b);
    }
  }
}

module.exports = Log;
