import { Client, Message } from "discord.js";
import { exec } from "child_process";

import Logger from "../util/Logger";
import Config from "../config/Config";
import TextCommand from "../models/TextCommand";
import CustomCommandsDB from "../providers/CustomCommands.Database";
import UserLevelsDB from "../providers/UserLevels.Database";

export default (client: Client): void => {
  client.on("messageCreate", async (message: Message) => {
    addExpForUser(message);

    // Check if message is a Mee6 level up message
    checkLevelUpMessage(message);

    handleTextCommands(message);

    handleCustomCommands(message);
  });
};

function addExpForUser(message: Message): void {
  // Ignores all bots
  if (message.author.bot) return;
  // Ignores all messages not in a text channel
  if (!message.channel.isTextBased()) return;

  const db = UserLevelsDB.getInstance();
  db.addMessage(message.author.id);
}

function checkLevelUpMessage(message: Message): void {
  if (message.content.includes("you just advanced") && message.author.id == "796849687436066826") {
    const levelRegex = /level ([0-9]+)/;
    const regexMatches = message.content.match(levelRegex);
    if (regexMatches && regexMatches.length > 0) {
      const playerNumber = regexMatches[1];

      exec(
        `curl -s 'http://www.flyershistory.com/cgi-bin/rosternum.cgi?${playerNumber}' | hxnormalize -l 1024 -x | hxselect -c -s '\n' 'tbody tr td a font'`,
        (error, stdout, stderr) => {
          if (error) {
            Logger.error(error.message, "checkLevelUpMessage");
            return;
          }
          if (stderr) {
            Logger.error(stderr, "checkLevelUpMessage");
            return;
          }
          if (stdout.length != 0) {
            const names = createNamesMessage(stdout);
            message.channel.send(`Flyers players that have had the number **${playerNumber}**:\n${names}`);
          } else {
            message.channel.send(`No Flyers player has ever had the number **${playerNumber}**!`);
          }
        }
      );
    }
  }
}

function handleTextCommands(message: Message): void {
  const prefix = Config.getConfig().prefixes.normal;

  // Ignores all bots
  if (message.author.bot) return;
  // Ignores all messages not in a text channel
  if (!message.channel.isTextBased()) return;
  // Ignores messages that dont start with the prefix
  if (!message.content.startsWith(prefix)) return;

  const messageArray = message.content.split(" ");
  const command = messageArray[0];
  const args = messageArray.slice(1);

  const textCmd: TextCommand = message.client.textCommands.get(command.slice(prefix.length));
  try {
    if (textCmd) {
      textCmd.execute(message, args);
      Logger.info(`Command ${command} called!`, "handleTextCommands");
    }
  } catch (err) {
    Logger.error(`Message content: ${message.content}  Error: ${err}`, "handleTextCommands");
  }
}

function handleCustomCommands(message: Message): void {
  const prefix = Config.getConfig().prefixes.custom;

  // Ignores all bots
  if (message.author.bot) return;
  // Ignores all messages not in a text channel
  if (!message.channel.isTextBased()) return;
  // Ignores messages that dont start with the prefix
  if (!message.content.startsWith(prefix)) return;

  const messageArray = message.content.split(" ");
  const command = messageArray[0];

  const db = CustomCommandsDB.getInstance();
  const customCommand = db.getCommand(command.slice(prefix.length));

  if (customCommand) {
    message.channel.send(customCommand.text);
  }
}

function createNamesMessage(stdout: string): string {
  const spacing = 25;
  let result = "```\n";

  const names = stdout.split("\n");
  names.forEach((name, i) => {
    if (i != names.length - 1) {
      if (i % 2 == 0) {
        // Needs the spacing
        result = `${result}${name.padEnd(spacing)}`;
      } else {
        // In the second column
        result = `${result}${name}\n`;
      }
    }
  });
  return result + "```";
}
