import Module from "../../common/models/Module.ts";
import SlashCommand from "../../common/models/SlashCommand.ts";

export default class UserManagementModule extends Module {
  constructor() {
    super("UserManagement");
  }

  protected override setup(): void {
    this.readInCommands<SlashCommand>("slash");
  }
}
