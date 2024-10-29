import Module from "../../common/models/Module";
import CreateGameDayPostTask from "./tasks/CreateGameDayPostTask";

export default class GameDayPostsModule extends Module {
  constructor() {
    super("GameDayPosts");
  }

  protected override async setup(): Promise<void> {
    this.registerSchedules();
  }

  private registerSchedules(): void {
    // Run every day at midnight
    new CreateGameDayPostTask().createScheduledJob();
  }
}
