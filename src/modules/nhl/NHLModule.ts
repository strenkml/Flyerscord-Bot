import Module from "../../common/models/Module";
import SlashCommand from "../../common/models/SlashCommand";
import LiveGameDataTask from "./tasks/LiveGameDataTask";

export default class NHLModule extends Module {
  constructor() {
    super("NHL");
  }

  protected override async setup(): Promise<void> {
    await this.readInCommands<SlashCommand>(__dirname, "slash");

    this.registerTasks();
  }

  private registerTasks(): void {
    LiveGameDataTask.getInstance().createScheduledJob();
  }
}
