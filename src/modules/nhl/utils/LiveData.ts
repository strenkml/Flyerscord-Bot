import Stumper from "stumper";
import Time from "../../../common/utils/Time";
import LiveDataDB from "../providers/LiveData.Database";
import nhlApi from "nhl-api-wrapper-ts";

const PLAY_TYPES = {
  FACEOFF: 502,
  HIT: 503,
  GIVEAWAY: 504,
  GOAL: 505,
  SOG: 506,
  MISSED_SHOT: 507,
  BLOCKED_SHOT: 508,
  PENALTY: 509,
  STOPPAGE: 516,
  PERIOD_START: 520,
  PERIOD_END: 521,
  GAME_END: 524,
  TAKEAWAY: 525,
  DELAYED_PENALTY: 535,
};

export async function checkLiveData(): Promise<void> {
  const db = LiveDataDB.getInstance();

  const startMonitorTime = db.getGameStartMonitorTime();

  // Not past the start monitor time
  if (Time.timeUntil(startMonitorTime.getTime()) >= 0) {
    return;
  }

  // Game not set
  const currentGame = db.getCurrentGame();
  if (currentGame == -1) {
    return;
  }

  const playByPlayRes = await nhlApi.games.events.getPlayByPlay({ gameId: currentGame });

  // Failed to fetch play by play data for the game
  if (playByPlayRes.status != 200) {
    Stumper.error(`Error fetching play by play data for game ${currentGame}`, "nhl:LiveData:checkLiveData");
    return;
  }
  const playByPlay = playByPlayRes.data;

  // Game is not in progress
  if (playByPlay.gameState == "FUT") {
    Stumper.debug(`Game ${currentGame} hasn't started yet!`, "nhl:LiveData:checkLiveData");
    return;
  }

  // Check past goals for highlights
  const goalIndexesThatNeedHightlight = db.getGoalIndexesThatNeedHightlight();
  for (const goalIndex of goalIndexesThatNeedHightlight) {
    const play = playByPlay.plays.at(goalIndex);
    if (play && play.typeCode == PLAY_TYPES.GOAL) {
      // TODO: Implement
      db.removeGoalThatNeedsHightlight(goalIndex);
    }
  }

  // Check plays since last index
  const playsSinceLastIndex = playByPlay.plays.slice(db.getLastIndex() + 1);
  for (const play of playsSinceLastIndex) {
    switch (play.typeCode) {
      case PLAY_TYPES.PERIOD_START:
        // TODO: Implement
        break;
      case PLAY_TYPES.GAME_END:
        // TODO: Implement
        break;
      case PLAY_TYPES.GOAL:
        // TODO: Implement
        break;
      default:
        continue;
    }
  }

  db.setLastIndex(playByPlay.plays.length - 1);
}
