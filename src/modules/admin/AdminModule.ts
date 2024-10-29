import Module from "../../common/models/Module.ts";
import SlashCommand from "../../common/models/SlashCommand.ts";

export default class AdminModule extends Module {
  constructor() {
    super("Admin");
  }

  protected override setup(): void {
    this.readInCommands<SlashCommand>("slash");
  }
}
