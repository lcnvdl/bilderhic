module.exports = ({ CommandBase }) => {
  class ExampleCommand extends CommandBase {
    async run(args) {
      console.log("Command Example", args);
    }
  }

  return ExampleCommand;
};
