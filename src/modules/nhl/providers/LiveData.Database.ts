import Database from "../../../common/providers/Database";

export default class LiveDataDB extends Database {
  private static instance: LiveDataDB;

  private constructor() {
    super({ name: "live-data" });
  }

  static getInstance(): LiveDataDB {
    return this.instance || (this.instance = new this());
  }
}
