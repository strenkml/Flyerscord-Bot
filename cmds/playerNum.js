const { exec } = require("child_process");

module.exports.run = async (client, message, args) => {
  if (args.length >= 1) {
    // let regex = /level ([0-9]+)/;
    // let res = message.content.match(regex);
    let pNum = args[0];
    exec(
      `curl -s 'http://www.flyershistory.com/cgi-bin/rosternum.cgi?${pNum}' | hxnormalize -l 1024 -x | hxselect -c -s '\n' 'tbody tr td a font'`,
      (error, stdout, stderr) => {
        if (error) {
          logging.logError(`error: ${error.message}`, "playerNum");
          return;
        }
        if (stderr) {
          logging.logError(`error: ${stderr}`, "playerNum");
          return;
        }
        if (stdout.length != 0) {
          message.channel.send(
            `The following Flyers players have had the number ${pNum}:\n${stdout}`
          );
        } else {
          if (pNum == 0) {
            message.channel.send(
              `The following Flyers players have had the number ${pNum}:\nGritty`
            );
          } else {
            message.channel.send(
              `No Flyers player has ever had the number ${pNum}!`
            );
          }
        }
      }
    );
  } else {
    message.channel.send(`A player number is required.`);
  }
};

module.exports.help = {
  name: "pNum",
};
