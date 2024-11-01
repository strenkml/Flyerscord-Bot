import { AttachmentBuilder, ChatInputCommandInteraction, User } from "discord.js";
import SlashCommand, { PARAM_TYPES } from "../../../../common/models/SlashCommand";
import LevelsDB from "../../providers/Levels.Database";
import LevelExpDB from "../../providers/LevelExp.Database";
import RankImageGenerator from "../../utils/RankImageGenerator";
import discord from "../../../../common/utils/discord/discord";
import Stumper from "stumper";

export default class RankCommand extends SlashCommand {
  constructor() {
    super("rank", "Get your rank or the rank of an user");

    this.data.addUserOption((option) => option.setName("user").setDescription("The user to get the rank of").setRequired(false));
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply({ ephemeral: true });

    const userInput: User | undefined = this.getParamValue(interaction, PARAM_TYPES.USER, "user");

    let user: User;
    if (userInput) {
      user = userInput;
    } else {
      user = interaction.user;
    }

    const member = await discord.members.getMember(user.id);
    if (!member) {
      interaction.editReply({ content: "Error finding member!" });
      Stumper.error(`Error finding member for user ${user.id}`, "levels:RankCommand:createEmbed");
      return;
    }

    const profilePictureUrl = member.displayAvatarURL() || user.displayAvatarURL();
    const username = member.displayName || user.username;

    const db = LevelsDB.getInstance();
    const levelExpDB = LevelExpDB.getInstance();
    const userLevel = db.getUser(user.id);
    const rank = db.getUserRank(user.id);

    if (rank == -1) {
      interaction.editReply({ content: "Error finding rank!" });
      Stumper.error(`Error finding rank for user ${user.id}`, "levels:RankCommand:createEmbed");
      return;
    }

    if (userLevel) {
      const rankImageGenerator = new RankImageGenerator(
        userLevel.messageCount,
        userLevel.totalExp,
        levelExpDB.getLevelExp(userLevel.currentLevel + 1),
        userLevel.currentLevel,
        rank,
        username,
        profilePictureUrl,
      );
      const imageBuffer = await rankImageGenerator.getImage();

      const attachment = new AttachmentBuilder(imageBuffer, { name: "rank.png" });
      interaction.followUp({ files: [attachment] });
      return;
    }
    interaction.editReply({ content: "You need to send a message before you can use this command!" });
  }
}
