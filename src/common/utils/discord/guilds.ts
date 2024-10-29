import { Guild } from "discord.js";
import ClientManager from "../../managers/ClientManager.ts";
import Config from "../../config/Config.ts";

export function getGuild(): Guild | undefined {
  const client = ClientManager.getInstance().client;
  return client.guilds.cache.get(Config.getConfig().masterGuildId);
}
