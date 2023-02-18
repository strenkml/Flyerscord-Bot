import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default abstract class SlashCommand {
  readonly data: SlashCommandBuilder;

  name: string;

  description: string;

  constructor(name: string, description: string) {
    this.name = name.toLowerCase();
    this.description = description;

    this.data = new SlashCommandBuilder().setName(this.name).setDescription(this.description);
  }

  protected getParameterValue(parameterName: string, interaction: ChatInputCommandInteraction): string {
    const val = interaction.options.get(parameterName)?.value;

    return val == undefined ? "" : val.toString();
  }

  abstract execute(interaction: ChatInputCommandInteraction): Promise<void>;
}
