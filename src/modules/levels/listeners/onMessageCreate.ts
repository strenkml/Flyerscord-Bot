import { Message } from "discord.js";

import ClientManager from "../../../common/managers/ClientManager.ts";
import { addMessage } from "../utils/leveling.ts";

export default (): void => {
  ClientManager.getInstance().client.on("messageCreate", async (message: Message) => {
    if (message.author.bot) return;
    if (!message.channel.isTextBased()) return;

    addMessage(message);
  });
};
