import Module from "../../common/models/Module.ts";
import SlashCommand from "../../common/models/SlashCommand.ts";

export default class DaysUntilModule extends Module {
  constructor() {
    super("DaysUntil");
  }

  protected override setup(): void {
    this.readInCommands<SlashCommand>("slash");
  }
}
