import Module from "../../common/models/Module.ts";
import SlashCommand from "../../common/models/SlashCommand.ts";

export default class NHLModule extends Module {
  constructor() {
    super("NHL");
  }

  protected override setup(): void {
    this.readInCommands<SlashCommand>("slash");
  }
}
