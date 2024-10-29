import { AttachmentBuilder, bold } from "discord.js";
import ClientManager from "../../../common/managers/ClientManager";
import discord from "../../../common/utils/discord/discord";
import Config from "../../../common/config/Config";
import Stumper from "stumper";

export default (): void => {
  ClientManager.getInstance().client.on("guildMemberRemove", async (member) => {
    const username = member.displayName || member.user.username;
    const message = `${bold(username)} has just left the server! Typical Pens fan ${bold(username)}...`;

    await discord.messages.sendMessageAndAttachmentToChannel(
      Config.getConfig().joinLeaveMessageChannelId,
      message,
      new AttachmentBuilder("https://imgur.com/dDrkXV6"),
    );
    Stumper.info(`User ${username} has left the server!`, "onGuildMemberRemove");
  });
};
