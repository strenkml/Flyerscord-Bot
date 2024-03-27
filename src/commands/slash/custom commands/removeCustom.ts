import { ChatInputCommandInteraction } from "discord.js";

import { AdminSlashCommand, PARAM_TYPES } from "../../../models/SlashCommand";
import CustomCommandsDB from "../../../providers/CustomCommands.Database";
import Config from "../../../config/Config";

export default class RemoveCustomCommand extends AdminSlashCommand {
  constructor() {
    super("removecustom", "Remove a custom command");

    this.data.addStringOption((option) =>
      option
        .setName("name")
        .setDescription(`The name of the command. Case insensitive`)
        .setRequired(true),
    );
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const db = CustomCommandsDB.getInstance();

    let name: string = this.getParamValue(
      interaction,
      PARAM_TYPES.STRING,
      "name",
    );

    name = name.toLowerCase();

    if (!db.hasCommand(name)) {
      interaction.reply({
        content: `Command ${Config.getConfig().prefixes.custom}${name} does not exist!`,
        ephemeral: true,
      });
      return;
    }

    db.removeCommand(name);
    interaction.reply({
      content: `Command ${Config.getConfig().prefixes.custom}${name} removed!`,
      ephemeral: true,
    });
  }
}