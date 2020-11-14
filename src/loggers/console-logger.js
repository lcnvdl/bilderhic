/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
const colors = require("../theme")(true);

const BaseLogger = require("./base-logger");

class ConsoleLogger extends BaseLogger {
  write(a, b) {
    if (typeof b === "undefined") {
      console.log(a);
    }
    else {
      console.log(a, b);
    }
  }

  info(a, b) {
    if (typeof b === "undefined") {
      console.log(a);
    }
    else {
      console.log(a, b);
    }
  }

  verbose(a, b) {
    if (typeof b === "undefined") {
      console.log(colors.verbose(a));
    }
    else {
      console.log(colors.verbose(a), b);
    }
  }

  success(a, b) {
    if (typeof b === "undefined") {
      console.log(colors.success(a));
    }
    else {
      console.log(colors.success(a), b);
    }
  }

  debug(a, b) {
    if (typeof b === "undefined") {
      console.log(colors.debug(a));
    }
    else {
      console.log(colors.debug(a), b);
    }
  }

  warn(a, b) {
    if (typeof b === "undefined") {
      console.warn(colors.warn(a));
    }
    else {
      console.warn(colors.warn(a), b);
    }
  }

  error(a, b) {
    if (typeof b === "undefined") {
      console.error(colors.error(a));
    }
    else {
      console.error(colors.error(a), b);
    }
  }
}

module.exports = ConsoleLogger;
