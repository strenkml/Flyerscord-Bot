import { Client, Collection, GatewayIntentBits } from "discord.js";

import Config from "./config/Config";
import { calculateLevels } from "./util/levels/requiredExp";

import ready from "./listeners/ready";
import messageCreate from "./listeners/messageCreate";
import interactionCreate from "./listeners/interactionCreate";
import errorHanding from "./listeners/errorHanding";
import join from "./listeners/join";

/* -------------------------------------------------------------------------- */
/*                                Setup Stumper                                */
/* -------------------------------------------------------------------------- */
import Stumper, { LOG_LEVEL } from "stumper";
Stumper.setConfig({ logLevel: LOG_LEVEL.ALL });

/* -------------------------------------------------------------------------- */
/*                              Check Config file                             */
/* -------------------------------------------------------------------------- */
if (!Config.fileExists()) {
  Stumper.error("Config file not found! Rename src/config/sample.config.json to config.json and enter the required information!", "main");
  process.exit(1);
}

/* -------------------------------------------------------------------------- */
/*                            Create Discord Client                           */
/* -------------------------------------------------------------------------- */
const client = new Client({
  intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

/* -------------------------------------------------------------------------- */
/*                       Setup Collections for commands                       */
/* -------------------------------------------------------------------------- */
client.slashCommands = new Collection();
client.textCommands = new Collection();

/* -------------------------------------------------------------------------- */
/*                         Register our event handlers                        */
/* -------------------------------------------------------------------------- */
errorHanding(client);
ready(client);
messageCreate(client);
interactionCreate(client);
join(client);

/* -------------------------------------------------------------------------- */
/*                                Setup Levels                                */
/* -------------------------------------------------------------------------- */
calculateLevels(1000);

/* -------------------------------------------------------------------------- */
/*                                Log into bot                                */
/* -------------------------------------------------------------------------- */
client.login(Config.getConfig().token);