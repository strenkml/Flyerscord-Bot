/* -------------------------------------------------------------------------- */
/*                                Setup Stumper                                */
/* -------------------------------------------------------------------------- */
import Stumper, { LOG_LEVEL } from "stumper";
Stumper.setConfig({ logLevel: LOG_LEVEL.ALL });

/* -------------------------------------------------------------------------- */
/*                        Setup Process Error Handling                        */
/* -------------------------------------------------------------------------- */
import processErrorHandling from "./common/listeners/processErrorHandling.ts";

processErrorHandling();

/* -------------------------------------------------------------------------- */
/*                                Check Config                                */
/* -------------------------------------------------------------------------- */
import Config from "./common/config/Config.ts";

if (!Config.fileExists()) {
  Stumper.error("Config file not found", "main");
  process.exit(1);
}

Stumper.setConfig({ logLevel: Config.getConfig().logLevel });

/* -------------------------------------------------------------------------- */
/*                            Create Discord Client                           */
/* -------------------------------------------------------------------------- */
import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";

const client = new Client({
  intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
  partials: [Partials.Message, Partials.Reaction, Partials.User],
});

/* -------------------------------------------------------------------------- */
/*                        Setup Discord Error Handling                        */
/* -------------------------------------------------------------------------- */
import discordErrorHandling from "./common/listeners/discordErrorHandling.ts";

discordErrorHandling(client);

/* -------------------------------------------------------------------------- */
/*                       Setup Collections for commands                       */
/* -------------------------------------------------------------------------- */
client.slashCommands = new Collection();
client.textCommands = new Collection();
client.modals = new Collection();
client.contextMenus = new Collection();

/* -------------------------------------------------------------------------- */
/*                               Setup Managers                               */
/* -------------------------------------------------------------------------- */
import ClientManager from "./common/managers/ClientManager.ts";
import SlashCommandManager from "./common/managers/SlashCommandManager.ts";
import TextCommandManager from "./common/managers/TextCommandManager.ts";
import ContextMenuCommandManager from "./common/managers/ContextMenuManager.ts";
import ModalMenuManager from "./common/managers/ModalMenuManager.ts";

ClientManager.getInstance(client);
TextCommandManager.getInstance();
SlashCommandManager.getInstance();
ContextMenuCommandManager.getInstance();
ModalMenuManager.getInstance();

/* -------------------------------------------------------------------------- */
/*                              Register Modules                              */
/* -------------------------------------------------------------------------- */
import AdminModule from "./modules/admin/AdminModule.ts";
import CustomCommandsModule from "./modules/customCommands/CustomCommandsModule.ts";
import DaysUntilModule from "./modules/daysUntil/DaysUntilModule.ts";
import GameDayPostsModule from "./modules/gamedayPosts/GameDayPostsModule.ts";
import JoinLeaveModule from "./modules/joinLeave/JoinLeaveModule.ts";
import LevelsModule from "./modules/levels/LevelsModule.ts";
import MiscModule from "./modules/misc/MiscModule.ts";
import NHLModule from "./modules/nhl/NHLModule.ts";
import PlayerEmojisModule from "./modules/playerEmojis/PlayerEmojisModule.ts";
import UserManagementModule from "./modules/userManagement/UserManagementModule.ts";
import VisitorRoleModule from "./modules/visitorRole/VisitorRoleModule.ts";

new AdminModule().enable();
new CustomCommandsModule().enable();
new DaysUntilModule().enable();
new GameDayPostsModule().enable();
new JoinLeaveModule().enable();
new LevelsModule().enable();
new MiscModule().enable();
new NHLModule().enable();
new PlayerEmojisModule().enable();
new UserManagementModule().enable();
new VisitorRoleModule().enable();

/* -------------------------------------------------------------------------- */
/*                      Register Our Other Event Handlers                     */
/* -------------------------------------------------------------------------- */
import onMessageCreate from "./common/listeners/onMessageCreate.ts";
import onInteractionCreate from "./common/listeners/onInteractionCreate.ts";
import onReady from "./common/listeners/onReady.ts";

onMessageCreate(client);
onInteractionCreate(client);
onReady(client);

/* -------------------------------------------------------------------------- */
/*                                Log into bot                                */
/* -------------------------------------------------------------------------- */
client.login(Config.getConfig().token);

/* -------------------------------------------------------------------------- */
/*                           Setup HTTP Health Check                          */
/* -------------------------------------------------------------------------- */
import express from "express";
import { getBotHealth } from "./common/utils/healthCheck.ts";
import IBotHealth from "./common/interfaces/IBotHealth.ts";
import process from "node:process";

const app = express();
const port = process.env.PORT || 3000;

app.get("/health.ts", (_req, res) => {
  const health: IBotHealth = getBotHealth();
  if (health.status === "healthy") {
    res.status(200).json(health);
  } else {
    res.status(503).json(health);
  }
});

app.listen(port, () => {
  Stumper.info(`Health check server is running on port ${port}`, "healthCheck");
});
