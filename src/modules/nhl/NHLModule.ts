import Module from "../../common/models/Module";
import SlashCommand from "../../common/models/SlashCommand";

export default class NHLModule extends Module {
  constructor() {
    super("NHL");
  }

  protected override setup(): void {
    this.readInCommands<SlashCommand>("slash");
  }
}