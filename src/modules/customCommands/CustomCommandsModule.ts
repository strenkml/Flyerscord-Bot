import Module from "../../common/models/Module.ts";
import SlashCommand from "../../common/models/SlashCommand.ts";
import TextCommand from "../../common/models/TextCommand.ts";
import onMessageCreate from "./listeners/onMessageCreate.ts";
import Imgur from "./utils/Imgur.ts";

export default class CustomCommandsModule extends Module {
  constructor() {
    super("CustomCommands");
  }

  protected override setup(): void {
    this.readInCommands<SlashCommand>("slash");
    this.readInCommands<TextCommand>("text");

    this.registerListeners();

    Imgur.getInstance();
  }

  private registerListeners(): void {
    onMessageCreate();
  }
}
