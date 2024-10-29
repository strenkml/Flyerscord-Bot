import { IUserEvent } from "./IUserEvent.ts";

export interface IUserInfo {
  userId: string;
  warnings: Array<IUserEvent>;
  notes: Array<IUserEvent>;
}
