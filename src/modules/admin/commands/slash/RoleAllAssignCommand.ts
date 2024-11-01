import { ChatInputCommandInteraction, Role } from "discord.js";
import { AdminSlashCommand, PARAM_TYPES } from "../../../../common/models/SlashCommand";
import discord from "../../../../common/utils/discord/discord";

export default class RoleAllAssignCommand extends AdminSlashCommand {
  constructor() {
    super("roleallassign", "Assign the role to all members of the server");

    this.data
      .addRoleOption((option) => option.setName("role").setDescription("The role to assign to everyone").setRequired(true))
      .addBooleanOption((option) =>
        option.setName("onlynonrole").setDescription("Whether or not to give the role to only members that don't have a role"),
      );
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply({ ephemeral: true });

    const role: Role = this.getParamValue(interaction, PARAM_TYPES.ROLE, "role");
    const onlyNoRole: boolean = this.getParamValue(interaction, PARAM_TYPES.BOOLEAN, "onlynonrole") || false;

    await interaction.deferReply({ ephemeral: true });

    const members = await discord.members.getMembers();
    if (!members) {
      interaction.editReply({
        content: "Error retreiving the guild members",
      });
      return;
    }

    members.forEach((member) => {
      if (onlyNoRole && discord.roles.userHasAnyRole(member)) {
        discord.roles.addRoleToUser(member, role.id);
      } else if (!onlyNoRole) {
        discord.roles.addRoleToUser(member, role.id);
      }
    });

    if (onlyNoRole) {
      interaction.editReply({
        content: `Adding the following role to users that do not have a role: ${role.name}`,
      });
    } else {
      interaction.editReply({
        content: `Adding the following role to all users: ${role.name}`,
      });
    }
  }
}
