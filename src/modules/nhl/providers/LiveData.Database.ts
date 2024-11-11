import Stumper from "stumper";
import Database from "../../../common/providers/Database";

export default class LiveDataDB extends Database {
  private static instance: LiveDataDB;

  private readonly CURRENT_GAME_KEY = "currentGame";
  private readonly GAME_START_MONITOR_TIME_KEY = "gameStartMonitorTime";
  private readonly LAST_INDEX_KEY = "lastIndex";
  private readonly GOAL_INDEXES_THAT_NEED_HIGHLIGHT_KEY = "goalIndexesThatNeedHightlight";
  private readonly PERIOD_STARTS_KEY = "periodStarts";

  private constructor() {
    super({ name: "live-data" });
  }

  static getInstance(): LiveDataDB {
    return this.instance || (this.instance = new this());
  }

  setCurrentGame(gameId: number): void {
    Stumper.debug(`Setting current game to ${gameId}`, "nhl:LiveDataDB:setCurrentGame");
    this.resetDB();

    this.db.set(this.CURRENT_GAME_KEY, gameId);
  }

  addGoalThatNeedsHightlight(goalIndex: number): void {
    this.db.push(this.GOAL_INDEXES_THAT_NEED_HIGHLIGHT_KEY, goalIndex);
  }

  removeGoalThatNeedsHightlight(goalIndex: number): void {
    this.db.remove(this.GOAL_INDEXES_THAT_NEED_HIGHLIGHT_KEY, goalIndex);
  }

  setLastIndex(lastIndex: number): void {
    this.db.set(this.LAST_INDEX_KEY, lastIndex);
  }

  addPeriodStart(periodStart: number): void {
    this.db.push(this.PERIOD_STARTS_KEY, periodStart);
  }

  getCurrentGame(): number {
    return this.db.get(this.CURRENT_GAME_KEY);
  }

  getLastIndex(): number {
    return this.db.get(this.LAST_INDEX_KEY);
  }

  getGoalIndexesThatNeedHightlight(): number[] {
    return this.db.get(this.GOAL_INDEXES_THAT_NEED_HIGHLIGHT_KEY);
  }

  getPeriodStarts(): number[] {
    return this.db.get(this.PERIOD_STARTS_KEY);
  }

  hasPeriodStart(periodStart: number): boolean {
    return this.getPeriodStarts().includes(periodStart);
  }

  setGameStartMonitorTime(gameStartTime: Date): void {
    // Get time an hour before the game start time
    const gameStartMonitorTime = new Date(gameStartTime.getTime() - 1000 * 60 * 60);

    this.db.set(this.GAME_START_MONITOR_TIME_KEY, gameStartMonitorTime.getTime());
  }

  getGameStartMonitorTime(): Date {
    const gameStartMonitorTime = this.db.get(this.GAME_START_MONITOR_TIME_KEY);
    if (gameStartMonitorTime == -1) {
      return new Date(0);
    }
    return new Date(gameStartMonitorTime);
  }

  private resetDB(): void {
    this.db.clear();

    this.db.set(this.CURRENT_GAME_KEY, -1);
    this.db.set(this.GAME_START_MONITOR_TIME_KEY, -1);
    this.db.set(this.LAST_INDEX_KEY, -1);
    this.db.set(this.GOAL_INDEXES_THAT_NEED_HIGHLIGHT_KEY, []);
    this.db.set(this.PERIOD_STARTS_KEY, []);
  }
}
