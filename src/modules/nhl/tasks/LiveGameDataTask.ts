import Task from "../../../common/models/Task";
import { checkLiveData } from "../utils/LiveData";

export default class LiveGameDataTask extends Task {
  private static instance: LiveGameDataTask;

  private constructor() {
    // Run every 5 seconds
    super("LiveGameDataTask", "*/5 * * * * *");
  }

  static getInstance(): LiveGameDataTask {
    return this.instance || (this.instance = new this());
  }

  protected async execute(): Promise<void> {
    await checkLiveData();
  }
}
