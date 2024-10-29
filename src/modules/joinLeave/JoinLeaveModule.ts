import Module from "../../common/models/Module.ts";
import onGuildMemberAdd from "./listeners/onGuildMemberAdd.ts";
import onGuildMemberRemove from "./listeners/onGuildMemberRemove.ts";

export default class JoinLeaveModule extends Module {
  constructor() {
    super("JoinLeave");
  }

  protected override setup(): void {
    this.registerListeners();
  }

  private registerListeners(): void {
    onGuildMemberAdd();
    onGuildMemberRemove();
  }
}
