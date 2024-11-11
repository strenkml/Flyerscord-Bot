import { TEAM_TRI_CODE } from "nhl-api-wrapper-ts/dist/interfaces/Common";
import Task from "../../../common/models/Task";
import nhlApi from "nhl-api-wrapper-ts";
import Time from "../../../common/utils/Time";
import LiveDataDB from "../providers/LiveData.Database";

export default class GameTodayTask extends Task {
  constructor() {
    // Run every day at 4:00 AM
    super("GameTodayTask", "0 4 * * *");
  }

  protected async execute(): Promise<void> {
    const res = await nhlApi.teams.schedule.getCurrentTeamSchedule({ team: TEAM_TRI_CODE.PHILADELPHIA_FLYERS });

    if (res.status == 200) {
      const game = res.data.games.find((game) => Time.isSameDay(new Date(), new Date(game.startTimeUTC)));

      if (game) {
        const db = LiveDataDB.getInstance();
        db.setCurrentGame(game.id);
        db.setGameStartMonitorTime(new Date(game.startTimeUTC));
      }
    }
  }
}
