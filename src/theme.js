function getColors(safe) {
  const colors = require(safe ? "colors/safe" : "colors");

  colors.setTheme({
    silly: "rainbow",
    input: "grey",
    verbose: "cyan",
    prompt: "grey",
    info: "white",
    success: "green",
    data: "grey",
    help: "cyan",
    warn: "yellow",
    debug: "blue",
    error: "red",
  });

  return colors;
}

module.exports = getColors;
