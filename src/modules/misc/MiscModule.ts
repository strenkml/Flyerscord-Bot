import Module from "../../common/models/Module.ts";
import SlashCommand from "../../common/models/SlashCommand.ts";

export default class MiscModule extends Module {
  constructor() {
    super("Misc");
  }

  protected override setup(): void {
    this.readInCommands<SlashCommand>("slash");
  }
}
