const { JsonStorage, config } = require("json-storage-fs");
const _config = require("../common/config.js");
const globals = require("../common/globals");

// Create the database
config({ catalog: "../../data/" });

var vistorEmoji = _config.vistorReactRole.visitorEmoji;
var rolesChannelId = _config.vistorReactRole.rolesChannelId;

module.exports.sendVisitorReactionMessage = async () => {
  let embed = {
    title: "Visitor Role Selection",
    description: `${vistorEmoji} Get the Visitor Role (Everyone else will get the member role)`,
  };
  var message = await globals.client.channels.cache
    .get(rolesChannelId)
    .send({ embed: embed });
  JsonStorage.set("visitorMessageID", message.id);
  message.react(vistorEmoji);
};