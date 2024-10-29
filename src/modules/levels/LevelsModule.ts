import Module from "../../common/models/Module.ts";
import SlashCommand from "../../common/models/SlashCommand.ts";
import onMessageCreate from "./listeners/onMessageCreate.ts";
import { calculateLevels } from "./utils/requiredExp.ts";

export default class LevelsModule extends Module {
  constructor() {
    super("Levels");
  }

  protected override setup(): void {
    this.readInCommands<SlashCommand>("slash");

    this.registerListeners();

    calculateLevels(1000);
  }

  private registerListeners(): void {
    onMessageCreate();
  }
}
