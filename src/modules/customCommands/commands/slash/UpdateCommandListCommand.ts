import { ChatInputCommandInteraction } from "discord.js";
import { AdminSlashCommand } from "../../../../common/models/SlashCommand.ts";
import { updateCommandList } from "../../utils/util.ts";

export default class UpdateCommandListCommand extends AdminSlashCommand {
  constructor() {
    super("updatecustomlist", "Update the custom commands list");
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    updateCommandList();

    interaction.reply({
      content: "Custom Command List Updated!",
      ephemeral: true,
    });
  }
}
