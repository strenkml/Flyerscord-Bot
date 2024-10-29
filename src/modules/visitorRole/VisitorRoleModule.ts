import Module from "../../common/models/Module.ts";
import onGuildMemberAdd from "./listeners/onGuildMemberAdd.ts";
import { createVisitorRoleMessageIfNeeded } from "./utils/utils.ts";
import onMessageReactionAdd from "./listeners/onMessageReactionAdd.ts";
import onMessageReactionRemove from "./listeners/onMessageReactionRemove.ts";

export default class VistorRoleModule extends Module {
  constructor() {
    super("VistorRole");
  }

  protected override setup(): void {
    this.registerListeners();

    createVisitorRoleMessageIfNeeded();
  }

  private registerListeners(): void {
    onGuildMemberAdd();
    onMessageReactionAdd();
    onMessageReactionRemove();
  }
}
