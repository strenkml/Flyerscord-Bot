import Database from "../../../common/providers/Database";

export default class PlayerEmojisDB extends Database {
  private static instance: PlayerEmojisDB;

  private constructor() {
    super({ name: "player-emojis" });
  }

  static getInstance(): PlayerEmojisDB {
    return this.instance || (this.instance = new this());
  }

  addPlayer(playerName: number, emojiId: string): boolean {
    if (!this.hasPlayer(playerName)) {
      this.db.set(playerName.toString(), emojiId);
      return true;
    }
    return false;
  }

  hasPlayer(playerName: number): boolean {
    return this.db.has(playerName.toString());
  }

  clearPlayers(): void {
    this.db.clear();
  }

  getAllPlayers(): string[] {
    return this.getAllValues();
  }

  getAllPlayersIds(): number[] {
    return this.getAllKeys() as number[];
  }
}
