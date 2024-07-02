import { ModalBuilder, ModalSubmitInteraction } from "discord.js";

export default abstract class ModalMenu {
  readonly data: ModalBuilder;

  id: string;
  title: string;

  constructor(id: string, title: string) {
    this.id = id;
    this.title = title;

    this.data = new ModalBuilder().setCustomId(this.id).setTitle(this.title);
  }

  abstract execute(interaction: ModalSubmitInteraction): Promise<void>;

  public getModal(): ModalBuilder {
    return this.data;
  }
}