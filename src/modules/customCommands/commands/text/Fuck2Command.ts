import { Message } from "discord.js";
import TextCommand from "../../../../common/models/TextCommand.ts";
import { getRandomNumber } from "../../../../common/utils/misc.ts";
import discord from "../../../../common/utils/discord/discord.ts";

export default class Fuck2TextCommand extends TextCommand {
  constructor() {
    super("fuck2", "fuck2");
  }

  // deno-lint-ignore no-unused-vars
  async execute(message: Message, args: Array<string>): Promise<void> {
    const teams = ["Pens", "Pens", "Rags", "Rags", "Isles", "Bruins", "caps", "Devils"];
    const index = getRandomNumber(0, teams.length - 1);
    const team = teams[index];

    let outStr: string;
    if (team == "caps") {
      outStr = "fuck the caps!";
    } else {
      outStr = `Fuck the ${team}!`;
    }

    discord.messages.sendMessageToChannel(message.channel.id, outStr);
  }
}
